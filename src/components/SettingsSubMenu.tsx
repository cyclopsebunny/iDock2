import { useT } from '../i18n/LanguageContext'
import { BackArrowIcon, CloseIcon } from '../icons/Icons'
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
}: Props) {
  const t = useT()
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
            {t('Settings')}
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
        <MenuRow label={t('Language')} onClick={onOpenLanguage} />
        <MenuRow label={t('Light & Sound')} onClick={onOpenLightSound} />
        <MenuRow label={t('Date & Time')} onClick={onOpenDateTime} />
        <MenuRow label={t('PIN Code')} />
        <MenuRow label={t('Timers')} onClick={onOpenTimers} />
        <MenuRow label={t('Network')} onClick={onOpenNetwork} />
        <MenuRow label={t('iDock Configuration')} onClick={onOpenIDockConfig} />
        <MenuRow label={t('Update Firmware')} />
      </div>
    </div>
  )
}
