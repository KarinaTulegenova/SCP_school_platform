import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import LessonCard from '../../../components/LessonCard/LessonCard';
import { addPoints, unlockAchievement } from '../../user/userSlice';
import { completeLesson, startLesson } from '../lessonsSlice';

function LessonDashboard(): JSX.Element {
  const dispatch = useAppDispatch();
  const lessons = useAppSelector((state) => state.lessons.lessons);

  const handleStartLesson = (lessonId: string): void => {
    dispatch(startLesson(lessonId));

    const lesson = lessons.find((item) => item.id === lessonId);
    if (lesson?.status === 'in_progress') {
      dispatch(completeLesson(lessonId));
      dispatch(addPoints(50));
      dispatch(unlockAchievement('Lesson Completed'));
    }
  };

  return (
    <section className="space-y-4" aria-label="Lesson dashboard">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-800">My Courses</h2>
        <p className="text-sm text-slate-500">Complete lessons to unlock the next one.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {lessons.map((lesson) => (
          <LessonCard key={lesson.id} lesson={lesson} onStart={handleStartLesson} />
        ))}
      </div>
    </section>
  );
}

export default LessonDashboard;
