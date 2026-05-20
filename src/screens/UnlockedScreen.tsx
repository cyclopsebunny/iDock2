import { Panel } from '../components/Panel'
import { TopGraphic } from '../components/TopGraphic'
import { SettingsGearIcon } from '../icons/Icons'

type Props = {
  doorNumber: string
  status: string
  onOpenSettings: () => void
}

export function UnlockedScreen({ doorNumber, status, onOpenSettings }: Props) {
  return (
    <>
      <TopGraphic />
      <Panel padding={12} gap={12}>
        <div className="flex h-[66px] items-center gap-[12px] px-[16px]">
          <span className="font-inter font-semibold text-primary-text text-[40px] leading-none whitespace-nowrap">
            Door
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
        <div className="flex flex-1 flex-col items-center justify-start gap-[16px] px-[8px]">
          <div className="flex flex-1 items-center justify-center w-full">
            <p className="font-inter font-semibold text-primary-text text-[64px] leading-tight text-center">
              {status}
            </p>
          </div>
          <div className="h-[156px] w-full" />
        </div>
      </Panel>
    </>
  )
}
