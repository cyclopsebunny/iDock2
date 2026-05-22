import { ChevronRightIcon } from '../icons/Icons'

type Props = {
  canUp: boolean
  canDown: boolean
  onUp: () => void
  onDown: () => void
}

/**
 * The bottom-of-panel "scroll up / scroll down" pager used on screens whose
 * content is taller than the panel.
 *
 * Place this as a sibling of a scrollable `flex-1` region inside a
 * `<MenuModal>` (which already has `padding: 8`). The footer bleeds into
 * that 8px padding via negative margins so it sits flush with the panel
 * edges, and rounds its bottom corners to match the panel's `rounded-12`
 * bottom.
 *
 * The container background is a transparent → white gradient so content
 * scrolling under it fades into the white area instead of being hidden
 * behind a hard horizontal bar.
 */
export function PagingFooter({ canUp, canDown, onUp, onDown }: Props) {
  // When the list fits within the panel, both directions are disabled and
  // there's nothing useful to do — hide the pager entirely so the screen
  // doesn't gain a row of dead controls.
  if (!canUp && !canDown) return null
  return (
    <div
      // -mt consumes the gap MenuModal puts between flex children so the
      // pager sits flush against the scrollable area above it. Without
      // this, the gap fills with the panel's bg-white and the drop-shadow
      // has no content to project onto, making the shadow invisible.
      className="shrink-0 flex items-stretch -mt-[10px] -mx-[8px] -mb-[8px] p-[8px] rounded-b-[12px] bg-white"
      style={{
        // Drop shadow projects upward so the pager appears to float above
        // the scrolling content (per Figma node 1017:17964).
        filter: 'drop-shadow(0 -4px 6px rgba(0,0,0,0.25))',
      }}
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
