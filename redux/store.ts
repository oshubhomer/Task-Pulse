import { configureStore, type PreloadedState } from "@reduxjs/toolkit"
import membersReducer from "./slices/members-slice"
import roleReducer from "./slices/role-slice"
import teamManagementReducer from "./slices/team-management-slice"
import communityReducer from "./slices/community-slice"

export const makeStore = (preloadedState?: PreloadedState<RootState>) =>
  configureStore({
    reducer: {
      members: membersReducer,
      role: roleReducer,
      teamManagement: teamManagementReducer,
      community: communityReducer,
    },
    preloadedState,
    devTools: true,
  })

export type AppStore = ReturnType<typeof makeStore>
export type AppDispatch = ReturnType<AppStore["dispatch"]>
export type RootState = {
  members: ReturnType<typeof membersReducer>
  role: ReturnType<typeof roleReducer>
  teamManagement: ReturnType<typeof teamManagementReducer>
  community: ReturnType<typeof communityReducer>
}

// Typed hooks (inline to avoid separate file)
import { type TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
export const useAppDispatch: () => AppDispatch = useDispatch as any
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
