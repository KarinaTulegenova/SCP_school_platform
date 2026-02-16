import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema(
  {
    lessonId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    videoUrl: { type: String, required: true },
    duration: { type: String, required: true },
    order: { type: Number, required: true, index: true }
  },
  { timestamps: true }
);

const Lesson = mongoose.model('Lesson', lessonSchema);
export default Lesson;
