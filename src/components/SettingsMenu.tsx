import { CloseIcon } from '../icons/Icons'
import { MenuRow } from './MenuRow'

type Props = {
  onClose: () => void
  onLock: () => void
  onOpenSettings: () => void
  onOpenEquipmentInfo: () => void
  onOpenCounters: () => void
}

export function SettingsMenu({
  onClose,
  onLock,
  onOpenSettings,
  onOpenEquipmentInfo,
  onOpenCounters,
}: Props) {
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
        style={{ width: 448, height: 514, padding: 8, marginLeft: 16, marginBottom: 16 }}
      >
        <div className="flex h-[66px] items-center gap-[6px] pl-[69px] pr-[8px]">
          <h2 className="flex-1 text-center font-inter font-semibold text-brand-primary text-[28px] leading-[30px]">
            Main Menu
          </h2>
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="shrink-0 text-btn-secondary-label"
            style={{ width: 36, height: 36 }}
          >
            <CloseIcon className="h-full w-full" />
          </button>
        </div>
        <PrimaryButton variant="accent" onClick={onLock}>
          Lock iDock Controller
        </PrimaryButton>
        <PrimaryButton variant="destructive">Bypass Restrait</PrimaryButton>
        <MenuRow label="Equipment Info" onClick={onOpenEquipmentInfo} />
        <MenuRow label="Counters" onClick={onOpenCounters} />
        <MenuRow label="Maintenance" />
        <MenuRow label="Settings" onClick={onOpenSettings} />
      </div>
    </div>
  )
}

type PrimaryButtonProps = {
  children: React.ReactNode
  variant: 'accent' | 'destructive'
  onClick?: () => void
}

function PrimaryButton({ children, variant, onClick }: PrimaryButtonProps) {
  const styles =
    variant === 'accent'
      ? 'bg-accent-blue border-accent-blue'
      : 'bg-panel-red border-panel-red-stroke'
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full px-[8px] py-[14px] rounded-[6px] border text-white text-[24px] font-inter font-medium text-center tracking-[0.0066em] transition-opacity active:opacity-80 ${styles}`}
    >
      {children}
    </button>
  )
}
