import { useT } from '../i18n/LanguageContext'
import { MenuModal } from './MenuModal'
import { MenuRow } from './MenuRow'

type Props = {
  onClose: () => void
  onLock: () => void
  onBypassRestraint: () => void
  onOpenSettings: () => void
  onOpenEquipmentInfo: () => void
  onOpenCounters: () => void
  onOpenMaintenance: () => void
}

export function SettingsMenu({
  onClose,
  onLock,
  onBypassRestraint,
  onOpenSettings,
  onOpenEquipmentInfo,
  onOpenCounters,
  onOpenMaintenance,
}: Props) {
  const t = useT()
  return (
    <MenuModal title="Main Menu" onClose={onClose} height={514} gap={8}>
      <PrimaryButton variant="accent" onClick={onLock}>
        {t('Lock iDock Controller')}
      </PrimaryButton>
      <PrimaryButton variant="destructive" onClick={onBypassRestraint}>
        {t('Bypass Restrait')}
      </PrimaryButton>
      <MenuRow label={t('Equipment Info')} onClick={onOpenEquipmentInfo} />
      <MenuRow label={t('Counters')} onClick={onOpenCounters} />
      <MenuRow label={t('Maintenance')} onClick={onOpenMaintenance} />
      <MenuRow label={t('Settings')} onClick={onOpenSettings} />
    </MenuModal>
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
