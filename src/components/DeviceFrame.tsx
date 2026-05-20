import type { ReactNode } from 'react'

type Props = { children: ReactNode }

export function DeviceFrame({ children }: Props) {
  return (
    <div
      className="relative overflow-hidden rounded-[12px] bg-panel-red"
      style={{ width: 480, height: 800 }}
    >
      {children}
    </div>
  )
}
