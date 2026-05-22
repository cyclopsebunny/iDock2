import { useEffect, useRef, useState } from 'react'
import { useT } from '../i18n/LanguageContext'
import {
  CheckCircleIcon,
  CloudActiveIcon,
  CloudIdleIcon,
  ConnectingControllerIcon,
  ConnectingDotsIcon,
  ConnectingLineIcon,
  EyeIcon,
  RouterActiveIcon,
  RouterIdleIcon,
} from '../icons/NetworkFlowIcons'
import { Wifi2Icon, Wifi3Icon, WifiFullIcon } from '../icons/WifiSignalIcons'
import { MenuModal } from './MenuModal'
import { OnScreenKeyboard } from './OnScreenKeyboard'

type CommonProps = { onBack: () => void; onClose: () => void }

// ──────────────────────────────────────────────────────────────────────────
// Shared panel chrome
// ──────────────────────────────────────────────────────────────────────────

function Panel({
  onBack,
  onClose,
  children,
}: {
  onBack: () => void
  onClose: () => void
  children: React.ReactNode
}) {
  return (
    <MenuModal title="Wireless Network Setup" onBack={onBack} onClose={onClose}>
      {children}
    </MenuModal>
  )
}

function InfoAlert({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="self-center flex items-center justify-center px-[14px] py-[12px] rounded-[8px] border"
      style={{ background: '#edf9ff', borderColor: '#a1def7', width: 398 }}
    >
      <p
        className="font-inter font-medium text-center text-[24px] leading-[1.15] tracking-[0.0066em]"
        style={{ color: '#003b5c' }}
      >
        {children}
      </p>
    </div>
  )
}

function SuccessAlert({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="self-center flex items-center justify-center px-[14px] py-[12px] rounded-[8px] border"
      style={{ background: '#eafde3', borderColor: '#d4ebcc', width: 398 }}
    >
      <p
        className="font-inter font-medium text-center text-[24px] leading-[1.15] tracking-[0.0066em]"
        style={{ color: '#003b5c' }}
      >
        {children}
      </p>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────
// Other Network — manual SSID entry
// ──────────────────────────────────────────────────────────────────────────

export function NetworkOther({
  onBack,
  onClose,
  onConnect,
}: CommonProps & { onConnect: (ssid: string) => void }) {
  const t = useT()
  const [ssid, setSsid] = useState('Nam')
  const append = (k: string) => setSsid((s) => s + k)
  const backspace = () => setSsid((s) => s.slice(0, -1))
  const enter = () => {
    if (ssid.trim()) onConnect(ssid.trim())
  }
  return (
    <Panel onBack={onBack} onClose={onClose}>
      <InfoAlert>{t('Enter your Wi-fi Network name')}</InfoAlert>
      <div className="self-center rounded-[6px] border border-accent-blue bg-white px-[14px] py-[10px] flex items-center gap-[8px]" style={{ width: 398 }}>
        <input
          type="text"
          value={ssid}
          onChange={(e) => setSsid(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') enter()
          }}
          className="flex-1 bg-transparent outline-none font-inter text-btn-secondary-label text-[24px] leading-none"
          autoFocus
        />
        {ssid && (
          <button
            type="button"
            onClick={() => setSsid('')}
            className="text-accent-blue text-[28px] leading-none w-[28px] h-[28px] flex items-center justify-center"
            aria-label="Clear"
          >
            ✕
          </button>
        )}
      </div>

      <div className="flex flex-col gap-[10px] px-[8px]">
        {[
          { label: 'Network Name', icon: <WifiFullIcon className="h-full w-full" /> },
          { label: 'Network Name', icon: <WifiFullIcon className="h-full w-full" /> },
          { label: 'Network Name', icon: <Wifi3Icon className="h-full w-full" /> },
          { label: 'Network Name', icon: <Wifi2Icon className="h-full w-full" /> },
        ].map((n, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onConnect(n.label)}
            className="flex w-full items-center gap-[6px] bg-btn-secondary-bg border border-btn-secondary-stroke rounded-[6px] pl-[18px] pr-[8px] py-[14px] text-left transition-colors active:bg-[#ebebeb]"
          >
            <span className="flex-1 font-inter font-medium text-btn-secondary-label text-[24px] leading-none tracking-[0.0066em]">
              {n.label}
            </span>
            <span className="text-accent-blue" style={{ width: 30, height: 30 }}>{n.icon}</span>
          </button>
        ))}
      </div>

      <OnScreenKeyboard onKey={append} onBackspace={backspace} onEnter={enter} />
    </Panel>
  )
}

// ──────────────────────────────────────────────────────────────────────────
// Password entry
// ──────────────────────────────────────────────────────────────────────────

export function NetworkPassword({
  ssid,
  onBack,
  onClose,
  onConnect,
}: CommonProps & { ssid: string; onConnect: (pw: string) => void }) {
  const t = useT()
  const [pw, setPw] = useState('')
  const [show, setShow] = useState(false)
  const append = (k: string) => setPw((p) => p + k)
  const backspace = () => setPw((p) => p.slice(0, -1))
  const submit = () => {
    if (pw.length > 0) onConnect(pw)
  }
  return (
    <Panel onBack={onBack} onClose={onClose}>
      <InfoAlert>
        {t('Enter your Network Password for')} “{ssid}”
      </InfoAlert>
      <div
        className={`self-center rounded-[6px] border bg-btn-secondary-bg px-[14px] py-[10px] flex items-center gap-[8px] ${
          pw.length > 0 ? 'border-accent-blue' : 'border-btn-secondary-stroke'
        }`}
        style={{ width: 398 }}
      >
        <span className="flex-1 font-inter text-[24px] leading-none text-btn-secondary-label min-h-[26px]">
          {pw.length === 0 ? (
            <span className="text-btn-secondary-label opacity-70">{t('Password')}</span>
          ) : show ? (
            pw
          ) : (
            '•'.repeat(pw.length)
          )}
        </span>
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="text-accent-blue"
          aria-label="Toggle password visibility"
          style={{ width: 28, height: 28 }}
        >
          <EyeIcon className="h-full w-full" />
        </button>
      </div>

      <div className="flex-1" />

      <ConnectButton enabled={pw.length > 0} onClick={submit}>
        {t('Connect')}
      </ConnectButton>

      <OnScreenKeyboard onKey={append} onBackspace={backspace} onEnter={submit} />

      {/* Hidden input to capture physical keyboard input too. */}
      <input
        type="text"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') submit()
        }}
        autoFocus
        className="absolute opacity-0 pointer-events-none"
        aria-hidden
      />
    </Panel>
  )
}

function ConnectButton({
  children,
  enabled,
  onClick,
}: {
  children: React.ReactNode
  enabled: boolean
  onClick: () => void
}) {
  if (enabled) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="w-full rounded-[6px] border border-brand-primary bg-brand-primary text-white font-inter font-medium text-center text-[24px] tracking-[0.0066em] px-[12px] py-[14px] transition-opacity active:opacity-90"
      >
        {children}
      </button>
    )
  }
  return (
    <button
      type="button"
      disabled
      className="w-full rounded-[6px] border border-[#eaeaea] bg-white text-[#a6a6a6] font-inter font-medium text-center text-[24px] tracking-[0.0066em] px-[12px] py-[14px] cursor-not-allowed"
    >
      {children}
    </button>
  )
}

// ──────────────────────────────────────────────────────────────────────────
// Connecting / Complete
// ──────────────────────────────────────────────────────────────────────────

type ConnectingPhase = 'router' | 'cloud' | 'done'

const STATUS_ROWS: { label: string; value: string }[] = [
  { label: 'Resolve myQ Business', value: 'www.myqbusiness.com' },
  { label: 'DNS Server Settings', value: '10.10.2.10' },
  { label: 'IP Address', value: '10.10.2.10' },
  { label: 'Ping Gateway', value: '32' },
  { label: 'Physical Gateway', value: 'Connected' },
]

export function NetworkConnecting({
  ssid,
  onBack,
  onClose,
  onContinue,
}: CommonProps & { ssid: string; onContinue: () => void }) {
  const t = useT()
  const [phase, setPhase] = useState<ConnectingPhase>('router')

  useEffect(() => {
    const t1 = window.setTimeout(() => setPhase('cloud'), 2200)
    const t2 = window.setTimeout(() => setPhase('done'), 4400)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [])

  // How many status rows are checked at each phase
  const checkedCount = phase === 'router' ? 1 : 5

  const routerConnected = phase !== 'router'
  const cloudConnected = phase === 'done'

  return (
    <Panel onBack={onBack} onClose={onClose}>
      {phase === 'done' ? (
        <SuccessAlert>{t('Network Setup Complete')}</SuccessAlert>
      ) : (
        <InfoAlert>
          {t('Connecting to')} “{ssid}”…
        </InfoAlert>
      )}

      <ConnectionGraphic
        routerActive={routerConnected}
        cloudActive={cloudConnected}
        animateLeft={phase === 'router'}
        animateRight={phase === 'cloud'}
      />

      <div className="rounded-[8px] border border-btn-secondary-stroke bg-white">
        {STATUS_ROWS.map((row, i) => {
          const done = i < checkedCount
          return (
            <div
              key={row.label}
              className={`flex items-center gap-[12px] px-[14px] py-[10px] ${
                i > 0 ? 'border-t border-btn-secondary-stroke' : ''
              }`}
            >
              <CheckCircleIcon active={done} />
              <span
                className={`flex-1 font-inter text-[18px] leading-none ${
                  done ? 'font-semibold text-btn-secondary-label' : 'font-medium text-[#a6a6a6]'
                }`}
              >
                {t(row.label)}
              </span>
              <span
                className={`font-inter text-[18px] leading-none whitespace-nowrap ${
                  done ? 'font-semibold text-btn-secondary-label' : 'font-medium text-[#a6a6a6]'
                }`}
              >
                {row.value}
              </span>
            </div>
          )
        })}
      </div>

      <div className="flex-1" />

      {phase === 'done' && (
        <button
          type="button"
          onClick={onContinue}
          className="w-full rounded-[6px] border border-brand-primary bg-brand-primary text-white font-inter font-medium text-center text-[24px] tracking-[0.0066em] px-[12px] py-[14px] transition-opacity active:opacity-90"
        >
          {t('Continue')}
        </button>
      )}
    </Panel>
  )
}

function ConnectionGraphic({
  routerActive,
  cloudActive,
  animateLeft,
  animateRight,
}: {
  routerActive: boolean
  cloudActive: boolean
  animateLeft: boolean
  animateRight: boolean
}) {
  // Figma layout (Frame 484858 → 484859):
  //   Controller is 80 tall, top-aligned. Router is 60 tall, top-aligned.
  //   Connectors and Cloud bottom-align with the router (60 tall logical row),
  //   while the controller extends ~20px BELOW the router/cloud baseline.
  //
  // We model this by aligning everything to the bottom of an 80-tall row and
  // lifting the non-controller items up by 20px so their bottoms land on the
  // router's body baseline, leaving the controller alone to sit on the row
  // bottom.
  return (
    <div className="flex items-end gap-[8px] px-[16px] pt-[16px] pb-[12px] h-[108px]">
      <ConnectingControllerIcon className="shrink-0" />
      <Connector dotted={animateLeft} />
      <span className="shrink-0" style={{ marginBottom: 20 }}>
        {routerActive ? <RouterActiveIcon /> : <RouterIdleIcon />}
      </span>
      <Connector dotted={animateRight} />
      <span className="shrink-0" style={{ marginBottom: 20 }}>
        {cloudActive ? <CloudActiveIcon /> : <CloudIdleIcon />}
      </span>
    </div>
  )
}

function Connector({ dotted }: { dotted: boolean }) {
  return (
    <div
      className="flex-1 flex justify-center"
      style={{ alignItems: 'center', marginBottom: 20 }}
    >
      {dotted ? (
        <ConnectingDotsIcon className="w-full max-w-[56px]" />
      ) : (
        <ConnectingLineIcon className="w-full max-w-[70px]" />
      )}
    </div>
  )
}

// Keep useRef import alive
void useRef
