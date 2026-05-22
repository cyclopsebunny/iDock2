import { useEffect, useState } from 'react'
import { Panel } from '../components/Panel'
import { TopGraphic, type TopGraphicVariant } from '../components/TopGraphic'
import { useT } from '../i18n/LanguageContext'
import { SettingsGearIcon } from '../icons/Icons'

type Props = {
  doorNumber: string
  direction: 'opening' | 'closing'
  onOpenSettings: () => void
  /** Fires once the 5-second animation completes. */
  onComplete: () => void
  /** When true, render the dark-brown door frame + bypass subtitle. */
  bypass?: boolean
}

const OPENING_LIGHT: TopGraphicVariant[] = [
  'door-frame-1',
  'door-frame-2',
  'door-frame-3',
  'door-frame-4',
  'door-frame-5',
  'door-frame-6',
]
const OPENING_DARK: TopGraphicVariant[] = [
  'door-frame-1-dark',
  'door-frame-2-dark',
  'door-frame-3-dark',
  'door-frame-4-dark',
  'door-frame-5-dark',
  'door-frame-6-dark',
]

export function DoorAnimationScreen({
  doorNumber,
  direction,
  onOpenSettings,
  onComplete,
  bypass = false,
}: Props) {
  const t = useT()
  const baseFrames = bypass ? OPENING_DARK : OPENING_LIGHT
  const frames =
    direction === 'opening' ? baseFrames : [...baseFrames].reverse()
  const [frameIdx, setFrameIdx] = useState(0)

  useEffect(() => {
    if (frameIdx >= frames.length - 1) {
      const done = setTimeout(onComplete, 1000)
      return () => clearTimeout(done)
    }
    const advance = setTimeout(() => setFrameIdx((i) => i + 1), 1000)
    return () => clearTimeout(advance)
  }, [frameIdx, frames.length, onComplete])

  const showDoorNumber = direction === 'opening' && !bypass
  const statusKey = direction === 'opening' ? 'Door Opening' : 'Door Closing'

  return (
    <>
      <TopGraphic variant={frames[frameIdx]} />
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
      <Panel padding={12} gap={12}>
        <div className="flex h-[66px] items-center gap-[12px] px-[16px]">
          {showDoorNumber ? (
            <>
              <span className="font-inter font-semibold text-primary-text text-[40px] leading-none whitespace-nowrap">
                {t('Door')}
              </span>
              <span className="flex-1 font-inter font-semibold text-primary-text text-[40px] leading-none">
                {doorNumber}
              </span>
            </>
          ) : (
            <span className="flex-1" />
          )}
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
