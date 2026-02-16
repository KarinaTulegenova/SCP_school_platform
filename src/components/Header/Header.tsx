import { LogOut, Sparkles, UserCircle2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import { useGetLessonsQuery } from '../../features/lessons/api/lessonsApi';
import { useLogoutApiMutation } from '../../store/slices/authApi';
import { useI18n } from '../../shared/i18n';

function Header(): JSX.Element {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, refreshToken } = useAppSelector((state) => state.auth);
  const points = useAppSelector((state) => state.user.points);
  const { lang, setLang, t } = useI18n();
  const { data: lessons = [] } = useGetLessonsQuery(undefined, { skip: !isAuthenticated });
  const [logoutApi] = useLogoutApiMutation();
  const completedCount = lessons.filter((lesson) => lesson.status === 'completed').length;
  const totalLessons = lessons.length;

  const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <header className="sticky top-0 z-20 border-b border-cyan-200 bg-gradient-to-r from-cyan-100/85 via-blue-100/80 to-emerald-100/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">{t('header.platform')}</p>
          <h1 className="text-xl font-extrabold text-slate-900">{t('header.school')}</h1>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-cyan-200 bg-white/90 px-4 py-2 shadow-md">
          <Sparkles className="h-5 w-5 text-cyan-600" aria-hidden="true" />
          <div className="text-sm">
            <p className="font-bold text-slate-800">
              {t('header.progress')}: {progress}%
            </p>
            <p className="text-slate-600">
              {t('header.points')}: {points}
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white/90 p-1">
          <button
            type="button"
            onClick={() => setLang('ru')}
            className={`rounded-lg px-3 py-1 text-xs font-semibold ${lang === 'ru' ? 'bg-blue-600 text-white' : 'text-slate-700'}`}
          >
            {t('lang.ru')}
          </button>
          <button
            type="button"
            onClick={() => setLang('kk')}
            className={`rounded-lg px-3 py-1 text-xs font-semibold ${lang === 'kk' ? 'bg-blue-600 text-white' : 'text-slate-700'}`}
          >
            {t('lang.kk')}
          </button>
        </div>

        {isAuthenticated && user && (
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-cyan-200 bg-white/90 px-4 py-2 text-sm shadow-sm">
              <p className="inline-flex items-center gap-2 font-bold text-slate-700">
                <UserCircle2 className="h-4 w-4" aria-hidden="true" />
                {user.fullName}
              </p>
              <p className="text-xs font-semibold text-blue-700">{t(`role.${user.role}`)}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                void logoutApi({ refreshToken });
                dispatch(logout());
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              {t('common.logout')}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
