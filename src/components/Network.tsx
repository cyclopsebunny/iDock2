import { useEffect, useRef, useState } from 'react'
import { useT } from '../i18n/LanguageContext'
import { BackArrowIcon, CloseIcon } from '../icons/Icons'
import {
  Wifi1Icon,
  Wifi2Icon,
  Wifi3Icon,
  WifiFullIcon,
} from '../icons/WifiSignalIcons'
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
    <div className="absolute inset-0 flex items-end" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0 bg-black/45"
      />
      <div
        className="relative flex flex-col gap-[10px] bg-white rounded-[12px] shadow-panel overflow-hidden"
        style={{ width: 448, height: 768, padding: 8, marginLeft: 16, marginBottom: 16 }}
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
            {t('Wireless Network Setup')}
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
      </div>
    </div>
  )
}
