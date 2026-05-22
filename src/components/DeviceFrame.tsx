import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  theme?: 'red' | 'bypass' | 'positive'
}

const BG: Record<NonNullable<Props['theme']>, string> = {
  red: 'bg-panel-red',
  bypass: 'bg-panel-bypass',
  positive: 'bg-panel-positive',
}

export function DeviceFrame({ children, theme = 'red' }: Props) {
  return (
    <div
      className={`relative overflow-hidden rounded-[12px] ${BG[theme]}`}
      style={{ width: 480, height: 800 }}
    >
      {children}
    </div>
  )
}
