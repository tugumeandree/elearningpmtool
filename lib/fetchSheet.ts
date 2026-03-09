import Papa from "papaparse"

const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/1PVL-Aie9TXKTeuB_8ATqk6k6X-c42649IsIReIzxDJk/export?format=csv"

export interface Task {
  taskId: string
  taskName: string
  phase: string
  owner: string
  startDate: string
  endDate: string
  status:
    | "Not Started"
    | "In Progress"
    | "Waiting for Client"
    | "Delayed"
    | "Completed"
  progress: number
  notes: string
}

type TaskRow = {
  "Task ID"?: string
  "Task Name"?: string
  Phase?: string
  Owner?: string
  "Start Date"?: string
  "End Date"?: string
  Status?: string
  Progress?: string | number
  "Progress (%)"?: string | number
  Notes?: string
}

const allowedStatuses = new Set<Task["status"]>([
  "Not Started",
  "In Progress",
  "Waiting for Client",
  "Delayed",
  "Completed"
])

function normalizeStatus(value: string | undefined): Task["status"] {
  if (!value) return "Not Started"
  const trimmed = value.trim() as Task["status"]
  return allowedStatuses.has(trimmed) ? trimmed : "Not Started"
}

function normalizeProgress(value: string | number | undefined): number {
  const numeric = typeof value === "number" ? value : Number.parseFloat(value ?? "0")
  if (Number.isNaN(numeric)) return 0
  return Math.max(0, Math.min(100, numeric))
}

function normalizeDate(value: string | undefined): string {
  const trimmed = String(value ?? "").trim()
  if (!trimmed) return ""

  // Keep ISO dates unchanged.
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed

  // Convert M/D/YYYY and MM/DD/YYYY to YYYY-MM-DD.
  const slashDate = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (slashDate) {
    const month = slashDate[1].padStart(2, "0")
    const day = slashDate[2].padStart(2, "0")
    const year = slashDate[3]
    return `${year}-${month}-${day}`
  }

  return trimmed
}

export async function fetchSheet(signal?: AbortSignal): Promise<Task[]> {
  const response = await fetch(SHEET_CSV_URL, {
    cache: "no-store",
    signal
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch sheet data: ${response.status}`)
  }

  const csvText = await response.text()

  const parsed = Papa.parse<TaskRow>(csvText, {
    header: true,
    skipEmptyLines: true
  })

  if (parsed.errors.length > 0) {
    throw new Error(parsed.errors[0]?.message ?? "Failed to parse CSV")
  }

  return parsed.data.map((row) => ({
    taskId: String(row["Task ID"] ?? "").trim(),
    taskName: String(row["Task Name"] ?? "").trim(),
    phase: String(row.Phase ?? "").trim(),
    owner: String(row.Owner ?? "").trim(),
    startDate: normalizeDate(row["Start Date"]),
    endDate: normalizeDate(row["End Date"]),
    status: normalizeStatus(row.Status),
    progress: normalizeProgress(row.Progress ?? row["Progress (%)"]),
    notes: String(row.Notes ?? "").trim()
  }))
}
