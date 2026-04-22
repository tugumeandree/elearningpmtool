"use client"

import { useEffect, useMemo, useState } from "react"
import { Search, Sparkles } from "lucide-react"
import ReviewCard, { ReviewItem } from "@/components/ReviewCard"

type ReviewFilter = "All" | "Script" | "SME Video" | "Storyboard" | "Audio" | "Animation"

const baseReviewItems: ReviewItem[] = [
  {
    id: 1,
    title: "Animated Video Script (EN)",
    description: "Decent Work & Social Protection - English Version",
    type: "Script",
    language: "EN",
    link: "https://docs.google.com/presentation/d/1vST4-j9NU_Eg50u3WAtw9o1qEqyUEdTT/edit",
    thumbnail:
      "https://res.cloudinary.com/dwa3soopc/image/upload/v1776849097/Enabel/Animated%20Video%20Script%20%28EN%29.png",
    feedbackLink:
      "https://docs.google.com/spreadsheets/d/1PVL-Aie9TXKTeuB_8ATqk6k6X-c42649IsIReIzxDJk/edit?gid=591557179#gid=591557179",
    feedbackLabel: "Submit Feedback",
    status: "Under Review",
    owner: "Berivan"
  },
  {
    id: 2,
    title: "French Localised Script",
    description: "Travail decent et protection sociale - Version Francaise",
    type: "Script",
    language: "FR",
    link: "https://docs.google.com/presentation/d/1KVmFsXjK3he1zXNsKZcRByLLo5ZaXfpT/edit",
    thumbnail:
      "https://res.cloudinary.com/dwa3soopc/image/upload/v1776849096/Enabel/French_Thumbnail_1_tpfvfj.png",
    feedbackLink:
      "https://docs.google.com/spreadsheets/d/1PVL-Aie9TXKTeuB_8ATqk6k6X-c42649IsIReIzxDJk/edit?gid=188733276#gid=188733276",
    feedbackLabel: "Submit Feedback",
    status: "Under Review",
    owner: "Lucie"
  },
  {
    id: 3,
    title: "SME Video Interview Questions",
    description: "Live Subject Matter Expert Scripts (EN + FR)",
    type: "SME Video",
    language: "EN/FR",
    link: "https://docs.google.com/presentation/d/1YY8uC3BgDr_ZwFK6AgyVzhbeTVgIhY6J/edit",
    thumbnail: "https://placehold.co/1200x675/e2e8f0/334155?text=SME+Video+Review",
    status: "Under Review",
    owner: "Enabel Team"
  },
  {
    id: 4,
    title: "Pilot Storyboard",
    description: "Module 0 & 1 Storyboards",
    type: "Storyboard",
    language: "EN/FR",
    link: "https://drive.google.com/drive/folders/1MIkPchrSMkEC97HrY6LD5_In9-6ef2kx",
    thumbnail: "https://placehold.co/1200x675/fce7f3/831843?text=Storyboard+Review",
    status: "Under Review",
    owner: "Full Team"
  },
  {
    id: 5,
    title: "Audio (Voice Over & Music) Review",
    description: "Voice over and music files (EN + FR)",
    type: "Audio",
    language: "EN/FR",
    link: "https://drive.google.com/drive/folders/11o1KcQA5ImFrMgUDe_MhI-ecvrzJzAUq?usp=sharing",
    thumbnail: "https://placehold.co/1200x675/dcfce7/14532d?text=Audio+Review",
    status: "Under Review",
    owner: "Full Team"
  },
  {
    id: 6,
    title: "Animations Review",
    description: "Animation assets and draft renders",
    type: "Animation",
    language: "EN/FR",
    link: "https://drive.google.com/drive/folders/1whLNSDEzDOoInRSl25j3T8mX5zyEQcUp?usp=sharing",
    thumbnail: "https://placehold.co/1200x675/cffafe/155e75?text=Animations+Review",
    status: "Under Review",
    owner: "Full Team"
  }
]

const filterTabs: ReviewFilter[] = ["All", "Script", "SME Video", "Storyboard", "Audio", "Animation"]

const filterTabLabels: Record<ReviewFilter, string> = {
  All: "All",
  Script: "Scripts",
  "SME Video": "SME Videos",
  Storyboard: "Storyboards",
  Audio: "Audio (Voice Over & Music)",
  Animation: "Animations"
}

interface ReviewCenterPanelProps {
  showHeader?: boolean
}

export default function ReviewCenterPanel({ showHeader = true }: ReviewCenterPanelProps) {
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>(baseReviewItems)
  const [activeFilter, setActiveFilter] = useState<ReviewFilter>("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [lastRefreshed, setLastRefreshed] = useState(() => new Date().toLocaleTimeString())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const timer = window.setInterval(() => {
      setLastRefreshed(new Date().toLocaleTimeString())
    }, 30_000)

    return () => {
      window.clearInterval(timer)
    }
  }, [])

  const filteredItems = useMemo(() => {
    return reviewItems.filter((item) => {
      const typeMatch = activeFilter === "All" || item.type === activeFilter
      const titleMatch = item.title.toLowerCase().includes(searchQuery.toLowerCase().trim())
      return typeMatch && titleMatch
    })
  }, [activeFilter, reviewItems, searchQuery])

  return (
    <section className="space-y-5">
      {showHeader ? (
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Stakeholder Reviews</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Review Center</h1>
          <p className="text-sm text-slate-500">All materials pending validation</p>
        </header>
      ) : null}

      <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm md:p-5">
        <div className="flex flex-col gap-3">
          <div className="relative w-full lg:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by title"
              className="w-full rounded-lg border border-slate-300 bg-slate-50/70 py-2 pl-9 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            {filterTabs.map((tab) => {
              const active = tab === activeFilter
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveFilter(tab)}
                  className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                    active
                      ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                      : "border-slate-300 bg-white text-slate-600 hover:border-slate-500 hover:text-slate-800"
                  }`}
                >
                  {filterTabLabels[tab]}
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-1.5 border-t border-slate-100 pt-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>{filteredItems.length} items visible</p>
          <p className="inline-flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-blue-500" />
            Auto-refresh marker: {lastRefreshed}
          </p>
        </div>
      </section>

      <div>
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                className={`transition-all duration-300 ${mounted ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <ReviewCard item={item} />
              </div>
            ))}
          </div>
        ) : (
          <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <h3 className="text-lg font-semibold text-slate-800">No review items found</h3>
            <p className="mt-1 text-sm text-slate-500">Try a different filter or clear your search query.</p>
          </section>
        )}
      </div>
    </section>
  )
}
