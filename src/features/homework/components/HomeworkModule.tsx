import { useState } from 'react';
import { Download, FileUp, Link as LinkIcon } from 'lucide-react';
import { useGetHomeworkQuery, useSubmitHomeworkMutation } from '../api/homeworkApi';
import { HomeworkStatus } from '../../../shared/types/domain';
import RequirePermission from '../../../components/routing/RequirePermission';
import { useI18n } from '../../../shared/i18n';

const statusClassMap: Record<HomeworkStatus, string> = {
  Pending: 'bg-amber-100 text-amber-700',
  Graded: 'bg-emerald-100 text-emerald-700',
  Resubmit: 'bg-rose-100 text-rose-700'
};

function HomeworkModule(): JSX.Element {
  const { t } = useI18n();
  const { data: homeworkItems = [], isLoading, isError } = useGetHomeworkQuery();
  const [submitHomework, { isLoading: isSubmitting }] = useSubmitHomeworkMutation();
  const [submissionById, setSubmissionById] = useState<Record<string, string>>({});
  const [noteById, setNoteById] = useState<Record<string, string>>({});
  const [fileById, setFileById] = useState<Record<string, File | null>>({});
  const [feedback, setFeedback] = useState<string>('');

  if (isLoading) {
    return <p className="text-sm text-slate-500">{t('homework.loading')}</p>;
  }

  if (isError) {
    return <p className="text-sm font-medium text-rose-600">{t('homework.loadError')}</p>;
  }

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = typeof reader.result === 'string' ? reader.result : '';
        const encoded = dataUrl.includes(',') ? dataUrl.split(',')[1] : '';
        resolve(encoded);
      };
      reader.onerror = () => reject(new Error('Unable to read file'));
      reader.readAsDataURL(file);
    });

  const resolveApiErrorMessage = (error: unknown): string | null => {
    if (!error || typeof error !== 'object') return null;
    const maybeData = (error as { data?: unknown }).data;
    if (!maybeData || typeof maybeData !== 'object') return null;
    const maybeMessage = (maybeData as { message?: unknown }).message;
    return typeof maybeMessage === 'string' ? maybeMessage : null;
  };

  const handleSubmit = async (homeworkId: string, type: 'file' | 'link'): Promise<void> => {
    const submissionUrl = submissionById[homeworkId]?.trim();
    const note = noteById[homeworkId]?.trim() ?? '';

    try {
      if (type === 'file') {
        const file = fileById[homeworkId];
        if (!file) {
          setFeedback(t('homework.needFile'));
          return;
        }

        const contentBase64 = await fileToBase64(file);
        await submitHomework({
          homeworkId,
          note,
          attachment: {
            fileName: file.name,
            mimeType: file.type || 'application/octet-stream',
            size: file.size,
            contentBase64
          }
        }).unwrap();
      } else {
        if (!submissionUrl) {
          setFeedback(t('homework.needLink'));
          return;
        }

        await submitHomework({ homeworkId, submissionUrl, note }).unwrap();
      }

      setFeedback(t('homework.submitSuccess'));
    } catch (error) {
      const apiMessage = resolveApiErrorMessage(error);
      setFeedback(apiMessage ?? t('homework.submitError'));
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur-md">
      <h2 className="mb-4 text-lg font-semibold text-slate-800">{t('homework.title')}</h2>
      {feedback && <p className="mb-3 text-sm text-slate-600">{feedback}</p>}
      <div className="space-y-3">
        {homeworkItems.map((item) => (
          <article key={item.id} className="rounded-xl bg-slate-50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-medium text-slate-700">{item.title}</h3>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClassMap[item.status]}`}>
                {t(`homework.status.${item.status}`)}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              {t('homework.due')}: {item.dueDate}
            </p>
            <p className="mt-1 text-xs text-slate-500">{item.submitted ? t('homework.submitted') : t('homework.notSubmitted')}</p>
            {item.feedback && (
              <p className="mt-1 text-xs text-indigo-700">
                {t('homework.feedback')}: {item.feedback}
              </p>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              <RequirePermission permission="homework:submit">
                {item.type === 'link' ? (
                  <input
                    type="url"
                    className="min-w-72 rounded-xl border border-slate-300 px-3 py-2 text-sm"
                    placeholder={t('homework.submissionUrl')}
                    value={submissionById[item.id] ?? item.submissionUrl ?? ''}
                    onChange={(event) =>
                      setSubmissionById((prev) => ({
                        ...prev,
                        [item.id]: event.target.value
                      }))
                    }
                  />
                ) : (
                  <input
                    type="file"
                    className="min-w-72 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
                    onChange={(event) =>
                      setFileById((prev) => ({
                        ...prev,
                        [item.id]: event.target.files?.[0] ?? null
                      }))
                    }
                  />
                )}
                <input
                  type="text"
                  className="min-w-72 rounded-xl border border-slate-300 px-3 py-2 text-sm"
                  placeholder={t('homework.commentOptional')}
                  value={noteById[item.id] ?? item.note ?? ''}
                  onChange={(event) =>
                    setNoteById((prev) => ({
                      ...prev,
                      [item.id]: event.target.value
                    }))
                  }
                />
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => {
                    void handleSubmit(item.id, item.type);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-70"
                >
                  <FileUp className="h-4 w-4" aria-hidden="true" />
                  {t('homework.submit')}
                </button>
              </RequirePermission>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                {t('common.download')}
              </button>
              {(item.type === 'link' || item.submissionType === 'link') && (
                <button
                  type="button"
                  onClick={() => {
                    if (item.submissionUrl) {
                      window.open(item.submissionUrl, '_blank', 'noopener,noreferrer');
                    }
                  }}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  <LinkIcon className="h-4 w-4" aria-hidden="true" />
                  {t('homework.openLink')}
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default HomeworkModule;
