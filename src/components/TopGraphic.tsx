import { StopHandIcon, WifiIcon } from '../icons/Icons'

export type TopGraphicVariant =
  | 'stop'
  | 'lock-x'
  | 'lock-x-dark'
  | 'dock-doors'
  | 'dock-doors-dark'
  | 'door-frame-1'
  | 'door-frame-2'
  | 'door-frame-3'
  | 'door-frame-4'
  | 'door-frame-5'
  | 'door-frame-6'
  | 'door-frame-1-dark'
  | 'door-frame-2-dark'
  | 'door-frame-3-dark'
  | 'door-frame-4-dark'
  | 'door-frame-5-dark'
  | 'door-frame-6-dark'
  | 'leveler-arrow'
  | 'leveler-arrow-dark'
  | 'leveler-arrow-up'
  | 'leveler-arrow-down'
  | 'forklift'
  | 'forklift-dark'
  | 'leveler-store-down'
  | 'leveler-store-up'
  | 'dock-doors-close'
  | 'dock-doors-close-dark'
  | 'lock'
  | 'lock-dark'

type Props = {
  variant?: TopGraphicVariant
}

const C = (name: string) => `${import.meta.env.BASE_URL}controls/${name}`

// Shared layout boxes. Dark variants reuse the same layout as their light
// counterparts since they're the same shape, just recolored.
const DOCK_LAYOUT = { left: 155, top: 50, width: 170, height: 170 }
const BYPASS_DOCK_LAYOUT = { left: 155, top: 30, width: 170, height: 170 }
const LOCK_LAYOUT = { left: 140, top: 39, width: 200, height: 200 }
const LEVELER_LAYOUT = { left: 136, top: 19, width: 210, height: 204 }
const FORKLIFT_LAYOUT = { left: 150, top: 37, width: 180, height: 180 }

const VARIANT_LAYOUT: Record<
  TopGraphicVariant,
  { left: number; top: number; width: number; height: number }
> = {
  stop: LOCK_LAYOUT,
  'lock-x': LOCK_LAYOUT,
  'lock-x-dark': LOCK_LAYOUT,
  'dock-doors': DOCK_LAYOUT,
  // Bypass theme nudges the dock-doors icon higher to leave room for the
  // "Restraint in Bypass" subtitle below it.
  'dock-doors-dark': BYPASS_DOCK_LAYOUT,
  'door-frame-1': DOCK_LAYOUT,
  'door-frame-2': DOCK_LAYOUT,
  'door-frame-3': DOCK_LAYOUT,
  'door-frame-4': DOCK_LAYOUT,
  'door-frame-5': DOCK_LAYOUT,
  'door-frame-6': DOCK_LAYOUT,
  'door-frame-1-dark': BYPASS_DOCK_LAYOUT,
  'door-frame-2-dark': BYPASS_DOCK_LAYOUT,
  'door-frame-3-dark': BYPASS_DOCK_LAYOUT,
  'door-frame-4-dark': BYPASS_DOCK_LAYOUT,
  'door-frame-5-dark': BYPASS_DOCK_LAYOUT,
  'door-frame-6-dark': BYPASS_DOCK_LAYOUT,
  'leveler-arrow': LEVELER_LAYOUT,
  'leveler-arrow-dark': LEVELER_LAYOUT,
  'leveler-arrow-up': LEVELER_LAYOUT,
  'leveler-arrow-down': { left: 135, top: 19, width: 211, height: 202 },
  forklift: FORKLIFT_LAYOUT,
  'forklift-dark': FORKLIFT_LAYOUT,
  'leveler-store-down': { left: 135, top: 19, width: 211, height: 202 },
  'leveler-store-up': { left: 118, top: 19, width: 244, height: 205 },
  'dock-doors-close': DOCK_LAYOUT,
  'dock-doors-close-dark': BYPASS_DOCK_LAYOUT,
  lock: LOCK_LAYOUT,
  'lock-dark': LOCK_LAYOUT,
}

const SRC: Record<Exclude<TopGraphicVariant, 'stop'>, string> = {
  'lock-x': 'lock-x.svg',
  'lock-x-dark': 'lock-x-dark.svg',
  'dock-doors': 'dock-doors.svg',
  'dock-doors-dark': 'dock-doors-dark.svg',
  'door-frame-1': 'door-frame-1.svg',
  'door-frame-2': 'door-frame-2.svg',
  'door-frame-3': 'door-frame-3.svg',
  'door-frame-4': 'door-frame-4.svg',
  'door-frame-5': 'door-frame-5.svg',
  'door-frame-6': 'door-frame-6.svg',
  'door-frame-1-dark': 'door-frame-1-dark.svg',
  'door-frame-2-dark': 'door-frame-2-dark.svg',
  'door-frame-3-dark': 'door-frame-3-dark.svg',
  'door-frame-4-dark': 'door-frame-4-dark.svg',
  'door-frame-5-dark': 'door-frame-5-dark.svg',
  'door-frame-6-dark': 'door-frame-6-dark.svg',
  'leveler-arrow': 'leveler-arrow.svg',
  'leveler-arrow-dark': 'leveler-arrow-dark.svg',
  'leveler-arrow-up': 'leveler-arrow-up.svg',
  'leveler-arrow-down': 'leveler-arrow-down.svg',
  forklift: 'forklift.svg',
  'forklift-dark': 'forklift-dark.svg',
  'leveler-store-down': 'leveler-store-down.svg',
  'leveler-store-up': 'leveler-store-up.svg',
  'dock-doors-close': 'dock-doors-close.svg',
  'dock-doors-close-dark': 'dock-doors-close-dark.svg',
  lock: 'lock.svg',
  'lock-dark': 'lock-dark.svg',
}

export function TopGraphic({ variant = 'stop' }: Props) {
  const layout = VARIANT_LAYOUT[variant]
  // Dark-variant icons live on the yellow bypass background; the wifi
  // glyph follows the same dark-brown tint so it stays readable.
  const isBypass = variant.endsWith('-dark')
  const wifiColor = isBypass ? '#513500' : 'white'
  return (
    <>
      <div className="absolute" style={layout}>
        {variant === 'stop' ? (
          <StopHandIcon className="block h-full w-full" />
        ) : (
          <img
            src={C(SRC[variant])}
            alt=""
            className="block h-full w-full"
            draggable={false}
          />
        )}
      </div>
      <div
        className="absolute"
        style={{ right: 14, top: 12, width: 36, height: 36, color: wifiColor }}
      >
        <WifiIcon />
      </div>
    </>
  )
}
