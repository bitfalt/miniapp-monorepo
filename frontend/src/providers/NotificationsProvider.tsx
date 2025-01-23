"use client"

import { createContext, useContext, useState } from "react"

const NotificationsContext = createContext({
  notificationsEnabled: true,
  toggleNotifications: () => {}
})

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  const toggleNotifications = () => {
    setNotificationsEnabled(prev => !prev)
  }

  return (
    <NotificationsContext.Provider value={{ notificationsEnabled, toggleNotifications }}>
      {children}
    </NotificationsContext.Provider>
  )
}

export const useNotifications = () => useContext(NotificationsContext) 