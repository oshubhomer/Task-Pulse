"use client"

import { useEffect, useMemo } from "react"
import { useAppDispatch, useAppSelector } from "@/redux/store"
import { autoOfflineIfInactive } from "@/redux/slices/members-slice"
import { setView } from "@/redux/slices/role-slice"
import HeaderBar from "./header"
import LeadPanel from "./lead-panel"
import MemberPanel from "./member-panel"
import { TeamManagementPanel } from "./team-management-panel"
import CommunityPanel from "./community-panel"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarSeparator,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Users, Home, ListChecks, UserCog, MessageCircle } from "lucide-react"

export default function Dashboard() {
  const dispatch = useAppDispatch()
  const { currentUserId, currentRole, currentView } = useAppSelector((s) => s.role)
  const membersState = useAppSelector((s) => s.members.members)
  const tmMembers = useAppSelector((s) => s.teamManagement.members)
  const threadCount = useAppSelector((s) => s.community.threads.length)

  // Optional: auto set Offline after 10 minutes of inactivity for current user
  useEffect(() => {
    const interval = setInterval(() => {
      if (!currentUserId) return
      dispatch(
        autoOfflineIfInactive({
          memberId: currentUserId,
          thresholdMs: 10 * 60 * 1000,
        }),
      )
    }, 60 * 1000)
    return () => clearInterval(interval)
  }, [dispatch, currentUserId])

  // Compute counts for sidebar badges
  const counts = useMemo(() => {
    const me = membersState.find((m) => m.id === currentUserId)
    const myActive = me ? me.tasks.filter((t) => !t.completed).length : 0
    const working = membersState.filter((m) => m.status === "Working").length
    return { myActive, working, teamSize: membersState.length, tmSize: tmMembers.length, threadCount }
  }, [membersState, currentUserId, tmMembers.length, threadCount])

  const content = useMemo(() => {
    // Route-like switching for dashboards
    if (currentView === "my-tasks") return <MemberPanel />
    if (currentView === "team") return <LeadPanel />
    if (currentView === "manage-team") return <TeamManagementPanel />
    if (currentView === "community") return <CommunityPanel />
    return currentRole === "lead" ? <LeadPanel /> : <MemberPanel />
  }, [currentView, currentRole])

  return (
    <div className="min-h-screen">
      <SidebarProvider>
        <Sidebar collapsible="offcanvas" className="border-r">
          <SidebarHeader>
            <div className="flex items-center gap-2 px-2 py-1">
              <img src="/images/logo.png" alt="Team Pulse Logo" className="h-6 w-6 rounded-sm" />
              <span className="text-sm font-semibold">Team Pulse</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Dashboards</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => dispatch(setView("overview"))}
                      isActive={currentView === "overview"}
                    >
                      <Home className="shrink-0" />
                      <span>Overview</span>
                      {currentRole === "lead" ? (
                        <Badge className="ml-auto" variant="secondary">
                          {counts.working} Working
                        </Badge>
                      ) : null}
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => dispatch(setView("my-tasks"))}
                      isActive={currentView === "my-tasks"}
                    >
                      <ListChecks className="shrink-0" />
                      <span>My Tasks</span>
                      <Badge className="ml-auto" variant="secondary">
                        {counts.myActive}
                      </Badge>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => dispatch(setView("team"))}
                      isActive={currentView === "team"}
                      aria-disabled={currentRole !== "lead"}
                      disabled={currentRole !== "lead"}
                      className={currentRole !== "lead" ? "opacity-60" : ""}
                    >
                      <Users className="shrink-0" />
                      <span>Team</span>
                      <Badge className="ml-auto" variant="secondary">
                        {counts.teamSize}
                      </Badge>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => dispatch(setView("manage-team"))}
                      isActive={currentView === "manage-team"}
                      aria-disabled={currentRole !== "lead"}
                      disabled={currentRole !== "lead"}
                      className={currentRole !== "lead" ? "opacity-60" : ""}
                    >
                      <UserCog className="shrink-0" />
                      <span>Manage Team</span>
                      <Badge className="ml-auto" variant="secondary">
                        {counts.tmSize}
                      </Badge>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => dispatch(setView("community"))}
                      isActive={currentView === "community"}
                    >
                      <MessageCircle className="shrink-0" />
                      <span>Community</span>
                      <Badge className="ml-auto" variant="secondary">
                        {counts.threadCount}
                      </Badge>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarSeparator />
          </SidebarContent>
          <SidebarFooter>
            <div className="text-xs text-muted-foreground px-2">v1.0</div>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
        <SidebarInset>
          <HeaderBar />
          <main className="mx-auto max-w-6xl p-4 md:p-6">{content}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
