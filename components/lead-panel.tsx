"use client"

import { useMemo, useState } from "react"
import { useAppSelector } from "@/redux/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import TaskForm from "./task-form"
import MemberRow from "./member-row"
import StatusPie from "./status-pie"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Status = "Working" | "Break" | "Meeting" | "Offline"

export default function LeadPanel() {
  const members = useAppSelector((s) => s.members.members)
  const [filter, setFilter] = useState<Status | "All">("All")
  const [sortByActive, setSortByActive] = useState<"none" | "activeTasksDesc">("activeTasksDesc")

  const summary = useMemo(() => {
    const counts = { Working: 0, Break: 0, Meeting: 0, Offline: 0 }
    for (const m of members) counts[m.status as keyof typeof counts]++
    return counts
  }, [members])

  const filtered = useMemo(() => {
    let list = [...members]
    if (filter !== "All") {
      list = list.filter((m) => m.status === filter)
    }
    if (sortByActive === "activeTasksDesc") {
      list.sort((a, b) => {
        const actA = a.tasks.filter((t) => !t.completed).length
        const actB = b.tasks.filter((t) => !t.completed).length
        return actB - actA
      })
    }
    return list
  }, [members, filter, sortByActive])

  return (
    <div className="grid gap-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <SummaryCard label="Working" value={summary.Working} />
        <SummaryCard label="Meeting" value={summary.Meeting} />
        <SummaryCard label="Break" value={summary.Break} />
        <SummaryCard label="Offline" value={summary.Offline} />
      </div>

      {/* Controls + Chart */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Team Members</CardTitle>
            <div className="flex items-center gap-2">
              <Select value={filter} onValueChange={(v) => setFilter(v as any)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Working">Working</SelectItem>
                  <SelectItem value="Meeting">Meeting</SelectItem>
                  <SelectItem value="Break">Break</SelectItem>
                  <SelectItem value="Offline">Offline</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortByActive} onValueChange={(v) => setSortByActive(v as any)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activeTasksDesc">Active tasks desc</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col divide-y">
              {filtered.map((m) => (
                <MemberRow key={m.id} member={m} />
              ))}
              {filtered.length === 0 && <div className="py-8 text-center text-muted-foreground">No members</div>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <StatusPie members={members} />
          </CardContent>
        </Card>
      </div>

      {/* Task Form */}
      <TaskForm />
    </div>
  )
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4 md:p-6">
        <span className="text-sm text-muted-foreground">{label}</span>
        <Badge variant="secondary" className="text-base">
          {value}
        </Badge>
      </CardContent>
    </Card>
  )
}
