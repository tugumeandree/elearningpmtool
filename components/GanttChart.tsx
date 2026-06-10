"use client"

import { differenceInCalendarDays, endOfMonth, format, max, min, parseISO, startOfMonth } from "date-fns"
import { Task } from "@/lib/fetchSheet"

interface GanttChartProps {
  tasks: Task[]
}

const statusClasses: Record<Task["status"], string> = {
  Completed: "bg-green-500",
  "In Progress": "bg-yellow-500",
  "Waiting for Client": "bg-blue-500",
  Delayed: "bg-red-500",
  "Not Started": "bg-gray-500"
}

function safeParse(dateStr: string): Date | null {
  if (!dateStr) return null
  const parsed = parseISO(dateStr)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

export default function GanttChart({ tasks }: GanttChartProps) {
  const now = new Date()

  const taskDates: Date[] = []
  for (const task of tasks) {
    const s = task.startDate ? safeParse(task.startDate) : null
    const e = task.endDate ? safeParse(task.endDate) : null
    if (s) taskDates.push(s)
    if (e) taskDates.push(e)
  }

  const timelineStart = taskDates.length > 0 ? min(taskDates) : startOfMonth(now)
  const timelineEnd = taskDates.length > 0 ? max(taskDates) : endOfMonth(now)

  const totalDays = differenceInCalendarDays(timelineEnd, timelineStart) + 1
  const totalDuration = differenceInCalendarDays(timelineEnd, timelineStart)

  const todayOffset = differenceInCalendarDays(now, timelineStart)
  const todayInRange = todayOffset >= 0 && todayOffset <= totalDuration
  const todayPercent = (Math.max(0, Math.min(totalDuration, todayOffset)) / totalDays) * 100

  const weekStarts = Array.from(
    { length: Math.ceil(totalDays / 7) },
    (_, i) => i * 7
  ).filter((offset) => offset < totalDays)

  const title = `Project Gantt (${format(timelineStart, "MMM d")} – ${format(timelineEnd, "MMM d, yyyy")})`

  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-sm backdrop-blur">
      <h3 className="mb-4 text-lg font-semibold text-slate-900">{title}</h3>

      <div className="overflow-x-auto">
        <div className="min-w-[720px] md:min-w-[860px]">
          <div className="mb-2 ml-36 flex text-[11px] font-medium uppercase tracking-wide text-slate-400 sm:ml-44">
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

          <div className="mb-3 ml-36 flex border-b border-gray-200 pb-2 text-xs text-slate-500 sm:ml-44">
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
              const startDate = task.startDate ? safeParse(task.startDate) : null
              const endDate = task.endDate ? safeParse(task.endDate) : null

              const clampedStart = startDate ? max([startDate, timelineStart]) : timelineStart
              const clampedEnd = endDate ? min([endDate, timelineEnd]) : timelineEnd

              const startOffset = Math.max(0, differenceInCalendarDays(clampedStart, timelineStart))
              const barDays = Math.max(1, differenceInCalendarDays(clampedEnd, clampedStart) + 1)
              const leftPercent = (startOffset / totalDays) * 100
              const widthPercent = (barDays / totalDays) * 100

              return (
                <div key={task.taskId || `${task.taskName}-${task.owner}`} className="flex items-center gap-3 sm:gap-4">
                  <div className="w-32 shrink-0 sm:w-40">
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
