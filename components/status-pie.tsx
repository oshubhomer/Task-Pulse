"use client"

import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from "recharts"
import type { Member } from "@/redux/slices/members-slice"

// ✅ define your fixed colors here (top of file)
const STATUS_COLORS: Record<string, string> = {
  Working: "#10B981", // emerald/green
  Meeting: "#3B82F6", // blue
  Break: "#F59E0B", // orange (brand)
  Offline: "#9CA3AF", // gray
}

export default function StatusPie({ members }: { members: Member[] }) {
  const counts = { Working: 0, Meeting: 0, Break: 0, Offline: 0 }

  members.forEach((m) => (counts[m.status as keyof typeof counts] += 1))

  const data = [
    { name: "Working", value: counts.Working },
    { name: "Meeting", value: counts.Meeting },
    { name: "Break", value: counts.Break },
    { name: "Offline", value: counts.Offline },
  ].filter((d) => d.value > 0)

  const total = data.reduce((acc, d) => acc + d.value, 0)

  const label = (props: any) => {
    const { name, value, percent } = props
    const pct = Math.round(percent * 100)
    return `${name}: ${value} (${pct}%)`
  }

  if (data.length === 0) return <div className="text-sm text-muted-foreground">No data</div>

  return (
    <div className="space-y-3">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie dataKey="value" data={data} outerRadius={90} label={label}>
              {data.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={STATUS_COLORS[entry.name] ?? "#000"} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => {
                const pct = total ? Math.round((value / total) * 100) : 0
                return [`${value} (${pct}%)`, name]
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* custom legend with figures */}
      <div className="grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
        {data.map((d) => {
          const pct = total ? Math.round((d.value / total) * 100) : 0
          return (
            <div key={d.name} className="flex items-center gap-2">
              <span
                className="inline-block h-3 w-3 rounded-sm"
                style={{ backgroundColor: STATUS_COLORS[d.name] }}
                aria-hidden="true"
              />
              <span className="text-muted-foreground">{d.name}</span>
              <span className="ml-auto font-medium">{d.value}</span>
              <span className="text-muted-foreground">({pct}%)</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
