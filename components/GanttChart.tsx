import { differenceInCalendarDays, format, max, min, parseISO } from "date-fns"
import { Task } from "@/lib/fetchSheet"

interface GanttChartProps {
  tasks: Task[]
}

const timelineStart = new Date(2026, 2, 5)
const timelineEnd = new Date(2026, 2, 31)
const totalDays = differenceInCalendarDays(timelineEnd, timelineStart) + 1
const totalDuration = differenceInCalendarDays(timelineEnd, timelineStart)

const statusClasses: Record<Task["status"], string> = {
  Completed: "bg-green-500",
  "In Progress": "bg-yellow-500",
  "Waiting for Client": "bg-blue-500",
  Delayed: "bg-red-500",
  "Not Started": "bg-gray-500"
}

function safeParse(dateStr: string): Date {
  const isoParsed = parseISO(dateStr)
  if (!Number.isNaN(isoParsed.getTime())) return isoParsed

  const slashDate = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (slashDate) {
    const month = Number.parseInt(slashDate[1], 10)
    const day = Number.parseInt(slashDate[2], 10)
    const year = Number.parseInt(slashDate[3], 10)
    const parsed = new Date(year, month - 1, day)
    if (!Number.isNaN(parsed.getTime())) return parsed
  }

  return timelineStart
}

export default function GanttChart({ tasks }: GanttChartProps) {
  const now = new Date()
  const todayOffset = differenceInCalendarDays(now, timelineStart)
  const todayInRange = todayOffset >= 0 && todayOffset <= totalDuration
  const todayPercent = (Math.max(0, Math.min(totalDuration, todayOffset)) / totalDays) * 100
  const weekStarts = [0, 7, 14, 21]

  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-sm backdrop-blur">
      <h3 className="mb-4 text-lg font-semibold text-slate-900">Project Gantt (Mar 5 - Mar 31)</h3>

      <div className="overflow-x-auto">
        <div className="min-w-[860px]">
          <div className="mb-2 ml-44 flex text-[11px] font-medium uppercase tracking-wide text-slate-400">
            {weekStarts.map((offset, index) => {
              const weekDate = new Date(timelineStart)
              weekDate.setDate(timelineStart.getDate() + offset)
              const nextOffset = weekStarts[index + 1] ?? totalDays
              const widthPercent = ((nextOffset - offset) / totalDays) * 100
              return (
                <div key={offset} style={{ width: `${widthPercent}%` }}>
                  Week of {format(weekDate, "MMM d")}
                </div>
              )
            })}
          </div>

          <div className="mb-3 ml-44 flex border-b border-gray-200 pb-2 text-xs text-slate-500">
            {Array.from({ length: totalDays }).map((_, i) => {
              const day = new Date(timelineStart)
              day.setDate(timelineStart.getDate() + i)
              return (
                <div key={i} className="w-6 text-center">
                  {i % 3 === 0 ? format(day, "d") : ""}
                </div>
              )
            })}
          </div>

          <div className="space-y-3">
            {tasks.map((task) => {
              const startDate = safeParse(task.startDate)
              const endDate = safeParse(task.endDate)
              const clampedStart = max([startDate, timelineStart])
              const clampedEnd = min([endDate, timelineEnd])
              const startOffset = Math.max(0, differenceInCalendarDays(clampedStart, timelineStart))
              const barDays = Math.max(1, differenceInCalendarDays(clampedEnd, clampedStart) + 1)
              const leftPercent = (startOffset / totalDays) * 100
              const widthPercent = (barDays / totalDays) * 100

              return (
                <div key={task.taskId || `${task.taskName}-${task.owner}`} className="flex items-center gap-3 sm:gap-4">
                  <div className="w-40 shrink-0">
                    <p className="truncate text-sm font-semibold text-slate-800">{task.taskName || "Untitled Task"}</p>
                    <p className="truncate text-xs text-slate-500">{task.owner || "Unassigned"}</p>
                  </div>

                  <div className="relative h-10 flex-1 rounded-md bg-gray-100">
                    {todayInRange ? (
                      <div
                        className="absolute bottom-0 top-0 z-10 w-px bg-slate-900/40"
                        style={{ left: `${todayPercent}%` }}
                        title={`Today: ${format(now, "yyyy-MM-dd")}`}
                      />
                    ) : null}

                    <div
                      className={`absolute top-1 z-20 h-8 rounded-md px-2 py-1 text-xs font-medium text-white ${statusClasses[task.status]}`}
                      style={{ left: `${leftPercent}%`, width: `${widthPercent}%` }}
                      title={`${task.taskName} (${task.startDate} to ${task.endDate})`}
                    >
                      <span className="block truncate">{task.taskName}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
