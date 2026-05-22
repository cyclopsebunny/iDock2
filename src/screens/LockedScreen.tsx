import { Panel } from '../components/Panel'
import { TopGraphic } from '../components/TopGraphic'
import { useT } from '../i18n/LanguageContext'
import { KeypadIcon } from '../icons/Icons'

type Props = {
  doorNumber: string
  onTapToUnlock: () => void
  /** When true, prompt the user to scan their badge. False hides the text. */
  showScanBadgePrompt?: boolean
}

export function LockedScreen({
  doorNumber,
  onTapToUnlock,
  showScanBadgePrompt = true,
}: Props) {
  const t = useT()
  return (
    <button
      type="button"
      onClick={onTapToUnlock}
      className="absolute inset-0 block text-left"
      aria-label="Tap to unlock"
    >
      <TopGraphic />
      <Panel padding={12} gap={12}>
        <div className="flex h-[66px] w-full items-center gap-[12px] pl-[77px] pr-[16px]">
          <span className="flex-1 text-center font-inter font-semibold text-primary-text text-[40px] leading-none">
            {t('Locked')}
          </span>
          <span
            className="shrink-0 text-primary-text"
            style={{ width: 36, height: 36 }}
            aria-hidden
          >
            <KeypadIcon className="h-full w-full" />
          </span>
        </div>
        <div className="flex flex-1 flex-col items-center justify-between min-h-0 pt-[12px] pb-[8px] w-full">
          <div className="flex flex-col items-center text-primary-text font-inter font-semibold leading-none w-full">
            <div className="text-[64px] text-center whitespace-nowrap">{t('Door')}</div>
            <div
              className="text-[180px] leading-none text-left"
              style={{ width: 207, height: 160 }}
            >
              {doorNumber}
            </div>
          </div>
          {showScanBadgePrompt ? (
            <div className="w-full text-center font-inter font-medium text-primary-text text-[32px]">
              {t('Scan Badge to Unlock')}
            </div>
          ) : (
            // Reserve the same vertical space so the layout doesn't shift
            // when the prompt is hidden.
            <div style={{ height: 40 }} />
          )}
        </div>
      </Panel>
    </button>
  )
}
