import { ReactNode } from 'react';
import { useAppSelector } from '../../store/hooks';
import { hasPermission, Permission } from '../../features/auth/permissions';

interface RequirePermissionProps {
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
}

function RequirePermission({ permission, children, fallback = null }: RequirePermissionProps): JSX.Element {
  const role = useAppSelector((state) => state.auth.role);

  if (!hasPermission(role, permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

export default RequirePermission;
