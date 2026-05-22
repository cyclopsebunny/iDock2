import { Panel } from '../components/Panel'
import { TopGraphic } from '../components/TopGraphic'
import { useT } from '../i18n/LanguageContext'
import { SettingsGearIcon } from '../icons/Icons'

type Props = {
  doorNumber: string
  onOpenSettings: () => void
  onCancelRequest: () => void
  onEnterPin: () => void
}

export function AuthorizationWaitScreen({
  doorNumber,
  onOpenSettings,
  onCancelRequest,
  onEnterPin,
}: Props) {
  const t = useT()
  return (
    <>
      <TopGraphic variant="lock-x-dark" />
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
        {/* Authorization Requested alert panel */}
        <div
          className="flex-1 w-full rounded-[8px] flex items-center justify-center px-[12px] py-[12px]"
          style={{
            background: '#fff7e2',
            border: '3px solid #ffed8f',
          }}
        >
          <p
            className="font-inter font-semibold text-center leading-[1.1]"
            style={{ color: '#513500', fontSize: 48 }}
          >
            {t('Authorization Requested...')}
          </p>
        </div>
        {/* Cancel Request — secondary button */}
        <button
          type="button"
          onClick={onCancelRequest}
          className="w-full rounded-[8px] bg-btn-secondary-bg border border-btn-secondary-stroke text-btn-secondary-label font-inter font-medium text-center text-[32px] leading-none tracking-[0.0066em] px-[12px] py-[18px] transition-opacity active:opacity-90"
          style={{ maxHeight: 75 }}
        >
          {t('Cancel Request')}
        </button>
        {/* Enter PIN Code — primary blue button */}
        <button
          type="button"
          onClick={onEnterPin}
          className="w-full rounded-[8px] text-white font-inter font-medium text-center text-[32px] leading-none tracking-[0.0066em] px-[12px] py-[18px] transition-opacity active:opacity-90"
          style={{
            background: '#009cde',
            border: '1px solid #009cde',
            maxHeight: 75,
          }}
        >
          {t('Enter PIN Code')}
        </button>
      </Panel>
    </>
  )
}
