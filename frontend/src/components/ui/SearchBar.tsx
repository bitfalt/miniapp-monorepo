"use client"

import { useState, ChangeEvent, KeyboardEvent, InputHTMLAttributes, forwardRef } from 'react'
import { Search } from 'lucide-react'

// Utility function for class names
const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ')

// Input component
const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

interface SearchBarProps {
  onSearch: (query: string) => void
  className?: string
  placeholder?: string
}

export default function SearchBar({ 
  onSearch, 
  className, 
  placeholder = "Search for tests" 
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = () => {
    onSearch(searchQuery)
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className={cn("relative w-full max-w-md", className)}>
      <Input
        type="search"
        placeholder={placeholder}
        value={searchQuery}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        className="w-full h-12 pl-4 pr-12 bg-white rounded-full border-0 text-gray-600 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      <button
        onClick={handleSearch}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#1B4B43] p-2 rounded-full transition-colors hover:bg-[#15372F] focus:outline-none focus:ring-2 focus:ring-[#1B4B43] focus:ring-offset-2"
        aria-label="Search"
      >
        <Search className="w-4 h-4 text-white" />
      </button>
    </div>
  )
}

