import { useEffect, useRef, useState } from 'react'
import { useT } from '../i18n/LanguageContext'
import { ChevronRightIcon } from '../icons/Icons'
import { MenuModal } from './MenuModal'
import { MenuRow } from './MenuRow'
import { PagingFooter } from './PagingFooter'

type Props = { onBack: () => void; onClose: () => void }

type IoRow = { letter: string; label: string; enabled: boolean }

const IO_ROWS: IoRow[] = [
  { letter: 'C', label: 'E-Stop', enabled: true },
  { letter: 'C', label: 'E-Guide Lights', enabled: true },
  { letter: 'C', label: 'Edge Lights', enabled: false },
  { letter: 'C', label: 'Below End Load', enabled: false },
  { letter: 'C', label: 'Auto Raise', enabled: true },
  { letter: 'C', label: 'Self Contained', enabled: true },
]

export function Diagnostics({ onBack, onClose }: Props) {
  const t = useT()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canUp, setCanUp] = useState(false)
  const [canDown, setCanDown] = useState(false)

  const recompute = () => {
    const el = scrollRef.current
    if (!el) return
    setCanUp(el.scrollTop > 1)
    setCanDown(el.scrollTop + el.clientHeight < el.scrollHeight - 1)
  }

  useEffect(() => {
    recompute()
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', recompute)
    return () => el.removeEventListener('scroll', recompute)
  }, [])

  return (
    <MenuModal title="Diagnostics" onBack={onBack} onClose={onClose}>
      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden no-scrollbar flex flex-col gap-[10px]"
        style={{ scrollbarWidth: 'none' }}
      >
        <style>{`.no-scrollbar::-webkit-scrollbar{display:none}`}</style>
        <MenuRow label={t('Controller Info')} />
        <NavRowMultiline
          label={t('Date & Time')}
          statusLines={['8/6/24', '12:00']}
        />
        <MenuRow label={t('Next Preventative Maintenance')} status="10/1/24" />
        <MenuRow label={t('Max Days to PM')} status="90" />
        <MenuRow label={t('Controller I/O')} />
        {IO_ROWS.map((row, i) => (
          <IoStateRow
            key={i}
            letter={row.letter}
            label={t(row.label)}
            enabled={row.enabled}
            enabledLabel={t('Enabled')}
            disabledLabel={t('Disabled')}
          />
        ))}
      </div>

      <PagingFooter
        canUp={canUp}
        canDown={canDown}
        onUp={() => scrollRef.current?.scrollBy({ top: -220, behavior: 'smooth' })}
        onDown={() => scrollRef.current?.scrollBy({ top: 220, behavior: 'smooth' })}
      />
    </MenuModal>
  )
}

function NavRowMultiline({
  label,
  statusLines,
}: {
  label: string
  statusLines: string[]
}) {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-[6px] bg-btn-secondary-bg border border-btn-secondary-stroke rounded-[6px] pl-[18px] pr-[8px] py-[14px] text-left transition-colors active:bg-[#ebebeb]"
    >
      <span className="flex-1 font-inter font-medium text-btn-secondary-label text-[24px] leading-none tracking-[0.0066em]">
        {label}
      </span>
      <div
        className="font-inter font-bold text-btn-secondary-label text-[20px] leading-tight tracking-[0.0066em] text-right whitespace-nowrap"
        style={{ width: 120 }}
      >
        {statusLines.map((line, i) => (
          <p key={i} className={i > 0 ? 'mt-[2px]' : ''}>
            {line}
          </p>
        ))}
      </div>
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

function IoStateRow({
  letter,
  label,
  enabled,
  enabledLabel,
  disabledLabel,
}: {
  letter: string
  label: string
  enabled: boolean
  enabledLabel: string
  disabledLabel: string
}) {
  return (
    <div
      className="shrink-0 flex items-center gap-[8px] rounded-[6px] border border-btn-secondary-stroke bg-btn-secondary-bg pl-[8px] overflow-hidden"
      style={{ height: 64 }}
    >
      <div
        className="shrink-0 bg-brand-primary text-white rounded-[4px] flex items-center justify-center"
        style={{ width: 38, height: 48 }}
      >
        <span className="font-inter font-medium text-[28px] leading-none">{letter}</span>
      </div>
      <span className="flex-1 pl-[8px] font-inter font-medium text-btn-secondary-label text-[24px] leading-none tracking-[0.0066em]">
        {label}
      </span>
      <span className="font-inter font-bold text-btn-secondary-label text-[20px] leading-none tracking-[0.0066em] whitespace-nowrap pr-[8px]">
        {enabled ? enabledLabel : disabledLabel}
      </span>
      <span
        className="shrink-0 self-stretch"
        style={{
          width: 13,
          background: enabled ? '#6ac449' : '#d13b0b',
          boxShadow: 'inset 0 0 6px rgba(255,255,255,0.25)',
        }}
      />
    </div>
  )
}
