"use client"

import { useRef } from "react"
import Image from "next/image"
import { Menu, X, KanbanSquare, Flag, ListTodo, MessagesSquare, Megaphone } from "lucide-react"

type Channel = "implementation-timeline" | "milestones" | "module-tracker" | "review-center" | "announcements"

interface SidebarProps {
  activeChannel: Channel
  onChannelSelect: (channel: Channel) => void
  isOpen: boolean
  onToggle: () => void
  onClose: () => void
}

const channels: Array<{ id: Channel; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { id: "implementation-timeline", label: "#implementation-timeline", icon: KanbanSquare },
  { id: "milestones", label: "#milestones", icon: Flag },
  { id: "module-tracker", label: "#module-tracker", icon: ListTodo },
  { id: "review-center", label: "#review-center", icon: MessagesSquare },
  { id: "announcements", label: "#announcements", icon: Megaphone }
]

const consultantLogo =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRC6LEPGPBUreszQVjTZBmfTZ8CvmBfiK86_g&s"
const clientLogo = "https://www.enabel.be/app/uploads/2023/04/Enabel_Logo_Color_RGB-1.jpg"

export default function Sidebar({ activeChannel, onChannelSelect, isOpen, onToggle, onClose }: SidebarProps) {
  const touchStartX = useRef<number | null>(null)

  return (
    <>
      <button
        type="button"
        onClick={onToggle}
        className={`fixed left-3 top-3 z-50 rounded-lg border border-slate-700 bg-slate-900 p-2 text-slate-200 shadow-lg transition-[left] duration-300 md:top-4 ${
          isOpen ? "md:left-[17rem]" : "md:left-4"
        }`}
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {isOpen ? (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={onClose}
          className="fixed inset-0 z-20 bg-black/30 transition-opacity duration-200 md:hidden"
        />
      ) : null}

      <aside
        onTouchStart={(event) => {
          touchStartX.current = event.touches[0]?.clientX ?? null
        }}
        onTouchEnd={(event) => {
          const startX = touchStartX.current
          const endX = event.changedTouches[0]?.clientX
          touchStartX.current = null

          if (!isOpen || startX === null || endX === undefined) {
            return
          }

          if (startX - endX > 60) {
            onClose()
          }
        }}
        className={`fixed inset-y-0 left-0 z-40 w-[86vw] max-w-72 border-r border-slate-800 bg-slate-900/95 text-slate-200 backdrop-blur transition-transform duration-300 ease-out md:w-72 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-slate-800 px-4 py-4 md:px-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Workspace</p>
          <h1 className="mt-2 text-base font-semibold leading-tight md:text-lg">Decent Work &amp; Social Protection (DWSP) Project Dashboard (EN + FR)</h1>
          <p className="mt-2 text-xs text-slate-400">Contract Reference: UGA21003_A050401</p>
        </div>

        <nav className="p-3 pb-36">
          {channels.map((channel) => {
            const Icon = channel.icon
            const active = channel.id === activeChannel
            return (
              <button
                key={channel.id}
                type="button"
                onClick={() => {
                  onChannelSelect(channel.id)
                  onClose()
                }}
                className={`mb-1 flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left text-[15px] transition md:py-2 md:text-sm ${
                  active ? "bg-slate-700 text-white" : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{channel.label}</span>
              </button>
            )
          })}
        </nav>

        <footer className="absolute bottom-0 left-0 right-0 border-t border-slate-800 bg-slate-900/90 p-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-slate-700 bg-slate-800/60 p-2">
              <p className="mb-1 text-[9px] uppercase tracking-[0.14em] text-slate-400">Consultant</p>
              <div className="rounded bg-white p-1.5">
                <Image
                  src={consultantLogo}
                  alt="Project manager and consultant logo"
                  width={180}
                  height={60}
                  className="h-7 w-full object-contain"
                />
              </div>
            </div>

            <div className="rounded-lg border border-slate-700 bg-slate-800/60 p-2">
              <p className="mb-1 text-[9px] uppercase tracking-[0.14em] text-slate-400">Client</p>
              <div className="rounded bg-white p-1.5">
                <Image
                  src={clientLogo}
                  alt="Enabel client logo"
                  width={180}
                  height={60}
                  className="h-7 w-full object-contain"
                />
              </div>
            </div>
          </div>
        </footer>
      </aside>
    </>
  )
}
