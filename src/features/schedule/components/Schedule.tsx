import { FormEvent, useState } from 'react';
import { CalendarDays, Clock3, Pencil, Plus, Trash2 } from 'lucide-react';
import { useAddScheduleItemMutation, useDeleteScheduleItemMutation, useGetScheduleQuery, useUpdateScheduleItemMutation } from '../api/scheduleApi';
import { useAppSelector } from '../../../store/hooks';
import { hasPermission } from '../../auth/permissions';
import { ScheduleItemPayload } from '../../../shared/types/domain';

function Schedule(): JSX.Element {
  const { data: schedule = [], isLoading, isError } = useGetScheduleQuery();
  const role = useAppSelector((state) => state.auth.role);
  const canManage = hasPermission(role, 'schedule:manage');
  const [addItem, { isLoading: isAdding }] = useAddScheduleItemMutation();
  const [deleteItem, { isLoading: isDeleting }] = useDeleteScheduleItemMutation();
  const [updateItem, { isLoading: isUpdating }] = useUpdateScheduleItemMutation();
  const [feedback, setFeedback] = useState<string>('');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [form, setForm] = useState<ScheduleItemPayload>({
    day: 'Monday',
    time: '16:00',
    title: '',
    type: 'Lesson'
  });

  if (isLoading) {
    return <p className="text-sm text-slate-500">Loading schedule...</p>;
  }

  if (isError) {
    return <p className="text-sm font-medium text-rose-600">Failed to load schedule.</p>;
  }

  const handleAdd = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setFeedback('');
    try {
      await addItem(form).unwrap();
      setFeedback('Schedule item created.');
      setForm((prev) => ({ ...prev, title: '' }));
    } catch {
      setFeedback('Failed to create schedule item.');
    }
  };

  const startEdit = (day: string, itemId: string, time: string, title: string, type: string): void => {
    setEditingItemId(itemId);
    setForm({ day, time, title, type });
  };

  const handleUpdate = async (): Promise<void> => {
    if (!editingItemId) return;

    try {
      await updateItem({ itemId: editingItemId, payload: form }).unwrap();
      setFeedback('Schedule item updated.');
      setEditingItemId(null);
      setForm({ day: 'Monday', time: '16:00', title: '', type: 'Lesson' });
    } catch {
      setFeedback('Failed to update schedule item.');
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur-md">
      <div className="mb-4 flex items-center gap-2">
        <CalendarDays className="h-5 w-5 text-indigo-600" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-slate-800">Weekly Schedule</h2>
      </div>
      {canManage && (
        <form className="mb-4 grid gap-2 md:grid-cols-5" onSubmit={(event) => void handleAdd(event)}>
          <input
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            value={form.day}
            onChange={(event) => setForm((prev) => ({ ...prev, day: event.target.value }))}
            placeholder="Day"
            required
          />
          <input
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            value={form.time}
            onChange={(event) => setForm((prev) => ({ ...prev, time: event.target.value }))}
            placeholder="Time"
            required
          />
          <input
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            placeholder="Title"
            required
          />
          <input
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            value={form.type}
            onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))}
            placeholder="Type"
            required
          />
          {editingItemId ? (
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => {
                void handleUpdate();
              }}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-70"
            >
              <Pencil className="h-4 w-4" aria-hidden="true" />
              Save
            </button>
          ) : (
            <button
              type="submit"
              disabled={isAdding}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-70"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add
            </button>
          )}
        </form>
      )}
      {feedback && <p className="mb-3 text-sm text-slate-600">{feedback}</p>}

      <div className="grid gap-4 md:grid-cols-3">
        {schedule.map((day) => (
          <article key={day.day} className="rounded-xl bg-slate-50 p-4">
            <h3 className="mb-2 font-semibold text-slate-700">{day.day}</h3>
            <ul className="space-y-2">
              {day.items.map((item) => (
                <li key={item.itemId} className="rounded-lg bg-white p-3 shadow-sm">
                  <div className="flex items-center justify-between text-sm">
                    <span className="inline-flex items-center gap-1 font-medium text-slate-600">
                      <Clock3 className="h-4 w-4" aria-hidden="true" />
                      {item.time}
                    </span>
                    <span className="rounded-full bg-indigo-100 px-2 py-1 text-xs font-semibold text-indigo-700">
                      {item.type}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <p className="text-sm text-slate-700">{item.title}</p>
                    {canManage && (
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => startEdit(day.day, item.itemId, item.time, item.title, item.type)}
                          className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-slate-700"
                        >
                          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          disabled={isDeleting}
                          onClick={async () => {
                            try {
                              await deleteItem({ itemId: item.itemId }).unwrap();
                              setFeedback('Schedule item deleted.');
                            } catch {
                              setFeedback('Failed to delete schedule item.');
                            }
                          }}
                          className="rounded-md border border-rose-200 bg-rose-50 px-2 py-1 text-rose-700"
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Schedule;
