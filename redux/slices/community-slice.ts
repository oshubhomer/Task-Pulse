import { createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit"

export type Thread = {
  id: string
  authorId: string
  content: string
  createdAt: string
}
export type Reply = {
  id: string
  threadId: string
  authorId: string
  content: string
  createdAt: string
}

type CommunityState = {
  threads: Thread[]
  replies: Reply[]
}

const initialState: CommunityState = {
  threads: [],
  replies: [],
}

const communitySlice = createSlice({
  name: "community",
  initialState,
  reducers: {
    addThread: {
      reducer(state, action: PayloadAction<Thread>) {
        state.threads.unshift(action.payload)
      },
      prepare({ authorId, content }: { authorId: string; content: string }) {
        return {
          payload: {
            id: nanoid(),
            authorId,
            content,
            createdAt: new Date().toISOString(),
          },
        }
      },
    },
    addReply: {
      reducer(state, action: PayloadAction<Reply>) {
        state.replies.push(action.payload)
      },
      prepare({ threadId, authorId, content }: { threadId: string; authorId: string; content: string }) {
        return {
          payload: {
            id: nanoid(),
            threadId,
            authorId,
            content,
            createdAt: new Date().toISOString(),
          },
        }
      },
    },
  },
})

export const { addThread, addReply } = communitySlice.actions
export default communitySlice.reducer
