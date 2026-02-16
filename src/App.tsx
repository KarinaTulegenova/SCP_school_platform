import { LockKeyhole, LogIn } from 'lucide-react';
import Header from './components/Header/Header';
import DashboardLayout from './features/dashboard/components/DashboardLayout';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { mockLogin, UserRole } from './store/slices/authSlice';

const roleButtons: UserRole[] = ['STUDENT', 'TEACHER', 'ADMIN'];

function App(): JSX.Element {
  const dispatch = useAppDispatch();
  const { isAuthenticated, role } = useAppSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-slate-50 bg-[radial-gradient(circle_at_10%_20%,rgba(99,102,241,0.15),transparent_30%),radial-gradient(circle_at_90%_10%,rgba(16,185,129,0.12),transparent_30%)] font-sans text-slate-800">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-6">
        {!isAuthenticated && (
          <section className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white/75 p-8 shadow-xl backdrop-blur-md">
            <p className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-indigo-600">
              <LockKeyhole className="h-4 w-4" aria-hidden="true" />
              Mock Authentication
            </p>
            <h2 className="text-2xl font-bold text-slate-800">Select a role to enter the platform</h2>
            <p className="mt-2 text-slate-500">This simulates login for Student, Teacher, and Admin dashboards.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {roleButtons.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => dispatch(mockLogin(item))}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
                >
                  <LogIn className="h-4 w-4" aria-hidden="true" />
                  Login as {item}
                </button>
              ))}
            </div>
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
