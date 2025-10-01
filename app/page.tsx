import { Suspense } from "react"
import { Providers } from "@/components/providers"
import Dashboard from "@/components/dashboard"

// Types mirrored from our lib/types
type Status = "Working" | "Break" | "Meeting" | "Offline"
type Task = {
  id: string
  title: string
  dueDate: string
  progress: number
  completed: boolean
}
type Member = {
  id: string
  name: string
  avatar: string
  status: Status
  tasks: Task[]
  lastActivity: number
}

async function fetchMembersSeed(): Promise<Member[]> {
  // Seed 6 members via randomuser.me
  const res = await fetch("https://randomuser.me/api/?results=6&nat=us,gb,ca,au", {
    // Prevent caching across refreshes so the UI stays dynamic while developing
    cache: "no-store",
  })
  const data = await res.json()
  const now = Date.now()
  const statuses: Status[] = ["Working", "Break", "Meeting", "Offline"]
  return (data.results as any[]).map((u, idx) => {
    const name = `${u.name.first} ${u.name.last}`
    const status = statuses[idx % statuses.length]
    const tasks: Task[] =
      idx % 2 === 0
        ? [
            {
              id: `${idx}-t1`,
              title: "Prepare report",
              dueDate: new Date(Date.now() + 3 * 86400000).toISOString(),
              progress: 20,
              completed: false,
            },
            {
              id: `${idx}-t2`,
              title: "Fix dashboard bug",
              dueDate: new Date(Date.now() + 5 * 86400000).toISOString(),
              progress: 0,
              completed: false,
            },
          ]
        : []
    return {
      id: u.login.uuid as string,
      name,
      avatar: u.picture?.thumbnail || "/member-avatar.jpg",
      status,
      tasks,
      lastActivity: now,
    }
  })
}

export default async function Page() {
  const members = await fetchMembersSeed()

  // Preloaded Redux state shape
  const preloadedState = {
    role: {
      currentRole: "member",
      currentUserId: members[0]?.id ?? "",
      theme: "light" as "light" | "dark",
      currentView: "overview" as "overview" | "my-tasks" | "team",
    },
    members: {
      members,
    },
  }

  return (
    <Suspense fallback={<div className="p-6">Loading Team Pulse...</div>}>
      <Providers preloadedState={preloadedState}>
        <Dashboard />
      </Providers>
    </Suspense>
  )
}
