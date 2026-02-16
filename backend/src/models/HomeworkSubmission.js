import mongoose from 'mongoose';

const homeworkSubmissionSchema = new mongoose.Schema(
  {
    homeworkId: { type: String, required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    submissionUrl: { type: String, required: true, trim: true },
    note: { type: String, default: '' },
    status: { type: String, enum: ['submitted'], default: 'submitted' }
  },
  { timestamps: true }
);

homeworkSubmissionSchema.index({ homeworkId: 1, userId: 1 }, { unique: true });

const HomeworkSubmission = mongoose.model('HomeworkSubmission', homeworkSubmissionSchema);
export default HomeworkSubmission;
