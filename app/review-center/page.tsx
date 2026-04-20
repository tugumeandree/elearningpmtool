import ReviewCenterPanel from "@/components/ReviewCenterPanel"

export default function ReviewCenterPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-8">
      <div className="mx-auto w-full max-w-5xl rounded-3xl border border-slate-200/80 bg-white/70 p-6 shadow-sm backdrop-blur md:p-8">
        <ReviewCenterPanel />
      </div>
    </main>
  )
}
