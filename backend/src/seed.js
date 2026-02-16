import User from './models/User.js';
import Lesson from './models/Lesson.js';
import Homework from './models/Homework.js';
import ScheduleDay from './models/ScheduleDay.js';
import { hashPassword } from './utils/password.js';

const lessonSeed = [
  {
    lessonId: 'html-intro',
    title: 'Intro to HTML',
    description: 'Build your first page with headings, paragraphs, and lists.',
    videoUrl: 'https://example.com/videos/intro-to-html',
    duration: '12:30',
    order: 1
  },
  {
    lessonId: 'css-colors',
    title: 'Colors in CSS',
    description: 'Learn color names, hex values, and gradients for better design.',
    videoUrl: 'https://example.com/videos/colors-in-css',
    duration: '09:40',
    order: 2
  },
  {
    lessonId: 'first-script',
    title: 'First Script',
    description: 'Write your first JavaScript and make a button interactive.',
    videoUrl: 'https://example.com/videos/first-script',
    duration: '15:05',
    order: 3
  }
];

const homeworkSeed = [
  {
    homeworkId: 'hw-1',
    title: 'Create a Personal HTML Card',
    type: 'file',
    dueDate: '2026-03-05',
    status: 'Pending'
  },
  {
    homeworkId: 'hw-2',
    title: 'Color Palette Mini Project',
    type: 'link',
    dueDate: '2026-03-08',
    status: 'Graded'
  },
  {
    homeworkId: 'hw-3',
    title: 'Interactive Button with JS',
    type: 'file',
    dueDate: '2026-03-11',
    status: 'Resubmit'
  }
];

const scheduleSeed = [
  {
    day: 'Monday',
    items: [
      { time: '16:00', title: 'HTML Basics Webinar', type: 'Lesson' },
      { time: '17:30', title: 'Homework Q&A', type: 'Support' }
    ]
  },
  {
    day: 'Wednesday',
    items: [{ time: '16:00', title: 'CSS Colors Workshop', type: 'Lesson' }]
  },
  {
    day: 'Friday',
    items: [
      { time: '15:00', title: 'JavaScript Starter Session', type: 'Lesson' },
      { time: '17:00', title: 'Mentor Feedback', type: 'Review' }
    ]
  }
];

export const seedDatabase = async () => {
  const usersCount = await User.countDocuments();
  if (usersCount === 0) {
    const users = [
      { fullName: 'Aruzhan Student', email: 'student@scp.local', role: 'STUDENT', password: 'Student123!' },
      { fullName: 'Dana Teacher', email: 'teacher@scp.local', role: 'TEACHER', password: 'Teacher123!' },
      { fullName: 'Alex Admin', email: 'admin@scp.local', role: 'ADMIN', password: 'Admin123!' }
    ];

    for (const user of users) {
      const passwordHash = await hashPassword(user.password);
      await User.create({
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        passwordHash
      });
    }
  }

  if ((await Lesson.countDocuments()) === 0) {
    await Lesson.insertMany(lessonSeed);
  }

  if ((await Homework.countDocuments()) === 0) {
    await Homework.insertMany(homeworkSeed);
  }

  if ((await ScheduleDay.countDocuments()) === 0) {
    await ScheduleDay.insertMany(scheduleSeed);
  }
};
