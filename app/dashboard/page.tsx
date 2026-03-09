"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Sidebar from "@/components/Sidebar"
import TaskFeed from "@/components/TaskFeed"
import GanttChart from "@/components/GanttChart"
import ChannelView from "@/components/ChannelView"
import Toast from "@/components/Toast"
import { fetchSheet, Task } from "@/lib/fetchSheet"

type Channel = "implementation-timeline" | "milestones" | "module-tracker"

const validChannels: Channel[] = ["implementation-timeline", "milestones", "module-tracker"]
const statusOptions: Array<"All" | Task["status"]> = [
  "All",
  "Not Started",
  "In Progress",
  "Waiting for Client",
  "Delayed",
  "Completed"
]

export default function DashboardPage() {
  const didInitFromQuery = useRef(false)

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [channel, setChannel] = useState<Channel>("implementation-timeline")
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedOwner, setSelectedOwner] = useState<string>("All")
  const [selectedPhase, setSelectedPhase] = useState<string>("All")
  const [selectedStatus, setSelectedStatus] = useState<"All" | Task["status"]>("All")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string>("")
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastVariant, setToastVariant] = useState<"success" | "error">("success")

  useEffect(() => {
    let alive = true

    const loadTasks = async () => {
      try {
        const data = await fetchSheet()
        if (!alive) return
        setTasks(data)
        setLastUpdated(new Date().toLocaleTimeString())
        setError(null)
      } catch (err) {
        if (!alive) return
        setError(err instanceof Error ? err.message : "Unable to fetch data")
      } finally {
        if (alive) setLoading(false)
      }
    }

    void loadTasks()
    const timer = window.setInterval(() => {
      void loadTasks()
    }, 30_000)

    return () => {
      alive = false
      window.clearInterval(timer)
    }
  }, [])

  const ownerOptions = useMemo(() => {
    return ["All", ...new Set(tasks.map((task) => task.owner || "Unassigned"))]
  }, [tasks])

  const phaseOptions = useMemo(() => {
    return ["All", ...new Set(tasks.map((task) => task.phase || "Unassigned"))]
  }, [tasks])

  useEffect(() => {
    if (didInitFromQuery.current) return
    didInitFromQuery.current = true

    const params = new URLSearchParams(window.location.search)
    const urlChannel = params.get("channel")
    const urlOwner = params.get("owner")
    const urlPhase = params.get("phase")
    const urlStatus = params.get("status")

    if (urlChannel && validChannels.includes(urlChannel as Channel) && urlChannel !== channel) {
      setChannel(urlChannel as Channel)
    }

    if (urlOwner && urlOwner !== selectedOwner) {
      setSelectedOwner(urlOwner)
    }

    if (urlPhase && urlPhase !== selectedPhase) {
      setSelectedPhase(urlPhase)
    }

    if (urlStatus && statusOptions.includes(urlStatus as "All" | Task["status"]) && urlStatus !== selectedStatus) {
      setSelectedStatus(urlStatus as "All" | Task["status"])
    }
  }, [channel, selectedOwner, selectedPhase, selectedStatus])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    params.set("channel", channel)
    if (selectedOwner === "All") params.delete("owner")
    else params.set("owner", selectedOwner)

    if (selectedPhase === "All") params.delete("phase")
    else params.set("phase", selectedPhase)

    if (selectedStatus === "All") params.delete("status")
    else params.set("status", selectedStatus)

    const nextQuery = params.toString()
    const currentQuery = window.location.search.startsWith("?")
      ? window.location.search.slice(1)
      : window.location.search

    if (nextQuery !== currentQuery) {
      const nextUrl = `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ""}`
      window.history.replaceState({}, "", nextUrl)
    }
  }, [channel, selectedOwner, selectedPhase, selectedStatus])

  useEffect(() => {
    if (!ownerOptions.includes(selectedOwner)) {
      setSelectedOwner("All")
    }
  }, [ownerOptions, selectedOwner])

  useEffect(() => {
    if (!phaseOptions.includes(selectedPhase)) {
      setSelectedPhase("All")
    }
  }, [phaseOptions, selectedPhase])

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const owner = task.owner || "Unassigned"
      const phase = task.phase || "Unassigned"
      const ownerMatch = selectedOwner === "All" || selectedOwner === owner
      const phaseMatch = selectedPhase === "All" || selectedPhase === phase
      const statusMatch = selectedStatus === "All" || selectedStatus === task.status
      return ownerMatch && phaseMatch && statusMatch
    })
  }, [selectedOwner, selectedPhase, selectedStatus, tasks])

  const visibleTasks = useMemo(() => {
    if (channel === "milestones") {
      return filteredTasks.filter((task) => task.status === "Completed" || task.progress >= 80)
    }

    if (channel === "module-tracker") {
      return filteredTasks.filter((task) => task.status !== "Completed")
    }

    return filteredTasks
  }, [channel, filteredTasks])

  const completedCount = useMemo(
    () => filteredTasks.filter((task) => task.status === "Completed").length,
    [filteredTasks]
  )

  const delayedCount = useMemo(
    () => filteredTasks.filter((task) => task.status === "Delayed").length,
    [filteredTasks]
  )

  const avgProgress = useMemo(() => {
    if (filteredTasks.length === 0) return 0
    const total = filteredTasks.reduce((sum, task) => sum + task.progress, 0)
    return Math.round(total / filteredTasks.length)
  }, [filteredTasks])

  const ownerRows = useMemo(() => {
    const byOwner = new Map<string, { total: number; done: number; inFlight: number }>()
    for (const task of visibleTasks) {
      const owner = task.owner || "Unassigned"
      const current = byOwner.get(owner) ?? { total: 0, done: 0, inFlight: 0 }
      current.total += 1
      if (task.status === "Completed") current.done += 1
      if (task.status !== "Completed") current.inFlight += 1
      byOwner.set(owner, current)
    }

    return [...byOwner.entries()]
      .map(([owner, values]) => ({ owner, ...values }))
      .sort((a, b) => b.inFlight - a.inFlight)
  }, [visibleTasks])

  const showToast = (message: string, variant: "success" | "error") => {
    setToastMessage(message)
    setToastVariant(variant)
    setToastVisible(true)
    window.setTimeout(() => setToastVisible(false), 1800)
  }

  return (
    <div className="min-h-screen">
      <Sidebar
        activeChannel={channel}
        onChannelSelect={setChannel}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((prev) => !prev)}
        onClose={() => setSidebarOpen(false)}
      />

      <main
        className={`px-4 pb-8 pt-16 transition-[margin] duration-300 md:px-8 md:pt-8 ${
          sidebarOpen ? "md:ml-72" : "md:ml-0"
        }`}
      >
        <ChannelView channel={channel}>
          <section className="rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-sm backdrop-blur sm:p-5">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {statusOptions.map((status) => {
                const active = status === selectedStatus
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setSelectedStatus(status)}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                      active
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-300 bg-white text-slate-600 hover:border-slate-500"
                    }`}
                  >
                    {status}
                  </button>
                )
              })}
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="text-sm text-slate-600">
                Owner
                <select
                  value={selectedOwner}
                  onChange={(event) => setSelectedOwner(event.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-800"
                >
                  {ownerOptions.map((owner) => (
                    <option key={owner} value={owner}>
                      {owner}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-sm text-slate-600">
                Phase
                <select
                  value={selectedPhase}
                  onChange={(event) => setSelectedPhase(event.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-800"
                >
                  {phaseOptions.map((phase) => (
                    <option key={phase} value={phase}>
                      {phase}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-500">
                Active filters: owner {selectedOwner}, phase {selectedPhase}, status {selectedStatus}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(window.location.href)
                      showToast("Share link copied", "success")
                    } catch {
                      showToast("Unable to copy link", "error")
                    }
                  }}
                  className="rounded-md border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Copy Share Link
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedOwner("All")
                    setSelectedPhase("All")
                    setSelectedStatus("All")
                  }}
                  className="rounded-md border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </section>

          <div className="grid gap-3 sm:grid-cols-3">
            <article className="rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-sm backdrop-blur">
              <p className="text-xs uppercase tracking-wide text-slate-500">Completion</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{completedCount}/{filteredTasks.length}</p>
            </article>
            <article className="rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-sm backdrop-blur">
              <p className="text-xs uppercase tracking-wide text-slate-500">Average Progress</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{avgProgress}%</p>
            </article>
            <article className="rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-sm backdrop-blur">
              <p className="text-xs uppercase tracking-wide text-slate-500">Delayed Tasks</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{delayedCount}</p>
            </article>
          </div>

          {lastUpdated ? <p className="text-xs text-slate-500">Last synced: {lastUpdated}</p> : null}

          {loading ? <p className="text-sm text-slate-500">Loading project data...</p> : null}
          {error ? <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}

          {!loading && !error ? (
            <>
              {channel === "implementation-timeline" ? (
                <div className="grid gap-6">
                  <TaskFeed tasks={visibleTasks} title="Implementation Feed" />
                  <GanttChart tasks={visibleTasks} />
                </div>
              ) : null}

              {channel === "milestones" ? (
                <div className="grid gap-6">
                  <TaskFeed tasks={visibleTasks} title="Milestone Feed" />
                  <section className="rounded-lg border border-gray-200 bg-white p-5">
                    <h3 className="mb-4 text-lg font-semibold text-slate-900">Milestone Health</h3>
                    <div className="space-y-3">
                      {visibleTasks.map((task) => (
                        <div key={task.taskId || task.taskName} className="rounded-md border border-gray-200 p-3">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-semibold text-slate-800">{task.taskName}</p>
                            <span className="text-xs text-slate-500">{task.endDate || "No due date"}</span>
                          </div>
                          <p className="mt-1 text-xs text-slate-600">Owner: {task.owner || "Unassigned"}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              ) : null}

              {channel === "module-tracker" ? (
                <div className="grid gap-6">
                  <TaskFeed tasks={visibleTasks} title="Module Tracker Feed" />
                  <section className="rounded-lg border border-gray-200 bg-white p-5">
                    <h3 className="mb-4 text-lg font-semibold text-slate-900">Owner Workload</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full border-collapse text-sm">
                        <thead>
                          <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wide text-slate-500">
                            <th className="px-2 py-2">Owner</th>
                            <th className="px-2 py-2">Total</th>
                            <th className="px-2 py-2">In Flight</th>
                            <th className="px-2 py-2">Completed</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ownerRows.map((row) => (
                            <tr key={row.owner} className="border-b border-gray-100 text-slate-700">
                              <td className="px-2 py-2 font-medium">{row.owner}</td>
                              <td className="px-2 py-2">{row.total}</td>
                              <td className="px-2 py-2">{row.inFlight}</td>
                              <td className="px-2 py-2">{row.done}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </div>
              ) : null}
            </>
          ) : null}
        </ChannelView>
      </main>

      <Toast message={toastMessage} variant={toastVariant} visible={toastVisible} />
    </div>
  )
}
