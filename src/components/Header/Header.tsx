import { LogOut, Sparkles, UserCircle2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import { useGetLessonsQuery } from '../../features/lessons/api/lessonsApi';
import { useLogoutApiMutation } from '../../store/slices/authApi';

function Header(): JSX.Element {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, refreshToken } = useAppSelector((state) => state.auth);
  const points = useAppSelector((state) => state.user.points);
  const { data: lessons = [] } = useGetLessonsQuery(undefined, { skip: !isAuthenticated });
  const [logoutApi] = useLogoutApiMutation();
  const completedCount = lessons.filter((lesson) => lesson.status === 'completed').length;
  const totalLessons = lessons.length;

  const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-indigo-600">Learning Platform</p>
          <h1 className="text-xl font-bold text-slate-800">SCP School</h1>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 px-4 py-2 shadow-sm">
          <Sparkles className="h-5 w-5 text-emerald-600" aria-hidden="true" />
          <div className="text-sm">
            <p className="font-semibold text-slate-700">Progress: {progress}%</p>
            <p className="text-slate-500">Points: {points}</p>
          </div>
        </div>

        {isAuthenticated && user && (
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-2 text-sm shadow-sm">
              <p className="inline-flex items-center gap-2 font-semibold text-slate-700">
                <UserCircle2 className="h-4 w-4" aria-hidden="true" />
                {user.fullName}
              </p>
              <p className="text-xs font-medium text-indigo-600">{user.role}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                void logoutApi({ refreshToken });
                dispatch(logout());
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
