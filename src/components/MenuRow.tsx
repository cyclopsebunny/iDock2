import { ChevronRightIcon } from '../icons/Icons'

type Props = {
  label: string
  status?: string
  onClick?: () => void
}

export function MenuRow({ label, status, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-[6px] bg-btn-secondary-bg border border-btn-secondary-stroke rounded-[6px] pl-[18px] pr-[8px] py-[14px] text-left transition-colors active:bg-[#ebebeb]"
    >
      <span className="flex-1 font-inter font-medium text-btn-secondary-label text-[24px] leading-none tracking-[0.0066em]">
        {label}
      </span>
      {status && (
        <span className="font-inter font-bold text-btn-secondary-label text-[20px] leading-none tracking-[0.0066em] whitespace-nowrap">
          {status}
        </span>
      )}
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
