import { LoadingSpinner } from "./LoadingSpinner"

export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-brand-tertiary flex items-center justify-center z-50">
      <LoadingSpinner />
    </div>
  )
} 