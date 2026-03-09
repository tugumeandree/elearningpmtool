type Channel = "implementation-timeline" | "milestones" | "module-tracker"

interface ChannelViewProps {
  channel: Channel
  children: React.ReactNode
}

const channelMeta: Record<Channel, { title: string; subtitle: string }> = {
  "implementation-timeline": {
    title: "Implementation Timeline",
    subtitle: "Live execution feed and schedule coverage"
  },
  milestones: {
    title: "Milestones",
    subtitle: "High-level completion and delivery checkpoints"
  },
  "module-tracker": {
    title: "Module Tracker",
    subtitle: "Task ownership and module-level progress"
  }
}

export default function ChannelView({ channel, children }: ChannelViewProps) {
  const meta = channelMeta[channel]
  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{meta.title}</h2>
        <p className="mt-1 text-sm text-slate-500">{meta.subtitle}</p>
      </div>
      {children}
    </section>
  )
}
