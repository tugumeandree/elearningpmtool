import { Task } from "@/lib/fetchSheet"

interface TaskFeedProps {
  tasks: Task[]
  title?: string
}

const statusClasses: Record<Task["status"], string> = {
  Completed: "bg-green-100 text-green-700 border-green-200",
  "In Progress": "bg-yellow-100 text-yellow-700 border-yellow-200",
  "Waiting for Client": "bg-blue-100 text-blue-700 border-blue-200",
  Delayed: "bg-red-100 text-red-700 border-red-200",
  "Not Started": "bg-gray-100 text-gray-600 border-gray-200"
}

const progressBarClasses: Record<Task["status"], string> = {
  Completed: "bg-emerald-500",
  "In Progress": "bg-amber-500",
  "Waiting for Client": "bg-sky-500",
  Delayed: "bg-rose-500",
  "Not Started": "bg-slate-400"
}

export default function TaskFeed({ tasks, title = "Task Feed" }: TaskFeedProps) {
  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-sm backdrop-blur">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="text-xs text-slate-500">{tasks.length} tasks</p>
      </div>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
            No tasks match the current filters.
          </p>
        ) : null}

        {tasks.map((task) => (
          <article key={task.taskId || `${task.taskName}-${task.startDate}`} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-base font-bold text-slate-900">{task.taskName || "Untitled Task"}</h4>
              <span className={`rounded-full border px-2 py-1 text-xs font-medium ${statusClasses[task.status]}`}>
                {task.status}
              </span>
            </div>

            <div className="mt-2 grid gap-1 text-sm text-slate-600 sm:grid-cols-2">
              <p>
                <span className="font-medium text-slate-800">Owner:</span> {task.owner || "Unassigned"}
              </p>
              <p>
                <span className="font-medium text-slate-800">Phase:</span> {task.phase || "N/A"}
              </p>
            </div>

            <div className="mt-3">
              <div className="mb-1 flex justify-between text-xs text-slate-500">
                <span>Progress</span>
                <span>{task.progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100">
                <div
                  className={`h-full rounded-full ${progressBarClasses[task.status]}`}
                  style={{ width: `${task.progress}%` }}
                />
              </div>
            </div>

            <p className="mt-3 text-sm text-slate-600">{task.notes || "No notes"}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
