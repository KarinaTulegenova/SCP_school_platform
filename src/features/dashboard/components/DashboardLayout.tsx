import { BarChart3, BookOpenCheck, CalendarCheck2, FileSpreadsheet, ShieldCheck, UploadCloud, Users } from 'lucide-react';
import LessonDashboard from '../../lessons/components/LessonDashboard';
import HomeworkModule from '../../homework/components/HomeworkModule';
import HomeworkReviewPanel from '../../homework/components/HomeworkReviewPanel';
import Schedule from '../../schedule/components/Schedule';
import UserManagement from '../../users/components/UserManagement';
import studentsProgressData from '../../teacher/data/studentsProgress.json';
import ProtectedRoute from '../../../components/routing/ProtectedRoute';
import RequirePermission from '../../../components/routing/RequirePermission';
import { UserRole } from '../../../shared/types/domain';
import { useI18n } from '../../../shared/i18n';

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
  const { t } = useI18n();

  return (
    <div className="grid gap-6">
      <section className="rounded-2xl border border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50 p-6 shadow-md backdrop-blur-md">
        <div className="mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-indigo-600" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-slate-800">{t('teacher.classManagement')}</h2>
        </div>
        <div className="space-y-3">
          {studentsProgress.map((student) => (
            <article key={student.id} className="rounded-xl border border-white/70 bg-white/80 p-4 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-semibold text-slate-700">{student.name}</h3>
                <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">
                  {t('teacher.grade')} {student.grade}
                </span>
              </div>
              <p className="mb-2 text-sm text-slate-500">
                {t('teacher.completion')}: {student.completionPercent}%
              </p>
              <div className="h-2 w-full rounded-full bg-cyan-100">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500"
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

      <RequirePermission permission="homework:review">
        <HomeworkReviewPanel />
      </RequirePermission>

      <section className="grid gap-4 md:grid-cols-3">
        <RequirePermission permission="lesson:publish">
          <div className="rounded-2xl border border-cyan-200 bg-gradient-to-br from-cyan-50 to-white p-4 shadow-sm">
            <UploadCloud className="mb-2 h-5 w-5 text-cyan-600" aria-hidden="true" />
            <h3 className="font-semibold text-slate-700">{t('teacher.uploadHomework')}</h3>
            <p className="text-sm text-slate-500">{t('teacher.uploadHomeworkHint')}</p>
          </div>
        </RequirePermission>
        <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-4 shadow-sm">
          <BookOpenCheck className="mb-2 h-5 w-5 text-blue-600" aria-hidden="true" />
          <h3 className="font-semibold text-slate-700">{t('teacher.addVideos')}</h3>
          <p className="text-sm text-slate-500">{t('teacher.addVideosHint')}</p>
        </div>
        <RequirePermission permission="progress:read:class">
          <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-4 shadow-sm">
            <BarChart3 className="mb-2 h-5 w-5 text-emerald-600" aria-hidden="true" />
            <h3 className="font-semibold text-slate-700">{t('teacher.monitor')}</h3>
            <p className="text-sm text-slate-500">{t('teacher.monitorHint')}</p>
          </div>
        </RequirePermission>
      </section>
    </div>
  );
}

function AdminPanel(): JSX.Element {
  const { t } = useI18n();

  return (
    <section className="grid gap-4">
      <RequirePermission permission="user:manage">
        <UserManagement />
      </RequirePermission>
      <RequirePermission permission="homework:review">
        <HomeworkReviewPanel />
      </RequirePermission>

      <div className="grid gap-4 md:grid-cols-3">
      <RequirePermission permission="user:manage">
        <article className="rounded-2xl border border-cyan-200 bg-gradient-to-br from-cyan-50 to-white p-5 shadow-sm">
          <Users className="mb-2 h-5 w-5 text-cyan-600" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-slate-800">{t('admin.userManagement')}</h2>
          <p className="text-sm text-slate-500">{t('admin.userManagementHint')}</p>
        </article>
      </RequirePermission>

      <RequirePermission permission="schedule:manage">
        <article className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-5 shadow-sm">
          <CalendarCheck2 className="mb-2 h-5 w-5 text-blue-600" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-slate-800">{t('admin.scheduleEditor')}</h2>
          <p className="text-sm text-slate-500">{t('admin.scheduleEditorHint')}</p>
        </article>
      </RequirePermission>

      <article className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-sm">
        <FileSpreadsheet className="mb-2 h-5 w-5 text-emerald-600" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-slate-800">{t('admin.analytics')}</h2>
        <p className="text-sm text-slate-500">{t('admin.analyticsHint')}</p>
      </article>
      </div>
    </section>
  );
}

function DashboardLayout({ role }: DashboardLayoutProps): JSX.Element {
  const { t } = useI18n();

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
        <div className="rounded-2xl border border-cyan-200 bg-gradient-to-r from-cyan-50 via-blue-50 to-emerald-50 p-4 text-cyan-900">
          <p className="inline-flex items-center gap-2 font-semibold">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            {t('admin.fullAccess')}
          </p>
        </div>
        <AdminPanel />
        <Schedule />
      </div>
    </ProtectedRoute>
  );
}

export default DashboardLayout;
