'use client'

import { useState, useEffect } from 'react'
import { Home, BookCheck, Trophy, Settings, Lightbulb } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { icon: Home, href: '/' },
  { icon: BookCheck, href: '/test-selection' },
  { icon: Lightbulb, href: '/results' },
  { icon: Trophy, href: '/achievements' },
  { icon: Settings, href: '/settings' },
]

export default function MobileBottomNav() {
  const pathname = usePathname()
  const [active, setActive] = useState(0)

  useEffect(() => {
    const currentIndex = navItems.findIndex(item => item.href === pathname)
    if (currentIndex !== -1) {
      setActive(currentIndex)
    }
  }, [pathname])

  // Hide bottom nav on ideology test page
  if (pathname.includes('/ideology-test')) {
    return null
  }

  return (
    <nav className="fixed bottom-4 left-4 right-4 h-16 bg-brand-tertiary rounded-[25px] shadow-lg">
      <div className="flex justify-around items-center h-full px-4">
        {navItems.map(({ icon: Icon, href }, index) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center justify-center w-12 h-12 ${
              active === index ? 'text-accent-red' : 'text-gray-100'
            }`}
          >
            <div className={`p-2 rounded-full ${active === index ? 'bg-accent-red/10' : ''}`}>
              <Icon size={24} className={`transition-all duration-300 ${active === index ? 'scale-110' : ''}`} />
            </div>
          </Link>
        ))}
      </div>
    </nav>
  )
}
