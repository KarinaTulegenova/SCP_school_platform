import { AuthUser } from '../../shared/types/domain';

const AUTH_STORAGE_KEY = 'scp_auth_session_v1';

interface PersistedAuthSession {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export const loadAuthSession = (): PersistedAuthSession | null => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedAuthSession;
  } catch {
    return null;
  }
};

export const saveAuthSession = (session: PersistedAuthSession): void => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
};

export const clearAuthSession = (): void => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};
