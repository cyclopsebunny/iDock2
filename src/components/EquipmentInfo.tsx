import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useT } from '../i18n/LanguageContext'
import {
  ControllerIcon,
  DoorIcon,
  LevelerIcon,
  LockIcon,
} from '../icons/EquipmentIcons'
import { BackArrowIcon, ChevronRightIcon, CloseIcon } from '../icons/Icons'

type Props = {
  doorNumber: string
  onBack: () => void
  onClose: () => void
}

const PAGE_STEP = 220

export function EquipmentInfo({ doorNumber, onBack, onClose }: Props) {
  const t = useT()
  const [showDetails, setShowDetails] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canUp, setCanUp] = useState(false)
  const [canDown, setCanDown] = useState(false)

  const recompute = () => {
    const el = scrollRef.current
    if (!el) return
    setCanUp(el.scrollTop > 1)
    setCanDown(el.scrollTop + el.clientHeight < el.scrollHeight - 1)
  }

  // Recompute on mount, on content change, and on scroll.
  useLayoutEffect(() => {
    recompute()
  }, [showDetails])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', recompute)
    return () => el.removeEventListener('scroll', recompute)
  }, [])

  const scrollBy = (delta: number) => {
    scrollRef.current?.scrollBy({ top: delta, behavior: 'smooth' })
  }

  return (
    <div className="absolute inset-0 flex items-end" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0"
      />
      <div
        className="relative flex flex-col bg-white rounded-[12px] shadow-panel overflow-hidden"
        style={{ width: 448, height: 768, padding: 8, marginLeft: 16, marginBottom: 16 }}
      >
        <div className="flex h-[66px] items-center gap-[12px] px-[16px] shrink-0">
          <button
            type="button"
            aria-label="Back to Main Menu"
            onClick={onBack}
            className="shrink-0 text-brand-primary"
            style={{ width: 36, height: 36 }}
          >
            <BackArrowIcon className="h-full w-full" />
          </button>
          <h2 className="flex-1 text-center font-inter font-semibold text-brand-primary text-[28px] leading-[30px]">
            {t('Equipment Info')}
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

        <div
          ref={scrollRef}
          className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-[40px]"
          style={{ scrollbarWidth: 'none' }}
        >
          {/* Hide WebKit scrollbar */}
          <style>{`.no-scrollbar::-webkit-scrollbar{display:none}`}</style>
          <div className="no-scrollbar py-[24px]">
            <ControllerSection
              showDetails={showDetails}
              onToggle={() => setShowDetails((v) => !v)}
            />

            <Divider />

            <Section
              icon={<LockIcon className="h-full w-full text-btn-secondary-label" />}
              iconBox={116}
              rows={[
                { label: t('Model'), value: t('Restraint Model') },
                { label: t('Serial #'), value: '1234567890' },
                { label: t('Installed on:'), value: '07/24/2024' },
              ]}
            />

            <Divider />

            <Section
              icon={<LevelerIcon className="h-full w-full text-btn-secondary-label" />}
              iconBox={116}
              rows={[
                { label: t('Model'), value: t('Leveler Model') },
                { label: t('Serial #'), value: '1234567890' },
                { label: t('Installed on:'), value: '07/24/2024' },
              ]}
            />

            <Divider />

            <Section
              icon={
                <div className="flex items-center justify-center w-[116px]">
                  <DoorIcon className="text-btn-secondary-label" />
                </div>
              }
              iconBox={116}
              rows={[
                { label: t('Door #'), value: doorNumber, valueSize: 40 },
                { label: t('Status'), value: t('CLOSED') },
              ]}
            />
          </div>
        </div>

        <PagingButtons
          canUp={canUp}
          canDown={canDown}
          onUp={() => scrollBy(-PAGE_STEP)}
          onDown={() => scrollBy(PAGE_STEP)}
        />
      </div>
    </div>
  )
}

function ControllerSection({
  showDetails,
  onToggle,
}: {
  showDetails: boolean
  onToggle: () => void
}) {
  const t = useT()
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-[12px] py-[24px]">
        <div className="shrink-0 text-btn-secondary-label" style={{ width: 110, height: 110 }}>
          <ControllerIcon className="h-full w-full" />
        </div>
        <div className="flex flex-col justify-between self-stretch">
          <div className="flex flex-col">
            <p className="font-inter text-[18px] text-accent-blue leading-none whitespace-nowrap">
              {t('iDock 2.0 Controller')}
            </p>
            <p className="font-inter font-semibold text-[30px] text-btn-secondary-label leading-[29.187px] whitespace-nowrap mt-[6px]">
              1234567890
            </p>
          </div>
          <button
            type="button"
            onClick={onToggle}
            className="bg-btn-secondary-bg border border-btn-secondary-stroke rounded-[4px] px-[12px] py-[6px] mt-[8px] w-[181px] font-inter font-medium text-[20px] text-btn-secondary-label text-center tracking-[0.0066em] transition-colors active:bg-[#ebebeb]"
          >
            {showDetails ? t('Hide Details') : t('Show Details')}
          </button>
        </div>
      </div>
      {showDetails && <ControllerDetails />}
    </div>
  )
}

function ControllerDetails() {
  const t = useT()
  return (
    <div className="flex flex-col gap-[10px] pb-[4px]">
      <div className="flex flex-col">
        <DetailRow label={t('Main Brd. SW Version:')} value="1.0.0" />
        <DetailRow label={t('Main Brd. HW Version:')} value="1.000" />
      </div>
      <ThinDivider />
      <div className="flex flex-col">
        <DetailRow label={t('Commission Date:')} value="mm/dd/yyyy" />
        <DetailRow label={t('Install Date:')} value="mm/dd/yyyy" />
        <DetailRow label={t('Current Set Date:')} value="mm/dd/yyyy" />
      </div>
      <ThinDivider />
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-[16px] py-[5.837px]">
      <p
        className="font-inter text-[14px] text-accent-blue leading-none whitespace-nowrap"
        style={{ width: 160 }}
      >
        {label}
      </p>
      <p className="font-inter font-semibold text-[22px] text-btn-secondary-label leading-none whitespace-nowrap">
        {value}
      </p>
    </div>
  )
}

type SectionRow = { label: string; value: string; valueSize?: number }

function Section({
  icon,
  iconBox,
  rows,
}: {
  icon: React.ReactNode
  iconBox: number
  rows: SectionRow[]
}) {
  return (
    <div className="flex items-center gap-[24px] py-[16px]">
      <div className="shrink-0" style={{ width: iconBox, height: iconBox }}>
        {icon}
      </div>
      <div className="flex flex-col items-start py-[5.837px]">
        {rows.map((r, i) => (
          <div key={i} className="flex flex-col">
            <p className="font-inter text-[14px] text-accent-blue leading-none whitespace-nowrap">
              {r.label}
            </p>
            <p
              className={`font-inter font-${r.valueSize === 40 ? 'bold' : 'semibold'} text-btn-secondary-label whitespace-nowrap`}
              style={{
                fontSize: r.valueSize ?? 22,
                lineHeight: r.valueSize === 40 ? '40px' : 'normal',
              }}
            >
              {r.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function Divider() {
  return (
    <div className="w-full border-t-2 border-btn-secondary-stroke" style={{ borderColor: '#b0b0b0' }} />
  )
}

function ThinDivider() {
  return <div className="w-full border-t" style={{ borderColor: '#e5e5e5' }} />
}

function PagingButtons({
  canUp,
  canDown,
  onUp,
  onDown,
}: {
  canUp: boolean
  canDown: boolean
  onUp: () => void
  onDown: () => void
}) {
  return (
    <div
      className="shrink-0 flex items-stretch border-t border-btn-secondary-stroke bg-white px-[8px] pt-[16px] pb-[8px]"
      style={{ boxShadow: '0 -4px 6px rgba(0,0,0,0.25)' }}
    >
      <PagingButton direction="up" disabled={!canUp} onClick={onUp} />
      <PagingButton direction="down" disabled={!canDown} onClick={onDown} />
    </div>
  )
}

function PagingButton({
  direction,
  disabled,
  onClick,
}: {
  direction: 'up' | 'down'
  disabled: boolean
  onClick: () => void
}) {
  const rounded = direction === 'up' ? 'rounded-l-[8px]' : 'rounded-r-[8px]'
  const baseStyles = disabled
    ? 'bg-white border-[#eaeaea] text-[#a6a6a6] cursor-not-allowed'
    : 'bg-btn-secondary-bg border-btn-secondary-stroke text-btn-secondary-label cursor-pointer active:bg-[#ebebeb]'
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'up' ? 'Scroll up' : 'Scroll down'}
      className={`flex-1 h-[62px] flex items-center justify-center border ${rounded} ${baseStyles}`}
      style={{ boxShadow: '1px 1px 4px 0 rgba(0,0,0,0.15)' }}
    >
      <span
        className="block"
        style={{
          width: 30,
          height: 30,
          transform: direction === 'up' ? 'rotate(-90deg)' : 'rotate(90deg)',
        }}
      >
        <ChevronRightIcon className="h-full w-full" />
      </span>
    </button>
  )
}
