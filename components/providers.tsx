"use client"

import type React from "react"

import { Provider } from "react-redux"
import { makeStore, type AppStore } from "@/redux/store"
import { useRef } from "react"

export function Providers({
  children,
  preloadedState,
}: {
  children: React.ReactNode
  preloadedState?: Parameters<typeof makeStore>[0]
}) {
  const storeRef = useRef<AppStore>()
  if (!storeRef.current) {
    storeRef.current = makeStore(preloadedState)
  }
  return <Provider store={storeRef.current}>{children}</Provider>
}
