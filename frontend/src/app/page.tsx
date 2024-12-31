"use client";

import { FilledButton } from '@/components/ui/FilledButton'
import { Check, AlertTriangle } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center gap-4">
      {/* Default button with arrow */}
      <FilledButton>
        Click me!
      </FilledButton>

      {/* Success variant with check */}
      <FilledButton variant="success" size="md" icon={Check}>
        Success
      </FilledButton>

      {/* Warning variant with alert icon */}
      <FilledButton variant="warning" size="lg" icon={AlertTriangle}>
        Warning
      </FilledButton>
    </div>
  )
}
