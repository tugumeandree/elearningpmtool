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
      className={`pointer-events-none fixed bottom-4 left-1/2 z-50 w-[calc(100vw-1.5rem)] max-w-sm -translate-x-1/2 rounded-md border px-4 py-2 text-sm font-medium shadow transition-all duration-200 sm:bottom-5 sm:left-auto sm:right-5 sm:w-auto sm:max-w-none sm:translate-x-0 ${variantStyles[variant]} ${
        visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  )
}
