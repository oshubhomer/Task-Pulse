import { createSlice, type PayloadAction, nanoid } from "@reduxjs/toolkit"

export type Status = "Working" | "Break" | "Meeting" | "Offline"
export type Task = {
  id: string
  title: string
  dueDate: string
  progress: number
  completed: boolean
}
export type Member = {
  id: string
  name: string
  avatar: string
  status: Status
  tasks: Task[]
  lastActivity: number
}

type MembersState = {
  members: Member[]
}

const initialState: MembersState = {
  members: [],
}

const findMemberIndex = (state: MembersState, memberId: string) => state.members.findIndex((m) => m.id === memberId)

const findTaskIndex = (member: Member, taskId: string) => member.tasks.findIndex((t) => t.id === taskId)

const membersSlice = createSlice({
  name: "members",
  initialState,
  reducers: {
    setInitialMembers: (state, action: PayloadAction<Member[]>) => {
      state.members = action.payload
    },
    updateStatus: (state, action: PayloadAction<{ memberId: string; status: Status; at?: number }>) => {
      const i = findMemberIndex(state, action.payload.memberId)
      if (i >= 0) {
        state.members[i].status = action.payload.status
        state.members[i].lastActivity = action.payload.at ?? Date.now()
      }
    },
    addTask: (state, action: PayloadAction<{ memberId: string; title: string; dueDate: string }>) => {
      const i = findMemberIndex(state, action.payload.memberId)
      if (i >= 0) {
        state.members[i].tasks.unshift({
          id: nanoid(),
          title: action.payload.title,
          dueDate: action.payload.dueDate,
          progress: 0,
          completed: false,
        })
        state.members[i].lastActivity = Date.now()
      }
    },
    updateTaskProgress: (state, action: PayloadAction<{ memberId: string; taskId: string; delta: number }>) => {
      const i = findMemberIndex(state, action.payload.memberId)
      if (i >= 0) {
        const tIdx = findTaskIndex(state.members[i], action.payload.taskId)
        if (tIdx >= 0) {
          const t = state.members[i].tasks[tIdx]
          const next = Math.max(0, Math.min(100, t.progress + action.payload.delta))
          t.progress = next
          t.completed = next >= 100
          state.members[i].lastActivity = Date.now()
        }
      }
    },
    markTaskComplete: (state, action: PayloadAction<{ memberId: string; taskId: string }>) => {
      const i = findMemberIndex(state, action.payload.memberId)
      if (i >= 0) {
        const tIdx = findTaskIndex(state.members[i], action.payload.taskId)
        if (tIdx >= 0) {
          const t = state.members[i].tasks[tIdx]
          t.progress = 100
          t.completed = true
          state.members[i].lastActivity = Date.now()
        }
      }
    },
    autoOfflineIfInactive: (state, action: PayloadAction<{ memberId: string; thresholdMs: number; now?: number }>) => {
      const i = findMemberIndex(state, action.payload.memberId)
      if (i >= 0) {
        const now = action.payload.now ?? Date.now()
        const m = state.members[i]
        if (now - m.lastActivity >= action.payload.thresholdMs && m.status !== "Offline") {
          m.status = "Offline"
        }
      }
    },
  },
})

export const { setInitialMembers, updateStatus, addTask, updateTaskProgress, markTaskComplete, autoOfflineIfInactive } =
  membersSlice.actions

export default membersSlice.reducer
