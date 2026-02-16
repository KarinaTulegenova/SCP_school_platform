import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import LessonCard from '../../../components/LessonCard/LessonCard';
import { addPoints, unlockAchievement } from '../../user/userSlice';
import { useCompleteLessonMutation, useGetLessonsQuery } from '../api/lessonsApi';
import LessonWorkspace from './LessonWorkspace';
import { useI18n } from '../../../shared/i18n';

function LessonDashboard(): JSX.Element {
  const { t } = useI18n();
  const dispatch = useAppDispatch();
  const role = useAppSelector((state) => state.auth.role);
  const { data: lessons = [], isLoading, isError, error } = useGetLessonsQuery(undefined, { skip: role !== 'STUDENT' });
  const [completeLesson, { isLoading: isCompleting }] = useCompleteLessonMutation();
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  const handleStartLesson = async (lessonId: string): Promise<void> => {
    const lesson = lessons.find((item) => item.id === lessonId);
    if (!lesson || lesson.status === 'locked') {
      return;
    }

    setActiveLessonId(lessonId);
  };

  const handleCompleteLesson = async (lessonId: string): Promise<void> => {
    try {
      await completeLesson({ lessonId }).unwrap();
      dispatch(addPoints(50));
      dispatch(unlockAchievement('Lesson Completed'));
      setActiveLessonId(null);
    } catch {
      // Keep UI stable on request failure. Error is rendered below.
    }
  };

  if (isLoading) {
    return <p className="text-sm text-slate-500">{t('lessons.loading')}</p>;
  }

  if (isError) {
    const message = 'status' in (error as Record<string, unknown>) ? t('lessons.error') : t('lessons.unexpected');
    return <p className="text-sm font-medium text-rose-600">{message}</p>;
  }

  const activeLesson = activeLessonId ? lessons.find((item) => item.id === activeLessonId) : null;

  if (activeLesson) {
    return (
      <LessonWorkspace
        lesson={activeLesson}
        isCompleting={isCompleting}
        onBack={() => setActiveLessonId(null)}
        onComplete={(lessonId) => {
          void handleCompleteLesson(lessonId);
        }}
      />
    );
  }

  return (
    <section className="space-y-4" aria-label="Lesson dashboard">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-800">{t('lessons.title')}</h2>
        <p className="text-sm text-slate-500">{isCompleting ? t('lessons.saving') : t('lessons.hint')}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {lessons.map((lesson) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            onStart={(id) => {
              void handleStartLesson(id);
            }}
          />
        ))}
      </div>
    </section>
  );
}

export default LessonDashboard;
