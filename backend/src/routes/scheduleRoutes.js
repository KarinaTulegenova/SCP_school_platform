import express from 'express';
import ScheduleDay from '../models/ScheduleDay.js';
import { authenticate, authorizePermissions } from '../middleware/auth.js';

const router = express.Router();

const toDto = (days) =>
  days.map((day) => ({
    day: day.day,
    items: day.items.map((item) => ({
      itemId: item.itemId,
      time: item.time,
      title: item.title,
      type: item.type
    }))
  }));

router.get('/', authenticate, authorizePermissions('schedule:read'), async (_req, res) => {
  try {
    const days = await ScheduleDay.find({}).lean();
    return res.json(toDto(days));
  } catch {
    return res.status(500).json({ message: 'Failed to load schedule' });
  }
});

router.post('/items', authenticate, authorizePermissions('schedule:manage'), async (req, res) => {
  try {
    const { day, time, title, type } = req.body;
    if (!day || !time || !title || !type) {
      return res.status(400).json({ message: 'day, time, title and type are required' });
    }

    let scheduleDay = await ScheduleDay.findOne({ day });
    if (!scheduleDay) {
      scheduleDay = await ScheduleDay.create({ day, items: [] });
    }

    scheduleDay.items.push({ time, title, type });
    await scheduleDay.save();

    const days = await ScheduleDay.find({}).lean();
    return res.status(201).json(toDto(days));
  } catch {
    return res.status(500).json({ message: 'Failed to add schedule item' });
  }
});

router.put('/items/:itemId', authenticate, authorizePermissions('schedule:manage'), async (req, res) => {
  try {
    const { itemId } = req.params;
    const { day, time, title, type } = req.body;
    if (!day || !time || !title || !type) {
      return res.status(400).json({ message: 'day, time, title and type are required' });
    }

    const sourceDay = await ScheduleDay.findOne({ 'items.itemId': itemId });
    if (!sourceDay) {
      return res.status(404).json({ message: 'Schedule item not found' });
    }

    const sourceItem = sourceDay.items.find((item) => item.itemId === itemId);
    sourceDay.items = sourceDay.items.filter((item) => item.itemId !== itemId);
    await sourceDay.save();

    let targetDay = sourceDay;
    if (sourceDay.day !== day) {
      targetDay = await ScheduleDay.findOne({ day });
      if (!targetDay) {
        targetDay = await ScheduleDay.create({ day, items: [] });
      }
    }

    targetDay.items.push({ itemId: sourceItem.itemId, time, title, type });
    await targetDay.save();

    const days = await ScheduleDay.find({}).lean();
    return res.json(toDto(days));
  } catch {
    return res.status(500).json({ message: 'Failed to update schedule item' });
  }
});

router.delete('/items/:itemId', authenticate, authorizePermissions('schedule:manage'), async (req, res) => {
  try {
    const { itemId } = req.params;
    const sourceDay = await ScheduleDay.findOne({ 'items.itemId': itemId });
    if (!sourceDay) {
      return res.status(404).json({ message: 'Schedule item not found' });
    }

    sourceDay.items = sourceDay.items.filter((item) => item.itemId !== itemId);
    await sourceDay.save();

    const days = await ScheduleDay.find({}).lean();
    return res.json(toDto(days));
  } catch {
    return res.status(500).json({ message: 'Failed to delete schedule item' });
  }
});

export default router;
