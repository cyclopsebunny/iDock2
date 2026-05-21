import { BackArrowIcon, CameraIcon, ChevronRightIcon, CloseIcon } from '../icons/Icons'

type Props = {
  cameraIndex: number
  cameraEnabled: boolean
  motionDetectionOn: boolean
  cameraConnected: boolean
  onBack: () => void
  onClose: () => void
  onOpenCameraState: () => void
  onOpenMotionDetection: () => void
}

export function CameraSettings({
  cameraIndex,
  cameraEnabled,
  motionDetectionOn,
  cameraConnected,
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
        {!cameraConnected && <DisconnectedAlert />}
        <StateRow
          icon={<CameraIcon className="h-full w-full" />}
          label="Camera State"
          status={cameraConnected ? (cameraEnabled ? 'Enabled' : 'Disabled') : undefined}
          onClick={cameraConnected ? onOpenCameraState : undefined}
          disabled={!cameraConnected}
        />
        <StateRow
          label="Motion Detection Configuration"
          status={cameraConnected ? (motionDetectionOn ? 'On' : 'Off') : undefined}
          onClick={cameraConnected ? onOpenMotionDetection : undefined}
          disabled={!cameraConnected}
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
  disabled,
}: {
  icon?: React.ReactNode
  label: string
  status?: string
  onClick?: () => void
  disabled?: boolean
}) {
  const bg = disabled ? 'bg-white' : 'bg-btn-secondary-bg'
  const border = disabled ? 'border-[#eaeaea]' : 'border-btn-secondary-stroke'
  const color = disabled ? 'text-[#a6a6a6]' : 'text-btn-secondary-label'
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full items-center gap-[6px] ${bg} ${border} border rounded-[6px] px-[8px] py-[14px] text-left transition-colors ${
        disabled ? 'cursor-not-allowed' : 'active:bg-[#ebebeb]'
      }`}
    >
      {icon && (
        <span className={`shrink-0 ${color}`} style={{ width: 30, height: 30 }}>
          {icon}
        </span>
      )}
      <span className={`flex-1 font-inter font-medium text-[24px] leading-[1.15] tracking-[0.0066em] ${color}`}>
        {label}
      </span>
      {status && (
        <span
          className={`font-inter font-bold text-[20px] leading-none tracking-[0.0066em] text-right whitespace-nowrap ${color}`}
          style={{ width: 120 }}
        >
          {status}
        </span>
      )}
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

function DisconnectedAlert() {
  return (
    <div
      className="flex items-center justify-center px-[12px] py-[14px] rounded-[6px] border-2"
      style={{
        background: '#f7dbd2',
        borderColor: '#f7b6a1',
        width: 398,
        alignSelf: 'center',
      }}
    >
      <p
        className="font-inter font-bold text-center text-[24px] leading-none tracking-[0.0066em]"
        style={{ color: '#732006' }}
      >
        Camera Disconnected
      </p>
    </div>
  )
}
