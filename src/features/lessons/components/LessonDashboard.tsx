import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import LessonCard from '../../../components/LessonCard/LessonCard';
import { addPoints, unlockAchievement } from '../../user/userSlice';
import { useCompleteLessonMutation, useGetLessonsQuery } from '../api/lessonsApi';

function LessonDashboard(): JSX.Element {
  const dispatch = useAppDispatch();
  const role = useAppSelector((state) => state.auth.role);
  const { data: lessons = [], isLoading, isError, error } = useGetLessonsQuery(undefined, { skip: role !== 'STUDENT' });
  const [completeLesson, { isLoading: isCompleting }] = useCompleteLessonMutation();

  const handleStartLesson = async (lessonId: string): Promise<void> => {
    const lesson = lessons.find((item) => item.id === lessonId);
    if (!lesson || lesson.status !== 'in_progress') {
      return;
    }

    try {
      await completeLesson({ lessonId }).unwrap();
      dispatch(addPoints(50));
      dispatch(unlockAchievement('Lesson Completed'));
    } catch {
      // Keep UI stable on request failure. Error is rendered below.
    }
  };

  if (isLoading) {
    return <p className="text-sm text-slate-500">Loading lessons...</p>;
  }

  if (isError) {
    const message = 'status' in (error as Record<string, unknown>) ? 'Failed to load lessons.' : 'Unexpected lessons error.';
    return <p className="text-sm font-medium text-rose-600">{message}</p>;
  }

  return (
    <section className="space-y-4" aria-label="Lesson dashboard">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-800">My Courses</h2>
        <p className="text-sm text-slate-500">{isCompleting ? 'Saving progress...' : 'Complete lessons to unlock the next one.'}</p>
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
