"use client"

import { ExternalLink, FileText, Languages, UserCircle2 } from "lucide-react"

export type ReviewStatus = "Under Review" | "Approved" | "Not Started"

export interface ReviewItem {
  id: number
  title: string
  description: string
  type: "Script" | "SME Video" | "Storyboard" | "Audio"
  language: "EN" | "FR" | "EN/FR"
  link: string
  status: ReviewStatus
  owner: string
}

interface ReviewCardProps {
  item: ReviewItem
}

const statusStyles: Record<ReviewStatus, string> = {
  "Under Review": "border-amber-200 bg-amber-100 text-amber-800",
  Approved: "border-emerald-200 bg-emerald-100 text-emerald-800",
  "Not Started": "border-slate-200 bg-slate-100 text-slate-700"
}

const typeStyles: Record<ReviewItem["type"], string> = {
  Script: "border-blue-200 bg-blue-50 text-blue-700",
  "SME Video": "border-orange-200 bg-orange-50 text-orange-700",
  Storyboard: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700",
  Audio: "border-emerald-200 bg-emerald-50 text-emerald-700"
}

const languageStyles: Record<ReviewItem["language"], string> = {
  EN: "border-sky-200 bg-sky-50 text-sky-700",
  FR: "border-rose-200 bg-rose-50 text-rose-700",
  "EN/FR": "border-violet-200 bg-violet-50 text-violet-700"
}

function getInitials(owner: string) {
  return owner
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join("")
}

export default function ReviewCard({ item }: ReviewCardProps) {
  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2 md:max-w-2xl">
          <h3 className="text-lg font-bold tracking-tight text-slate-900">{item.title}</h3>
          <p className="text-sm text-slate-600">{item.description}</p>

          <div className="flex flex-wrap gap-2 pt-1">
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${typeStyles[item.type]}`}
            >
              <FileText className="h-3.5 w-3.5" />
              {item.type}
            </span>
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${languageStyles[item.language]}`}
            >
              <Languages className="h-3.5 w-3.5" />
              {item.language}
            </span>
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[item.status]}`}
            >
              {item.status}
            </span>
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-3 border-t border-slate-100 pt-3 md:min-w-[16rem] md:border-l md:border-t-0 md:pl-4 md:pt-0">
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Status</p>
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[item.status]}`}
            >
              {item.status}
            </span>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                {getInitials(item.owner)}
              </span>
              <span className="inline-flex items-center gap-1">
                <UserCircle2 className="h-4 w-4 text-slate-500" />
                {item.owner}
              </span>
            </div>

            <a
              href={item.link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 hover:shadow-sm sm:w-auto"
            >
              Open Document
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </article>
  )
}
