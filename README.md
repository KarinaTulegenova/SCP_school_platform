# SCP School Platform

A modern Learning Management System (LMS) prototype for children from vulnerable families, focused on programming education.

This project was developed by **Tulegenova Karina** as my **practical training assignment**.

## Overview

The platform demonstrates role-based learning workflows with a clean, light UI:

- Student dashboard: courses, weekly schedule, homework tracking
- Teacher dashboard: class management, student progress, content tools
- Admin dashboard: user management, schedule control, analytics overview

## Main Features

- Mock authentication with role switch (`STUDENT`, `TEACHER`, `ADMIN`)
- Role-Based Access Control (RBAC) with protected UI sections
- Redux Toolkit state management
- Lesson progression logic (locked, in progress, completed)
- Weekly schedule module
- Homework module with statuses (`Pending`, `Graded`, `Resubmit`)
- Video metadata for lessons (`videoUrl`, `duration`)
- Glassmorphism/light design direction using utility-first classes

## Tech Stack

- React 18 (functional components)
- TypeScript (strict mode)
- Redux Toolkit + React Redux
- Lucide React icons
- Vite

## Project Structure

```text
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

### 1. Install dependencies

```bash
npm install
```

### 2. Run development server

```bash
npm run dev
```

Open: `http://localhost:5173`

## Available Scripts

- `npm run dev` - start local development server
- `npm run build` - build for production
- `npm run preview` - preview production build

## Notes

- Authentication is mocked for demo purposes.
- Role switching is implemented in the UI to simplify testing.
- Data is currently local JSON/mock state and can be replaced with API endpoints later.

## Author

**Tulegenova Karina**

Practical training project, 2026.
