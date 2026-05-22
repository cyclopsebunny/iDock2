import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useT } from '../i18n/LanguageContext'
import {
  ControllerIcon,
  DoorIcon,
  LevelerIcon,
  LockIcon,
} from '../icons/EquipmentIcons'
import { MenuModal } from './MenuModal'
import { PagingFooter } from './PagingFooter'

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

  // When the content size changes (showDetails toggling), the pager
  // visibility has a feedback loop: the pager itself shrinks the scroll
  // area, which can keep canDown=true even if the un-paged content would
  // fit. To break the loop we pessimistically hide the pager and reset
  // scroll position synchronously, then re-measure after React has
  // rendered the larger (un-paged) scroll area.
  useLayoutEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = 0
    setCanUp(false)
    setCanDown(false)
  }, [showDetails])

  useEffect(() => {
    // Runs after the layout-effect's re-render with both flags false. By
    // now the scroll container is at its full (un-paged) height, so a
    // recompute correctly decides whether the pager is actually needed.
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
    <MenuModal title="Equipment Info" onBack={onBack} onClose={onClose}>
      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-[40px]"
        style={{ scrollbarWidth: 'none' }}
      >
          {/* Hide WebKit scrollbar */}
          <style>{`.no-scrollbar::-webkit-scrollbar{display:none}`}</style>
          <div className="no-scrollbar pb-[24px]">
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

      <PagingFooter
        canUp={canUp}
        canDown={canDown}
        onUp={() => scrollBy(-PAGE_STEP)}
        onDown={() => scrollBy(PAGE_STEP)}
      />
    </MenuModal>
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

