import { ArrowLeft, CheckCircle2, Clock3, Video } from 'lucide-react';
import { Lesson } from '../../../shared/types/domain';
import { translateLessonDescription, translateLessonTitle, useI18n } from '../../../shared/i18n';

interface LessonWorkspaceProps {
  lesson: Lesson;
  onBack: () => void;
  onComplete: (lessonId: string) => void;
  isCompleting: boolean;
}

function LessonWorkspace({ lesson, onBack, onComplete, isCompleting }: LessonWorkspaceProps): JSX.Element {
  const { t, lang } = useI18n();
  const isCompleted = lesson.status === 'completed';
  const canComplete = lesson.status === 'in_progress';
  const localizedTitle = translateLessonTitle(lesson.id, lesson.title, lang);
  const localizedDescription = translateLessonDescription(lesson.id, lesson.description, lang);
  const youtubeWatchUrl = lesson.videoUrl.includes('/embed/')
    ? lesson.videoUrl.replace('www.youtube-nocookie.com/embed/', 'www.youtube.com/watch?v=').replace('/embed/', '/watch?v=')
    : lesson.videoUrl;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-md">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {t('lessons.backToList')}
      </button>

      <h2 className="text-2xl font-bold text-slate-800">{localizedTitle}</h2>
      <p className="mt-2 text-slate-600">{localizedDescription}</p>

      <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-500">
        <span className="inline-flex items-center gap-1">
          <Clock3 className="h-4 w-4" aria-hidden="true" />
          {lesson.duration}
        </span>
        <span className="inline-flex items-center gap-1">
          <Video className="h-4 w-4" aria-hidden="true" />
          {lesson.videoUrl}
        </span>
      </div>

      <div className="mt-5 aspect-video overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
        <iframe
          src={lesson.videoUrl}
          title={localizedTitle}
          className="h-full w-full"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
      <div className="mt-3">
        <a
          href={youtubeWatchUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
        >
          <Video className="h-4 w-4" aria-hidden="true" />
          {t('lessons.watchOnYoutube')}
        </a>
      </div>

      {isCompleted && (
        <p className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-100 px-3 py-2 text-sm font-semibold text-emerald-700">
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          {t('lessons.completedLabel')}
        </p>
      )}

      {canComplete && (
        <button
          type="button"
          onClick={() => onComplete(lesson.id)}
          disabled={isCompleting}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-70"
        >
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          {isCompleting ? t('lessons.completing') : t('lessons.markCompleted')}
        </button>
      )}
    </section>
  );
}

export default LessonWorkspace;
