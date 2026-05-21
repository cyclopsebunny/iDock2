import { ChevronRightIcon } from '../icons/Icons'

type Props = {
  canUp: boolean
  canDown: boolean
  onUp: () => void
  onDown: () => void
}

/**
 * The bottom-of-panel "scroll up / scroll down" pager used on screens whose
 * content is taller than the panel. Matches the Equipment Info design.
 *
 * Place this as a sibling of a scrollable flex-1 region inside a panel with
 * `padding: 8`. It bleeds into that 8px padding via negative margins so the
 * top border and drop shadow sit flush with the panel edge.
 */
export function PagingFooter({ canUp, canDown, onUp, onDown }: Props) {
  return (
    <div
      className="shrink-0 flex items-stretch border-t border-btn-secondary-stroke bg-white -mx-[8px] -mb-[8px] px-[8px] pt-[16px] pb-[8px]"
      style={{ boxShadow: '0 -4px 6px rgba(0,0,0,0.25)' }}
    >
      <PagerButton direction="up" disabled={!canUp} onClick={onUp} />
      <PagerButton direction="down" disabled={!canDown} onClick={onDown} />
    </div>
  )
}

function PagerButton({
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
