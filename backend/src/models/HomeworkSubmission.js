import mongoose from 'mongoose';

const homeworkSubmissionSchema = new mongoose.Schema(
  {
    homeworkId: { type: String, required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    submissionType: { type: String, enum: ['link', 'file'], required: true, default: 'link' },
    submissionUrl: { type: String, default: '', trim: true },
    fileName: { type: String, default: '' },
    mimeType: { type: String, default: '' },
    fileSize: { type: Number, default: 0 },
    fileContentBase64: { type: String, default: '' },
    note: { type: String, default: '' },
    reviewStatus: { type: String, enum: ['Pending', 'Graded', 'Resubmit'], default: 'Pending' },
    feedback: { type: String, default: '' },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    reviewedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

homeworkSubmissionSchema.index({ homeworkId: 1, userId: 1 }, { unique: true });

const HomeworkSubmission = mongoose.model('HomeworkSubmission', homeworkSubmissionSchema);
export default HomeworkSubmission;
