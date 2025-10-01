"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import type { Member, Task } from "@/redux/slices/members-slice"

function activeTasks(tasks: Task[]) {
  return tasks.filter((t) => !t.completed).length
}

export default function MemberRow({ member }: { member: Member }) {
  const color =
    member.status === "Working"
      ? "bg-green-200 text-green-800 dark:bg-green-700/30 dark:text-green-200"
      : member.status === "Meeting"
        ? "bg-blue-200 text-blue-800 dark:bg-blue-700/30 dark:text-blue-200"
        : member.status === "Break"
          ? "bg-yellow-200 text-yellow-900 dark:bg-yellow-700/30 dark:text-yellow-100"
          : "bg-gray-200 text-gray-800 dark:bg-gray-700/30 dark:text-gray-200"

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <Image
          src={member.avatar || "/placeholder.svg?height=40&width=40&query=member-avatar"}
          alt={`${member.name} avatar`}
          width={36}
          height={36}
          className="rounded-full"
        />
        <div className="flex flex-col">
          <span className="font-medium">{member.name}</span>
          <span className="text-xs text-muted-foreground">{activeTasks(member.tasks)} active task(s)</span>
        </div>
      </div>
      <Badge className={color}>{member.status}</Badge>
    </div>
  )
}
