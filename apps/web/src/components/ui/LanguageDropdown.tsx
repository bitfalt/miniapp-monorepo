"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Globe } from "lucide-react";

type Language = "en" | "es";

interface LanguageDropdownProps {
  onChange?: (language: Language) => void;
}

export function LanguageDropdown({ onChange }: LanguageDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("en");

  useEffect(() => {
    // Get the stored language preference or default to English
    const storedLanguage = localStorage.getItem("language") as Language;
    if (storedLanguage && (storedLanguage === "en" || storedLanguage === "es")) {
      setSelectedLanguage(storedLanguage);
    }
  }, []);

  const handleLanguageChange = (language: Language) => {
    setSelectedLanguage(language);
    localStorage.setItem("language", language);
    setIsOpen(false);
    
    if (onChange) {
      onChange(language);
    }
  };

  const languages = {
    en: "English",
    es: "Español",
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-md px-2 py-1 text-sm text-neutral-black hover:bg-neutral-grey/10"
      >
        <Globe className="h-4 w-4" />
        <span>{languages[selectedLanguage]}</span>
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-1 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {Object.entries(languages).map(([code, name]) => (
              <button
                key={code}
                onClick={() => handleLanguageChange(code as Language)}
                className={cn(
                  "block w-full px-4 py-2 text-left text-sm",
                  selectedLanguage === code
                    ? "bg-accent-red/10 text-accent-red"
                    : "text-neutral-black hover:bg-neutral-grey/10"
                )}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 