import { CalendarDays, Clock3 } from 'lucide-react';
import weeklySchedule from '../data/weeklySchedule.json';

interface ScheduleItem {
  time: string;
  title: string;
  type: string;
}

interface ScheduleDay {
  day: string;
  items: ScheduleItem[];
}

const schedule = weeklySchedule as ScheduleDay[];

function Schedule(): JSX.Element {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur-md">
      <div className="mb-4 flex items-center gap-2">
        <CalendarDays className="h-5 w-5 text-indigo-600" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-slate-800">Weekly Schedule</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {schedule.map((day) => (
          <article key={day.day} className="rounded-xl bg-slate-50 p-4">
            <h3 className="mb-2 font-semibold text-slate-700">{day.day}</h3>
            <ul className="space-y-2">
              {day.items.map((item) => (
                <li key={`${day.day}-${item.time}-${item.title}`} className="rounded-lg bg-white p-3 shadow-sm">
                  <div className="flex items-center justify-between text-sm">
                    <span className="inline-flex items-center gap-1 font-medium text-slate-600">
                      <Clock3 className="h-4 w-4" aria-hidden="true" />
                      {item.time}
                    </span>
                    <span className="rounded-full bg-indigo-100 px-2 py-1 text-xs font-semibold text-indigo-700">
                      {item.type}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-700">{item.title}</p>
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
