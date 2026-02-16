import mongoose from 'mongoose';

const homeworkSchema = new mongoose.Schema(
  {
    homeworkId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    type: { type: String, enum: ['file', 'link'], required: true },
    dueDate: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Graded', 'Resubmit'], required: true }
  },
  { timestamps: true }
);

const Homework = mongoose.model('Homework', homeworkSchema);
export default Homework;
