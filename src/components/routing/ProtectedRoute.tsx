import { ReactNode } from 'react';
import { ShieldAlert } from 'lucide-react';
import { useAppSelector } from '../../store/hooks';
import { UserRole } from '../../store/slices/authSlice';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  children: ReactNode;
}

function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps): JSX.Element {
  const { isAuthenticated, role } = useAppSelector((state) => state.auth);

  if (!isAuthenticated || !role) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur">
        <div className="flex items-center gap-3 text-slate-700">
          <ShieldAlert className="h-5 w-5" aria-hidden="true" />
          <p>Please sign in to access this section.</p>
        </div>
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 shadow-sm">
        <p className="font-semibold text-rose-700">Access denied for this role.</p>
      </div>
    );
  }

  return <>{children}</>;
}

export default ProtectedRoute;
