import {
  DoorIcon,
  ForkliftIcon,
  LevelerIcon,
  LockIcon,
  LockXIcon,
  TrailerIcon,
} from '../icons/EquipmentIcons'
import { BackArrowIcon, ChevronRightIcon, CloseIcon } from '../icons/Icons'

type Props = {
  onBack: () => void
  onClose: () => void
}

const ALERT_RED = '#9E2D08'

export function Counters({ onBack, onClose }: Props) {
  return (
    <div className="absolute inset-0 flex items-end" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0 bg-black/45"
      />
      <div
        className="relative flex flex-col gap-[8px] bg-white rounded-[12px] shadow-panel"
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
            Counters
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

        <div className="flex flex-col gap-[12px] w-full">
          <div className="flex gap-[12px] w-full">
            <StatCard
              icon={<LockIcon className="h-full w-full" />}
              iconBox={50}
              label="Restraint Cycles"
              value="23658"
            />
            <StatCard
              icon={<LockXIcon className="h-full w-full" />}
              iconBox={50}
              label="Restraint Bypass"
              value="854"
              color={ALERT_RED}
            />
          </div>
          <div className="flex gap-[12px] w-full">
            <StatCard
              icon={<DoorIcon className="h-[42px]" />}
              iconBox={50}
              label="Door Cycles"
              value="23658"
            />
            <StatCard
              icon={<LevelerIcon className="h-full w-full" />}
              iconBox={50}
              label="Leveler Cycles"
              value="23658"
            />
          </div>
          <div className="flex gap-[12px] w-full">
            <StatCard
              icon={<TrailerIcon className="w-[46px] h-[44px]" />}
              iconBox={50}
              label="Trailer Present"
              value="11503"
            />
            <StatCard
              icon={<ForkliftIcon className="h-[50px] w-[50px]" />}
              iconBox={50}
              label="Forklift Activity"
              value="5,842,563"
            />
          </div>
        </div>

        <NavRow label="Recordings" value="500" />
        <NavRow label="Fault Counters" value="324" />
        <NavRow label="Door Code Counters" value="12" />
      </div>
    </div>
  )
}

function StatCard({
  icon,
  iconBox,
  label,
  value,
  color,
}: {
  icon: React.ReactNode
  iconBox: number
  label: string
  value: string
  color?: string
}) {
  const textColor = color ?? '#595959'
  const labelColor = color ?? '#009cde'
  return (
    <div
      className="flex-1 flex flex-col items-center justify-center bg-btn-secondary-bg border border-btn-secondary-stroke rounded-[8px] p-[8px]"
      style={{
        height: 130,
        minHeight: 114,
        filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.15))',
        color: textColor,
      }}
    >
      <div
        className="flex items-center justify-center shrink-0"
        style={{ width: iconBox, height: iconBox }}
      >
        {icon}
      </div>
      <div className="flex flex-col items-center justify-center text-center w-full mt-[4px]">
        <p
          className="font-inter font-normal text-[16px] leading-none"
          style={{ color: labelColor }}
        >
          {label}
        </p>
        <p
          className="font-inter font-semibold text-[24px] leading-[1.15] whitespace-nowrap overflow-hidden text-ellipsis w-full"
        >
          {value}
        </p>
      </div>
    </div>
  )
}

function NavRow({
  label,
  value,
  onClick,
}: {
  label: string
  value: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-[6px] bg-btn-secondary-bg border border-btn-secondary-stroke rounded-[6px] pl-[18px] pr-[8px] py-[14px] text-left transition-colors active:bg-[#ebebeb]"
    >
      <span className="flex-1 font-inter font-medium text-btn-secondary-label text-[24px] leading-none tracking-[0.0066em]">
        {label}
      </span>
      <span
        className="font-inter font-bold text-btn-secondary-label text-[20px] leading-none tracking-[0.0066em] text-right whitespace-nowrap"
        style={{ width: 120 }}
      >
        {value}
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
