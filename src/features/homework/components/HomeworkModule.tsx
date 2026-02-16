import { Download, FileUp, Link as LinkIcon } from 'lucide-react';
import homeworkData from '../data/homework.json';

export type HomeworkStatus = 'Pending' | 'Graded' | 'Resubmit';

interface HomeworkItem {
  id: string;
  title: string;
  type: 'file' | 'link';
  dueDate: string;
  status: HomeworkStatus;
}

const homeworkItems = homeworkData as HomeworkItem[];

const statusClassMap: Record<HomeworkStatus, string> = {
  Pending: 'bg-amber-100 text-amber-700',
  Graded: 'bg-emerald-100 text-emerald-700',
  Resubmit: 'bg-rose-100 text-rose-700'
};

function HomeworkModule(): JSX.Element {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur-md">
      <h2 className="mb-4 text-lg font-semibold text-slate-800">Homework</h2>
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
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                <FileUp className="h-4 w-4" aria-hidden="true" />
                Upload
              </button>
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
