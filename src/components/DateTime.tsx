import { useEffect, useRef, useState } from 'react'
import { useT } from '../i18n/LanguageContext'
import { CalendarIcon, ClockIcon } from '../icons/EquipmentIcons'
import { ChevronRightIcon } from '../icons/Icons'
import { MenuModal } from './MenuModal'
import { MenuRow } from './MenuRow'
import { PagingFooter } from './PagingFooter'
import { SaveButton } from './SaveButton'

type CommonProps = { onBack: () => void; onClose: () => void }

export type DateFormat = 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'DD/MM/YY' | 'MM/DD/YY'

export type TimeZone =
  | 'Hawaii Time Zone'
  | 'Alaska Time Zone'
  | 'Pacific Time Zone'
  | 'Mountain Time Zone'
  | 'Central Time Zone'
  | 'Eastern Time Zone'

export type LocalDateTime = {
  month: number // 1..12
  day: number // 1..31
  year: number
  hour: number // 1..12
  minute: number // 0..59
  meridiem: 'AM' | 'PM'
}

// ──────────────────────────────────────────────────────────────────────────
// Shared chrome
// ──────────────────────────────────────────────────────────────────────────

function DateTimePanel({
  title,
  onBack,
  onClose,
  children,
  gap = 10,
}: {
  title: string
  onBack: () => void
  onClose: () => void
  children: React.ReactNode
  gap?: number
}) {
  return (
    <MenuModal title={title} onBack={onBack} onClose={onClose} gap={gap}>
      {children}
    </MenuModal>
  )
}

// ──────────────────────────────────────────────────────────────────────────
// Date & Time landing
// ──────────────────────────────────────────────────────────────────────────

type DateTimeMenuProps = CommonProps & {
  dateFormat: DateFormat
  localDateTime: LocalDateTime
  timeZone: TimeZone
  onOpenDateFormat: () => void
  onOpenLocalDateTime: () => void
  onOpenTimeZone: () => void
}

export function DateTimeMenu({
  dateFormat,
  localDateTime,
  timeZone,
  onBack,
  onClose,
  onOpenDateFormat,
  onOpenLocalDateTime,
  onOpenTimeZone,
}: DateTimeMenuProps) {
  const t = useT()
  return (
    <DateTimePanel title={t('Date & Time')} onBack={onBack} onClose={onClose}>
      <MenuRow label={t('Date Format')} status={dateFormat} onClick={onOpenDateFormat} />
      <MenuRow
        label={t('Local Date & Time')}
        status={formatDate(localDateTime, dateFormat)}
        onClick={onOpenLocalDateTime}
      />
      <MenuRow label={t('Time Zone')} status={t(timeZone)} onClick={onOpenTimeZone} />
    </DateTimePanel>
  )
}

function formatDate(dt: LocalDateTime, fmt: DateFormat): string {
  const mm = String(dt.month)
  const dd = String(dt.day)
  const yyyy = String(dt.year)
  const yy = yyyy.slice(-2)
  if (fmt === 'DD/MM/YYYY') return `${dd}/${mm}/${yyyy}`
  if (fmt === 'MM/DD/YYYY') return `${mm}/${dd}/${yyyy}`
  if (fmt === 'DD/MM/YY') return `${dd}/${mm}/${yy}`
  return `${mm}/${dd}/${yy}`
}

// ──────────────────────────────────────────────────────────────────────────
// Date Format
// ──────────────────────────────────────────────────────────────────────────

const FORMAT_OPTIONS: DateFormat[] = ['DD/MM/YYYY', 'MM/DD/YYYY', 'DD/MM/YY', 'MM/DD/YY']

export function DateFormatScreen({
  value,
  onSave,
  onBack,
  onClose,
}: CommonProps & { value: DateFormat; onSave: (v: DateFormat) => void }) {
  const t = useT()
  const [draft, setDraft] = useState<DateFormat>(value)
  const dirty = draft !== value
  return (
    <DateTimePanel title={t('Date Format')} onBack={onBack} onClose={onClose}>
      {FORMAT_OPTIONS.map((opt) => {
        const selected = draft === opt
        return (
          <button
            key={opt}
            type="button"
            onClick={() => setDraft(opt)}
            className={`w-full px-[8px] py-[14px] rounded-[6px] border text-center font-inter font-medium text-[24px] tracking-[0.0066em] transition-colors ${
              selected
                ? 'bg-accent-blue border-accent-blue text-white'
                : 'bg-btn-secondary-bg border-btn-secondary-stroke text-btn-secondary-label active:bg-[#ebebeb]'
            }`}
          >
            {opt}
          </button>
        )
      })}
      <div className="flex-1" />
      <SaveButton enabled={dirty} onClick={() => onSave(draft)} label="Save Date Format" />
    </DateTimePanel>
  )
}

// ──────────────────────────────────────────────────────────────────────────
// Local Date & Time
// ──────────────────────────────────────────────────────────────────────────

const daysInMonth = (m: number, y: number) => new Date(y, m, 0).getDate()

export function LocalDateTimeScreen({
  value,
  onSave,
  onBack,
  onClose,
}: CommonProps & { value: LocalDateTime; onSave: (v: LocalDateTime) => void }) {
  const t = useT()
  const [draft, setDraft] = useState<LocalDateTime>(value)
  const dirty = JSON.stringify(draft) !== JSON.stringify(value)

  const setMonth = (m: number) => {
    const month = ((m - 1 + 12) % 12) + 1
    const maxDay = daysInMonth(month, draft.year)
    setDraft({ ...draft, month, day: Math.min(draft.day, maxDay) })
  }
  const setDay = (d: number) => {
    const max = daysInMonth(draft.month, draft.year)
    const day = ((d - 1 + max) % max) + 1
    setDraft({ ...draft, day })
  }
  const setYear = (y: number) => setDraft({ ...draft, year: y })
  const setHour = (h: number) => {
    const hour = ((h - 1 + 12) % 12) + 1
    setDraft({ ...draft, hour })
  }
  const setMinute = (m: number) => {
    const minute = ((m + 60) % 60)
    setDraft({ ...draft, minute })
  }
  const toggleMeridiem = () =>
    setDraft({ ...draft, meridiem: draft.meridiem === 'AM' ? 'PM' : 'AM' })

  return (
    <DateTimePanel title={t('Local Date & Time')} onBack={onBack} onClose={onClose} gap={8}>
      <SectionHeader icon={<CalendarIcon className="text-btn-secondary-label" />} label={t('Local Date')} />
      <SpinnerGroup>
        <Spinner value={String(draft.month)} onUp={() => setMonth(draft.month + 1)} onDown={() => setMonth(draft.month - 1)} />
        <Separator>/</Separator>
        <Spinner value={String(draft.day)} onUp={() => setDay(draft.day + 1)} onDown={() => setDay(draft.day - 1)} />
        <Separator>/</Separator>
        <Spinner value={String(draft.year)} onUp={() => setYear(draft.year + 1)} onDown={() => setYear(draft.year - 1)} />
      </SpinnerGroup>

      <SectionHeader icon={<ClockIcon className="text-btn-secondary-label" />} label={t('Local Time')} />
      <SpinnerGroup>
        <Spinner value={String(draft.hour)} onUp={() => setHour(draft.hour + 1)} onDown={() => setHour(draft.hour - 1)} />
        <Separator>:</Separator>
        <Spinner
          value={String(draft.minute).padStart(2, '0')}
          onUp={() => setMinute(draft.minute + 1)}
          onDown={() => setMinute(draft.minute - 1)}
        />
        <Separator> </Separator>
        <Spinner value={draft.meridiem} onUp={toggleMeridiem} onDown={toggleMeridiem} />
      </SpinnerGroup>

      <div className="flex-1" />
      <SaveButton enabled={dirty} onClick={() => onSave(draft)} />
    </DateTimePanel>
  )
}

function SectionHeader({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-[12px] mt-[4px]">
      <span style={{ width: 34, height: 34 }}>{icon}</span>
      <span className="font-inter font-medium text-btn-secondary-label text-[24px] leading-none">
        {label}
      </span>
    </div>
  )
}

function SpinnerGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full rounded-[6px] border border-btn-secondary-stroke bg-btn-secondary-bg p-[8px]">
      <div className="flex items-stretch justify-between gap-[4px]">{children}</div>
    </div>
  )
}

function Separator({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center font-inter font-medium text-btn-secondary-label text-[28px]">
      {children}
    </div>
  )
}

function Spinner({
  value,
  onUp,
  onDown,
}: {
  value: string
  onUp: () => void
  onDown: () => void
}) {
  return (
    <div className="flex flex-1 flex-col items-stretch min-w-0">
      <StepperBtn direction="up" onClick={onUp} />
      <div className="py-[8px] text-center font-inter font-medium text-btn-secondary-label text-[28px] leading-none whitespace-nowrap">
        {value}
      </div>
      <StepperBtn direction="down" onClick={onDown} />
    </div>
  )
}

function StepperBtn({
  direction,
  onClick,
}: {
  direction: 'up' | 'down'
  onClick: () => void
}) {
  const rounded = direction === 'up' ? 'rounded-t-[8px]' : 'rounded-b-[8px]'
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === 'up' ? 'Increase' : 'Decrease'}
      className={`h-[44px] flex items-center justify-center bg-btn-secondary-bg border border-btn-secondary-stroke ${rounded} active:bg-[#ebebeb]`}
      style={{ boxShadow: '1px 1px 4px 0 rgba(0,0,0,0.15)' }}
    >
      <span
        className="text-btn-secondary-label"
        style={{
          width: 22,
          height: 22,
          transform: direction === 'up' ? 'rotate(-90deg)' : 'rotate(90deg)',
        }}
      >
        <ChevronRightIcon className="h-full w-full" />
      </span>
    </button>
  )
}

// ──────────────────────────────────────────────────────────────────────────
// Time Zone
// ──────────────────────────────────────────────────────────────────────────

const ZONES: TimeZone[] = [
  'Hawaii Time Zone',
  'Alaska Time Zone',
  'Pacific Time Zone',
  'Mountain Time Zone',
  'Central Time Zone',
  'Eastern Time Zone',
]

export function TimeZoneScreen({
  value,
  onSave,
  onBack,
  onClose,
}: CommonProps & { value: TimeZone; onSave: (v: TimeZone) => void }) {
  const t = useT()
  const [draft, setDraft] = useState<TimeZone>(value)
  const dirty = draft !== value

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
    <DateTimePanel title={t('Time Zone')} onBack={onBack} onClose={onClose}>
      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto no-scrollbar flex flex-col gap-[10px]"
        style={{ scrollbarWidth: 'none' }}
      >
        <style>{`.no-scrollbar::-webkit-scrollbar{display:none}`}</style>
        {ZONES.map((z) => {
          const selected = draft === z
          return (
            <button
              key={z}
              type="button"
              onClick={() => setDraft(z)}
              className={`w-full px-[18px] py-[14px] rounded-[6px] border text-left font-inter font-medium text-[24px] tracking-[0.0066em] transition-colors ${
                selected
                  ? 'bg-accent-blue border-accent-blue text-white'
                  : 'bg-btn-secondary-bg border-btn-secondary-stroke text-btn-secondary-label active:bg-[#ebebeb]'
              }`}
            >
              {t(z)}
            </button>
          )
        })}
      </div>
      <SaveButton enabled={dirty} onClick={() => onSave(draft)} />
      <PagingFooter
        canUp={canUp}
        canDown={canDown}
        onUp={() => scrollRef.current?.scrollBy({ top: -200, behavior: 'smooth' })}
        onDown={() => scrollRef.current?.scrollBy({ top: 200, behavior: 'smooth' })}
      />
    </DateTimePanel>
  )
}

