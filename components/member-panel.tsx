"use client"

import { useMemo } from "react"
import { useAppDispatch, useAppSelector } from "@/redux/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import StatusSelector from "./status-selector"
import TaskList from "./task-list"

export default function MemberPanel() {
  const dispatch = useAppDispatch()
  const { currentUserId } = useAppSelector((s) => s.role)
  const member = useAppSelector((s) => s.members.members.find((m) => m.id === s.role.currentUserId))

  const counts = useMemo(() => {
    const total = member?.tasks.length ?? 0
    const active = member?.tasks.filter((t) => !t.completed).length ?? 0
    const done = total - active
    return { total, active, done }
  }, [member])

  if (!member) return <div className="text-muted-foreground p-6">No current user.</div>

  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Your Status</CardTitle>
          </CardHeader>
          <CardContent>
            <StatusSelector memberId={member.id} current={member.status} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tasks Summary</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-6">
            <SummaryItem label="Total" value={counts.total} />
            <SummaryItem label="Active" value={counts.active} />
            <SummaryItem label="Done" value={counts.done} />
          </CardContent>
        </Card>
      </div>
      <TaskList member={member} />
    </div>
  )
}

function SummaryItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-2xl font-semibold">{value}</span>
    </div>
  )
}
