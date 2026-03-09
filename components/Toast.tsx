interface ToastProps {
  message: string
  variant?: "success" | "error"
  visible: boolean
}

const variantStyles: Record<NonNullable<ToastProps["variant"]>, string> = {
  success: "border-green-200 bg-green-50 text-green-700",
  error: "border-red-200 bg-red-50 text-red-700"
}

export default function Toast({ message, variant = "success", visible }: ToastProps) {
  return (
    <div
      className={`pointer-events-none fixed bottom-5 right-5 z-50 rounded-md border px-4 py-2 text-sm font-medium shadow transition-all duration-200 ${variantStyles[variant]} ${
        visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  )
}
