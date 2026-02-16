import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    lessonId: { type: String, required: true, index: true },
    status: { type: String, enum: ['completed'], default: 'completed' },
    completedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

progressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });

const Progress = mongoose.model('Progress', progressSchema);
export default Progress;
