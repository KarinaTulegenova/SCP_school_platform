import { BarChart3, BookOpenCheck, CalendarCheck2, FileSpreadsheet, ShieldCheck, UploadCloud, Users } from 'lucide-react';
import LessonDashboard from '../../lessons/components/LessonDashboard';
import HomeworkModule from '../../homework/components/HomeworkModule';
import Schedule from '../../schedule/components/Schedule';
import UserManagement from '../../users/components/UserManagement';
import studentsProgressData from '../../teacher/data/studentsProgress.json';
import ProtectedRoute from '../../../components/routing/ProtectedRoute';
import RequirePermission from '../../../components/routing/RequirePermission';
import { UserRole } from '../../../shared/types/domain';

interface StudentProgress {
  id: string;
  name: string;
  grade: string;
  completionPercent: number;
}

interface DashboardLayoutProps {
  role: UserRole;
}

const studentsProgress = studentsProgressData as StudentProgress[];

function TeacherPanel(): JSX.Element {
  return (
    <div className="grid gap-6">
      <section className="rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur-md">
        <div className="mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-indigo-600" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-slate-800">Class Management</h2>
        </div>
        <div className="space-y-3">
          {studentsProgress.map((student) => (
            <article key={student.id} className="rounded-xl bg-slate-50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-semibold text-slate-700">{student.name}</h3>
                <span className="rounded-full bg-indigo-100 px-2 py-1 text-xs font-semibold text-indigo-700">
                  Grade {student.grade}
                </span>
              </div>
              <p className="mb-2 text-sm text-slate-500">Completion: {student.completionPercent}%</p>
              <div className="h-2 w-full rounded-full bg-slate-200">
                <div
                  className="h-2 rounded-full bg-emerald-500"
                  style={{ width: `${student.completionPercent}%` }}
                  aria-label={`${student.name} completion ${student.completionPercent}%`}
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      <RequirePermission permission="user:manage">
        <UserManagement />
      </RequirePermission>

      <section className="grid gap-4 md:grid-cols-3">
        <RequirePermission permission="lesson:publish">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <UploadCloud className="mb-2 h-5 w-5 text-indigo-600" aria-hidden="true" />
            <h3 className="font-semibold text-slate-700">Upload Homework</h3>
            <p className="text-sm text-slate-500">Attach files or learning links.</p>
          </div>
        </RequirePermission>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <BookOpenCheck className="mb-2 h-5 w-5 text-indigo-600" aria-hidden="true" />
          <h3 className="font-semibold text-slate-700">Add Video Lessons</h3>
          <p className="text-sm text-slate-500">Publish metadata, URL, and duration.</p>
        </div>
        <RequirePermission permission="progress:read:class">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <BarChart3 className="mb-2 h-5 w-5 text-indigo-600" aria-hidden="true" />
            <h3 className="font-semibold text-slate-700">Monitor Progress</h3>
            <p className="text-sm text-slate-500">Track grades and completion trends.</p>
          </div>
        </RequirePermission>
      </section>
    </div>
  );
}

function AdminPanel(): JSX.Element {
  return (
    <section className="grid gap-4">
      <RequirePermission permission="user:manage">
        <UserManagement />
      </RequirePermission>

      <div className="grid gap-4 md:grid-cols-3">
      <RequirePermission permission="user:manage">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <Users className="mb-2 h-5 w-5 text-indigo-600" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-slate-800">User Management</h2>
          <p className="text-sm text-slate-500">Manage students, teachers, and admins.</p>
        </article>
      </RequirePermission>

      <RequirePermission permission="schedule:manage">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <CalendarCheck2 className="mb-2 h-5 w-5 text-indigo-600" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-slate-800">Schedule Editor</h2>
          <p className="text-sm text-slate-500">Adjust webinars and class calendars.</p>
        </article>
      </RequirePermission>

      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <FileSpreadsheet className="mb-2 h-5 w-5 text-indigo-600" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-slate-800">Platform Analytics</h2>
        <p className="text-sm text-slate-500">Review engagement, retention, and outcomes.</p>
      </article>
      </div>
    </section>
  );
}

function DashboardLayout({ role }: DashboardLayoutProps): JSX.Element {
  if (role === 'STUDENT') {
    return (
      <div className="space-y-6">
        <LessonDashboard />
        <Schedule />
        <HomeworkModule />
      </div>
    );
  }

  if (role === 'TEACHER') {
    return (
      <ProtectedRoute allowedRoles={['TEACHER', 'ADMIN']} requiredPermissions={['progress:read:class']}>
        <TeacherPanel />
        <div className="mt-6">
          <Schedule />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['ADMIN']} requiredPermissions={['user:manage']}>
      <div className="space-y-6">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
          <p className="inline-flex items-center gap-2 font-semibold">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            Full admin access enabled.
          </p>
        </div>
        <AdminPanel />
        <Schedule />
      </div>
    </ProtectedRoute>
  );
}

export default DashboardLayout;
