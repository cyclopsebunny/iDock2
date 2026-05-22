import { useT } from '../i18n/LanguageContext'

type Props = {
  /**
   * When false the button is rendered in its disabled "no changes" state
   * (gray border, muted text, no click handler).
   */
  enabled: boolean
  onClick: () => void
  /**
   * Translatable label. Defaults to the standard "Save Settings" copy used
   * across most settings screens; pass "Save Configuration" for the camera
   * + motion detection screens.
   */
  label?: string
}

/**
 * Standard Save CTA used at the bottom of every settings panel.
 *
 * Sized to match the Motion Detection Configuration reference:
 *   w-full px-[12px] py-[14px] rounded-[6px] text-[24px]
 *
 * Active state uses brand-primary blue (`#003b5c`). Disabled state uses the
 * common gray secondary button styling.
 */
export function SaveButton({ enabled, onClick, label }: Props) {
  const t = useT()
  const text = t(label ?? 'Save Settings')
  if (!enabled) {
    return (
      <button
        type="button"
        disabled
        className="w-full px-[12px] py-[14px] rounded-[6px] border border-[#eaeaea] bg-btn-secondary-bg text-[#a6a6a6] font-inter font-medium text-center text-[24px] tracking-[0.0066em] cursor-not-allowed"
      >
        {text}
      </button>
    )
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full px-[12px] py-[14px] rounded-[6px] border border-brand-primary bg-brand-primary text-white font-inter font-medium text-center text-[24px] tracking-[0.0066em] transition-opacity active:opacity-90"
    >
      {text}
    </button>
  )
}
