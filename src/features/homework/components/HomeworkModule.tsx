import { useState } from 'react';
import { Download, FileUp, Link as LinkIcon } from 'lucide-react';
import { useGetHomeworkQuery, useSubmitHomeworkMutation } from '../api/homeworkApi';
import { HomeworkStatus } from '../../../shared/types/domain';
import RequirePermission from '../../../components/routing/RequirePermission';

const statusClassMap: Record<HomeworkStatus, string> = {
  Pending: 'bg-amber-100 text-amber-700',
  Graded: 'bg-emerald-100 text-emerald-700',
  Resubmit: 'bg-rose-100 text-rose-700'
};

function HomeworkModule(): JSX.Element {
  const { data: homeworkItems = [], isLoading, isError } = useGetHomeworkQuery();
  const [submitHomework, { isLoading: isSubmitting }] = useSubmitHomeworkMutation();
  const [submissionById, setSubmissionById] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<string>('');

  if (isLoading) {
    return <p className="text-sm text-slate-500">Loading homework...</p>;
  }

  if (isError) {
    return <p className="text-sm font-medium text-rose-600">Failed to load homework.</p>;
  }

  const handleSubmit = async (homeworkId: string): Promise<void> => {
    const submissionUrl = submissionById[homeworkId]?.trim();
    if (!submissionUrl) {
      setFeedback('Please provide a link or file path before submitting.');
      return;
    }

    try {
      await submitHomework({ homeworkId, submissionUrl }).unwrap();
      setFeedback('Homework submitted successfully.');
    } catch {
      setFeedback('Failed to submit homework.');
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur-md">
      <h2 className="mb-4 text-lg font-semibold text-slate-800">Homework</h2>
      {feedback && <p className="mb-3 text-sm text-slate-600">{feedback}</p>}
      <div className="space-y-3">
        {homeworkItems.map((item) => (
          <article key={item.id} className="rounded-xl bg-slate-50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-medium text-slate-700">{item.title}</h3>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClassMap[item.status]}`}>
                {item.status}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-500">Due: {item.dueDate}</p>
            <p className="mt-1 text-xs text-slate-500">{item.submitted ? 'Submitted' : 'Not submitted yet'}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <RequirePermission permission="homework:submit">
                <input
                  type="text"
                  className="min-w-72 rounded-xl border border-slate-300 px-3 py-2 text-sm"
                  placeholder="Submission URL or path"
                  value={submissionById[item.id] ?? item.submissionUrl ?? ''}
                  onChange={(event) =>
                    setSubmissionById((prev) => ({
                      ...prev,
                      [item.id]: event.target.value
                    }))
                  }
                />
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => {
                    void handleSubmit(item.id);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-70"
                >
                  <FileUp className="h-4 w-4" aria-hidden="true" />
                  Submit
                </button>
              </RequirePermission>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Download
              </button>
              {item.type === 'link' && (
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  <LinkIcon className="h-4 w-4" aria-hidden="true" />
                  Open Link
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
