"use client"

import { useAppDispatch } from "@/redux/store"
import { updateStatus, type Status } from "@/redux/slices/members-slice"
import { Button } from "@/components/ui/button"

const OPTIONS: Status[] = ["Working", "Break", "Meeting", "Offline"]

const activeClass = (opt: Status) =>
  opt === "Working"
    ? "bg-emerald-600 text-white hover:bg-emerald-600"
    : opt === "Meeting"
      ? "bg-blue-600 text-white hover:bg-blue-600"
      : opt === "Break"
        ? "bg-amber-500 text-white hover:bg-amber-500"
        : "bg-gray-600 text-white hover:bg-gray-600"

const outlineClass = (opt: Status) =>
  opt === "Working"
    ? "text-emerald-700 border-emerald-300 hover:bg-emerald-50 dark:text-emerald-300 dark:border-emerald-700"
    : opt === "Meeting"
      ? "text-blue-700 border-blue-300 hover:bg-blue-50 dark:text-blue-300 dark:border-blue-700"
      : opt === "Break"
        ? "text-amber-700 border-amber-300 hover:bg-amber-50 dark:text-amber-300 dark:border-amber-700"
        : "text-gray-700 border-gray-300 hover:bg-gray-50 dark:text-gray-300 dark:border-gray-700"

export default function StatusSelector({
  memberId,
  current,
}: {
  memberId: string
  current: Status
}) {
  const dispatch = useAppDispatch()
  return (
    <div className="flex flex-wrap gap-2">
      {OPTIONS.map((opt) => (
        <Button
          key={opt}
          type="button"
          variant={opt === current ? "default" : "outline"}
          className={opt === current ? activeClass(opt) : outlineClass(opt)}
          onClick={() => dispatch(updateStatus({ memberId, status: opt }))}
        >
          {opt}
        </Button>
      ))}
    </div>
  )
}
