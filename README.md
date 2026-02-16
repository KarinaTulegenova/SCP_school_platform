# SCP School Platform

A modern Learning Management System (LMS) prototype for children from vulnerable families, focused on programming education.

This project was developed by **Tulegenova Karina** as my **practical training assignment**.

## Overview

The platform demonstrates role-based learning workflows with a clean, light UI:

- Student dashboard: courses, weekly schedule, homework tracking
- Teacher dashboard: class management, student progress, content tools
- Admin dashboard: user management, schedule control, analytics overview

## Main Features

- JWT authentication with email/password login
- Self-registration for students via `/api/auth/register`
- Role-Based Access Control (RBAC) with protected UI sections
- Permission-based access checks in UI and API
- Redux Toolkit state management
- Lesson progression logic (locked, in progress, completed)
- Weekly schedule module
- Homework module with statuses (`Pending`, `Graded`, `Resubmit`)
- Video metadata for lessons (`videoUrl`, `duration`)
- Backend REST API with MongoDB persistence

## Tech Stack

- React 18 (functional components)
- TypeScript (strict mode)
- Redux Toolkit + React Redux
- Lucide React icons
- Vite
- Express.js + Mongoose
- MongoDB
- JWT + bcryptjs

## Project Structure

```text
backend/
  src/
    middleware/
    models/
    routes/
    utils/
  .env.example
src/
  components/
    Header/
    LessonCard/
    routing/
  features/
    dashboard/
    homework/
    lessons/
    schedule/
    teacher/
    user/
  store/
    slices/
```

## Getting Started

### 1. Install frontend dependencies

```bash
npm install
```

### 2. Install backend dependencies

```bash
npm --prefix backend install
```

### 3. Configure backend env

```bash
cp backend/.env.example backend/.env
```

Set `MONGODB_URI` (example: `mongodb://127.0.0.1:27017/codebridge_lms`).

### 4. Start backend API

```bash
npm run dev:api
```

API: `http://localhost:3000/api`

### 5. Start frontend

```bash
npm run dev
```

Frontend: `http://localhost:5173`

## Demo Accounts

- `student@scp.local` / `Student123!`
- `teacher@scp.local` / `Teacher123!`
- `admin@scp.local` / `Admin123!`

## Available Scripts

- `npm run dev` - start local development server
- `npm run dev:api` - start backend API server
- `npm run install:api` - install backend dependencies
- `npm run build` - build for production
- `npm run typecheck` - run TypeScript checks
- `npm run test` - run backend tests (`node:test`)
- `npm run check` - run typecheck + tests + production build
- `npm run preview` - preview production build

## Notes

- Backend seeds initial data and demo users automatically on first launch.
- Frontend uses RTK Query and real API calls for auth, lessons, homework, and schedule.

## Author

**Tulegenova Karina**

Practical training project, 2026.
