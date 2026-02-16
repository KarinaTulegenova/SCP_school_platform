import { FormEvent, useState } from 'react';
import { ArrowRight, GraduationCap, LockKeyhole, LogIn, Sparkles, UserPlus } from 'lucide-react';
import Header from './components/Header/Header';
import DashboardLayout from './features/dashboard/components/DashboardLayout';
import { useAppSelector } from './store/hooks';
import { useLoginMutation, useMeQuery, useRegisterMutation } from './store/slices/authApi';
import { useI18n } from './shared/i18n';

const showcaseImages = [
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1200&q=80'
];

interface LandingPageProps {
  onStart: (mode: 'login' | 'register') => void;
}

function LandingPage({ onStart }: LandingPageProps): JSX.Element {
  const { t } = useI18n();

  return (
    <section className="space-y-8">
      <div className="relative overflow-hidden rounded-[2rem] border border-cyan-200 bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 p-8 text-white shadow-2xl md:p-12">
        <div className="absolute -right-12 -top-10 h-44 w-44 rounded-full bg-white/20 blur-2xl" aria-hidden="true" />
        <div className="absolute -bottom-16 left-1/3 h-44 w-44 rounded-full bg-emerald-300/30 blur-3xl" aria-hidden="true" />
        <p className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1 text-sm font-semibold">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          {t('landing.badge')}
        </p>
        <h2 className="mt-4 max-w-3xl text-3xl font-extrabold leading-tight md:text-5xl">
          {t('landing.title')}
        </h2>
        <p className="mt-4 max-w-2xl text-base text-blue-50 md:text-lg">
          {t('landing.subtitle')}
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onStart('register')}
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-blue-700 hover:bg-blue-50"
          >
            {t('landing.start')}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onStart('login')}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/50 bg-white/15 px-5 py-3 text-sm font-bold text-white hover:bg-white/25"
          >
            <LogIn className="h-4 w-4" aria-hidden="true" />
            {t('landing.haveAccount')}
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {showcaseImages.map((image, index) => (
          <article key={image} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
            <img src={image} alt={`School showcase ${index + 1}`} className="h-48 w-full object-cover" loading="lazy" />
            <div className="p-5">
              <h3 className="text-lg font-bold text-slate-800">
                {index === 0 && t('landing.card1.title')}
                {index === 1 && t('landing.card2.title')}
                {index === 2 && t('landing.card3.title')}
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                {index === 0 && t('landing.card1.body')}
                {index === 1 && t('landing.card2.body')}
                {index === 2 && t('landing.card3.body')}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function App(): JSX.Element {
  const { isAuthenticated, role, status, error, accessToken } = useAppSelector((state) => state.auth);
  const { t } = useI18n();
  const [login] = useLoginMutation();
  const [register] = useRegisterMutation();
  useMeQuery(undefined, { skip: !accessToken });
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('student@scp.local');
  const [password, setPassword] = useState('Student123!');

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (authMode === 'register') {
      void register({ fullName: fullName.trim(), email: email.trim(), password });
      return;
    }

    void login({ email: email.trim(), password });
  };

  const openAuthFlow = (mode: 'login' | 'register'): void => {
    setAuthMode(mode);
    setShowAuthForm(true);
    if (mode === 'register') {
      setEmail('');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen text-slate-800">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8">
        {!isAuthenticated && !showAuthForm && <LandingPage onStart={openAuthFlow} />}

        {!isAuthenticated && showAuthForm && (
          <section className="mx-auto max-w-2xl rounded-[2rem] border border-indigo-200 bg-white/80 p-8 shadow-2xl backdrop-blur-md">
            <button
              type="button"
              onClick={() => setShowAuthForm(false)}
              className="mb-5 text-sm font-semibold text-indigo-700 hover:text-indigo-900"
            >
              {t('auth.backToLanding')}
            </button>

            <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700">
              <LockKeyhole className="h-4 w-4" aria-hidden="true" />
              {t('auth.badge')}
            </p>
            <h2 className="text-3xl font-extrabold text-slate-800">
              {authMode === 'login' ? t('auth.loginTitle') : t('auth.registerTitle')}
            </h2>
            <p className="mt-2 text-slate-500">
              {authMode === 'login' ? t('auth.loginSubtitle') : t('auth.registerSubtitle')}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-gradient-to-r from-cyan-50 to-indigo-50 p-1">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`rounded-xl px-3 py-2 text-sm font-semibold ${
                  authMode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                {t('auth.signIn')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setEmail('');
                  setPassword('');
                }}
                className={`rounded-xl px-3 py-2 text-sm font-semibold ${
                  authMode === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                {t('auth.signUp')}
              </button>
            </div>
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              {authMode === 'register' && (
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-slate-700">{t('auth.fullName')}</span>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-indigo-200 focus:ring"
                    autoComplete="name"
                    minLength={2}
                    required
                  />
                </label>
              )}
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">{t('auth.email')}</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-indigo-200 focus:ring"
                  autoComplete="email"
                  required
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">{t('auth.password')}</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-indigo-200 focus:ring"
                  autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
                  minLength={8}
                  required
                />
              </label>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700 px-4 py-3 text-sm font-bold text-white shadow-lg hover:brightness-110 disabled:opacity-70"
              >
                {authMode === 'login' ? (
                  <LogIn className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <UserPlus className="h-4 w-4" aria-hidden="true" />
                )}
                {status === 'loading'
                  ? authMode === 'login'
                    ? t('auth.signingIn')
                    : t('auth.creating')
                  : authMode === 'login'
                    ? t('auth.signIn')
                    : t('auth.createAccount')}
              </button>
            </form>
            {authMode === 'login' && (
              <div className="mt-4 rounded-xl bg-slate-100 p-3 text-xs text-slate-600">
                {t('auth.demoUsers')}: student@scp.local / Student123!, teacher@scp.local / Teacher123!, admin@scp.local /
                Admin123!
              </div>
            )}
            {error && <p className="mt-4 text-sm font-medium text-rose-600">{error}</p>}
          </section>
        )}

        {isAuthenticated && role && (
          <section className="space-y-4">
            <div className="rounded-3xl border border-cyan-200 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-emerald-500/20 p-5 shadow-sm">
              <h2 className="inline-flex items-center gap-2 text-xl font-bold text-slate-800">
                <GraduationCap className="h-5 w-5 text-blue-700" aria-hidden="true" />
                {t(`role.${role}`)}: {t('dashboard.role')}
              </h2>
              <p className="text-sm text-slate-600">{t('dashboard.roleInfo')}</p>
            </div>
            <DashboardLayout role={role} />
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
