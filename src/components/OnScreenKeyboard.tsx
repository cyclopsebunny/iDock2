type Props = {
  onKey: (key: string) => void
  onBackspace: () => void
  onEnter?: () => void
}

const ROW1 = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']
const ROW2 = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l']
const ROW3 = ['z', 'x', 'c', 'v', 'b', 'n', 'm']

export function OnScreenKeyboard({ onKey, onBackspace, onEnter }: Props) {
  return (
    <div
      className="absolute left-0 right-0 bottom-0 px-[6px] pt-[6px] pb-[6px] flex flex-col gap-[6px]"
      style={{ background: '#cdd1d6' }}
    >
      <Row>
        {ROW1.map((k) => (
          <KeyBtn key={k} onClick={() => onKey(k)}>{k}</KeyBtn>
        ))}
      </Row>
      <Row pad>
        {ROW2.map((k) => (
          <KeyBtn key={k} onClick={() => onKey(k)}>
            {k}
          </KeyBtn>
        ))}
      </Row>
      <Row>
        <ModBtn flex="0.6">
          <ShiftIcon />
        </ModBtn>
        {ROW3.map((k) => (
          <KeyBtn key={k} onClick={() => onKey(k)}>{k}</KeyBtn>
        ))}
        <ModBtn flex="0.6" onClick={onBackspace}>
          <BackspaceMiniIcon />
        </ModBtn>
      </Row>
      <Row>
        <ModBtn flex="0.7"><span className="text-[14px]">?123</span></ModBtn>
        <ModBtn>,</ModBtn>
        <ModBtn flex="3.6" onClick={() => onKey(' ')} />
        <ModBtn>.</ModBtn>
        <ModBtn flex="0.7" filled onClick={onEnter}>
          <ReturnIcon />
        </ModBtn>
      </Row>
    </div>
  )
}

function Row({ children, pad }: { children: React.ReactNode; pad?: boolean }) {
  return (
    <div className={`flex gap-[6px] ${pad ? 'px-[18px]' : ''}`}>{children}</div>
  )
}

function KeyBtn({
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
      className="flex-1 h-[42px] rounded-[5px] flex items-center justify-center text-[20px] font-inter bg-white text-[#3f4a55] active:bg-accent-blue active:text-white"
      style={{ boxShadow: '0 1px 0 rgba(0,0,0,0.2)' }}
    >
      {children}
    </button>
  )
}

function ModBtn({
  children,
  onClick,
  flex = '1',
  filled,
}: {
  children?: React.ReactNode
  onClick?: () => void
  flex?: string
  filled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-[42px] rounded-[5px] flex items-center justify-center text-[20px] font-inter ${
        filled ? 'bg-brand-primary text-white rounded-full' : 'bg-[#aab1b9] text-[#3f4a55]'
      }`}
      style={{ flex, boxShadow: '0 1px 0 rgba(0,0,0,0.2)' }}
    >
      {children}
    </button>
  )
}

function ShiftIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 3 L17 10 L13 10 L13 17 L7 17 L7 10 L3 10 Z" fill="#3f4a55" />
      <line x1="6" y1="18.5" x2="14" y2="18.5" stroke="#3f4a55" strokeWidth="1.5" />
    </svg>
  )
}

function BackspaceMiniIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path
        d="M6.5 4 L18 4 C19.1 4 20 4.9 20 6 L20 16 C20 17.1 19.1 18 18 18 L6.5 18 L2 11 Z"
        stroke="#3f4a55"
        strokeWidth="1.5"
        fill="none"
        strokeLinejoin="round"
      />
      <path d="M9 8 L14 14 M14 8 L9 14" stroke="#3f4a55" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function ReturnIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M17 5 L17 10 C17 11.1 16.1 12 15 12 L4 12 M4 12 L8 8 M4 12 L8 16"
        stroke="white"
        strokeWidth="1.7"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
