import express from 'express';
import Lesson from '../models/Lesson.js';
import Progress from '../models/Progress.js';
import { authenticate, authorizePermissions } from '../middleware/auth.js';

const router = express.Router();

const toLessonDto = (lesson, status) => ({
  id: lesson.lessonId,
  title: lesson.title,
  description: lesson.description,
  videoUrl: lesson.videoUrl,
  duration: lesson.duration,
  status
});

const buildStudentLessons = async (userId) => {
  const lessons = await Lesson.find({}).sort({ order: 1 }).lean();
  const completed = await Progress.find({ userId, status: 'completed' }).lean();
  const completedSet = new Set(completed.map((item) => item.lessonId));

  let nextUnlocked = true;

  return lessons.map((lesson) => {
    if (completedSet.has(lesson.lessonId)) {
      return toLessonDto(lesson, 'completed');
    }

    if (nextUnlocked) {
      nextUnlocked = false;
      return toLessonDto(lesson, 'in_progress');
    }

    return toLessonDto(lesson, 'locked');
  });
};

router.get('/', authenticate, authorizePermissions('lesson:read'), async (req, res) => {
  try {
    if (req.user.role === 'STUDENT') {
      const studentLessons = await buildStudentLessons(req.user.id);
      return res.json(studentLessons);
    }

    const lessons = await Lesson.find({}).sort({ order: 1 }).lean();
    return res.json(lessons.map((lesson) => toLessonDto(lesson, 'in_progress')));
  } catch {
    return res.status(500).json({ message: 'Failed to load lessons' });
  }
});

router.post('/:lessonId/complete', authenticate, authorizePermissions('lesson:complete'), async (req, res) => {
  try {
    const { lessonId } = req.params;
    const lessons = await buildStudentLessons(req.user.id);
    const target = lessons.find((lesson) => lesson.id === lessonId);

    if (!target) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    if (target.status !== 'in_progress') {
      return res.status(400).json({ message: 'Only in-progress lesson can be completed' });
    }

    await Progress.updateOne(
      { userId: req.user.id, lessonId },
      { $set: { status: 'completed', completedAt: new Date() } },
      { upsert: true }
    );

    const updated = await buildStudentLessons(req.user.id);
    return res.json(updated);
  } catch {
    return res.status(500).json({ message: 'Failed to update lesson progress' });
  }
});

export default router;
