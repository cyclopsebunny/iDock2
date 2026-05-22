import type { ReactNode } from 'react'
import { useT } from '../i18n/LanguageContext'
import { BackArrowIcon, CloseIcon } from '../icons/Icons'

type Props = {
  /** Header title — passed through `useT` for translation. */
  title: string
  /** Renders the back-arrow button when supplied. Omitted on top-level menus. */
  onBack?: () => void
  onClose: () => void
  /** Bottom-anchored panel height. 514 for the main menu, 768 elsewhere. */
  height?: 514 | 768
  /**
   * Vertical gap between header and children, plus children's gap from
   * each other when they're direct flex items. Most sub-screens use 10px;
   * a few PIN/keypad screens use 8px, a few maintenance pages 12px.
   */
  gap?: number
  /** Inner padding of the white panel. Defaults to 8. */
  padding?: number
  children: ReactNode
}

/**
 * Bottom-anchored white modal panel with a 66px header (optional back
 * button + centered title + close X). This is the shared shell used by
 * almost every settings sub-screen.
 *
 * Why this exists: before extracting this, the same 25-line absolute /
 * flex / dialog scaffold + header was repeated inline in ~15 components,
 * and they had drifted on padding / gap / header alignment over time.
 */
export function MenuModal({
  title,
  onBack,
  onClose,
  height = 768,
  gap = 10,
  padding = 8,
  children,
}: Props) {
  const t = useT()
  return (
    <div
      className="absolute inset-0 flex items-end"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop click closes the menu — no dim per the design. */}
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0"
      />
      <div
        className="relative flex flex-col bg-white rounded-[12px] shadow-panel"
        style={{
          width: 448,
          height,
          padding,
          gap,
          marginLeft: 16,
          marginBottom: 16,
        }}
      >
        <div className="flex h-[66px] items-center gap-[12px] px-[16px] shrink-0">
          {onBack ? (
            <button
              type="button"
              aria-label="Back"
              onClick={onBack}
              className="shrink-0 text-brand-primary"
              style={{ width: 36, height: 36 }}
            >
              <BackArrowIcon className="h-full w-full" />
            </button>
          ) : (
            // Keeps the title visually centered when there's no back button.
            <span className="shrink-0" style={{ width: 36, height: 36 }} />
          )}
          <h2 className="flex-1 text-center font-inter font-semibold text-brand-primary text-[28px] leading-[30px]">
            {t(title)}
          </h2>
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="shrink-0 text-brand-primary"
            style={{ width: 36, height: 36 }}
          >
            <CloseIcon className="h-full w-full" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
