import { FormEvent, useState } from 'react';
import { Trash2, UserPlus } from 'lucide-react';
import { useAppSelector } from '../../../store/hooks';
import { CreateUserPayload, UserRole } from '../../../shared/types/domain';
import { useCreateUserMutation, useDeleteUserMutation, useGetUsersQuery, useUpdateUserRoleMutation } from '../api/usersApi';
import { useI18n } from '../../../shared/i18n';

const roleOptions: UserRole[] = ['STUDENT', 'TEACHER', 'ADMIN'];

function UserManagement(): JSX.Element {
  const { t } = useI18n();
  const currentRole = useAppSelector((state) => state.auth.role);
  const { data: users = [], isLoading, isError } = useGetUsersQuery();
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateRole, { isLoading: isUpdatingRole }] = useUpdateUserRoleMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const [form, setForm] = useState<CreateUserPayload>({
    fullName: '',
    email: '',
    password: '',
    role: 'STUDENT'
  });
  const [feedback, setFeedback] = useState<string>('');

  const canManageRoles = currentRole === 'ADMIN';

  const handleCreate = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setFeedback('');

    try {
      await createUser(form).unwrap();
      setFeedback(t('users.created'));
      setForm({ fullName: '', email: '', password: '', role: currentRole === 'TEACHER' ? 'STUDENT' : 'STUDENT' });
    } catch {
      setFeedback(t('users.createError'));
    }
  };

  if (isLoading) {
    return <p className="text-sm text-slate-500">{t('users.loading')}</p>;
  }

  if (isError) {
    return <p className="text-sm font-medium text-rose-600">{t('users.error')}</p>;
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur-md">
      <div className="mb-4 flex items-center gap-2">
        <UserPlus className="h-5 w-5 text-indigo-600" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-slate-800">{t('users.title')}</h2>
      </div>

      <form className="mb-6 grid gap-3 md:grid-cols-4" onSubmit={(event) => void handleCreate(event)}>
        <input
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
          placeholder={t('users.fullName')}
          value={form.fullName}
          onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
          required
        />
        <input
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          required
        />
        <input
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
          required
        />
        <div className="flex gap-2">
          <select
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            value={form.role}
            onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value as UserRole }))}
            disabled={currentRole === 'TEACHER'}
          >
            {(currentRole === 'TEACHER' ? ['STUDENT'] : roleOptions).map((role) => (
              <option key={role} value={role}>
                {t(`role.${role}`)}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={isCreating}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-70"
          >
            {t('users.add')}
          </button>
        </div>
      </form>

      {feedback && <p className="mb-3 text-sm text-slate-600">{feedback}</p>}

      <div className="space-y-2">
        {users.map((user) => (
          <article key={user.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-3">
            <div>
              <p className="font-medium text-slate-700">{user.fullName}</p>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <select
                className="rounded-lg border border-slate-300 px-2 py-1 text-xs"
                value={user.role}
                disabled={!canManageRoles || isUpdatingRole}
                onChange={async (event) => {
                  try {
                    await updateRole({ userId: user.id, role: event.target.value as UserRole }).unwrap();
                  } catch {
                    setFeedback(t('users.roleError'));
                  }
                }}
              >
                {roleOptions.map((role) => (
                  <option key={role} value={role}>
                    {t(`role.${role}`)}
                  </option>
                ))}
              </select>
              {canManageRoles && (
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={async () => {
                    try {
                      await deleteUser({ userId: user.id }).unwrap();
                    } catch {
                      setFeedback(t('users.deleteError'));
                    }
                  }}
                  className="rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-xs text-rose-700"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default UserManagement;
