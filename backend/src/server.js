import cors from 'cors';
import express from 'express';
import { config } from './config.js';
import { connectDb } from './db.js';
import { seedDatabase } from './seed.js';
import authRoutes from './routes/authRoutes.js';
import lessonsRoutes from './routes/lessonsRoutes.js';
import homeworkRoutes from './routes/homeworkRoutes.js';
import scheduleRoutes from './routes/scheduleRoutes.js';
import usersRoutes from './routes/usersRoutes.js';

const app = express();

app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true
  })
);
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/lessons', lessonsRoutes);
app.use('/api/homework', homeworkRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/users', usersRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

const start = async () => {
  await connectDb();
  await seedDatabase();

  app.listen(config.port, () => {
    console.log(`API server running on http://localhost:${config.port}`);
  });
};

start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
