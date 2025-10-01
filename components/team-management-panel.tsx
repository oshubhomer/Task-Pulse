"use client"

import { useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
import {
  addMember,
  removeMember,
  sendMessage,
  updateMemberStatus,
  type TeamMember,
} from "@/redux/slices/team-management-slice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

const COLORS: Record<NonNullable<TeamMember["status"]>, string> = {
  working: "#22c55e", // green-500
  meeting: "#3b82f6", // blue-500
  break: "#f97316", // orange-500 (brand)
  offline: "#64748b", // slate-500
}

function StatusBadge({ status }: { status: TeamMember["status"] }) {
  if (!status) return null
  const map: Record<NonNullable<TeamMember["status"]>, string> = {
    working: "bg-emerald-100 text-emerald-700",
    meeting: "bg-blue-100 text-blue-700",
    break: "bg-orange-100 text-orange-700",
    offline: "bg-slate-100 text-slate-700",
  }
  return <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs ${map[status]}`}>{status}</span>
}

export function TeamManagementPanel() {
  const dispatch = useDispatch()
  const members = useSelector((s: RootState) => (s as any)?.teamManagement?.members ?? [])
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [targetId, setTargetId] = useState<string | "all">("all")
  const [text, setText] = useState("")

  const distribution = useMemo(() => {
    const counts = { working: 0, meeting: 0, break: 0, offline: 0 } as Record<NonNullable<TeamMember["status"]>, number>
    for (const m of members as TeamMember[]) {
      const s = (m.status ?? "offline") as NonNullable<TeamMember["status"]>
      counts[s]++
    }
    const total = Math.max(1, (members as TeamMember[]).length)
    return {
      total,
      data: (Object.keys(counts) as Array<keyof typeof counts>).map((k) => ({
        name: k,
        value: counts[k],
        pct: Math.round((counts[k] / total) * 100),
        color: COLORS[k],
      })),
    }
  }, [members])

  const canAdd = name.trim() && email.trim()

  function handleAdd() {
    if (!canAdd) return
    dispatch(addMember({ name: name.trim(), email: email.trim(), status: "offline" }))
    setName("")
    setEmail("")
  }

  function handleSend() {
    if (!text.trim()) return
    dispatch(sendMessage({ to: targetId, text: text.trim() }))
    setText("")
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {/* Add Member */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-balance">Add a Team Member</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm text-slate-600">Full name</label>
            <Input placeholder="e.g. Jane Doe" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-600">Email</label>
            <Input
              placeholder="name@company.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <Button onClick={handleAdd} disabled={!canAdd} className="bg-orange-500 hover:bg-orange-600">
              Add Member
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Status Distribution with figures */}
      <Card>
        <CardHeader>
          <CardTitle className="text-balance">Status Distribution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distribution.data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                >
                  {distribution.data.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any, _name: any, p: any) => [`${value} (${p.payload.pct}%)`, p.payload.name]}
                />
                <Legend
                  verticalAlign="bottom"
                  align="center"
                  formatter={(value: string, entry: any) => {
                    const item = distribution.data.find((d) => d.name === value)
                    return `${value} — ${item?.value ?? 0} (${item?.pct ?? 0}%)`
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {distribution.data.map((d) => (
              <div key={d.name} className="flex items-center justify-between rounded border p-2">
                <div className="flex items-center gap-2">
                  <span className="inline-block size-2 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="capitalize">{d.name}</span>
                </div>
                <span className="tabular-nums text-slate-700">
                  {d.value} ({d.pct}%)
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Member List */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-balance">Team Members</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(members as TeamMember[]).length === 0 ? (
            <p className="text-sm text-slate-600">No members yet. Add your first teammate above.</p>
          ) : (
            (members as TeamMember[]).map((m) => (
              <div key={m.id} className="flex items-center justify-between rounded-md border bg-white p-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="grid size-8 place-items-center rounded-full bg-orange-100 text-orange-700">
                    {m.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{m.name}</div>
                    <div className="truncate text-xs text-slate-600">{m.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={m.status ?? "offline"} />
                  <Select
                    value={m.status ?? "offline"}
                    onValueChange={(v) => (dispatch as any)(updateMemberStatus({ id: m.id, status: v as any }))}
                  >
                    <SelectTrigger className="w-28">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="working">Working</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="break">Break</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="destructive" onClick={() => (dispatch as any)(removeMember(m.id))}>
                    Remove
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Send Reminder / Message */}
      <Card>
        <CardHeader>
          <CardTitle className="text-balance">Send Reminder / Message</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <label className="text-sm text-slate-600">Recipient</label>
            <Select value={targetId} onValueChange={(v) => setTargetId(v as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Choose recipient" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Members</SelectItem>
                {(members as TeamMember[]).map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name} ({m.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-600">Message</label>
            <Textarea
              placeholder="Write your reminder or message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={5}
            />
          </div>
          <Button onClick={handleSend} disabled={!text.trim()} className="bg-orange-500 hover:bg-orange-600">
            Send
          </Button>
          <p className="text-xs text-slate-500">Messages are stored locally in app state for this demo.</p>
        </CardContent>
      </Card>
    </div>
  )
}
