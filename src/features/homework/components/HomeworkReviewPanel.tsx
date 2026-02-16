import { useState } from 'react';
import { CheckCircle2, RotateCcw } from 'lucide-react';
import { useGetHomeworkSubmissionsQuery, useReviewHomeworkSubmissionMutation } from '../api/homeworkApi';
import { useI18n } from '../../../shared/i18n';

function HomeworkReviewPanel(): JSX.Element {
  const { t } = useI18n();
  const { data: submissions = [], isLoading, isError } = useGetHomeworkSubmissionsQuery();
  const [reviewSubmission, { isLoading: isReviewing }] = useReviewHomeworkSubmissionMutation();
  const [feedbackById, setFeedbackById] = useState<Record<string, string>>({});
  const [requestState, setRequestState] = useState<string>('');

  if (isLoading) {
    return <p className="text-sm text-slate-500">{t('review.loading')}</p>;
  }

  if (isError) {
    return <p className="text-sm font-medium text-rose-600">{t('review.loadError')}</p>;
  }

  const handleReview = async (submissionId: string, status: 'Graded' | 'Resubmit'): Promise<void> => {
    try {
      await reviewSubmission({
        submissionId,
        status,
        feedback: feedbackById[submissionId] ?? ''
      }).unwrap();
      setRequestState(t('review.saved'));
    } catch {
      setRequestState(t('review.saveError'));
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-slate-800">{t('review.title')}</h2>
      {requestState && <p className="mb-3 text-sm text-slate-600">{requestState}</p>}
      {submissions.length === 0 && <p className="text-sm text-slate-500">{t('review.empty')}</p>}
      <div className="space-y-3">
        {submissions.map((submission) => (
          <article key={submission.id} className="rounded-xl bg-slate-50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-semibold text-slate-800">{submission.homeworkTitle}</h3>
              <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
                {t(`homework.status.${submission.status}`)}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-600">
              {t('review.student')}: {submission.studentName} ({submission.studentEmail})
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {t('review.submittedAt')}: {new Date(submission.submittedAt).toLocaleString()}
            </p>
            {submission.note && <p className="mt-1 text-sm text-slate-600">{t('review.note')}: {submission.note}</p>}
            {submission.feedback && <p className="mt-1 text-sm text-indigo-700">{t('review.feedback')}: {submission.feedback}</p>}
            <div className="mt-3 flex flex-wrap gap-2">
              {submission.submissionType === 'link' && submission.submissionUrl && (
                <a
                  href={submission.submissionUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  {t('review.openLink')}
                </a>
              )}
              {submission.submissionType === 'file' && submission.fileDataUrl && (
                <a
                  href={submission.fileDataUrl}
                  download={submission.fileName || 'submission'}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  {t('review.download')}
                </a>
              )}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <input
                type="text"
                className="min-w-72 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
                placeholder={t('review.feedbackPlaceholder')}
                value={feedbackById[submission.id] ?? ''}
                onChange={(event) =>
                  setFeedbackById((prev) => ({
                    ...prev,
                    [submission.id]: event.target.value
                  }))
                }
              />
              <button
                type="button"
                disabled={isReviewing}
                onClick={() => {
                  void handleReview(submission.id, 'Graded');
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-70"
              >
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                {t('review.markGraded')}
              </button>
              <button
                type="button"
                disabled={isReviewing}
                onClick={() => {
                  void handleReview(submission.id, 'Resubmit');
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-70"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                {t('review.requestResubmit')}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default HomeworkReviewPanel;
