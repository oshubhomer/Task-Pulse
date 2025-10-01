"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/redux/store"
import { setTheme, switchRole, setUser, toggleTheme } from "@/redux/slices/role-slice"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarTrigger } from "@/components/ui/sidebar"

export default function HeaderBar() {
  const dispatch = useAppDispatch()
  const { currentRole, currentUserId, theme } = useAppSelector((s) => s.role)
  const members = useAppSelector((s) => s.members.members)

  // Persist and apply theme
  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("theme") : null
    if (saved === "light" || saved === "dark") {
      dispatch(setTheme(saved))
    }
  }, [dispatch])

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", theme === "dark")
      localStorage.setItem("theme", theme)
    }
  }, [theme])

  // Ensure currentUserId set
  useEffect(() => {
    if (!currentUserId && members[0]) {
      dispatch(setUser(members[0].id))
    }
  }, [currentUserId, members, dispatch])

  return (
    <div className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between p-4 md:p-6">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="md:hidden" />
          <img src="/images/logo.png" alt="Team Pulse Logo" className="h-6 w-6 rounded-sm" />
          <span className="text-lg font-semibold text-pretty">Team Pulse Dashboard</span>
          <span className="text-xs text-muted-foreground hidden md:inline">Monitor productivity and tasks</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Role Switch */}
          <Select value={currentRole} onValueChange={(v: "member" | "lead") => dispatch(switchRole(v))}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="member">Member</SelectItem>
              <SelectItem value="lead">Team Lead</SelectItem>
            </SelectContent>
          </Select>

          {/* Current User selector */}
          <Select value={currentUserId || undefined} onValueChange={(v) => dispatch(setUser(v))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select user" />
            </SelectTrigger>
            <SelectContent>
              {members.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Dark mode */}
          <Button variant="outline" onClick={() => dispatch(toggleTheme())} aria-label="Toggle theme">
            {theme === "dark" ? "Light" : "Dark"}
          </Button>
        </div>
      </div>
    </div>
  )
}
