"use client"
import Image from "next/image"
import Link from "next/link"
import { TeamManagementPanel } from "@/components/team-management-panel"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
import { Button } from "@/components/ui/button"
import { Providers } from "@/components/providers"

export default function LeadManagePage() {
  // Seed a minimal store for this standalone page so it's usable outside the home page.
  const preloadedState = {
    role: {
      currentRole: "lead" as const,
      currentUserId: "",
      theme: "light" as const,
      currentView: "manage-team" as const,
    },
    // optional: keep members empty; team-management slice has its own initial state
    members: { members: [] },
  }

  function Content() {
    // read the correct property: role.currentRole
    const role = useSelector((s: RootState) => s.role.currentRole)

    return (
      <main className="min-h-dvh bg-background">
        <header className="border-b bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <Image src="/images/logo.png" alt="Team Pulse Logo" width={28} height={28} className="rounded" />
              <h1 className="text-lg font-semibold text-pretty">Team Management</h1>
            </div>
            <nav className="flex items-center gap-2">
              <Link href="/">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
            </nav>
          </div>
        </header>

        <section className="mx-auto max-w-6xl px-4 py-6">
          {role !== "lead" ? (
            <div className="rounded-md border bg-white p-6">
              <p className="text-sm text-slate-600">
                You do not have permission to access this page. Please contact your team lead.
              </p>
            </div>
          ) : (
            <TeamManagementPanel />
          )}
        </section>
      </main>
    )
  }

  return (
    <Providers preloadedState={preloadedState}>
      <Content />
    </Providers>
  )
}
