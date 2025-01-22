import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { XataClient } from "./xata"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const xata = new XataClient({ apiKey: process.env.XATA_API_KEY });