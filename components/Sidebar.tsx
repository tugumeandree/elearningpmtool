"use client"

import { Menu, X, KanbanSquare, Flag, ListTodo } from "lucide-react"

type Channel = "implementation-timeline" | "milestones" | "module-tracker"

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
  { id: "module-tracker", label: "#module-tracker", icon: ListTodo }
]

export default function Sidebar({ activeChannel, onChannelSelect, isOpen, onToggle, onClose }: SidebarProps) {
  return (
    <>
      <button
        type="button"
        onClick={onToggle}
        className={`fixed top-4 z-50 rounded-md bg-slate-900 p-2 text-slate-200 shadow-lg transition-[left] duration-300 ${
          isOpen ? "left-[17rem]" : "left-4"
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
          className="fixed inset-0 z-20 bg-black/30 md:hidden"
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-800 bg-slate-900 text-slate-200 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-slate-800 px-5 py-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Workspace</p>
          <h1 className="mt-2 text-lg font-semibold">Project Pulse</h1>
        </div>

        <nav className="p-3">
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
                className={`mb-1 flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition ${
                  active ? "bg-slate-700 text-white" : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{channel.label}</span>
              </button>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
