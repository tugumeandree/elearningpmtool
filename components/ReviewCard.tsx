"use client"

import { useEffect, useRef, useState } from "react"
import { ExternalLink, FileText, Languages, UserCircle2 } from "lucide-react"

export type ReviewStatus = "Under Review" | "Approved" | "Not Started"

export interface ReviewItem {
  id: number
  title: string
  description: string
  type: "Script" | "SME Video" | "Storyboard" | "Audio" | "Animation" | "Infographics"
  language: "EN" | "FR" | "EN/FR"
  link: string
  thumbnail?: string
  feedbackLink?: string
  feedbackLabel?: string
  moduleFolders?: Array<{ label: string; link: string }>
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
  Audio: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Animation: "border-cyan-200 bg-cyan-50 text-cyan-700",
  Infographics: "border-indigo-200 bg-indigo-50 text-indigo-700"
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
  const [showFolderMenu, setShowFolderMenu] = useState(false)
  const hasModuleFolders = Boolean(item.moduleFolders && item.moduleFolders.length > 0)
  const folderMenuContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!showFolderMenu) {
      return
    }

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target
      if (!(target instanceof Node)) {
        return
      }

      if (!folderMenuContainerRef.current?.contains(target)) {
        setShowFolderMenu(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowFolderMenu(false)
      }
    }

    document.addEventListener("mousedown", handlePointerDown)
    document.addEventListener("touchstart", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("mousedown", handlePointerDown)
      document.removeEventListener("touchstart", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [showFolderMenu])

  return (
    <article className="group overflow-visible rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      {item.thumbnail ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-slate-200 bg-slate-100">
          <img
            src={item.thumbnail}
            alt={`${item.title} thumbnail`}
            loading="lazy"
            className="h-full w-full object-cover object-center transition duration-300 group-hover:scale-[1.04]"
          />
        </div>
      ) : null}

      <div className="flex flex-col gap-4 p-5 md:flex-row md:items-start md:justify-between md:p-6">
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

          <div className="flex flex-col gap-3">
            <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                {getInitials(item.owner)}
              </span>
              <span className="inline-flex items-center gap-1">
                <UserCircle2 className="h-4 w-4 text-slate-500" />
                {item.owner}
              </span>
            </div>

            <div className="flex w-full flex-col gap-2">
              {hasModuleFolders ? (
                <div ref={folderMenuContainerRef} className="relative z-20">
                  <button
                    type="button"
                    onClick={() => setShowFolderMenu((current) => !current)}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 hover:shadow-sm"
                  >
                    Open Folder
                    <ExternalLink className="h-4 w-4" />
                  </button>

                  {showFolderMenu ? (
                    <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-40 w-full min-w-[17rem] rounded-xl border border-slate-200 bg-white p-3 shadow-xl md:min-w-[19rem]">
                      <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Select Module</p>
                      <div className="flex max-h-72 flex-col gap-1 overflow-y-auto">
                        {item.moduleFolders?.map((folder) => (
                          <a
                            key={folder.label}
                            href={folder.link}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => setShowFolderMenu(false)}
                            className="inline-flex items-center justify-between rounded-md px-2 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                          >
                            {folder.label}
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 hover:shadow-sm"
                >
                  Open Document
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}

              {item.feedbackLink ? (
                <a
                  href={item.feedbackLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 transition hover:border-emerald-400 hover:bg-emerald-100"
                >
                  {item.feedbackLabel ?? "Submit Feedback"}
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
