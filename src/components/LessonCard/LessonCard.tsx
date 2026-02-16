import { CheckCircle2, Clock3, Lock, PlayCircle, Video } from 'lucide-react';
import { Lesson } from '../../shared/types/domain';
import { translateLessonDescription, translateLessonTitle, useI18n } from '../../shared/i18n';

interface LessonCardProps {
  lesson: Lesson;
  onStart: (lessonId: string) => void;
}

const statusStyleMap = {
  locked: 'bg-rose-100 text-rose-700',
  in_progress: 'bg-indigo-100 text-indigo-700',
  completed: 'bg-emerald-100 text-emerald-700'
} as const;

function LessonCard({ lesson, onStart }: LessonCardProps): JSX.Element {
  const { t, lang } = useI18n();
  const isLocked = lesson.status === 'locked';
  const actionLabel = lesson.status === 'completed' ? t('lessons.open') : t('lessons.start');
  const localizedTitle = translateLessonTitle(lesson.id, lesson.title, lang);
  const localizedDescription = translateLessonDescription(lesson.id, lesson.description, lang);

  return (
    <article className="rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm backdrop-blur-md">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-800">{localizedTitle}</h3>
        <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${statusStyleMap[lesson.status]}`}>
          {lesson.status === 'locked' && <Lock className="h-4 w-4" aria-hidden="true" />}
          {lesson.status === 'in_progress' && <PlayCircle className="h-4 w-4" aria-hidden="true" />}
          {lesson.status === 'completed' && <CheckCircle2 className="h-4 w-4" aria-hidden="true" />}
          {t(`lesson.status.${lesson.status}`)}
        </span>
      </div>

      <p className="mb-4 text-sm text-slate-600">{localizedDescription}</p>

      <div className="mb-4 flex flex-wrap gap-3 text-xs font-medium text-slate-500">
        <span className="inline-flex items-center gap-1">
          <Clock3 className="h-4 w-4" aria-hidden="true" />
          {lesson.duration}
        </span>
        <span className="inline-flex items-center gap-1">
          <Video className="h-4 w-4" aria-hidden="true" />
          {t('lessons.videoAvailable')}
        </span>
      </div>

      <button
        type="button"
        className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-base font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        disabled={isLocked}
        aria-disabled={isLocked}
        onClick={() => onStart(lesson.id)}
      >
        {actionLabel}
      </button>
    </article>
  );
}

export default LessonCard;
