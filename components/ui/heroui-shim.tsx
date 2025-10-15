"use client"

import React from "react"

type Props = {
  value?: any
  defaultValue?: any
  onChange?: (val: any) => void
  hideTimeZone?: boolean
  showMonthAndYearPickers?: boolean
  variant?: "bordered" | string
  className?: string
}

// Lightweight shim for DatePicker when @heroui/react is unavailable.
// Renders a native datetime-local input and adapts the API shape.
export function DatePicker({ value, defaultValue, onChange, className }: Props) {
  const [localVal, setLocalVal] = React.useState<string>("")

  React.useEffect(() => {
    if (value instanceof Date) {
      // convert Date to datetime-local string
      const iso = new Date(value).toISOString()
      setLocalVal(iso.slice(0, 16))
    } else if (typeof value === "string" && value) {
      setLocalVal(value.slice(0, 16))
    } else if (defaultValue && typeof defaultValue === "object") {
      const now = new Date()
      setLocalVal(now.toISOString().slice(0, 16))
    }
  }, [value, defaultValue])

  return (
    <input
      type="datetime-local"
      value={localVal}
      onChange={(e) => {
        const v = e.target.value
        setLocalVal(v)
        const iso = v ? new Date(v).toISOString() : ""
        onChange?.(iso as any)
      }}
      className={className || "w-full bg-gray-900/50 border border-gray-700 rounded-md text-white p-2"}
    />
  )
}


