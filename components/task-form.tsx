"use client"

import type React from "react"

import { useState } from "react"
import { useAppDispatch, useAppSelector } from "@/redux/store"
import { addTask } from "@/redux/slices/members-slice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function TaskForm() {
  const dispatch = useAppDispatch()
  const members = useAppSelector((s) => s.members.members)

  const [memberId, setMemberId] = useState<string>(members[0]?.id ?? "")
  const [title, setTitle] = useState("")
  const [due, setDue] = useState("")

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!memberId || !title || !due) return
    const iso = new Date(due + "T00:00:00Z").toISOString()
    dispatch(addTask({ memberId, title, dueDate: iso }))
    setTitle("")
    setDue("")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assign Task</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-3">
          <div className="grid gap-2">
            <Label>Member</Label>
            <Select value={memberId} onValueChange={setMemberId}>
              <SelectTrigger>
                <SelectValue placeholder="Select member" />
              </SelectTrigger>
              <SelectContent>
                {members.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Task Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Prepare sprint report" />
          </div>
          <div className="grid gap-2">
            <Label>Due Date</Label>
            <Input type="date" value={due} onChange={(e) => setDue(e.target.value)} />
          </div>
          <div className="md:col-span-3">
            <Button type="submit" className="w-full md:w-auto">
              Assign
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
