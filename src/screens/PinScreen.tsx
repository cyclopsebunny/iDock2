import { useState } from 'react'
import { Panel } from '../components/Panel'
import { TopGraphic } from '../components/TopGraphic'
import { BackspaceIcon, CloseIcon } from '../icons/Icons'

type Props = {
  onCancel: () => void
  onSubmit: (pin: string) => void
}

const ROWS: (string | 'back' | '0' | 'go')[][] = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['back', '0', 'go'],
]

export function PinScreen({ onCancel, onSubmit }: Props) {
  const [pin, setPin] = useState('')

  const append = (d: string) =>
    setPin((p) => (p.length >= 8 ? p : p + d))
  const backspace = () => setPin((p) => p.slice(0, -1))
  const submit = () => onSubmit(pin)

  return (
    <>
      <TopGraphic />
      <Panel padding={8} gap={8}>
        <div className="flex h-[66px] items-center gap-[12px] pl-[57px] pr-[16px]">
          <div className="flex-1 text-center font-inter font-semibold text-primary-text text-[36px] leading-none tracking-[2px] truncate">
            {pin.length === 0 ? (
              <span className="opacity-70 caret-blink">|</span>
            ) : (
              <span>{'•'.repeat(pin.length)}</span>
            )}
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Cancel"
            className="shrink-0 text-btn-secondary-label"
            style={{ width: 36, height: 36 }}
          >
            <CloseIcon className="h-full w-full" />
          </button>
        </div>
        <div className="flex flex-1 flex-col gap-[10px] px-[30px] pt-[15px] pb-[30px]">
          {ROWS.map((row, ri) => (
            <div key={ri} className="flex flex-1 gap-[10px]">
              {row.map((cell) => {
                if (cell === 'back') {
                  return (
                    <KeyButton key="back" variant="secondary" onClick={backspace} ariaLabel="Backspace">
                      <BackspaceIcon className="h-[57px] w-[57px] text-btn-secondary-label" />
                    </KeyButton>
                  )
                }
                if (cell === 'go') {
                  return (
                    <KeyButton key="go" variant="accent" onClick={submit}>
                      <span className="font-sfpro font-bold text-white text-[32px] leading-none tracking-[-0.02em]">
                        Go
                      </span>
                    </KeyButton>
                  )
                }
                return (
                  <KeyButton key={cell} variant="secondary" onClick={() => append(cell)}>
                    <span className="font-sfpro text-btn-secondary-label text-[31.481px] leading-none tracking-[-0.6296px]">
                      {cell}
                    </span>
                  </KeyButton>
                )
              })}
            </div>
          ))}
        </div>
      </Panel>
    </>
  )
}

type KeyButtonProps = {
  children: React.ReactNode
  onClick: () => void
  variant: 'secondary' | 'accent'
  ariaLabel?: string
}

function KeyButton({ children, onClick, variant, ariaLabel }: KeyButtonProps) {
  const styles =
    variant === 'accent'
      ? 'bg-accent-blue border border-accent-blue rounded-[4px]'
      : 'bg-btn-secondary-bg border border-btn-secondary-stroke rounded-[8px]'
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`relative flex flex-1 items-center justify-center transition-transform active:scale-[0.97] ${styles}`}
    >
      {children}
    </button>
  )
}
