import { useT } from '../i18n/LanguageContext'
import { CameraIcon, ChevronRightIcon } from '../icons/Icons'
import { MenuModal } from './MenuModal'

export type CameraState = 'never' | 'connected' | 'disconnected'

type Props = {
  cameras: CameraState[]
  onBack: () => void
  onClose: () => void
  onOpenCamera: (index: number) => void
}

export function CamerasMenu({ cameras, onBack, onClose, onOpenCamera }: Props) {
  const t = useT()
  const visible = cameras
    .map((state, idx) => ({ state, index: idx + 1 }))
    .filter((c) => c.state !== 'never')
  const noneConnected = cameras.every((c) => c !== 'connected')

  return (
    <MenuModal title="Cameras" onBack={onBack} onClose={onClose}>
      {noneConnected && <NoCamerasAlert label={t('No Cameras Connected')} />}
      {visible.map((c) => (
        <CameraRow
          key={c.index}
          index={c.index}
          disabled={c.state === 'disconnected'}
          onClick={() => onOpenCamera(c.index)}
        />
      ))}
    </MenuModal>
  )
}

function NoCamerasAlert({ label }: { label: string }) {
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
        {label}
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
  const t = useT()
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
        {t('Camera {n} Settings', { n: index })}
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
