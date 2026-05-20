import { BackArrowIcon, CloseIcon } from '../icons/Icons'
import { MenuRow } from './MenuRow'

type Props = {
  onBack: () => void
  onClose: () => void
  onOpenIDockConfig: () => void
}

export function SettingsSubMenu({ onBack, onClose, onOpenIDockConfig }: Props) {
  return (
    <div className="absolute inset-0 flex items-end" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0 bg-black/45"
      />
      <div
        className="relative flex flex-col gap-[8px] bg-white rounded-[12px] shadow-panel"
        style={{ width: 448, height: 768, padding: 8, marginLeft: 16, marginBottom: 16 }}
      >
        <div className="flex h-[66px] items-center gap-[12px] px-[16px] shrink-0">
          <button
            type="button"
            aria-label="Back to main menu"
            onClick={onBack}
            className="shrink-0 text-brand-primary"
            style={{ width: 36, height: 36 }}
          >
            <BackArrowIcon className="h-full w-full" />
          </button>
          <h2 className="flex-1 text-center font-inter font-semibold text-brand-primary text-[28px] leading-[30px]">
            Settings
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
        <MenuRow label="Language" />
        <MenuRow label="Light & Sound" />
        <MenuRow label="Date & Time" />
        <MenuRow label="PIN Code" />
        <MenuRow label="Timers" />
        <MenuRow label="Network" />
        <MenuRow label="iDock Configuration" onClick={onOpenIDockConfig} />
        <MenuRow label="Update Firmware" />
      </div>
    </div>
  )
}
