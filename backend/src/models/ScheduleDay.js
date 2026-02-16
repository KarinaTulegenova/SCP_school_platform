import mongoose from 'mongoose';

const scheduleItemSchema = new mongoose.Schema(
  {
    itemId: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString()
    },
    time: { type: String, required: true },
    title: { type: String, required: true },
    type: { type: String, required: true }
  },
  { _id: false }
);

const scheduleDaySchema = new mongoose.Schema(
  {
    day: { type: String, required: true },
    items: { type: [scheduleItemSchema], default: [] }
  },
  { timestamps: true }
);

const ScheduleDay = mongoose.model('ScheduleDay', scheduleDaySchema);
export default ScheduleDay;
