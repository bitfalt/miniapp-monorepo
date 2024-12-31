"use client";

import { FilledButton } from '@/components/ui/FilledButton'
import { Check, AlertTriangle } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center gap-4">
      <FilledButton>
        Click me!
      </FilledButton>

      <FilledButton variant="success" size="md" icon={Check}>
        Success
      </FilledButton>

      <FilledButton variant="warning" size="lg" icon={AlertTriangle}>
        Warning
      </FilledButton>
    </div>
  )
}
