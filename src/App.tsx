import { FormEvent, useState } from 'react';
import { LockKeyhole, LogIn } from 'lucide-react';
import Header from './components/Header/Header';
import DashboardLayout from './features/dashboard/components/DashboardLayout';
import { useAppSelector } from './store/hooks';
import { useLoginMutation, useMeQuery } from './store/slices/authApi';

function App(): JSX.Element {
  const { isAuthenticated, role, status, error, accessToken } = useAppSelector((state) => state.auth);
  const [login] = useLoginMutation();
  useMeQuery(undefined, { skip: !accessToken });
  const [email, setEmail] = useState('student@scp.local');
  const [password, setPassword] = useState('Student123!');

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    void login({ email: email.trim(), password });
  };

  return (
    <div className="min-h-screen bg-slate-50 bg-[radial-gradient(circle_at_10%_20%,rgba(99,102,241,0.15),transparent_30%),radial-gradient(circle_at_90%_10%,rgba(16,185,129,0.12),transparent_30%)] font-sans text-slate-800">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-6">
        {!isAuthenticated && (
          <section className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white/75 p-8 shadow-xl backdrop-blur-md">
            <p className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-indigo-600">
              <LockKeyhole className="h-4 w-4" aria-hidden="true" />
              Secure Authentication
            </p>
            <h2 className="text-2xl font-bold text-slate-800">Sign in to your account</h2>
            <p className="mt-2 text-slate-500">Use email and password credentials issued by your school administrator.</p>
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Email</span>
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
                <span className="mb-1 block text-sm font-medium text-slate-700">Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-indigo-200 focus:ring"
                  autoComplete="current-password"
                  required
                />
              </label>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-70"
              >
                <LogIn className="h-4 w-4" aria-hidden="true" />
                {status === 'loading' ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
            <div className="mt-4 rounded-xl bg-slate-100 p-3 text-xs text-slate-600">
              Demo users: student@scp.local / Student123!, teacher@scp.local / Teacher123!, admin@scp.local / Admin123!
            </div>
            {error && <p className="mt-4 text-sm font-medium text-rose-600">{error}</p>}
          </section>
        )}

        {isAuthenticated && role && (
          <section className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-800">{role} Dashboard</h2>
              <p className="text-sm text-slate-500">
                Role-specific modules are shown below based on RBAC rules.
              </p>
            </div>
            <DashboardLayout role={role} />
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
