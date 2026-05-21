import { useEffect, useRef, useState } from 'react'
import { useT } from '../i18n/LanguageContext'
import { CalendarIcon } from '../icons/EquipmentIcons'
import { BackArrowIcon, ChevronRightIcon, CloseIcon } from '../icons/Icons'
import { MenuRow } from './MenuRow'

type CommonProps = {
  onBack: () => void
  onClose: () => void
}

// ────────────────────────────────────────────────────────────────────────────
// Shared chrome
// ────────────────────────────────────────────────────────────────────────────

export function MaintenancePanel({
  title,
  onBack,
  onClose,
  children,
  gap = 8,
}: {
  title: string
  onBack: () => void
  onClose: () => void
  children: React.ReactNode
  gap?: number
}) {
  return (
    <div className="absolute inset-0 flex items-end" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0 bg-black/45"
      />
      <div
        className="relative flex flex-col bg-white rounded-[12px] shadow-panel"
        style={{ width: 448, height: 768, padding: 8, marginLeft: 16, marginBottom: 16, gap }}
      >
        <div className="flex h-[66px] items-center gap-[12px] px-[16px] shrink-0">
          <button
            type="button"
            aria-label="Back"
            onClick={onBack}
            className="shrink-0 text-brand-primary"
            style={{ width: 36, height: 36 }}
          >
            <BackArrowIcon className="h-full w-full" />
          </button>
          <h2 className="flex-1 text-center font-inter font-semibold text-brand-primary text-[28px] leading-[30px]">
            {title}
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
        {children}
      </div>
    </div>
  )
}

function InfoAlert({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-[6px] border-2 px-[14px] py-[14px] text-center"
      style={{ background: '#edf9ff', borderColor: '#a8def9' }}
    >
      <p
        className="font-inter font-medium text-[24px] leading-[1.2] tracking-[0.0066em]"
        style={{ color: '#003b5c' }}
      >
        {children}
      </p>
    </div>
  )
}

function AccentButton({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-[6px] border border-accent-blue bg-accent-blue text-white font-inter font-medium text-center text-[24px] tracking-[0.0066em] px-[8px] py-[14px] transition-opacity active:opacity-90"
    >
      {children}
    </button>
  )
}

function DestructiveButton({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-[6px] border border-panel-red-stroke bg-panel-red text-white font-inter font-medium text-center text-[24px] tracking-[0.0066em] px-[8px] py-[14px] transition-opacity active:opacity-90"
    >
      {children}
    </button>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Screens
// ────────────────────────────────────────────────────────────────────────────

type MaintenanceMenuProps = CommonProps & {
  nextPmDate: string
  onOpenEntry: () => void
  onOpenRecords: () => void
}

export function MaintenanceMenu({
  nextPmDate,
  onBack,
  onClose,
  onOpenEntry,
  onOpenRecords,
}: MaintenanceMenuProps) {
  const t = useT()
  return (
    <MaintenancePanel title={t('Maintenance')} onBack={onBack} onClose={onClose}>
      <MenuRow label={t('Maintenance Entry')} onClick={onOpenEntry} />
      <MenuRow label={t('Maintenance Records')} status={nextPmDate} onClick={onOpenRecords} />
    </MaintenancePanel>
  )
}

type MaintenanceEntryProps = CommonProps & {
  onOpenPM: () => void
  onOpenRestraint: () => void
  onOpenLeveler: () => void
  onOpenDoor: () => void
}

export function MaintenanceEntry({
  onBack,
  onClose,
  onOpenPM,
  onOpenRestraint,
  onOpenLeveler,
  onOpenDoor,
}: MaintenanceEntryProps) {
  const t = useT()
  return (
    <MaintenancePanel title={t('Maintenance Entry')} onBack={onBack} onClose={onClose}>
      <MenuRow label={t('Preventative Maintenance')} onClick={onOpenPM} />
      <MenuRow label={t('Restraint')} onClick={onOpenRestraint} />
      <MenuRow label={t('Leveler')} onClick={onOpenLeveler} />
      <MenuRow label={t('Door')} onClick={onOpenDoor} />
    </MaintenancePanel>
  )
}

export function MaintenanceRecords({ onBack, onClose }: CommonProps) {
  const t = useT()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canUp, setCanUp] = useState(false)
  const [canDown, setCanDown] = useState(false)
  const records = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    name: t('Record Item Name'),
    date: '8/6/24',
    time: '12:00',
  }))

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
    <MaintenancePanel title={t('Maintenance Records')} onBack={onBack} onClose={onClose}>
      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden no-scrollbar flex flex-col gap-[8px]"
        style={{ scrollbarWidth: 'none' }}
      >
        <style>{`.no-scrollbar::-webkit-scrollbar{display:none}`}</style>
        {records.map((r) => (
          <button
            type="button"
            key={r.id}
            className="flex w-full items-center gap-[6px] bg-btn-secondary-bg border border-btn-secondary-stroke rounded-[6px] px-[18px] py-[14px] text-left transition-colors active:bg-[#ebebeb]"
          >
            <span className="flex-1 font-inter font-medium text-btn-secondary-label text-[24px] leading-none">
              {r.name}
            </span>
            <span className="flex flex-col items-end text-btn-secondary-label">
              <span className="font-inter font-bold text-[18px] leading-tight">{r.date}</span>
              <span className="font-inter font-bold text-[18px] leading-tight">{r.time}</span>
            </span>
          </button>
        ))}
      </div>
      <PagingButtons
        canUp={canUp}
        canDown={canDown}
        onUp={() => scrollRef.current?.scrollBy({ top: -220, behavior: 'smooth' })}
        onDown={() => scrollRef.current?.scrollBy({ top: 220, behavior: 'smooth' })}
      />
    </MaintenancePanel>
  )
}

type PMProps = CommonProps & {
  days: number
  onSetDays: (d: number) => void
  onResetWarning: () => void
  onSave: (days: number) => void
}

export function PreventativeMaintenance({
  days,
  onSetDays,
  onResetWarning,
  onSave,
  onBack,
  onClose,
}: PMProps) {
  const t = useT()
  const today = new Date()
  const next = new Date(today.getTime() + days * 86400000)
  const formatted = `${next.getMonth() + 1}/${next.getDate()}/${next.getFullYear()}`

  return (
    <MaintenancePanel
      title={t('Preventative Maintenance')}
      onBack={onBack}
      onClose={onClose}
      gap={12}
    >
      <InfoAlert>
        {t('Once PM has been completed,\nreset the warning and set the\nnext PM date.')
          .split('\n')
          .map((line, i, arr) => (
            <span key={i}>
              {line}
              {i < arr.length - 1 && <br />}
            </span>
          ))}
      </InfoAlert>
      <DestructiveButton onClick={onResetWarning}>{t('Reset PM Due Warning')}</DestructiveButton>

      <PmDateStepper
        days={days}
        formatted={formatted}
        onUp={() => onSetDays(Math.min(365, days + 1))}
        onDown={() => onSetDays(Math.max(1, days - 1))}
      />

      <div className="flex-1" />

      <AccentButton onClick={() => onSave(days)}>{t('Set Next PM Date')}</AccentButton>
    </MaintenancePanel>
  )
}

function PmDateStepper({
  days,
  formatted,
  onUp,
  onDown,
}: {
  days: number
  formatted: string
  onUp: () => void
  onDown: () => void
}) {
  const t = useT()
  return (
    <div className="flex flex-col gap-[12px] py-[8px]">
      <div className="flex items-center gap-[16px] px-[16px]">
        <CalendarIcon className="text-btn-secondary-label" />
        <p className="flex-1 font-inter font-medium text-btn-secondary-label text-[28px] leading-normal tracking-[0.0066em]">
          {t('Next PM Date')}
        </p>
      </div>

      <div className="w-full rounded-[6px] border border-btn-secondary-stroke bg-btn-secondary-bg p-[12px]">
        <div className="flex flex-col items-center w-full">
          <StepperButton direction="up" onClick={onUp} position="top" />
          <div className="flex items-center justify-center gap-[11px] py-[12px] w-full">
            <p className="font-inter font-medium text-btn-secondary-label text-[28px] leading-normal text-center tracking-[0.0066em]">
              {days}
            </p>
            <p className="font-inter font-medium text-btn-secondary-label text-[28px] leading-normal text-center tracking-[0.0066em]">
              {t('Days')}
            </p>
          </div>
          <StepperButton direction="down" onClick={onDown} position="bottom" />
        </div>
      </div>

      <p className="font-inter font-medium text-btn-secondary-label text-[28px] leading-normal text-center tracking-[0.0066em] h-[34px]">
        {formatted}
      </p>
    </div>
  )
}

function StepperButton({
  direction,
  onClick,
  position,
}: {
  direction: 'up' | 'down'
  onClick: () => void
  position: 'top' | 'bottom'
}) {
  const rounded =
    position === 'top' ? 'rounded-t-[8px]' : 'rounded-b-[8px]'
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === 'up' ? 'Increase' : 'Decrease'}
      className={`h-[62px] w-full flex items-center justify-center bg-btn-secondary-bg border border-btn-secondary-stroke ${rounded} active:bg-[#ebebeb] transition-colors`}
      style={{ boxShadow: '1px 1px 4px 0 rgba(0,0,0,0.15)' }}
    >
      <span
        className="block text-btn-secondary-label"
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

type TaskScreenProps = CommonProps & {
  title: string
  options: string[]
}

type LoggedAction = {
  kind: 'Repair' | 'Maintenance' | 'Part replacement'
  at: Date
}

const labelForButton = (label: string): LoggedAction['kind'] => {
  if (label === 'General Maintenance') return 'Maintenance'
  if (label === 'Replace Part') return 'Part replacement'
  // Anything starting with "Repair " (Repair Restraint / Leveler / Door)
  return 'Repair'
}

export function MaintenanceTaskScreen({
  title,
  options,
  onBack,
  onClose,
}: TaskScreenProps) {
  const t = useT()
  const [logged, setLogged] = useState<LoggedAction | null>(null)
  return (
    <MaintenancePanel title={t(title)} onBack={onBack} onClose={onClose} gap={12}>
      <InfoAlert>{t('Select the maintenance task that was completed:')}</InfoAlert>
      {options.map((label) => (
        <AccentButton
          key={label}
          onClick={() => setLogged({ kind: labelForButton(label), at: new Date() })}
        >
          {t(label)}
        </AccentButton>
      ))}
      {logged && <LoggedConfirmation action={logged} />}
    </MaintenancePanel>
  )
}

function LoggedConfirmation({ action }: { action: LoggedAction }) {
  const t = useT()
  const d = action.at
  const date = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`
  let h = d.getHours()
  const ampm = h >= 12 ? 'PM' : 'AM'
  h = h % 12
  if (h === 0) h = 12
  const mm = d.getMinutes().toString().padStart(2, '0')
  const time = `${h}:${mm} ${ampm}`
  const labelKey =
    action.kind === 'Repair'
      ? 'Repair logged:'
      : action.kind === 'Maintenance'
        ? 'Maintenance logged:'
        : 'Part replacement logged:'
  return (
    <div
      className="self-center flex flex-col items-center justify-center gap-[6px] rounded-[8px] border px-[24px] py-[12px]"
      style={{ background: '#eafde3', borderColor: '#d4ebcc', color: '#1d5807' }}
    >
      <p className="font-inter font-medium text-[24px] leading-none text-center tracking-[0.0066em] whitespace-nowrap">
        {t(labelKey)}
      </p>
      <div className="flex items-start gap-[10px]">
        <p className="font-inter font-medium text-[24px] leading-none text-center tracking-[0.0066em] whitespace-nowrap">
          {date}
        </p>
        <p className="font-inter font-medium text-[24px] leading-none text-center tracking-[0.0066em] whitespace-nowrap">
          {time}
        </p>
      </div>
    </div>
  )
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
      className="shrink-0 flex items-stretch border-t border-btn-secondary-stroke bg-white px-[8px] pt-[16px] pb-[8px] -mx-[8px] -mb-[8px]"
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
