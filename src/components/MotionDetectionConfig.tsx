import { useEffect, useRef, useState } from 'react'
import { useT } from '../i18n/LanguageContext'
import { BackArrowIcon, CloseIcon } from '../icons/Icons'

export type Point = { x: number; y: number }

export type MotionConfig = {
  on: boolean
  sensitivity: number // 0..4
  hasPicture: boolean
  corners: [Point, Point, Point, Point]
}

const PHOTO_W = 432
const PHOTO_H = 250
const CTRL = 32 // control-point diameter
const COUNTDOWN_SECONDS = 5

export const defaultCorners = (): [Point, Point, Point, Point] => [
  { x: 19, y: 19 },
  { x: PHOTO_W - 19, y: 19 },
  { x: PHOTO_W - 19, y: PHOTO_H - 19 },
  { x: 19, y: PHOTO_H - 19 },
]

export const defaultMotionConfig = (): MotionConfig => ({
  on: true,
  sensitivity: 2,
  hasPicture: false,
  corners: defaultCorners(),
})

type Props = {
  cameraIndex: number
  motion: MotionConfig
  cameraConnected: boolean
  onSave: (next: MotionConfig) => void
  onBack: () => void
  onClose: () => void
}

const cornersEqual = (a: readonly Point[], b: readonly Point[]) =>
  a.length === b.length && a.every((p, i) => p.x === b[i].x && p.y === b[i].y)

export function MotionDetectionConfig({
  cameraIndex,
  motion,
  cameraConnected,
  onSave,
  onBack,
  onClose,
}: Props) {
  const t = useT()
  // Local draft state — initialized from the committed motion config.
  const [on, setOn] = useState(motion.on)
  const [sensitivity, setSensitivity] = useState(motion.sensitivity)
  const [hasPicture, setHasPicture] = useState(motion.hasPicture)
  const [corners, setCorners] = useState<[Point, Point, Point, Point]>(motion.corners)

  const [phase, setPhase] = useState<'idle' | 'countdown' | 'taken'>(
    motion.hasPicture ? 'taken' : 'idle'
  )
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS)

  // Cancel any in-progress countdown if the camera disconnects mid-flow.
  useEffect(() => {
    if (!cameraConnected && phase === 'countdown') {
      setPhase(motion.hasPicture ? 'taken' : 'idle')
    }
  }, [cameraConnected, phase, motion.hasPicture])

  useEffect(() => {
    if (phase !== 'countdown') return
    setCountdown(COUNTDOWN_SECONDS)
    let n = COUNTDOWN_SECONDS
    const id = window.setInterval(() => {
      n -= 1
      if (n <= 0) {
        window.clearInterval(id)
        setPhase('taken')
        setHasPicture(true)
        setCorners(defaultCorners())
      } else {
        setCountdown(n)
      }
    }, 1000)
    return () => window.clearInterval(id)
  }, [phase])

  const dirty =
    on !== motion.on ||
    sensitivity !== motion.sensitivity ||
    hasPicture !== motion.hasPicture ||
    !cornersEqual(corners, motion.corners)

  const save = () => {
    if (!dirty) return
    onSave({ on, sensitivity, hasPicture, corners })
  }

  return (
    <div className="absolute inset-0 flex items-end" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0 bg-black/45"
      />
      <div
        className="relative flex flex-col gap-[12px] bg-white rounded-[12px] shadow-panel"
        style={{ width: 448, height: 768, padding: 8, marginLeft: 16, marginBottom: 16 }}
      >
        <div className="flex h-[66px] items-center gap-[12px] px-[15px] shrink-0">
          <button
            type="button"
            aria-label="Back to Camera Settings"
            onClick={onBack}
            disabled={!cameraConnected}
            className={`shrink-0 ${cameraConnected ? 'text-brand-primary' : 'text-[#a6a6a6] cursor-not-allowed'}`}
            style={{ width: 36, height: 36 }}
          >
            <BackArrowIcon className="h-full w-full" />
          </button>
          <h2 className="flex-1 text-center font-inter font-semibold text-brand-primary text-[28px] leading-[30px]">
            {(() => {
              const parts = t('Motion Detection\nConfiguration').split('\n')
              return (
                <>
                  {parts[0]}
                  {parts[1] && (<><br />{parts[1]}</>)}
                </>
              )
            })()}
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

        <div className={cameraConnected ? '' : 'opacity-50 pointer-events-none'}>
          <MotionToggleRow cameraIndex={cameraIndex} on={on} onChange={setOn} />
        </div>

        {cameraConnected ? (
          <PhotoArea
            phase={phase}
            countdown={countdown}
            corners={corners}
            setCorners={setCorners}
          />
        ) : (
          <DisconnectedPanel />
        )}

        <div className="flex gap-[10px]">
          <ActionButton
            primary
            disabled={!cameraConnected || phase === 'countdown'}
            onClick={() => setPhase('countdown')}
          >
            {t('Take Picture')}
          </ActionButton>
          <ActionButton
            disabled={!cameraConnected || phase !== 'taken'}
            onClick={() => setCorners(defaultCorners())}
          >
            {t('Back to Default')}
          </ActionButton>
        </div>

        <div className={cameraConnected ? '' : 'opacity-50 pointer-events-none'}>
          <SensitivityPanel value={sensitivity} onChange={setSensitivity} />
        </div>

        <div className="flex-1" />

        <SaveButton enabled={cameraConnected && dirty} onClick={save} />
      </div>
    </div>
  )
}

function MotionToggleRow({
  cameraIndex,
  on,
  onChange,
}: {
  cameraIndex: number
  on: boolean
  onChange: (v: boolean) => void
}) {
  const t = useT()
  return (
    <div className="flex w-full items-center gap-[8px] rounded-[6px] border border-btn-secondary-stroke bg-btn-secondary-bg pl-px pr-[9px] py-[9px]">
      <span className="flex-1 pl-[16px] font-inter font-medium text-btn-secondary-label text-[24px] leading-[1.15] tracking-[0.0066em]">
        {t('Camera {n} Motion Detection', { n: cameraIndex })}
      </span>
      <div className="flex items-stretch w-[180px]" style={{ boxShadow: '1px 1px 4px 0 rgba(0,0,0,0.15)' }}>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`flex-1 px-[8px] py-[16px] rounded-l-[4px] border font-inter font-bold text-[20px] leading-none ${
            !on
              ? 'bg-panel-red border-panel-red text-white'
              : 'bg-btn-secondary-bg border-btn-secondary-stroke text-btn-secondary-label'
          }`}
        >
          {t('OFF')}
        </button>
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`flex-1 px-[8px] py-[16px] rounded-r-[4px] border font-inter font-bold text-[20px] leading-none ${
            on
              ? 'bg-accent-blue border-accent-blue text-white'
              : 'bg-btn-secondary-bg border-btn-secondary-stroke text-btn-secondary-label'
          }`}
        >
          {t('ON')}
        </button>
      </div>
    </div>
  )
}

function IdlePrompt() {
  const t = useT()
  const [a, b] = t('Press Take Picture and\nmove away from the camera').split('\n')
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <p className="text-center font-inter font-medium text-[24px] leading-[1.2]" style={{ color: '#003b5c' }}>
        {a}
        {b && (<><br />{b}</>)}
      </p>
    </div>
  )
}

function DisconnectedPanel() {
  const t = useT()
  const a = t('Camera Disconnected')
  const b = t('Check camera connection')
  return (
    <div
      className="relative shrink-0 flex items-center justify-center rounded-[6px] border"
      style={{
        width: PHOTO_W,
        height: PHOTO_H,
        background: '#f7dbd2',
        borderColor: '#f7b6a1',
      }}
    >
      <div className="text-center px-[24px]" style={{ color: '#732006' }}>
        <p className="font-inter font-bold text-[32px] leading-none mb-[14px] tracking-[0.0066em]">
          {a}
        </p>
        <p className="font-inter font-medium text-[24px] leading-[1.2] tracking-[0.0066em]">
          {b}
        </p>
      </div>
    </div>
  )
}

function PhotoArea({
  phase,
  countdown,
  corners,
  setCorners,
}: {
  phase: 'idle' | 'countdown' | 'taken'
  countdown: number
  corners: [Point, Point, Point, Point]
  setCorners: (c: [Point, Point, Point, Point]) => void
}) {
  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-[6px] border border-btn-secondary-stroke"
      style={{ width: PHOTO_W, height: PHOTO_H, background: '#edf9ff' }}
    >
      {phase === 'idle' && <IdlePrompt />}
      {phase === 'countdown' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="font-inter font-semibold text-[120px] leading-none" style={{ color: '#003b5c' }}>
            {countdown}
          </p>
        </div>
      )}
      {phase === 'taken' && (
        <PictureWithControlPoints corners={corners} setCorners={setCorners} />
      )}
    </div>
  )
}

function PictureWithControlPoints({
  corners,
  setCorners,
}: {
  corners: [Point, Point, Point, Point]
  setCorners: (c: [Point, Point, Point, Point]) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef<number | null>(null)

  const clamp = (p: Point): Point => ({
    x: Math.max(CTRL / 2, Math.min(PHOTO_W - CTRL / 2, p.x)),
    y: Math.max(CTRL / 2, Math.min(PHOTO_H - CTRL / 2, p.y)),
  })

  const handlePointerDown = (idx: number) => (e: React.PointerEvent) => {
    e.preventDefault()
    e.stopPropagation()
    draggingRef.current = idx
    ;(e.target as Element).setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    const idx = draggingRef.current
    if (idx == null) return
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const next: Point = clamp({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
    const newCorners = [...corners] as [Point, Point, Point, Point]
    newCorners[idx] = next
    setCorners(newCorners)
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    draggingRef.current = null
    try {
      ;(e.target as Element).releasePointerCapture(e.pointerId)
    } catch {}
  }

  const polyPoints = corners.map((c) => `${c.x},${c.y}`).join(' ')

  return (
    <div ref={containerRef} className="absolute inset-0">
      <img
        src={`${import.meta.env.BASE_URL}warehouse.png`}
        alt="Camera view"
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />
      <svg
        className="absolute inset-0"
        width={PHOTO_W}
        height={PHOTO_H}
        viewBox={`0 0 ${PHOTO_W} ${PHOTO_H}`}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <polygon
          points={polyPoints}
          fill="#48B8F7"
          fillOpacity={0.5}
        />
        {corners.map((c, i) => (
          <g
            key={i}
            transform={`translate(${c.x - 16}, ${c.y - 16})`}
            style={{ cursor: 'grab', touchAction: 'none' }}
            onPointerDown={handlePointerDown(i)}
          >
            <circle cx={16} cy={16} r={16} fill="black" fillOpacity={0.15} />
            <circle cx={16} cy={16} r={16} fill="white" fillOpacity={0.6} />
            <circle cx={16} cy={16} r={10} fill="white" />
          </g>
        ))}
      </svg>
    </div>
  )
}

function ActionButton({
  children,
  primary,
  disabled,
  onClick,
}: {
  children: React.ReactNode
  primary?: boolean
  disabled?: boolean
  onClick?: () => void
}) {
  if (disabled) {
    return (
      <button
        type="button"
        disabled
        className="flex-1 h-[57px] rounded-[6px] border border-[#eaeaea] bg-white text-[#a6a6a6] font-inter font-medium text-center text-[24px] leading-none cursor-not-allowed"
      >
        {children}
      </button>
    )
  }
  if (primary) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="flex-1 h-[57px] rounded-[6px] border border-accent-blue bg-accent-blue text-white font-inter font-medium text-center text-[24px] leading-none transition-opacity active:opacity-90"
      >
        {children}
      </button>
    )
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 h-[57px] rounded-[6px] border border-btn-secondary-stroke bg-btn-secondary-bg text-btn-secondary-label font-inter font-medium text-center text-[24px] leading-none transition-colors active:bg-[#ebebeb]"
    >
      {children}
    </button>
  )
}

function SensitivityPanel({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  const t = useT()
  const labels = ['Lowest', 'Low', 'Medium', 'High', 'Highest']
  const dec = () => onChange(Math.max(0, value - 1))
  const inc = () => onChange(Math.min(4, value + 1))
  const fillPct = ((value + 1) / 5) * 100

  return (
    <div className="w-full rounded-[6px] border border-btn-secondary-stroke bg-btn-secondary-bg p-px">
      <div className="flex items-center gap-[16px] py-[8px] pl-[16px] pr-[16px]">
        <SensitivityIcon className="shrink-0" />
        <span className="flex-1 font-inter font-medium text-btn-secondary-label text-[24px] leading-none tracking-[0.0066em]">
          {t('Sensitivity')}
        </span>
        <span className="font-inter font-bold text-btn-secondary-label text-[20px] leading-none tracking-[0.0066em] whitespace-nowrap">
          {t(labels[value])}
        </span>
      </div>
      <div className="flex items-stretch gap-0 px-[8px] py-[8px]">
        <button
          type="button"
          onClick={dec}
          className="w-[68px] rounded-l-[8px] border border-btn-secondary-stroke bg-btn-secondary-bg flex items-center justify-center"
          style={{ boxShadow: '1px 1px 4px 0 rgba(0,0,0,0.15)' }}
          aria-label="Decrease sensitivity"
        >
          <ChevronLeft />
        </button>
        <div className="flex-1 h-[62px] border-t border-b border-btn-secondary-stroke bg-white overflow-hidden flex items-center pr-[8px]">
          <div
            className="h-[46px] bg-accent-blue border border-accent-blue rounded-r-[8px]"
            style={{ width: `${fillPct}%` }}
          />
        </div>
        <button
          type="button"
          onClick={inc}
          className="w-[68px] rounded-r-[8px] border border-btn-secondary-stroke bg-btn-secondary-bg flex items-center justify-center"
          style={{ boxShadow: '1px 1px 4px 0 rgba(0,0,0,0.15)' }}
          aria-label="Increase sensitivity"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  )
}

function SensitivityIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M27.8471 17.3472C27.8471 14.3058 26.6265 11.5426 24.632 9.5065C24.2783 9.14535 24.2804 8.56198 24.6368 8.2035C24.9932 7.84502 25.5689 7.8472 25.9227 8.20833C28.2361 10.5702 29.6656 13.7929 29.6656 17.3472C29.6656 21.0039 28.1529 24.309 25.7213 26.6875C25.36 27.0408 24.7845 27.0305 24.4357 26.6643C24.0869 26.2982 24.0971 25.7151 24.4584 25.3615C26.5554 23.3105 27.8471 20.4759 27.8471 17.3472Z" fill="#595959" />
      <path fillRule="evenodd" clipRule="evenodd" d="M31.6704 17.3464C31.6704 13.1156 29.9675 9.2742 27.1906 6.45066C26.8362 6.09024 26.8371 5.50685 27.1928 5.14765C27.5485 4.78845 28.1242 4.78946 28.4786 5.14988C31.576 8.29939 33.4889 12.6013 33.4889 17.3464C33.4889 22.2248 31.4671 26.6345 28.2148 29.8055C27.8529 30.1582 27.2773 30.1471 26.9292 29.7803C26.581 29.4136 26.5922 28.8304 26.954 28.4775C29.8705 25.634 31.6704 21.6956 31.6704 17.3464Z" fill="#595959" />
      <path fillRule="evenodd" clipRule="evenodd" d="M24.0249 17.3482C24.0249 15.4952 23.2858 13.8095 22.073 12.5609C21.7208 12.1982 21.7254 11.6149 22.0833 11.2579C22.4411 10.901 23.0168 10.9056 23.3691 11.2682C24.898 12.8424 25.8433 14.9852 25.8433 17.3482C25.8433 19.7824 24.8405 21.9824 23.2303 23.5682C22.8702 23.9228 22.2945 23.9145 21.9446 23.5496C21.5946 23.1846 21.6027 22.6013 21.9628 22.2467C23.2411 20.9879 24.0249 19.2567 24.0249 17.3482Z" fill="#595959" />
      <path fillRule="evenodd" clipRule="evenodd" d="M6.15283 17.5974C6.15283 20.6389 7.37349 23.4022 9.36787 25.4381C9.72162 25.7994 9.71949 26.3827 9.3631 26.7411C9.0067 27.0996 8.43102 27.0974 8.07727 26.7364C5.76374 24.3744 4.33438 21.1518 4.33438 17.5974C4.33438 13.9407 5.84701 10.6356 8.27858 8.25721C8.63987 7.90382 9.21547 7.91413 9.56422 8.28026C9.91296 8.64637 9.90279 9.22966 9.54148 9.58305C7.44451 11.6342 6.15283 14.4688 6.15283 17.5974Z" fill="#595959" />
      <path fillRule="evenodd" clipRule="evenodd" d="M2.33018 17.5954C2.33018 21.8261 4.03317 25.6676 6.81002 28.4911C7.16449 28.8515 7.16351 29.4348 6.80782 29.7942C6.45215 30.1534 5.87645 30.1523 5.52199 29.7918C2.42455 26.6424 0.511719 22.3405 0.511719 17.5954C0.511719 12.7169 2.53362 8.3072 5.78584 5.13631C6.1477 4.78352 6.72328 4.79477 7.07145 5.16145C7.4196 5.52814 7.40849 6.1114 7.04663 6.46422C4.13015 9.30774 2.33018 13.2461 2.33018 17.5954Z" fill="#595959" />
      <path fillRule="evenodd" clipRule="evenodd" d="M9.97795 17.5955C9.97795 19.4486 10.717 21.1342 11.9298 22.3828C12.282 22.7455 12.2774 23.329 11.9195 23.6858C11.5617 24.0428 10.986 24.0382 10.6338 23.6756C9.10485 22.1014 8.15951 19.9586 8.15951 17.5955C8.15951 15.1613 9.16236 12.9614 10.7726 11.3756C11.1327 11.0209 11.7083 11.0293 12.0583 11.3942C12.4083 11.7591 12.4001 12.3424 12.04 12.697C10.7618 13.9558 9.97795 15.6871 9.97795 17.5955Z" fill="#595959" />
      <path fillRule="evenodd" clipRule="evenodd" d="M20.5434 17.4704C20.5434 18.3811 20.2087 19.2126 19.6574 19.8457C19.008 20.5911 18.0581 21.0613 16.9997 21.0613C15.9413 21.0613 14.9912 20.5911 14.3419 19.8457C13.7906 19.2126 13.456 18.3811 13.456 17.4704C13.456 16.5597 13.7906 15.7281 14.3419 15.0951C14.9912 14.3496 15.9413 13.8794 16.9997 13.8794C18.0581 13.8794 19.008 14.3496 19.6574 15.0951C20.2087 15.7281 20.5434 16.5597 20.5434 17.4704Z" fill="#595959" />
      <path fillRule="evenodd" clipRule="evenodd" d="M14.6031 15.33C14.1058 15.9011 13.8047 16.6497 13.8047 17.4712C13.8047 18.2927 14.1058 19.0412 14.6031 19.6123C15.1896 20.2855 16.0453 20.7085 16.9994 20.7085C17.9534 20.7085 18.8093 20.2855 19.3956 19.6123C19.893 19.0412 20.1942 18.2927 20.1942 17.4712C20.1942 16.6497 19.893 15.9011 19.3956 15.33C18.8092 14.6568 17.9534 14.2338 16.9994 14.2338C16.0453 14.2338 15.1896 14.6568 14.6031 15.33ZM19.8898 20.0545C20.4894 19.366 20.8534 18.4616 20.8534 17.4712C20.8534 16.4807 20.4894 15.5764 19.8898 14.8879C19.1836 14.0772 18.1505 13.5658 16.9994 13.5658C15.8483 13.5658 14.8151 14.0772 14.109 14.8879C13.5094 15.5764 13.1455 16.4807 13.1455 17.4712C13.1455 18.4616 13.5093 19.366 14.109 20.0545C14.8151 20.8652 15.8483 21.3765 16.9994 21.3765C18.1505 21.3765 19.1836 20.8652 19.8898 20.0545Z" fill="#595959" />
    </svg>
  )
}

function ChevronLeft() {
  return (
    <svg width="14" height="22" viewBox="0 0 14 22" fill="none" aria-hidden="true">
      <path d="M12 2 L3 11 L12 20" stroke="#595959" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}
function ChevronRight() {
  return (
    <svg width="14" height="22" viewBox="0 0 14 22" fill="none" aria-hidden="true">
      <path d="M2 2 L11 11 L2 20" stroke="#595959" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

function SaveButton({ enabled, onClick }: { enabled: boolean; onClick: () => void }) {
  const t = useT()
  if (enabled) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="w-full px-[12px] py-[14px] rounded-[6px] border border-brand-primary bg-brand-primary text-white font-inter font-medium text-center text-[24px] tracking-[0.0066em] transition-opacity active:opacity-90"
      >
        {t('Save Configuration')}
      </button>
    )
  }
  return (
    <button
      type="button"
      disabled
      className="w-full px-[12px] py-[14px] rounded-[6px] border border-[#eaeaea] bg-btn-secondary-bg text-[#a6a6a6] font-inter font-medium text-center text-[24px] tracking-[0.0066em] cursor-not-allowed"
    >
      {t('Save Configuration')}
    </button>
  )
}
