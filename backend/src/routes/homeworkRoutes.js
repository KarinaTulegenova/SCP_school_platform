import express from 'express';
import Homework from '../models/Homework.js';
import HomeworkSubmission from '../models/HomeworkSubmission.js';
import { authenticate, authorizePermissions } from '../middleware/auth.js';

const router = express.Router();

const MAX_ATTACHMENT_SIZE = 5_000_000;

const normalizeReviewStatus = (submission) => {
  if (submission.reviewStatus) {
    return submission.reviewStatus;
  }

  // Backward compatibility for old seeded submissions that stored only "submitted".
  return 'Pending';
};

const toSubmissionReviewDto = (submission, homeworkTitle) => ({
  id: submission._id.toString(),
  homeworkId: submission.homeworkId,
  homeworkTitle,
  studentId: submission.userId._id.toString(),
  studentName: submission.userId.fullName,
  studentEmail: submission.userId.email,
  submissionType: submission.submissionType,
  submissionUrl: submission.submissionUrl ?? '',
  fileName: submission.fileName ?? '',
  note: submission.note ?? '',
  status: normalizeReviewStatus(submission),
  feedback: submission.feedback ?? '',
  submittedAt: submission.updatedAt,
  reviewedAt: submission.reviewedAt,
  fileDataUrl:
    submission.submissionType === 'file' && submission.fileContentBase64
      ? `data:${submission.mimeType || 'application/octet-stream'};base64,${submission.fileContentBase64}`
      : ''
});

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
          status: submission ? normalizeReviewStatus(submission) : 'Pending',
          submitted: Boolean(submission),
          submissionUrl: submission?.submissionUrl ?? '',
          note: submission?.note ?? '',
          feedback: submission?.feedback ?? '',
          reviewedAt: submission?.reviewedAt ?? null,
          submittedAt: submission?.updatedAt ?? null,
          fileName: submission?.fileName ?? '',
          submissionType: submission?.submissionType ?? (submission ? 'link' : undefined)
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
    const { submissionUrl = '', attachment, note = '' } = req.body;
    const hasLink = typeof submissionUrl === 'string' && submissionUrl.trim().length > 0;
    const hasFile = attachment && typeof attachment === 'object';

    if (!hasLink && !hasFile) {
      return res.status(400).json({ message: 'Provide either submissionUrl or attachment' });
    }

    const homework = await Homework.findOne({ homeworkId });
    if (!homework) {
      return res.status(404).json({ message: 'Homework not found' });
    }

    if (hasFile) {
      const isValidAttachment =
        typeof attachment.fileName === 'string' &&
        typeof attachment.mimeType === 'string' &&
        typeof attachment.contentBase64 === 'string' &&
        Number.isFinite(attachment.size);

      if (!isValidAttachment) {
        return res.status(400).json({ message: 'Invalid attachment payload' });
      }

      if (attachment.size <= 0 || attachment.size > MAX_ATTACHMENT_SIZE) {
        return res.status(400).json({ message: 'Attachment size must be between 1 byte and 5MB' });
      }
    }

    const isFileSubmission = Boolean(hasFile);
    const submission = await HomeworkSubmission.findOneAndUpdate(
      { homeworkId, userId: req.user.id },
      {
        $set: {
          submissionType: isFileSubmission ? 'file' : 'link',
          submissionUrl: isFileSubmission ? '' : submissionUrl.trim(),
          fileName: isFileSubmission ? attachment.fileName : '',
          mimeType: isFileSubmission ? attachment.mimeType : '',
          fileSize: isFileSubmission ? attachment.size : 0,
          fileContentBase64: isFileSubmission ? attachment.contentBase64 : '',
          note,
          reviewStatus: 'Pending',
          feedback: '',
          reviewedAt: null,
          reviewedBy: null
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    return res.status(201).json({
      id: submission._id.toString(),
      homeworkId: submission.homeworkId,
      submissionUrl: submission.submissionUrl ?? '',
      submissionType: submission.submissionType,
      fileName: submission.fileName ?? '',
      note: submission.note,
      status: normalizeReviewStatus(submission),
      feedback: submission.feedback ?? '',
      reviewedAt: submission.reviewedAt,
      submittedAt: submission.updatedAt
    });
  } catch {
    return res.status(500).json({ message: 'Failed to submit homework' });
  }
});

router.get('/submissions', authenticate, authorizePermissions('homework:review'), async (req, res) => {
  try {
    const submissions = await HomeworkSubmission.find({})
      .sort({ updatedAt: -1 })
      .populate('userId', 'fullName email')
      .lean();
    const homeworks = await Homework.find({}).select('homeworkId title').lean();
    const titles = new Map(homeworks.map((item) => [item.homeworkId, item.title]));

    return res.json(
      submissions
        .filter((item) => item.userId && item.userId._id)
        .map((item) => toSubmissionReviewDto(item, titles.get(item.homeworkId) ?? item.homeworkId))
    );
  } catch {
    return res.status(500).json({ message: 'Failed to load homework submissions' });
  }
});

router.patch('/submissions/:submissionId/review', authenticate, authorizePermissions('homework:review'), async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { status, feedback = '' } = req.body;

    if (!['Graded', 'Resubmit'].includes(status)) {
      return res.status(400).json({ message: 'status must be either Graded or Resubmit' });
    }

    const submission = await HomeworkSubmission.findByIdAndUpdate(
      submissionId,
      {
        $set: {
          reviewStatus: status,
          feedback: typeof feedback === 'string' ? feedback.trim() : '',
          reviewedAt: new Date(),
          reviewedBy: req.user.id
        }
      },
      { new: true }
    )
      .populate('userId', 'fullName email')
      .lean();

    if (!submission || !submission.userId || !submission.userId._id) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    const homework = await Homework.findOne({ homeworkId: submission.homeworkId }).select('title').lean();
    return res.json(toSubmissionReviewDto(submission, homework?.title ?? submission.homeworkId));
  } catch {
    return res.status(500).json({ message: 'Failed to review homework submission' });
  }
});

export default router;
