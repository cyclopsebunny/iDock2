import { useState } from 'react'
import { CameraSettings } from './components/CameraSettings'
import { CamerasMenu, CameraState } from './components/CamerasMenu'
import { CameraStateConfig } from './components/CameraStateConfig'
import {
  defaultMotionConfig,
  MotionConfig,
  MotionDetectionConfig,
} from './components/MotionDetectionConfig'
import { DeviceFrame } from './components/DeviceFrame'
import { EquipmentInfo } from './components/EquipmentInfo'
import { IDockConfigMenu } from './components/IDockConfigMenu'
import { SettingsMenu } from './components/SettingsMenu'
import { SettingsSubMenu } from './components/SettingsSubMenu'
import { LockedScreen } from './screens/LockedScreen'
import { PinScreen } from './screens/PinScreen'
import { UnlockedScreen } from './screens/UnlockedScreen'

type Mode = 'locked' | 'pin' | 'unlocked'
type Menu =
  | 'none'
  | 'main'
  | 'settings'
  | 'idock-config'
  | 'cameras'
  | 'camera-settings'
  | 'camera-state'
  | 'motion-detection'
  | 'equipment-info'

export default function App() {
  const [mode, setMode] = useState<Mode>('locked')
  const [menu, setMenu] = useState<Menu>('none')
  const [cameras, setCameras] = useState<CameraState[]>(['connected', 'never'])
  const [cameraEnabled, setCameraEnabled] = useState<boolean[]>([true, true])
  const [motionConfig, setMotionConfig] = useState<MotionConfig[]>([
    defaultMotionConfig(),
    defaultMotionConfig(),
  ])
  const [myqSubscribed, setMyqSubscribed] = useState(true)
  const [selectedCamera, setSelectedCamera] = useState<number>(1)
  const doorNumber = '01'

  const setCamera = (idx: number, state: CameraState) => {
    setCameras((prev) => prev.map((c, i) => (i === idx ? state : c)))
  }
  const setCameraEnabledFor = (idx: number, enabled: boolean) => {
    setCameraEnabled((prev) => prev.map((c, i) => (i === idx ? enabled : c)))
  }
  const setMotionConfigFor = (idx: number, next: MotionConfig) => {
    setMotionConfig((prev) => prev.map((c, i) => (i === idx ? next : c)))
  }

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <DeviceFrame>
          {mode === 'locked' && (
            <LockedScreen doorNumber={doorNumber} onTapToUnlock={() => setMode('pin')} />
          )}
          {mode === 'pin' && (
            <PinScreen
              onCancel={() => setMode('locked')}
              onSubmit={() => setMode('unlocked')}
            />
          )}
          {mode === 'unlocked' && (
            <UnlockedScreen
              doorNumber={doorNumber}
              status="No Truck at Dock"
              onOpenSettings={() => setMenu('main')}
            />
          )}
          {menu === 'main' && mode === 'unlocked' && (
            <SettingsMenu
              onClose={() => setMenu('none')}
              onOpenSettings={() => setMenu('settings')}
              onOpenEquipmentInfo={() => setMenu('equipment-info')}
              onLock={() => {
                setMenu('none')
                setMode('locked')
              }}
            />
          )}
          {menu === 'equipment-info' && mode === 'unlocked' && (
            <EquipmentInfo
              doorNumber={doorNumber}
              onBack={() => setMenu('main')}
              onClose={() => setMenu('none')}
            />
          )}
          {menu === 'settings' && mode === 'unlocked' && (
            <SettingsSubMenu
              onBack={() => setMenu('main')}
              onClose={() => setMenu('none')}
              onOpenIDockConfig={() => setMenu('idock-config')}
            />
          )}
          {menu === 'idock-config' && mode === 'unlocked' && (
            <IDockConfigMenu
              onBack={() => setMenu('settings')}
              onClose={() => setMenu('none')}
              onOpenCameras={() => setMenu('cameras')}
            />
          )}
          {menu === 'cameras' && mode === 'unlocked' && (
            <CamerasMenu
              cameras={cameras}
              onBack={() => setMenu('idock-config')}
              onClose={() => setMenu('none')}
              onOpenCamera={(idx) => {
                setSelectedCamera(idx)
                setMenu('camera-settings')
              }}
            />
          )}
          {menu === 'camera-settings' && mode === 'unlocked' && (
            <CameraSettings
              cameraIndex={selectedCamera}
              cameraEnabled={cameraEnabled[selectedCamera - 1]}
              motionDetectionOn={motionConfig[selectedCamera - 1].on}
              cameraConnected={cameras[selectedCamera - 1] === 'connected'}
              myqSubscribed={myqSubscribed}
              onBack={() => setMenu('cameras')}
              onClose={() => setMenu('none')}
              onOpenCameraState={() => setMenu('camera-state')}
              onOpenMotionDetection={() => setMenu('motion-detection')}
            />
          )}
          {menu === 'motion-detection' && mode === 'unlocked' && (
            <MotionDetectionConfig
              cameraIndex={selectedCamera}
              motion={motionConfig[selectedCamera - 1]}
              cameraConnected={cameras[selectedCamera - 1] === 'connected'}
              onSave={(next) => {
                setMotionConfigFor(selectedCamera - 1, next)
                setMenu('camera-settings')
              }}
              onBack={() => setMenu('camera-settings')}
              onClose={() => setMenu('none')}
            />
          )}
          {menu === 'camera-state' && mode === 'unlocked' && (
            <CameraStateConfig
              cameraIndex={selectedCamera}
              enabled={cameraEnabled[selectedCamera - 1]}
              onSave={(en) => {
                setCameraEnabledFor(selectedCamera - 1, en)
                setMenu('camera-settings')
              }}
              onBack={() => setMenu('camera-settings')}
              onClose={() => setMenu('none')}
            />
          )}
        </DeviceFrame>
        <DevControls
          mode={mode}
          setMode={setMode}
          cameras={cameras}
          setCamera={setCamera}
          myqSubscribed={myqSubscribed}
          setMyqSubscribed={setMyqSubscribed}
        />
      </div>
    </div>
  )
}

type DevControlsProps = {
  mode: Mode
  setMode: (m: Mode) => void
  cameras: CameraState[]
  setCamera: (idx: number, state: CameraState) => void
  myqSubscribed: boolean
  setMyqSubscribed: (v: boolean) => void
}

function DevControls({
  mode,
  setMode,
  cameras,
  setCamera,
  myqSubscribed,
  setMyqSubscribed,
}: DevControlsProps) {
  return (
    <div className="flex flex-col items-center gap-3 text-xs text-white/60 font-inter">
      <div className="flex gap-2">
        {(['locked', 'pin', 'unlocked'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-2 py-1 rounded border ${
              mode === m ? 'border-white/60 text-white' : 'border-white/20 hover:border-white/40'
            }`}
          >
            {m}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        {cameras.map((state, idx) => (
          <CameraControl
            key={idx}
            label={`Camera ${idx + 1}`}
            state={state}
            onChange={(s) => setCamera(idx, s)}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={() => setMyqSubscribed(!myqSubscribed)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded border ${
          myqSubscribed
            ? 'border-emerald-500/60 text-emerald-300'
            : 'border-amber-500/60 text-amber-300'
        }`}
      >
        <span
          className={`inline-block h-2 w-2 rounded-full ${
            myqSubscribed ? 'bg-emerald-400' : 'bg-amber-400'
          }`}
        />
        myQ subscription: {myqSubscribed ? 'Active' : 'Inactive'}
        <span className="opacity-60">— click to toggle</span>
      </button>
    </div>
  )
}

function CameraControl({
  label,
  state,
  onChange,
}: {
  label: string
  state: CameraState
  onChange: (s: CameraState) => void
}) {
  const opts: { value: CameraState; label: string; tone: string }[] = [
    { value: 'connected', label: 'Connected', tone: 'border-emerald-500/60 text-emerald-300' },
    { value: 'disconnected', label: 'Disconnected', tone: 'border-rose-500/60 text-rose-300' },
    { value: 'never', label: 'Remove', tone: 'border-white/40 text-white/70' },
  ]
  return (
    <div className="flex items-center gap-2">
      <span className="w-[72px] text-white/80">{label}:</span>
      {opts.map((o) => {
        const active = state === o.value
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={`px-2 py-1 rounded border ${
              active ? o.tone : 'border-white/15 text-white/50 hover:border-white/30'
            }`}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
