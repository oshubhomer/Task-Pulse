import { createSlice, type PayloadAction, nanoid } from "@reduxjs/toolkit"

export type TeamMember = {
  id: string
  name: string
  email: string
  status?: "working" | "meeting" | "break" | "offline"
}

export type Message = {
  id: string
  to: "all" | string // "all" or member id
  text: string
  createdAt: string
}

type State = {
  members: TeamMember[]
  messages: Message[]
}

const initialState: State = {
  members: [],
  messages: [],
}

const teamManagementSlice = createSlice({
  name: "teamManagement",
  initialState,
  reducers: {
    addMember: {
      reducer(state, action: PayloadAction<TeamMember>) {
        state.members.push(action.payload)
      },
      prepare(member: Omit<TeamMember, "id">) {
        return { payload: { ...member, id: nanoid() } }
      },
    },
    removeMember(state, action: PayloadAction<string>) {
      state.members = state.members.filter((m) => m.id !== action.payload)
    },
    updateMemberStatus(state, action: PayloadAction<{ id: string; status: TeamMember["status"] }>) {
      const m = state.members.find((x) => x.id === action.payload.id)
      if (m) m.status = action.payload.status
    },
    sendMessage: {
      reducer(state, action: PayloadAction<Message>) {
        state.messages.unshift(action.payload)
      },
      prepare(msg: Omit<Message, "id" | "createdAt">) {
        return {
          payload: {
            ...msg,
            id: nanoid(),
            createdAt: new Date().toISOString(),
          },
        }
      },
    },
  },
})

export const { addMember, removeMember, updateMemberStatus, sendMessage } = teamManagementSlice.actions

export default teamManagementSlice.reducer
