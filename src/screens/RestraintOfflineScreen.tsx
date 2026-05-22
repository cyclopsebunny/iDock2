import { Panel } from '../components/Panel'
import { TopGraphic, type TopGraphicVariant } from '../components/TopGraphic'
import { useT } from '../i18n/LanguageContext'
import { SettingsGearIcon } from '../icons/Icons'

type Props = {
  doorNumber: string
  onOpenSettings: () => void
  onBypassRestraint: () => void
  /** Top-of-screen graphic. Defaults to the locked-padlock-X icon. */
  topGraphic?: TopGraphicVariant
  /** Warning copy. Defaults to "Cannot engage restraint". */
  message?: string
}

export function RestraintOfflineScreen({
  doorNumber,
  onOpenSettings,
  onBypassRestraint,
  topGraphic = 'lock-x',
  message = 'Cannot engage restraint',
}: Props) {
  const t = useT()
  return (
    <>
      <TopGraphic variant={topGraphic} />
      <Panel padding={12} gap={12}>
        <div className="flex h-[66px] items-center gap-[12px] px-[16px]">
          <span className="font-inter font-semibold text-primary-text text-[40px] leading-none whitespace-nowrap">
            {t('Door')}
          </span>
          <span className="flex-1 font-inter font-semibold text-primary-text text-[40px] leading-none">
            {doorNumber}
          </span>
          <button
            type="button"
            onClick={onOpenSettings}
            aria-label="Open settings"
            className="shrink-0 text-[#A6A6A6] hover:text-[#8a8a8a]"
            style={{ width: 36, height: 36 }}
          >
            <SettingsGearIcon className="h-full w-full" />
          </button>
        </div>
        {/* Warning panel — same peach styling for all restraint warnings. */}
        <div
          className="flex-1 w-full rounded-[8px] flex items-center justify-center px-[17px]"
          style={{
            background: '#f7dbd2',
            border: '3px solid #f7b6a1',
          }}
        >
          <p
            className="font-inter font-semibold text-center leading-[1.1]"
            style={{ color: '#732006', fontSize: 48 }}
          >
            {t(message)}
          </p>
        </div>
        {/* Bypass Restraint button (preserves typo "Restrait" from Figma source) */}
        <button
          type="button"
          onClick={onBypassRestraint}
          className="w-full rounded-[8px] font-inter font-medium text-white text-center text-[32px] leading-none tracking-[0.0066em] px-[12px] py-[18px] transition-opacity active:opacity-90"
          style={{ background: '#009cde', border: '1px solid #009cde' }}
        >
          {t('Bypass Restrait')}
        </button>
      </Panel>
    </>
  )
}
