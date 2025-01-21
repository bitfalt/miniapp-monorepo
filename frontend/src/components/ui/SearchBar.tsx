"use client"

import { useState, ChangeEvent, KeyboardEvent, InputHTMLAttributes, forwardRef } from 'react'

// Utility function for class names
const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ')

// Input component
const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-full border border-teal-600 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(searchQuery);
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
        className="w-full h-12 pl-4 pr-12 bg-white rounded-full border-0 text-gray-600 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 text-lg font-bold"
      />
    </div>
  )
}

