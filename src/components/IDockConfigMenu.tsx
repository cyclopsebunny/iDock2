import { BackArrowIcon, CloseIcon } from '../icons/Icons'
import { MenuRow } from './MenuRow'

type Props = {
  onBack: () => void
  onClose: () => void
  onOpenCameras: () => void
}

export function IDockConfigMenu({ onBack, onClose, onOpenCameras }: Props) {
  return (
    <div className="absolute inset-0 flex items-end" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0 bg-black/45"
      />
      <div
        className="relative flex flex-col gap-[10px] bg-white rounded-[12px] shadow-panel"
        style={{ width: 448, height: 768, padding: 8, marginLeft: 16, marginBottom: 16 }}
      >
        <div className="flex h-[66px] items-center gap-[12px] px-[15px] shrink-0">
          <button
            type="button"
            aria-label="Back to settings"
            onClick={onBack}
            className="shrink-0 text-brand-primary"
            style={{ width: 36, height: 36 }}
          >
            <BackArrowIcon className="h-full w-full" />
          </button>
          <h2 className="flex-1 text-center font-inter font-semibold text-brand-primary text-[28px] leading-[30px]">
            iDock Configuration
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
        <MenuRow label="Diagnostics" />
        <MenuRow label="Maxum Settings" />
        <MenuRow label="Field Installation Settings" />
        <MenuRow label="Factory Installation Settings" />
        <MenuRow label="Cameras" onClick={onOpenCameras} />
        <MenuRow label="Reader" status="Disabled" />
        <MenuRow label="Bypass Configuration" />
        <MenuRow label="User Access Configuration" />
      </div>
    </div>
  )
}
