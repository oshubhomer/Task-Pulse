import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

type Theme = "light" | "dark"
type RoleState = {
  currentRole: "member" | "lead"
  currentUserId: string
  theme: Theme
  currentView: "overview" | "my-tasks" | "team" | "manage-team" | "community"
}

const initialState: RoleState = {
  currentRole: "member",
  currentUserId: "",
  theme: "light",
  currentView: "overview",
}

const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    switchRole: (state, action: PayloadAction<"member" | "lead">) => {
      state.currentRole = action.payload
      if (action.payload === "member" && (state.currentView === "team" || state.currentView === "manage-team")) {
        state.currentView = "my-tasks"
      }
    },
    setUser: (state, action: PayloadAction<string>) => {
      state.currentUserId = action.payload
    },
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light"
    },
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload
    },
    setView: (state, action: PayloadAction<RoleState["currentView"]>) => {
      state.currentView = action.payload
    },
  },
})

export const { switchRole, setUser, toggleTheme, setTheme, setView } = roleSlice.actions
export default roleSlice.reducer
