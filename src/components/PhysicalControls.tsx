type ButtonSpec = {
  label: string
  image: string // filename under /public/controls/
  width: number
  height: number
  onClick?: () => void
  /** Fires on pointerdown for press-and-hold buttons (e.g. Leveler Lower). */
  onPressDown?: () => void
  /** Fires on pointerup or pointerleave to release a press-and-hold. */
  onPressUp?: () => void
}

const C = (name: string) => `${import.meta.env.BASE_URL}controls/${name}`

// Uniform size for every hardware button so the four panels match.
const BTN = { width: 72, height: 82 }

type PhysicalControlsProps = {
  onEngageRestraint?: () => void
  onReleaseRestraint?: () => void
  onDoorOpen?: () => void
  onDoorClose?: () => void
  onDoorStop?: () => void
  /** Press-and-hold handlers for the Leveler Lower button. */
  onLevelerPressDown?: () => void
  onLevelerPressUp?: () => void
  /** Drives the "Leveler Stored" indicator label visibility. */
  levelerStored?: boolean
}

export function PhysicalControls({
  onEngageRestraint,
  onReleaseRestraint,
  onDoorOpen,
  onDoorClose,
  onDoorStop,
  onLevelerPressDown,
  onLevelerPressUp,
  levelerStored = false,
}: PhysicalControlsProps = {}) {
  return (
    <div
      className="flex items-stretch gap-[20px] rounded-[12px] p-[20px]"
      style={{ background: '#222' }}
    >
      <ControlPanel
        buttons={[
          {
            label: 'Restraint Engage',
            image: 'restraint-engage.svg',
            onClick: onEngageRestraint,
            ...BTN,
          },
          // Empty slot — reserved space for a future button.
          null,
          {
            label: 'Restraint Release',
            image: 'restraint-release.svg',
            onClick: onReleaseRestraint,
            ...BTN,
          },
        ]}
      />
      <ControlPanel
        buttons={[
          {
            label: 'Door Open',
            image: 'door-open.svg',
            onClick: onDoorOpen,
            ...BTN,
          },
          {
            label: 'Door Close',
            image: 'door-close.svg',
            onClick: onDoorClose,
            ...BTN,
          },
          {
            label: 'Door Stop',
            image: 'door-stop.svg',
            onClick: onDoorStop,
            ...BTN,
          },
        ]}
      />
      <ControlPanel
        buttons={[
          {
            label: 'Leveler Lower',
            image: 'leveler-lower.svg',
            onPressDown: onLevelerPressDown,
            onPressUp: onLevelerPressUp,
            ...BTN,
          },
        ]}
      />
      <div
        className="relative rounded-[10px] border-2 border-black flex flex-col items-center gap-[10px] py-[16px] px-[10px]"
        style={{ background: '#262626', width: 110 }}
      >
        {/* Leveler Stored indicator label */}
        <div
          className="flex items-center justify-center rounded-[3px] border"
          style={{
            width: 70,
            height: 36,
            background: '#1f1f1f',
            borderColor: '#3a3a3a',
          }}
        >
          {levelerStored && (
            <span
              className="font-inter font-bold text-center leading-[1.05]"
              style={{ color: '#2bb0ee', fontSize: 11 }}
            >
              Leveler
              <br />
              Stored
            </span>
          )}
        </div>
        {/* Empty indicator lamp (off state) */}
        <div
          className="rounded-[3px] border"
          style={{
            width: 70,
            height: 26,
            background: '#1f1f1f',
            borderColor: '#3a3a3a',
          }}
        />
        <ControlButton label="Dock Light" image="dock-light.svg" {...BTN} />
        <ControlButton label="Dock Fan" image="dock-fan.svg" {...BTN} />
      </div>
    </div>
  )
}

function ControlPanel({ buttons }: { buttons: (ButtonSpec | null)[] }) {
  return (
    <div
      className="rounded-[10px] border-2 border-black flex flex-col items-center justify-start py-[16px] px-[10px] gap-[14px]"
      style={{ background: '#262626', width: 110 }}
    >
      {buttons.map((b, i) =>
        b ? (
          <ControlButton key={b.label} {...b} />
        ) : (
          // Spacer reserving the footprint of a button so the next button
          // sits in the slot below.
          <div
            key={`spacer-${i}`}
            aria-hidden
            style={{ width: BTN.width, height: BTN.height }}
          />
        ),
      )}
    </div>
  )
}

function ControlButton({
  label,
  image,
  width,
  height,
  onClick,
  onPressDown,
  onPressUp,
}: ButtonSpec) {
  // If this is a press-and-hold button, wire pointer events. Otherwise fall
  // back to a plain onClick. Note we still call release on pointerleave or
  // pointercancel so that dragging off cancels the action.
  const isHold = Boolean(onPressDown || onPressUp)
  return (
    <button
      type="button"
      onClick={isHold ? undefined : onClick}
      onPointerDown={
        isHold
          ? (e) => {
              try {
                ;(e.currentTarget as Element).setPointerCapture?.(e.pointerId)
              } catch {
                // setPointerCapture throws on synthetic events with no active
                // pointer (e.g. tests, automation). Safe to ignore — capture
                // is a nice-to-have for dragging off the button.
              }
              onPressDown?.()
            }
          : undefined
      }
      onPointerUp={isHold ? () => onPressUp?.() : undefined}
      onPointerCancel={isHold ? () => onPressUp?.() : undefined}
      onPointerLeave={isHold ? () => onPressUp?.() : undefined}
      aria-label={label}
      className="bg-transparent border-0 p-0 cursor-pointer transition-opacity active:opacity-70"
    >
      <img
        src={C(image)}
        alt={label}
        className="block"
        style={{ width, height }}
        draggable={false}
      />
    </button>
  )
}
