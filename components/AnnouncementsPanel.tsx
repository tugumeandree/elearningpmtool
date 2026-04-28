interface AnnouncementsPanelProps {
  showHeader?: boolean
}

const filmingDates = [
  { date: "11 May 2026", activity: "SME Video Filming - All Experts", location: "Kigali Studio A" },
  { date: "11 May 2026", activity: "Backup Pickup Slots", location: "Kigali Studio A" }
]

const voiceOverDates = [
  { date: "2 May 2026", activity: "French Voice Over Recording - Session 1", studio: "Audio Booth 1" },
  { date: "3 May 2026", activity: "French Voice Over Recording - Session 2", studio: "Audio Booth 1" },
  { date: "4 May 2026", activity: "French Voice Over Final Review", studio: "Audio Booth 2" }
]

const subjectMatterVideos = [
  {
    module: "Course Start",
    expertNeeded: "DWSP Expert",
    liveVideoTheme: "Course welcome and introduction",
    expertName: "Berivan",
    filmingSlot: "11 May 2026 - 09:00",
    status: "Confirmed"
  },
  {
    module: "Module 1 (Optional)",
    expertNeeded: "Labour / DWSP Expert",
    liveVideoTheme: "Why decent work matters for youth today",
    expertName: "TBC",
    filmingSlot: "11 May 2026 - 09:45",
    status: "Pending"
  },
  {
    module: "Module 2",
    expertNeeded: "Labour Law Expert / Ministry / Enabel",
    liveVideoTheme: "Importance of knowing rights; real-world violations; why youth are vulnerable",
    expertName: "TBC",
    filmingSlot: "11 May 2026 - 10:30",
    status: "Pending"
  },
  {
    module: "Module 3",
    expertNeeded: "Occupational Safety Expert",
    liveVideoTheme: "Why safety matters; common risks for young workers",
    expertName: "TBC",
    filmingSlot: "11 May 2026 - 11:15",
    status: "Pending"
  },
  {
    module: "Module 4",
    expertNeeded: "Social Protection Specialist (Enabel / Gov)",
    liveVideoTheme: "Why social protection matters; real-life impact",
    expertName: "Lucie",
    filmingSlot: "11 May 2026 - 13:30",
    status: "Confirmed"
  },
  {
    module: "Module 5",
    expertNeeded: "GBV Expert / Gender Specialist",
    liveVideoTheme: "What GBV looks like; why it happens; why reporting matters",
    expertName: "TBC",
    filmingSlot: "11 May 2026 - 14:15",
    status: "Pending"
  },
  {
    module: "Module 6",
    expertNeeded: "Reporting Expert / Legal / NGO / Worker Support Org",
    liveVideoTheme: "Where to report; what happens after reporting; encouragement",
    expertName: "TBC",
    filmingSlot: "11 May 2026 - 15:00",
    status: "Pending"
  },
  {
    module: "End",
    expertNeeded: "Authority",
    liveVideoTheme: "Key takeaway and encouragement",
    expertName: "Berivan",
    filmingSlot: "11 May 2026 - 15:45",
    status: "Confirmed"
  }
]

export default function AnnouncementsPanel({ showHeader = true }: AnnouncementsPanelProps) {
  return (
    <section className="space-y-5">
      {showHeader ? (
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Production Notices</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Announcements</h1>
          <p className="text-sm text-slate-500">Filming schedules, recording dates, and SME coordination</p>
        </header>
      ) : null}

      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Production Strategy (For the Team)</h3>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
          <li>Shoot all videos in one day.</li>
          <li>Keep the same background, lighting, camera, and style for every expert video.</li>
          <li>Ask each expert 3 to 4 short questions, not long speeches.</li>
        </ul>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">SME Video Filming Dates</h3>
          <ul className="mt-3 space-y-3">
            {filmingDates.map((item) => (
              <li key={`${item.date}-${item.activity}`} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-sm font-semibold text-slate-900">{item.date}</p>
                <p className="mt-1 text-sm text-slate-700">{item.activity}</p>
                <p className="mt-1 text-xs text-slate-500">Location: {item.location}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">French Voice Over Recording Dates</h3>
          <ul className="mt-3 space-y-3">
            {voiceOverDates.map((item) => (
              <li key={`${item.date}-${item.activity}`} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-sm font-semibold text-slate-900">{item.date}</p>
                <p className="mt-1 text-sm text-slate-700">{item.activity}</p>
                <p className="mt-1 text-xs text-slate-500">Studio: {item.studio}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-slate-900">Subject Matter Videos Structure</h3>
          <p className="mt-1 text-sm text-slate-500">Module coverage, expert profile required, and assigned names</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-2 py-2">Module</th>
                <th className="px-2 py-2">Subject Matter Expert Needed</th>
                <th className="px-2 py-2">Live Video Theme</th>
                <th className="px-2 py-2">Expert Name</th>
                <th className="px-2 py-2">Filming Slot</th>
                <th className="px-2 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {subjectMatterVideos.map((video) => (
                <tr key={video.module} className="border-b border-slate-100 text-slate-700">
                  <td className="px-2 py-2 font-medium">{video.module}</td>
                  <td className="px-2 py-2">{video.expertNeeded}</td>
                  <td className="px-2 py-2">{video.liveVideoTheme}</td>
                  <td className="px-2 py-2">{video.expertName}</td>
                  <td className="px-2 py-2">{video.filmingSlot}</td>
                  <td className="px-2 py-2">{video.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  )
}