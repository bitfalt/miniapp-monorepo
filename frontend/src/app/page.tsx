"use client";

import { ProfileCard } from '@/components/UI/ProfileCard'
import SearchBar from '@/components/UI/Search-Bar'

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <ProfileCard />
      <SearchBar onSearch={(query) => console.log(query)} />
    </div>
  )
}
