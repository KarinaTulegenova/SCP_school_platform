import express from 'express';
import Homework from '../models/Homework.js';
import HomeworkSubmission from '../models/HomeworkSubmission.js';
import { authenticate, authorizePermissions } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, authorizePermissions('homework:read'), async (req, res) => {
  try {
    const homework = await Homework.find({}).sort({ createdAt: 1 }).lean();

    if (req.user.role !== 'STUDENT') {
      return res.json(
        homework.map((item) => ({
          id: item.homeworkId,
          title: item.title,
          type: item.type,
          dueDate: item.dueDate,
          status: item.status,
          submitted: false,
          submissionUrl: ''
        }))
      );
    }

    const submissions = await HomeworkSubmission.find({ userId: req.user.id }).lean();
    const byHomeworkId = new Map(submissions.map((item) => [item.homeworkId, item]));

    return res.json(
      homework.map((item) => {
        const submission = byHomeworkId.get(item.homeworkId);
        return {
          id: item.homeworkId,
          title: item.title,
          type: item.type,
          dueDate: item.dueDate,
          status: item.status,
          submitted: Boolean(submission),
          submissionUrl: submission?.submissionUrl ?? ''
        };
      })
    );
  } catch {
    return res.status(500).json({ message: 'Failed to load homework' });
  }
});

router.post('/:homeworkId/submit', authenticate, authorizePermissions('homework:submit'), async (req, res) => {
  try {
    const { homeworkId } = req.params;
    const { submissionUrl, note = '' } = req.body;

    if (!submissionUrl || typeof submissionUrl !== 'string') {
      return res.status(400).json({ message: 'submissionUrl is required' });
    }

    const homework = await Homework.findOne({ homeworkId });
    if (!homework) {
      return res.status(404).json({ message: 'Homework not found' });
    }

    const submission = await HomeworkSubmission.findOneAndUpdate(
      { homeworkId, userId: req.user.id },
      { $set: { submissionUrl, note, status: 'submitted' } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    return res.status(201).json({
      id: submission._id.toString(),
      homeworkId: submission.homeworkId,
      submissionUrl: submission.submissionUrl,
      note: submission.note,
      status: submission.status,
      submittedAt: submission.updatedAt
    });
  } catch {
    return res.status(500).json({ message: 'Failed to submit homework' });
  }
});

export default router;
