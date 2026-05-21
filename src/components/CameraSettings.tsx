import { useT } from '../i18n/LanguageContext'
import { BackArrowIcon, CameraIcon, ChevronRightIcon, CloseIcon } from '../icons/Icons'

type Props = {
  cameraIndex: number
  cameraEnabled: boolean
  motionDetectionOn: boolean
  cameraConnected: boolean
  myqSubscribed: boolean
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
  myqSubscribed,
  onBack,
  onClose,
  onOpenCameraState,
  onOpenMotionDetection,
}: Props) {
  const t = useT()
  const motionDisabled = !cameraConnected || !myqSubscribed
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
        <div className="flex h-[66px] items-center gap-[12px] px-[16px] shrink-0">
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
            {t('Camera {n} Settings', { n: cameraIndex })}
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
        {cameraConnected && !myqSubscribed && <MyqRequiredAlert />}
        <StateRow
          icon={<CameraIcon className="h-full w-full" />}
          label={t('Camera State')}
          status={
            cameraConnected ? (cameraEnabled ? t('Enabled') : t('Disabled')) : undefined
          }
          onClick={cameraConnected ? onOpenCameraState : undefined}
          disabled={!cameraConnected}
        />
        <StateRow
          label={t('Motion Detection Configuration')}
          status={
            !motionDisabled ? (motionDetectionOn ? t('On') : t('Off')) : undefined
          }
          onClick={!motionDisabled ? onOpenMotionDetection : undefined}
          disabled={motionDisabled}
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

function MyqRequiredAlert() {
  const t = useT()
  const text = t('myQ Subscription Required To\nUse Motion Detection')
  const [a, b] = text.split('\n')
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
        className="font-inter font-medium text-center text-[24px] leading-[1.2] tracking-[0.0066em]"
        style={{ color: '#513500' }}
      >
        {a}
        {b && (<><br />{b}</>)}
      </p>
    </div>
  )
}

function DisconnectedAlert() {
  const t = useT()
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
        {t('Camera Disconnected')}
      </p>
    </div>
  )
}
