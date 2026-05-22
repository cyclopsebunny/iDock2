import { LevelerAnimatedIcon } from '../components/LevelerAnimatedIcon'
import { Panel } from '../components/Panel'
import { useT } from '../i18n/LanguageContext'
import { SettingsGearIcon, WifiIcon } from '../icons/Icons'

type Props = {
  direction: 'deploy' | 'store'
  onOpenSettings: () => void
  /** When true, render the dark-brown icon + "Restraint in Bypass" subtitle. */
  bypass?: boolean
}

export function LevelerAnimationScreen({
  direction,
  onOpenSettings,
  bypass = false,
}: Props) {
  const t = useT()
  const statusKey =
    direction === 'deploy' ? 'Deploying Leveler' : 'Storing Leveler'
  const iconFill = bypass ? '#513500' : 'white'
  // In bypass theme, the arrow stroke matches the yellow background so the
  // arrow visually separates from the ramp where they overlap.
  const arrowStroke = bypass ? '#f8d40f' : '#43ac1d'

  return (
    <>
      <div
        className="absolute"
        style={{ left: 136, top: 19, width: 210, height: 204 }}
      >
        <LevelerAnimatedIcon
          direction={direction}
          fill={iconFill}
          stroke={arrowStroke}
        />
      </div>
      {bypass && (
        <div
          className="absolute font-inter font-semibold text-center"
          style={{
            left: 0,
            right: 0,
            top: 225,
            color: '#513500',
            fontSize: 32,
            lineHeight: 1.05,
          }}
        >
          {t('Restraint in Bypass')}
        </div>
      )}
      <div
        className="absolute"
        style={{
          right: 14,
          top: 12,
          width: 36,
          height: 36,
          color: bypass ? '#513500' : 'white',
        }}
      >
        <WifiIcon />
      </div>
      <Panel padding={12} gap={12}>
        <div className="flex h-[66px] items-center gap-[12px] px-[16px]">
          <span className="flex-1" />
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
        <div className="flex flex-1 items-center justify-center w-full px-[8px]">
          <p className="font-inter font-semibold text-primary-text text-[64px] leading-tight text-center">
            {t(statusKey)}
          </p>
        </div>
      </Panel>
    </>
  )
}
