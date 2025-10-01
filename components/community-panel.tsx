"use client"

import { useMemo, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/redux/store"
import { addThread, addReply } from "@/redux/slices/community-slice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export default function CommunityPanel() {
  const dispatch = useAppDispatch()
  const currentUserId = useAppSelector((s) => s.role.currentUserId)
  const members = useAppSelector((s) => s.members.members)
  const threads = useAppSelector((s) => s.community.threads)
  const replies = useAppSelector((s) => s.community.replies)

  const [newContent, setNewContent] = useState("")
  const [filter, setFilter] = useState<string>("")

  const filteredThreads = useMemo(() => {
    if (!filter.trim()) return threads
    return threads.filter((t) => t.content.toLowerCase().includes(filter.toLowerCase()))
  }, [threads, filter])

  function nameFor(userId: string) {
    return members.find((m) => m.id === userId)?.name || (userId === currentUserId ? "You" : "Member")
  }

  function handlePost() {
    if (!newContent.trim() || !currentUserId) return
    dispatch(addThread({ authorId: currentUserId, content: newContent.trim() }))
    setNewContent("")
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-balance">Start a new query</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <Textarea
            placeholder="Ask a question or share an update..."
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            rows={4}
          />
          <div className="flex items-center gap-3">
            <Input
              placeholder="Filter queries..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="max-w-xs"
            />
            <Button
              onClick={handlePost}
              disabled={!newContent.trim() || !currentUserId}
              className="bg-orange-500 hover:bg-orange-600"
            >
              Post
            </Button>
          </div>
          <p className="text-xs text-slate-500">Everyone can post and reply. Keep it helpful and respectful.</p>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredThreads.length === 0 && (
          <div className="text-center text-sm text-muted-foreground">No queries yet. Be the first to post.</div>
        )}
        {filteredThreads.map((t) => (
          <ThreadItem
            key={t.id}
            id={t.id}
            author={nameFor(t.authorId)}
            content={t.content}
            createdAt={t.createdAt}
            replies={replies.filter((r) => r.threadId === t.id)}
            onReply={(text) =>
              currentUserId ? dispatch(addReply({ threadId: t.id, authorId: currentUserId, content: text })) : null
            }
            nameFor={nameFor}
          />
        ))}
      </div>
    </div>
  )
}

function ThreadItem({
  id,
  author,
  content,
  createdAt,
  replies,
  onReply,
  nameFor,
}: {
  id: string
  author: string
  content: string
  createdAt: string
  replies: { id: string; authorId: string; content: string; createdAt: string }[]
  onReply: (text: string) => void
  nameFor: (userId: string) => string
}) {
  const [text, setText] = useState("")
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-pretty text-base">
          <span className="font-semibold">{author}</span> <span className="text-muted-foreground">posted</span>
        </CardTitle>
        <Badge variant="secondary" className="text-xs">
          {new Date(createdAt).toLocaleString()}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-relaxed">{content}</p>

        <div className="space-y-2">
          {replies.length > 0 && (
            <div className="space-y-2">
              {replies.map((r) => (
                <div key={r.id} className="rounded-md border bg-white p-3">
                  <div className="mb-1 text-xs text-slate-500">
                    <span className="font-medium">{nameFor(r.authorId)}</span> replied ·{" "}
                    {new Date(r.createdAt).toLocaleString()}
                  </div>
                  <div className="text-sm">{r.content}</div>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center gap-2">
            <Input
              placeholder="Write a reply..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && text.trim()) {
                  onReply(text.trim())
                  setText("")
                }
              }}
            />
            <Button
              onClick={() => {
                if (!text.trim()) return
                onReply(text.trim())
                setText("")
              }}
              className="bg-orange-500 hover:bg-orange-600"
            >
              Reply
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
