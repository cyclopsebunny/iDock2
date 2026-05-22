import { useT } from '../i18n/LanguageContext'
import { MenuModal } from './MenuModal'
import { MenuRow } from './MenuRow'

type Props = {
  onBack: () => void
  onClose: () => void
  onOpenIDockConfig: () => void
  onOpenLanguage: () => void
  onOpenLightSound: () => void
  onOpenDateTime: () => void
  onOpenTimers: () => void
  onOpenNetwork: () => void
  onOpenUpdateFirmware: () => void
}

export function SettingsSubMenu({
  onBack,
  onClose,
  onOpenIDockConfig,
  onOpenLanguage,
  onOpenLightSound,
  onOpenDateTime,
  onOpenTimers,
  onOpenNetwork,
  onOpenUpdateFirmware,
}: Props) {
  const t = useT()
  return (
    <MenuModal title="Settings" onBack={onBack} onClose={onClose}>
      <MenuRow label={t('Language')} onClick={onOpenLanguage} />
      <MenuRow label={t('Light & Sound')} onClick={onOpenLightSound} />
      <MenuRow label={t('Date & Time')} onClick={onOpenDateTime} />
      <MenuRow label={t('PIN Code')} />
      <MenuRow label={t('Timers')} onClick={onOpenTimers} />
      <MenuRow label={t('Network')} onClick={onOpenNetwork} />
      <MenuRow label={t('iDock Configuration')} onClick={onOpenIDockConfig} />
      <MenuRow label={t('Update Firmware')} onClick={onOpenUpdateFirmware} />
    </MenuModal>
  )
}
