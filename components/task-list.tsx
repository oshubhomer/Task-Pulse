"use client"

import type { Member } from "@/redux/slices/members-slice"
import { useAppDispatch } from "@/redux/store"
import { updateTaskProgress, markTaskComplete } from "@/redux/slices/members-slice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export default function TaskList({ member }: { member: Member }) {
  const dispatch = useAppDispatch()
  const onDelta = (taskId: string, delta: number) =>
    dispatch(updateTaskProgress({ memberId: member.id, taskId, delta }))
  const onComplete = (taskId: string) => dispatch(markTaskComplete({ memberId: member.id, taskId }))

  const getTaskVisual = (t: Member["tasks"][number]) => {
    const overdue = !t.completed && new Date(t.dueDate).getTime() < Date.now()
    if (overdue)
      return {
        label: "Overdue",
        border: "border-red-500",
        badge: "bg-red-100 text-red-800 dark:bg-red-700/30 dark:text-red-100",
      }
    if (t.completed)
      return {
        label: "Completed",
        border: "border-emerald-500",
        badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-700/30 dark:text-emerald-100",
      }
    if (t.progress > 0)
      return {
        label: "In Progress",
        border: "border-blue-500",
        badge: "bg-blue-100 text-blue-800 dark:bg-blue-700/30 dark:text-blue-100",
      }
    return {
      label: "Not Started",
      border: "border-gray-400",
      badge: "bg-gray-200 text-gray-800 dark:bg-gray-700/30 dark:text-gray-200",
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Tasks</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {member.tasks.length === 0 && <div className="text-sm text-muted-foreground">No tasks assigned.</div>}
        {member.tasks.map((t) => {
          const vis = getTaskVisual(t)
          return (
            <div
              key={t.id}
              className={`grid gap-2 rounded-md border p-3 md:grid-cols-[1fr_auto] md:items-center border-l-4 ${vis.border}`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{t.title}</span>
                  <div className="flex items-center gap-2">
                    <Badge className={vis.badge}>{vis.label}</Badge>
                    <span className="text-xs text-muted-foreground">
                      Due: {new Date(t.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <Progress value={t.progress} />
                <div className="text-xs text-muted-foreground">{t.progress}%</div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => onDelta(t.id, -10)}>
                  -10%
                </Button>
                <Button variant="outline" onClick={() => onDelta(t.id, 10)}>
                  +10%
                </Button>
                <Button onClick={() => onComplete(t.id)} disabled={t.completed}>
                  {t.completed ? "Completed" : "Mark Done"}
                </Button>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
