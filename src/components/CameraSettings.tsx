import { BackArrowIcon, CameraIcon, ChevronRightIcon, CloseIcon } from '../icons/Icons'

type Props = {
  cameraIndex: number
  cameraEnabled: boolean
  motionDetectionOn: boolean
  onBack: () => void
  onClose: () => void
  onOpenCameraState: () => void
  onOpenMotionDetection: () => void
}

export function CameraSettings({
  cameraIndex,
  cameraEnabled,
  motionDetectionOn,
  onBack,
  onClose,
  onOpenCameraState,
  onOpenMotionDetection,
}: Props) {
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
            aria-label="Back to Cameras"
            onClick={onBack}
            className="shrink-0 text-brand-primary"
            style={{ width: 36, height: 36 }}
          >
            <BackArrowIcon className="h-full w-full" />
          </button>
          <h2 className="flex-1 text-center font-inter font-semibold text-brand-primary text-[28px] leading-[30px]">
            Camera {cameraIndex} Settings
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
        <StateRow
          icon={<CameraIcon className="h-full w-full" />}
          label="Camera State"
          status={cameraEnabled ? 'Enabled' : 'Disabled'}
          onClick={onOpenCameraState}
        />
        <StateRow
          label="Motion Detection Configuration"
          status={motionDetectionOn ? 'On' : 'Off'}
          onClick={onOpenMotionDetection}
        />
      </div>
    </div>
  )
}

function StateRow({
  icon,
  label,
  status,
  onClick,
}: {
  icon?: React.ReactNode
  label: string
  status: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-[6px] bg-btn-secondary-bg border border-btn-secondary-stroke rounded-[6px] px-[8px] py-[14px] text-left transition-colors active:bg-[#ebebeb]"
    >
      {icon && (
        <span className="shrink-0 text-btn-secondary-label" style={{ width: 30, height: 30 }}>
          {icon}
        </span>
      )}
      <span className="flex-1 font-inter font-medium text-btn-secondary-label text-[24px] leading-[1.15] tracking-[0.0066em]">
        {label}
      </span>
      <span
        className="font-inter font-bold text-btn-secondary-label text-[20px] leading-none tracking-[0.0066em] text-right whitespace-nowrap"
        style={{ width: 120 }}
      >
        {status}
      </span>
      <span
        className="flex items-center justify-center text-btn-secondary-label"
        style={{ width: 30, height: 30 }}
        aria-hidden
      >
        <ChevronRightIcon className="h-full w-full" />
      </span>
    </button>
  )
}
