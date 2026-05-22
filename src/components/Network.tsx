import { useEffect, useRef, useState } from 'react'
import { useT } from '../i18n/LanguageContext'
import {
  Wifi1Icon,
  Wifi2Icon,
  Wifi3Icon,
  WifiFullIcon,
} from '../icons/WifiSignalIcons'
import { MenuModal } from './MenuModal'
import { PagingFooter } from './PagingFooter'

type Props = {
  onBack: () => void
  onClose: () => void
  onSelectNetwork: (name: string) => void
  onOther: () => void
}

type Network = { name: string; strength: 1 | 2 | 3 | 4 }

const NETWORKS: Network[] = [
  { name: 'Network Name', strength: 4 },
  { name: 'Network Name', strength: 4 },
  { name: 'Network Name', strength: 3 },
  { name: 'Network Name', strength: 2 },
  { name: 'Network Name', strength: 1 },
  { name: 'Network Name', strength: 4 },
]

function StrengthIcon({
  strength,
  className,
}: {
  strength: 1 | 2 | 3 | 4
  className?: string
}) {
  if (strength === 4) return <WifiFullIcon className={className} />
  if (strength === 3) return <Wifi3Icon className={className} />
  if (strength === 2) return <Wifi2Icon className={className} />
  return <Wifi1Icon className={className} />
}

export function Network({ onBack, onClose, onSelectNetwork, onOther }: Props) {
  const t = useT()
  const [selected, setSelected] = useState<number | null>(null)
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
    <MenuModal title="Wireless Network Setup" onBack={onBack} onClose={onClose}>
      <div
        className="self-center flex items-center justify-center px-[14px] py-[12px] rounded-[8px] border"
        style={{ background: '#edf9ff', borderColor: '#a1def7', width: 398 }}
      >
        <p
          className="font-inter font-medium text-center text-[24px] leading-none tracking-[0.0066em]"
          style={{ color: '#003b5c' }}
        >
          {t('Select your Wi-fi Network')}
        </p>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden no-scrollbar flex flex-col gap-[10px]"
        style={{ scrollbarWidth: 'none' }}
      >
        <style>{`.no-scrollbar::-webkit-scrollbar{display:none}`}</style>
        {NETWORKS.map((net, idx) => {
          const isSel = selected === idx
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setSelected(idx)}
              className={`flex w-full items-center gap-[6px] rounded-[6px] border pl-[18px] pr-[8px] py-[14px] text-left transition-colors ${
                isSel
                  ? 'bg-accent-blue border-accent-blue text-white'
                  : 'bg-btn-secondary-bg border-btn-secondary-stroke text-btn-secondary-label active:bg-[#ebebeb]'
              }`}
            >
              <span className="flex-1 font-inter font-medium text-[24px] leading-none tracking-[0.0066em]">
                {net.name}
              </span>
              <span
                className={isSel ? 'text-white' : 'text-accent-blue'}
                style={{ width: 30, height: 30 }}
              >
                <StrengthIcon strength={net.strength} className="h-full w-full" />
              </span>
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={() => {
          if (selected === null) onOther()
          else onSelectNetwork(NETWORKS[selected].name)
        }}
        className="w-full rounded-[6px] border border-brand-primary bg-brand-primary text-white font-inter font-medium text-center text-[24px] tracking-[0.0066em] px-[12px] py-[14px] transition-opacity active:opacity-90"
      >
        {selected === null ? t('Select Other Network...') : t('Connect')}
      </button>

      <PagingFooter
        canUp={canUp}
        canDown={canDown}
        onUp={() => scrollRef.current?.scrollBy({ top: -160, behavior: 'smooth' })}
        onDown={() => scrollRef.current?.scrollBy({ top: 160, behavior: 'smooth' })}
      />
    </MenuModal>
  )
}
