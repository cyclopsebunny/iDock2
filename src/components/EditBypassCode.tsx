import { useState } from 'react'
import { useT } from '../i18n/LanguageContext'
import { BackspaceIcon } from '../icons/Icons'
import { MenuModal } from './MenuModal'

type Props = {
  /**
   * True when a PIN is already on file. Drives the two-phase flow:
   *   - `true`  → start in 'verify' phase (cream "Authorization Required"),
   *     then advance to 'new' phase (green "Authorization Granted").
   *   - `false` → skip the verify phase and start directly in 'new'.
   *
   * This is a UX prototype — verification accepts any non-empty input.
   */
  pinIsSet: boolean
  /**
   * Header title — defaults to "Edit Bypass Code". Pass a different value
   * (e.g. "Edit Access Code") when reusing this screen for another flow.
   */
  title?: string
  /** Banner subtitle shown in the verify phase. Defaults to "Enter the bypass code". */
  verifyBody?: string
  /** Banner subtitle shown in the new-PIN phase. Defaults to "Enter the NEW bypass code". */
  newBody?: string
  onBack: () => void
  onClose: () => void
  /**
   * Called with the new PIN when the user presses Go in the 'new' phase.
   * `null` means the user submitted with no digits → unset the PIN.
   */
  onSave: (newPin: string | null) => void
}

type Phase = 'verify' | 'new'

const ROWS: (string | 'back' | 'go')[][] = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['back', '0', 'go'],
]

/**
 * Edit Bypass Code (Figma 13941:50130 + 13941:50159) — reached from
 * BypassConfiguration's "Set Bypass PIN Code" row.
 *
 * Two-phase flow when a PIN is already set:
 *   1. 'verify' — cream "Authorization Required: Enter the bypass code"
 *      banner. Any non-empty entry advances. (Demo: not validated.)
 *   2. 'new' — green "Authorization Granted: Enter the NEW bypass code"
 *      banner. Go submits the new PIN. Empty Go = unset the PIN.
 *
 * If no PIN is set on entry, the verify phase is skipped.
 *
 * Layout (under MenuModal's 66px header + 10px gap):
 *   - Banner: grows to fill leftover space (`flex-1`).
 *   - Keypad section: fixed 514px tall — input row + 4×3 keypad grid.
 */
export function EditBypassCode({
  pinIsSet,
  title = 'Edit Bypass Code',
  verifyBody = 'Enter the bypass code',
  newBody = 'Enter the NEW bypass code',
  onBack,
  onClose,
  onSave,
}: Props) {
  const t = useT()
  const [phase, setPhase] = useState<Phase>(pinIsSet ? 'verify' : 'new')
  const [pin, setPin] = useState('')

  const append = (d: string) => setPin((p) => (p.length >= 8 ? p : p + d))
  const backspace = () => setPin((p) => p.slice(0, -1))
  const submit = () => {
    if (phase === 'verify') {
      // Demo: accept any non-empty entry as the "right" current PIN.
      // Pressing Go with no digits is a no-op so the user can't
      // accidentally skip the verify step entirely.
      if (pin.length === 0) return
      setPin('')
      setPhase('new')
      return
    }
    // phase === 'new' — empty Go means "unset the PIN".
    onSave(pin.length === 0 ? null : pin)
  }

  return (
    <MenuModal title={title} onBack={onBack} onClose={onClose}>
      {/* Banner — colors and copy switch between verify (cream) and new
          (green) phases. Grows to fill the space between header and the
          fixed-height keypad below. */}
      {phase === 'verify' ? (
        <Banner
          bg="#fff7e2"
          border="#ffed8f"
          color="#513500"
          title={t('Authorization Required:')}
          body={t(verifyBody)}
        />
      ) : (
        <Banner
          bg="#eafde3"
          border="#d4ebcc"
          color="#1d5807"
          title={t('Authorization Granted:')}
          body={t(newBody)}
        />
      )}

      {/* Keypad section — fixed 514px tall (per Figma). Holds the PIN
          display row and the 3×4 keypad grid. */}
      <div
        className="shrink-0 w-full flex flex-col items-center justify-end gap-[8px] p-[8px] rounded-[12px] bg-white"
        style={{ height: 514 }}
      >
        {/* PIN input display — blinking caret when empty, bullets per digit. */}
        <div className="h-[66px] w-full flex items-center justify-center px-[16px] shrink-0">
          <div className="text-center font-inter font-semibold text-primary-text text-[36px] leading-none">
            {pin.length === 0 ? (
              <span className="opacity-70 caret-blink">|</span>
            ) : (
              <span style={{ letterSpacing: '2px' }}>
                {'•'.repeat(pin.length)}
              </span>
            )}
          </div>
        </div>

        {/* 3×4 keypad — bottom-left backspace, bottom-right blue Go.
            Inner width matches Figma (372px) so each key is ~117×87. */}
        <div
          className="flex-1 flex flex-col gap-[10px] items-start pt-[15px] pb-[30px]"
          style={{ width: 372 }}
        >
          {ROWS.map((row, ri) => (
            <div key={ri} className="flex flex-1 gap-[10px] w-full">
              {row.map((cell) => {
                if (cell === 'back') {
                  return (
                    <KeyButton
                      key="back"
                      variant="secondary"
                      onClick={backspace}
                      ariaLabel="Backspace"
                    >
                      <BackspaceIcon className="h-[57px] w-[57px] text-btn-secondary-label" />
                    </KeyButton>
                  )
                }
                if (cell === 'go') {
                  return (
                    <KeyButton key="go" variant="accent" onClick={submit}>
                      <span className="font-sfpro font-bold text-white text-[32px] leading-none tracking-[-0.02em]">
                        {t('Go')}
                      </span>
                    </KeyButton>
                  )
                }
                return (
                  <KeyButton
                    key={cell}
                    variant="secondary"
                    onClick={() => append(cell)}
                  >
                    <span className="font-sfpro text-btn-secondary-label text-[31.481px] leading-none tracking-[-0.6296px]">
                      {cell}
                    </span>
                  </KeyButton>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </MenuModal>
  )
}

/**
 * Shared banner shell for the verify (cream) and new (green) phases.
 * Same dimensions and typography — only colors and copy differ.
 */
function Banner({
  bg,
  border,
  color,
  title,
  body,
}: {
  bg: string
  border: string
  color: string
  title: string
  body: string
}) {
  return (
    <div
      className="flex-1 self-center flex items-center justify-center rounded-[6px] border-2 px-[12px] py-[14px]"
      style={{ background: bg, borderColor: border, width: 398 }}
    >
      <div className="text-center" style={{ width: 351.355 }}>
        <p
          className="font-inter font-bold text-[30px] leading-normal mb-[14px]"
          style={{ color, letterSpacing: '0.0066px' }}
        >
          {title}
        </p>
        <p
          className="font-inter font-medium text-[24px] leading-normal"
          style={{ color, letterSpacing: '0.0066px' }}
        >
          {body}
        </p>
      </div>
    </div>
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
      className={`relative flex flex-1 h-full items-center justify-center transition-transform active:scale-[0.97] ${styles}`}
    >
      {children}
    </button>
  )
}
