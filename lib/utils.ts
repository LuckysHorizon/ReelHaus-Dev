import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Time helpers: robust UTC -> IST formatting for DB timestamptz strings
function parseUtcInput(input: string): Date {
  // Normalizes common DB outputs like "2024-11-15 21:00:00+00" into ISO
  let normalized = input
  if (normalized.includes(" ")) normalized = normalized.replace(" ", "T")
  // Normalize "+00" to Z (UTC)
  if (normalized.endsWith("+00")) normalized = normalized.slice(0, -3) + "Z"
  // Normalize timezone like +05 to +05:00
  else if (/[+-]\d{2}$/.test(normalized)) normalized = normalized + ":00"
  // If no timezone marker, assume UTC
  if (!/[zZ]|[+-]\d{2}:?\d{2}$/.test(normalized)) normalized += "Z"
  return new Date(normalized)
}

export function formatISTDate(utcString: string): string {
  const d = parseUtcInput(utcString)
  const parts = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Kolkata'
  }).formatToParts(d)
  const map: Record<string, string> = {}
  parts.forEach(p => { if (p.type !== 'literal') map[p.type] = p.value })
  return `${map.weekday}, ${map.month} ${map.day}, ${map.year}`
}

export function formatISTTime12(utcString: string): string {
  const d = parseUtcInput(utcString)
  const parts = new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata'
  }).formatToParts(d)
  const hour = parts.find(p => p.type === 'hour')?.value || ''
  const minute = parts.find(p => p.type === 'minute')?.value || ''
  const dayPeriod = (parts.find(p => p.type === 'dayPeriod')?.value || '').toUpperCase()
  return `${hour}:${minute} ${dayPeriod}`
}

// UTC-only formatting (requested)
export function formatUTCDate(utcString: string): string {
  const d = parseUtcInput(utcString)
  const parts = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'
  }).formatToParts(d)
  const map: Record<string, string> = {}
  parts.forEach(p => { if (p.type !== 'literal') map[p.type] = p.value })
  return `${map.weekday}, ${map.month} ${map.day}, ${map.year}`
}

export function formatUTCTime12(utcString: string): string {
  const d = parseUtcInput(utcString)
  const parts = new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'UTC'
  }).formatToParts(d)
  const hour = parts.find(p => p.type === 'hour')?.value || ''
  const minute = parts.find(p => p.type === 'minute')?.value || ''
  const dayPeriod = (parts.find(p => p.type === 'dayPeriod')?.value || '').toUpperCase()
  return `${hour}:${minute} ${dayPeriod}`
}