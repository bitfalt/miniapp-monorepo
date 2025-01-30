import { LoadingSpinner } from "./LoadingSpinner"

export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-brand-tertiary/90 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner />
      </div>
    </div>
  )
} 