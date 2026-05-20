import { BackArrowIcon, CameraIcon, ChevronRightIcon, CloseIcon } from '../icons/Icons'

export type CameraState = 'never' | 'connected' | 'disconnected'

type Props = {
  cameras: CameraState[]
  onBack: () => void
  onClose: () => void
  onOpenCamera: (index: number) => void
}

export function CamerasMenu({ cameras, onBack, onClose, onOpenCamera }: Props) {
  const visible = cameras
    .map((state, idx) => ({ state, index: idx + 1 }))
    .filter((c) => c.state !== 'never')
  const noneConnected =
    visible.length > 0 && visible.every((c) => c.state === 'disconnected')

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
        <div className="flex h-[66px] items-center gap-[12px] px-[15px] shrink-0">
          <button
            type="button"
            aria-label="Back to iDock Configuration"
            onClick={onBack}
            className="shrink-0 text-brand-primary"
            style={{ width: 36, height: 36 }}
          >
            <BackArrowIcon className="h-full w-full" />
          </button>
          <h2 className="flex-1 text-center font-inter font-semibold text-brand-primary text-[28px] leading-[30px]">
            Cameras
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

        {noneConnected && <NoCamerasAlert />}
        {visible.map((c) => (
          <CameraRow
            key={c.index}
            index={c.index}
            disabled={c.state === 'disconnected'}
            onClick={() => onOpenCamera(c.index)}
          />
        ))}
      </div>
    </div>
  )
}

function NoCamerasAlert() {
  return (
    <div
      className="flex items-center justify-center px-[12px] py-[14px] rounded-[6px] border-2"
      style={{
        background: '#fff7e2',
        borderColor: '#ffed8f',
        width: 398,
        alignSelf: 'center',
      }}
    >
      <p
        className="font-inter font-medium text-center text-[24px] leading-none tracking-[0.0066em]"
        style={{ color: '#513500' }}
      >
        No Cameras Connected
      </p>
    </div>
  )
}

function CameraRow({
  index,
  disabled,
  onClick,
}: {
  index: number
  disabled: boolean
  onClick: () => void
}) {
  const bg = disabled ? 'bg-white' : 'bg-btn-secondary-bg'
  const border = disabled ? 'border-[#eaeaea]' : 'border-btn-secondary-stroke'
  const color = disabled ? 'text-[#a6a6a6]' : 'text-btn-secondary-label'
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex w-full items-center gap-[6px] ${bg} ${border} border rounded-[6px] px-[8px] py-[14px] text-left transition-colors ${
        disabled ? 'cursor-not-allowed' : 'active:bg-[#ebebeb]'
      }`}
    >
      <span className={`shrink-0 ${color}`} style={{ width: 30, height: 30 }}>
        <CameraIcon className="h-full w-full" />
      </span>
      <span className={`flex-1 font-inter font-medium text-[24px] leading-none tracking-[0.0066em] ${color}`}>
        Camera {index} Settings
      </span>
      <span
        className={`flex items-center justify-center ${color}`}
        style={{ width: 30, height: 30 }}
        aria-hidden
      >
        <ChevronRightIcon className="h-full w-full" />
      </span>
    </button>
  )
}
