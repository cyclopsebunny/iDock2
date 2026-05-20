import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  padding?: 8 | 12
  gap?: 8 | 12 | 16
}

export function Panel({ children, padding = 12, gap = 12 }: Props) {
  return (
    <div
      className="absolute flex flex-col bg-white rounded-[12px] shadow-panel"
      style={{
        left: 16,
        top: 270,
        width: 448,
        height: 514,
        padding,
        gap,
      }}
    >
      {children}
    </div>
  )
}
