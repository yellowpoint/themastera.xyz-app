import type { ReactNode } from "react"

export default function CreatorLayout({ children }: { children: ReactNode }) {
  return (
    <div className="">
      {children}
    </div>
  )
}
