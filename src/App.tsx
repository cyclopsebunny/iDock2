import { useEffect, useState } from 'react'
import { CameraSettings } from './components/CameraSettings'
import { CamerasMenu, CameraState } from './components/CamerasMenu'
import { CameraStateConfig } from './components/CameraStateConfig'
import {
  DateFormat,
  DateFormatScreen,
  DateTimeMenu,
  LocalDateTime,
  LocalDateTimeScreen,
  TimeZone,
  TimeZoneScreen,
} from './components/DateTime'
import { LanguageScreen } from './components/LanguageScreen'
import { LightSound } from './components/LightSound'
import { Network } from './components/Network'
import { PhysicalControls } from './components/PhysicalControls'
import {
  NetworkConnecting,
  NetworkOther,
  NetworkPassword,
} from './components/NetworkFlow'
import { TIMER_KEYS, TimerDetail, TimerKey, Timers } from './components/Timers'
import { UpdateFirmware } from './components/UpdateFirmware'
import {
  defaultMotionConfig,
  MotionConfig,
  MotionDetectionConfig,
} from './components/MotionDetectionConfig'
import { DeviceFrame } from './components/DeviceFrame'
import { Counters } from './components/Counters'
import { Diagnostics } from './components/Diagnostics'
import { EquipmentInfo } from './components/EquipmentInfo'
import { IDockConfigMenu } from './components/IDockConfigMenu'
import { CardCredential } from './components/CardCredential'
import {
  BypassConfiguration,
  type BypassConfig,
} from './components/BypassConfiguration'
import {
  UserAccessConfiguration,
  type UserAccessConfig,
} from './components/UserAccessConfiguration'
import { EditBypassCode } from './components/EditBypassCode'
import {
  MaintenanceEntry,
  MaintenanceMenu,
  MaintenanceRecords,
  MaintenanceTaskScreen,
  PreventativeMaintenance,
} from './components/Maintenance'
import { SettingsMenu } from './components/SettingsMenu'
import { SettingsSubMenu } from './components/SettingsSubMenu'
import { LockedScreen } from './screens/LockedScreen'
import { PinScreen } from './screens/PinScreen'
import { UnlockedScreen } from './screens/UnlockedScreen'
import { RestraintOfflineScreen } from './screens/RestraintOfflineScreen'
import { AuthorizationWaitScreen } from './screens/AuthorizationWaitScreen'
import { BypassPinScreen } from './screens/BypassPinScreen'
import { DoorAnimationScreen } from './screens/DoorAnimationScreen'
import { LevelerAnimationScreen } from './screens/LevelerAnimationScreen'

type Mode = 'locked' | 'pin' | 'unlocked'
type Menu =
  | 'none'
  | 'main'
  | 'settings'
  | 'idock-config'
  | 'card-credential'
  | 'bypass-config'
  | 'bypass-edit-pin'
  | 'user-access-config'
  | 'user-access-edit-pin'
  | 'cameras'
  | 'camera-settings'
  | 'camera-state'
  | 'motion-detection'
  | 'equipment-info'
  | 'counters'
  | 'maintenance'
  | 'maintenance-entry'
  | 'maintenance-records'
  | 'maintenance-pm'
  | 'maintenance-restraint'
  | 'maintenance-leveler'
  | 'maintenance-door'
  | 'language'
  | 'light-sound'
  | 'datetime'
  | 'date-format'
  | 'local-datetime'
  | 'timezone'
  | 'timers'
  | 'timer-detail'
  | 'network'
  | 'network-other'
  | 'network-password'
  | 'network-connecting'
  | 'update-firmware'
  | 'diagnostics'

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
  const [cardCredentialEnabled, setCardCredentialEnabled] = useState(true)
  const [bypassConfig, setBypassConfig] = useState<BypassConfig>({
    enabled: true,
    pinCode: true,
    cardCredential: true,
    remote: false,
    pin: '12345678',
  })
  /**
   * In-flight BypassConfiguration draft, captured when the user navigates to
   * the Edit Bypass Code sub-screen so the rest of the form's unsaved edits
   * survive the round-trip. Null whenever there's no pending edit.
   */
  const [pendingBypassDraft, setPendingBypassDraft] =
    useState<BypassConfig | null>(null)
  const [userAccessConfig, setUserAccessConfig] = useState<UserAccessConfig>({
    enabled: true,
    pinCode: true,
    cardCredential: true,
    remote: false,
    pin: '12345678',
  })
  // Mirror of pendingBypassDraft, for the User Access Configuration flow.
  const [pendingUserAccessDraft, setPendingUserAccessDraft] =
    useState<UserAccessConfig | null>(null)
  const [trailerPresent, setTrailerPresentRaw] = useState(false)
  const [restraintOnline, setRestraintOnline] = useState(true)
  const [bypassStep, setBypassStep] = useState<'none' | 'wait' | 'pin'>('none')
  /** True once the user has successfully engaged (or bypassed) the restraint. */
  const [restraintEngaged, setRestraintEngaged] = useState(false)
  /**
   * True if the restraint was authorized via the PIN bypass flow rather than
   * engaged normally. The dock workflow continues with a yellow/alert theme
   * to make the bypass state obvious to the user.
   */
  const [restraintBypassed, setRestraintBypassed] = useState(false)
  /**
   * Set true when the user presses the Restraint Engage physical button and
   * the restraint hardware is offline. Drives the "Cannot engage restraint"
   * screen. Cleared when the user cancels the bypass request.
   */
  const [engageFailed, setEngageFailed] = useState(false)
  /**
   * Door workflow:
   *   closed → opening (5s animation) → open → closing (5s animation) → closed
   */
  const [doorState, setDoorState] = useState<
    'closed' | 'opening' | 'open' | 'closing'
  >('closed')
  /**
   * Transient warning shown when the user presses Door Open before engaging
   * the restraint. Auto-clears after 8s or as soon as Restraint Engage is
   * pressed (success or failure).
   */
  const [engageFirstWarning, setEngageFirstWarning] = useState(false)
  /**
   * Leveler workflow:
   *   stored → deploying (5s press-and-hold) → deployed
   *   deployed → storing (5s press-and-hold) → stored-after-use
   * Releasing during 'deploying' returns to 'stored'.
   * Releasing during 'storing' returns to 'deployed'.
   * The terminal 'stored-after-use' state shows the Leveler Stored screen
   * with the Close Door prompt (distinct from the initial 'stored' which
   * shows the Door Open / Operate Leveler screen).
   */
  const [levelerState, setLevelerState] = useState<
    'stored' | 'deploying' | 'deployed' | 'storing' | 'stored-after-use'
  >('stored')
  // Remembers which state to revert to when the user releases mid-animation.
  const [levelerPriorState, setLevelerPriorState] = useState<
    'stored' | 'stored-after-use' | 'deployed'
  >('stored')

  // Auto-dismiss the engage-first warning after 8 seconds.
  useEffect(() => {
    if (!engageFirstWarning) return
    const id = setTimeout(() => setEngageFirstWarning(false), 8000)
    return () => clearTimeout(id)
  }, [engageFirstWarning])

  // Leveler operations are press-and-hold for 5 seconds. Same logic for
  // both directions — releasing early reverts to the previous state via the
  // release handler, which cleans up this effect.
  useEffect(() => {
    if (levelerState === 'deploying') {
      const id = setTimeout(() => setLevelerState('deployed'), 5000)
      return () => clearTimeout(id)
    }
    if (levelerState === 'storing') {
      const id = setTimeout(() => setLevelerState('stored-after-use'), 5000)
      return () => clearTimeout(id)
    }
  }, [levelerState])

  // Wrap setTrailerPresent so the dock workflow resets when the truck leaves.
  const setTrailerPresent = (v: boolean) => {
    setTrailerPresentRaw(v)
    if (!v) {
      setRestraintEngaged(false)
      setEngageFailed(false)
      setBypassStep('none')
      setDoorState('closed')
      setEngageFirstWarning(false)
      setLevelerState('stored')
      setRestraintBypassed(false)
    }
  }

  /**
   * Press-and-hold handlers for the physical Leveler Lower button.
   * - Press starts the 5s deployment (only valid when door is open).
   * - Release before 5s cancels back to 'stored'.
   * - After 5s the useEffect transitions to 'deployed' — releasing the
   *   button at that point is a no-op.
   */
  const handleLevelerPress = () => {
    if (!trailerPresent || !restraintEngaged || doorState !== 'open') return
    if (levelerState === 'stored' || levelerState === 'stored-after-use') {
      // Either a fresh deploy, or a re-deploy after the user already
      // stored — both transition into the deploying animation and end up
      // at Leveler Deployed (session in progress).
      setLevelerPriorState(levelerState)
      setLevelerState('deploying')
    } else if (levelerState === 'deployed') {
      setLevelerPriorState('deployed')
      setLevelerState('storing')
    }
  }
  const handleLevelerRelease = () => {
    if (levelerState === 'deploying') {
      // Cancel mid-deploy → return to the prior stored state.
      setLevelerState(levelerPriorState === 'deployed' ? 'stored' : levelerPriorState)
    }
    if (levelerState === 'storing') setLevelerState('deployed')
  }

  /** Called by the physical Door Open button. */
  const handleDoorOpen = () => {
    if (!trailerPresent) return
    if (!restraintEngaged) {
      // User skipped the engage step — show the 8s warning. Pressing this
      // again while the warning is up just resets the 8s timer.
      setEngageFirstWarning(true)
      return
    }
    if (doorState === 'closed') setDoorState('opening')
  }

  /** Called by the physical Restraint Engage button. */
  const handleEngageRestraint = () => {
    // Pressing engage always dismisses the engage-first warning.
    setEngageFirstWarning(false)
    if (!trailerPresent || restraintEngaged) return
    if (restraintOnline) {
      setRestraintEngaged(true)
      setEngageFailed(false)
    } else {
      setEngageFailed(true)
    }
  }
  const [pmDays, setPmDays] = useState(60)
  const [nextPmDate, setNextPmDate] = useState('6/1/2024')
  const [dateFormat, setDateFormat] = useState<DateFormat>('MM/DD/YYYY')
  const [localDateTime, setLocalDateTime] = useState<LocalDateTime>({
    month: 8,
    day: 2,
    year: 2024,
    hour: 5,
    minute: 0,
    meridiem: 'PM',
  })
  const [timeZone, setTimeZone] = useState<TimeZone>('Eastern Time Zone')
  const [timerValues, setTimerValues] = useState<Record<TimerKey, number>>(
    () =>
      TIMER_KEYS.reduce<Record<TimerKey, number>>(
        (acc, k) => ({ ...acc, [k]: 0 }),
        {} as Record<TimerKey, number>,
      ),
  )
  const [selectedTimer, setSelectedTimer] = useState<TimerKey>('Hook Raise Time')
  const [pendingNetworkSsid, setPendingNetworkSsid] = useState('')
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
      <div className="flex items-start gap-6">
        {/* Left stack: the device frame with the physical button panel
            centered under it. */}
        <div className="flex flex-col items-center gap-4">
        <DeviceFrame
          theme={
            // Bypass session — yellow theme as long as the dock is in
            // bypass mode (i.e. PIN-authorized restraint engagement).
            mode === 'unlocked' &&
            trailerPresent &&
            restraintEngaged &&
            restraintBypassed
              ? 'bypass'
              : mode === 'unlocked' && trailerPresent && restraintEngaged
                ? 'positive' // engaged / opening / door open
                : mode === 'unlocked' &&
                    trailerPresent &&
                    engageFailed &&
                    bypassStep !== 'none'
                  ? 'bypass'
                  : 'red'
          }
        >
          {mode === 'locked' && (
            <LockedScreen
              doorNumber={doorNumber}
              onTapToUnlock={() => setMode('pin')}
              showScanBadgePrompt={cardCredentialEnabled}
            />
          )}
          {mode === 'pin' && (
            <PinScreen
              onCancel={() => setMode('locked')}
              onSubmit={() => setMode('unlocked')}
            />
          )}
          {mode === 'unlocked' &&
            (() => {
              // "Engage the restraint before opening the door" warning — fires
              // when Door Open is pressed before the restraint is engaged.
              if (
                trailerPresent &&
                !restraintEngaged &&
                engageFirstWarning &&
                bypassStep === 'none' &&
                !engageFailed
              ) {
                return (
                  <RestraintOfflineScreen
                    doorNumber={doorNumber}
                    topGraphic="stop"
                    message="Engage the restraint before opening the door"
                    onOpenSettings={() => setMenu('main')}
                    onBypassRestraint={() => {
                      // Skipping straight to the bypass flow from the warning.
                      setEngageFirstWarning(false)
                      setEngageFailed(true)
                      setBypassStep('wait')
                    }}
                  />
                )
              }
              // Bypass flow only shows up after an explicit engage attempt
              // failed (engageFailed) — not just because the hardware is
              // offline.
              if (trailerPresent && engageFailed) {
                if (bypassStep === 'pin') {
                  return (
                    <BypassPinScreen
                      onCancel={() => setBypassStep('wait')}
                      onSubmit={() => {
                        // Successful bypass → restraint is now considered
                        // engaged, but flagged as bypassed so downstream
                        // screens use the yellow alert theme.
                        setBypassStep('none')
                        setEngageFailed(false)
                        setRestraintEngaged(true)
                        setRestraintBypassed(true)
                      }}
                    />
                  )
                }
                if (bypassStep === 'wait') {
                  return (
                    <AuthorizationWaitScreen
                      doorNumber={doorNumber}
                      onOpenSettings={() => setMenu('main')}
                      onCancelRequest={() => {
                        // Cancelling clears the failed-engage state so the
                        // user returns to the Truck at Dock prompt.
                        setBypassStep('none')
                        setEngageFailed(false)
                      }}
                      onEnterPin={() => setBypassStep('pin')}
                    />
                  )
                }
                return (
                  <RestraintOfflineScreen
                    doorNumber={doorNumber}
                    onOpenSettings={() => setMenu('main')}
                    onBypassRestraint={() => setBypassStep('wait')}
                  />
                )
              }

              if (trailerPresent && restraintEngaged) {
                // Convenience derivatives used by every session sub-screen.
                const bypass = restraintBypassed
                const promptTone: 'success' | 'alert' = bypass
                  ? 'alert'
                  : 'success'
                const subtitle = bypass ? 'Restraint in Bypass' : undefined
                if (doorState === 'opening' || doorState === 'closing') {
                  return (
                    <DoorAnimationScreen
                      doorNumber={doorNumber}
                      direction={
                        doorState === 'opening' ? 'opening' : 'closing'
                      }
                      onOpenSettings={() => setMenu('main')}
                      onComplete={() => {
                        if (doorState === 'opening') {
                          setDoorState('open')
                          return
                        }
                        // Closing finished. In bypass mode, completing a
                        // full deploy → store → close cycle ends the
                        // bypass session: return to Truck at Dock (red)
                        // instead of looping back to Restraint Bypassed.
                        if (
                          restraintBypassed &&
                          levelerState === 'stored-after-use'
                        ) {
                          setRestraintEngaged(false)
                          setRestraintBypassed(false)
                          setLevelerState('stored')
                          setDoorState('closed')
                          return
                        }
                        setDoorState('closed')
                      }}
                      bypass={bypass}
                    />
                  )
                }
                if (doorState === 'open') {
                  if (
                    levelerState === 'deploying' ||
                    levelerState === 'storing'
                  ) {
                    return (
                      <LevelerAnimationScreen
                        direction={
                          levelerState === 'deploying' ? 'deploy' : 'store'
                        }
                        onOpenSettings={() => setMenu('main')}
                        bypass={bypass}
                      />
                    )
                  }
                  if (levelerState === 'deployed') {
                    return (
                      <UnlockedScreen
                        doorNumber={doorNumber}
                        status="Leveler Deployed."
                        topGraphic={bypass ? 'forklift-dark' : 'forklift'}
                        topSubtitle={subtitle}
                        showDoorNumber={false}
                        prompt={{
                          icon: 'leveler-store-icon.svg',
                          label: 'Store Leveler\nwhen complete',
                          tone: promptTone,
                        }}
                        onOpenSettings={() => setMenu('main')}
                      />
                    )
                  }
                  if (levelerState === 'stored-after-use') {
                    return (
                      <UnlockedScreen
                        doorNumber={doorNumber}
                        status="Leveler Stored"
                        topGraphic={
                          bypass ? 'dock-doors-close-dark' : 'dock-doors-close'
                        }
                        topSubtitle={subtitle}
                        showDoorNumber={false}
                        prompt={{
                          icon: 'close-door-icon.svg',
                          label: 'Close Door',
                          tone: promptTone,
                        }}
                        onOpenSettings={() => setMenu('main')}
                      />
                    )
                  }
                  return (
                    <UnlockedScreen
                      doorNumber={doorNumber}
                      status="Door Open. Operate Leveler"
                      topGraphic={
                        bypass ? 'leveler-arrow-dark' : 'leveler-arrow'
                      }
                      topSubtitle={subtitle}
                      showDoorNumber={false}
                      prompt={{
                        icon: 'leveler-icon.svg',
                        label: 'Deploy Leveler',
                        tone: promptTone,
                      }}
                      onOpenSettings={() => setMenu('main')}
                    />
                  )
                }
                // Door closed and leveler already used → session complete.
                // In bypass mode there's no restraint to release, so we
                // skip the Door Closed / Release Restraint screen entirely
                // and loop the user back to the Restraint Bypassed screen
                // (Open Door prompt). The session ends when the trailer
                // leaves the sensor.
                if (levelerState === 'stored-after-use' && !bypass) {
                  return (
                    <UnlockedScreen
                      doorNumber={doorNumber}
                      status="Door Closed"
                      topGraphic="lock"
                      showDoorNumber={false}
                      prompt={{
                        icon: 'restraint-release-icon.svg',
                        label: 'Release Restraint',
                        tone: 'success',
                      }}
                      onOpenSettings={() => setMenu('main')}
                    />
                  )
                }
                // PIN-authorized bypass → yellow Restraint Bypassed screen.
                if (restraintBypassed) {
                  return (
                    <UnlockedScreen
                      doorNumber={doorNumber}
                      status="Restraint Bypassed"
                      topGraphic="dock-doors-dark"
                      topSubtitle="Restraint in Bypass"
                      topSubtitleColor="#513500"
                      showDoorNumber={false}
                      prompt={{
                        icon: 'door-open-icon.svg',
                        label: 'Open Door',
                        tone: 'alert',
                      }}
                      onOpenSettings={() => setMenu('main')}
                    />
                  )
                }
                return (
                  <UnlockedScreen
                    doorNumber={doorNumber}
                    status="Restraint Engaged"
                    topGraphic="dock-doors"
                    showDoorNumber={false}
                    prompt={{
                      icon: 'door-open-icon.svg',
                      label: 'Open Door',
                      tone: 'success',
                    }}
                    onOpenSettings={() => setMenu('main')}
                  />
                )
              }

              return (
                <UnlockedScreen
                  doorNumber={doorNumber}
                  status={trailerPresent ? 'Truck at Dock' : 'No Truck at Dock'}
                  prompt={
                    trailerPresent
                      ? {
                          icon: 'restraint-icon.svg',
                          label: 'Engage Restraint',
                          tone: 'warning',
                        }
                      : null
                  }
                  onOpenSettings={() => setMenu('main')}
                />
              )
            })()}
          {menu === 'main' && mode === 'unlocked' && (
            <SettingsMenu
              onClose={() => setMenu('none')}
              onOpenSettings={() => setMenu('settings')}
              onOpenEquipmentInfo={() => setMenu('equipment-info')}
              onOpenCounters={() => setMenu('counters')}
              onOpenMaintenance={() => setMenu('maintenance')}
              onLock={() => {
                setMenu('none')
                setMode('locked')
              }}
              onBypassRestraint={() => {
                // Enter the bypass authorization flow from the main menu.
                // Same destination as the "Bypass Restrait" button on the
                // Cannot Engage Restraint screen: yellow Authorization
                // Requested... screen, with Enter PIN Code to proceed.
                setMenu('none')
                setEngageFailed(true)
                setBypassStep('wait')
              }}
            />
          )}
          {menu === 'maintenance' && mode === 'unlocked' && (
            <MaintenanceMenu
              nextPmDate={nextPmDate}
              onBack={() => setMenu('main')}
              onClose={() => setMenu('none')}
              onOpenEntry={() => setMenu('maintenance-entry')}
              onOpenRecords={() => setMenu('maintenance-records')}
            />
          )}
          {menu === 'maintenance-entry' && mode === 'unlocked' && (
            <MaintenanceEntry
              onBack={() => setMenu('maintenance')}
              onClose={() => setMenu('none')}
              onOpenPM={() => setMenu('maintenance-pm')}
              onOpenRestraint={() => setMenu('maintenance-restraint')}
              onOpenLeveler={() => setMenu('maintenance-leveler')}
              onOpenDoor={() => setMenu('maintenance-door')}
            />
          )}
          {menu === 'maintenance-records' && mode === 'unlocked' && (
            <MaintenanceRecords
              onBack={() => setMenu('maintenance')}
              onClose={() => setMenu('none')}
            />
          )}
          {menu === 'maintenance-pm' && mode === 'unlocked' && (
            <PreventativeMaintenance
              days={pmDays}
              onSetDays={setPmDays}
              onResetWarning={() => {}}
              onSave={(d) => {
                const next = new Date(Date.now() + d * 86400000)
                setNextPmDate(
                  `${next.getMonth() + 1}/${next.getDate()}/${next.getFullYear()}`,
                )
                setMenu('maintenance-entry')
              }}
              onBack={() => setMenu('maintenance-entry')}
              onClose={() => setMenu('none')}
            />
          )}
          {menu === 'maintenance-restraint' && mode === 'unlocked' && (
            <MaintenanceTaskScreen
              title="Restraint"
              options={['General Maintenance', 'Repair Restraint', 'Replace Part']}
              onBack={() => setMenu('maintenance-entry')}
              onClose={() => setMenu('none')}
            />
          )}
          {menu === 'maintenance-leveler' && mode === 'unlocked' && (
            <MaintenanceTaskScreen
              title="Leveler"
              options={['General Maintenance', 'Repair Leveler', 'Replace Part']}
              onBack={() => setMenu('maintenance-entry')}
              onClose={() => setMenu('none')}
            />
          )}
          {menu === 'maintenance-door' && mode === 'unlocked' && (
            <MaintenanceTaskScreen
              title="Door"
              options={['General Maintenance', 'Repair Door', 'Replace Part']}
              onBack={() => setMenu('maintenance-entry')}
              onClose={() => setMenu('none')}
            />
          )}
          {menu === 'counters' && mode === 'unlocked' && (
            <Counters
              onBack={() => setMenu('main')}
              onClose={() => setMenu('none')}
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
              onOpenLanguage={() => setMenu('language')}
              onOpenLightSound={() => setMenu('light-sound')}
              onOpenDateTime={() => setMenu('datetime')}
              onOpenTimers={() => setMenu('timers')}
              onOpenNetwork={() => setMenu('network')}
              onOpenUpdateFirmware={() => setMenu('update-firmware')}
            />
          )}
          {menu === 'update-firmware' && mode === 'unlocked' && (
            <UpdateFirmware
              onBack={() => setMenu('settings')}
              onClose={() => setMenu('none')}
            />
          )}
          {menu === 'network' && mode === 'unlocked' && (
            <Network
              onBack={() => setMenu('settings')}
              onClose={() => setMenu('none')}
              onOther={() => setMenu('network-other')}
              onSelectNetwork={(name) => {
                setPendingNetworkSsid(name)
                setMenu('network-password')
              }}
            />
          )}
          {menu === 'network-other' && mode === 'unlocked' && (
            <NetworkOther
              onBack={() => setMenu('network')}
              onClose={() => setMenu('none')}
              onConnect={(ssid) => {
                setPendingNetworkSsid(ssid)
                setMenu('network-password')
              }}
            />
          )}
          {menu === 'network-password' && mode === 'unlocked' && (
            <NetworkPassword
              ssid={pendingNetworkSsid}
              onBack={() => setMenu('network')}
              onClose={() => setMenu('none')}
              onConnect={() => setMenu('network-connecting')}
            />
          )}
          {menu === 'network-connecting' && mode === 'unlocked' && (
            <NetworkConnecting
              ssid={pendingNetworkSsid}
              onBack={() => setMenu('network')}
              onClose={() => setMenu('none')}
              onContinue={() => setMenu('settings')}
            />
          )}
          {menu === 'timers' && mode === 'unlocked' && (
            <Timers
              onBack={() => setMenu('settings')}
              onClose={() => setMenu('none')}
              onOpenTimer={(key) => {
                setSelectedTimer(key)
                setMenu('timer-detail')
              }}
            />
          )}
          {menu === 'timer-detail' && mode === 'unlocked' && (
            <TimerDetail
              timerKey={selectedTimer}
              value={timerValues[selectedTimer]}
              onSave={(v) => {
                setTimerValues((prev) => ({ ...prev, [selectedTimer]: v }))
                setMenu('timers')
              }}
              onBack={() => setMenu('timers')}
              onClose={() => setMenu('none')}
            />
          )}
          {menu === 'datetime' && mode === 'unlocked' && (
            <DateTimeMenu
              dateFormat={dateFormat}
              localDateTime={localDateTime}
              timeZone={timeZone}
              onBack={() => setMenu('settings')}
              onClose={() => setMenu('none')}
              onOpenDateFormat={() => setMenu('date-format')}
              onOpenLocalDateTime={() => setMenu('local-datetime')}
              onOpenTimeZone={() => setMenu('timezone')}
            />
          )}
          {menu === 'date-format' && mode === 'unlocked' && (
            <DateFormatScreen
              value={dateFormat}
              onSave={(v) => {
                setDateFormat(v)
                setMenu('datetime')
              }}
              onBack={() => setMenu('datetime')}
              onClose={() => setMenu('none')}
            />
          )}
          {menu === 'local-datetime' && mode === 'unlocked' && (
            <LocalDateTimeScreen
              value={localDateTime}
              onSave={(v) => {
                setLocalDateTime(v)
                setMenu('datetime')
              }}
              onBack={() => setMenu('datetime')}
              onClose={() => setMenu('none')}
            />
          )}
          {menu === 'timezone' && mode === 'unlocked' && (
            <TimeZoneScreen
              value={timeZone}
              onSave={(v) => {
                setTimeZone(v)
                setMenu('datetime')
              }}
              onBack={() => setMenu('datetime')}
              onClose={() => setMenu('none')}
            />
          )}
          {menu === 'language' && mode === 'unlocked' && (
            <LanguageScreen
              onBack={() => setMenu('settings')}
              onClose={() => setMenu('none')}
            />
          )}
          {menu === 'light-sound' && mode === 'unlocked' && (
            <LightSound
              onBack={() => setMenu('settings')}
              onClose={() => setMenu('none')}
            />
          )}
          {menu === 'idock-config' && mode === 'unlocked' && (
            <IDockConfigMenu
              onBack={() => setMenu('settings')}
              onClose={() => setMenu('none')}
              onOpenCameras={() => setMenu('cameras')}
              onOpenDiagnostics={() => setMenu('diagnostics')}
              onOpenCardCredential={() => setMenu('card-credential')}
              onOpenBypassConfig={() => setMenu('bypass-config')}
              onOpenUserAccessConfig={() => setMenu('user-access-config')}
              cardCredentialEnabled={cardCredentialEnabled}
            />
          )}
          {menu === 'card-credential' && mode === 'unlocked' && (
            <CardCredential
              enabled={cardCredentialEnabled}
              onBack={() => setMenu('idock-config')}
              onClose={() => setMenu('none')}
              onSave={(v) => {
                setCardCredentialEnabled(v)
                setMenu('idock-config')
              }}
            />
          )}
          {menu === 'bypass-config' && mode === 'unlocked' && (
            <BypassConfiguration
              // If the user came back from Edit Bypass Code, prefer the
              // preserved draft so their other unsaved edits aren't lost.
              value={pendingBypassDraft ?? bypassConfig}
              cardCredentialEnabled={cardCredentialEnabled}
              onBack={() => {
                setPendingBypassDraft(null)
                setMenu('idock-config')
              }}
              onClose={() => {
                setPendingBypassDraft(null)
                setMenu('none')
              }}
              onSave={(v) => {
                setBypassConfig(v)
                setPendingBypassDraft(null)
                setMenu('idock-config')
              }}
              onEditPin={(currentDraft) => {
                setPendingBypassDraft(currentDraft)
                setMenu('bypass-edit-pin')
              }}
            />
          )}
          {menu === 'bypass-edit-pin' && mode === 'unlocked' && (
            <EditBypassCode
              pinIsSet={Boolean((pendingBypassDraft ?? bypassConfig).pin)}
              onBack={() => setMenu('bypass-config')}
              onClose={() => {
                setPendingBypassDraft(null)
                setMenu('none')
              }}
              onSave={(newPin) => {
                // newPin may be null when the user pressed Go with no
                // digits in the "new" phase — that unsets the PIN.
                setPendingBypassDraft((d) =>
                  d ? { ...d, pin: newPin } : { ...bypassConfig, pin: newPin },
                )
                setMenu('bypass-config')
              }}
            />
          )}
          {menu === 'user-access-config' && mode === 'unlocked' && (
            <UserAccessConfiguration
              value={pendingUserAccessDraft ?? userAccessConfig}
              cardCredentialEnabled={cardCredentialEnabled}
              onBack={() => {
                setPendingUserAccessDraft(null)
                setMenu('idock-config')
              }}
              onClose={() => {
                setPendingUserAccessDraft(null)
                setMenu('none')
              }}
              onSave={(v) => {
                setUserAccessConfig(v)
                setPendingUserAccessDraft(null)
                setMenu('idock-config')
              }}
              onEditPin={(currentDraft) => {
                setPendingUserAccessDraft(currentDraft)
                setMenu('user-access-edit-pin')
              }}
            />
          )}
          {menu === 'user-access-edit-pin' && mode === 'unlocked' && (
            <EditBypassCode
              title="Edit Access Code"
              verifyBody="Enter the access code"
              newBody="Enter the NEW access code"
              pinIsSet={Boolean(
                (pendingUserAccessDraft ?? userAccessConfig).pin,
              )}
              onBack={() => setMenu('user-access-config')}
              onClose={() => {
                setPendingUserAccessDraft(null)
                setMenu('none')
              }}
              onSave={(newPin) => {
                setPendingUserAccessDraft((d) =>
                  d
                    ? { ...d, pin: newPin }
                    : { ...userAccessConfig, pin: newPin },
                )
                setMenu('user-access-config')
              }}
            />
          )}
          {menu === 'diagnostics' && mode === 'unlocked' && (
            <Diagnostics
              onBack={() => setMenu('idock-config')}
              onClose={() => setMenu('none')}
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
        <PhysicalControls
          onEngageRestraint={handleEngageRestraint}
          onReleaseRestraint={() => {
            // Release ends the dock session: restraint disengages, door
            // closes, leveler returns to the initial stored state. The user
            // is back at "Truck at Dock" with the Engage Restraint prompt.
            setRestraintEngaged(false)
            setRestraintBypassed(false)
            setDoorState('closed')
            setLevelerState('stored')
          }}
          onDoorOpen={handleDoorOpen}
          onDoorClose={() => {
            if (doorState === 'open') setDoorState('closing')
          }}
          onDoorStop={() => {
            // TODO: stop the in-progress open/close.
          }}
          onLevelerPressDown={handleLevelerPress}
          onLevelerPressUp={handleLevelerRelease}
          levelerStored={
            levelerState === 'stored' || levelerState === 'stored-after-use'
          }
        />
        </div>
        {/* Right column: all dev/simulation controls. */}
        <DevControls
          trailerPresent={trailerPresent}
          setTrailerPresent={setTrailerPresent}
          restraintOnline={restraintOnline}
          setRestraintOnline={setRestraintOnline}
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
  trailerPresent: boolean
  setTrailerPresent: (v: boolean) => void
  restraintOnline: boolean
  setRestraintOnline: (v: boolean) => void
  cameras: CameraState[]
  setCamera: (idx: number, state: CameraState) => void
  myqSubscribed: boolean
  setMyqSubscribed: (v: boolean) => void
}

function DevSectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] uppercase tracking-wider text-white/40 px-1">
      {children}
    </div>
  )
}

function DevControls({
  trailerPresent,
  setTrailerPresent,
  restraintOnline,
  setRestraintOnline,
  cameras,
  setCamera,
  myqSubscribed,
  setMyqSubscribed,
}: DevControlsProps) {
  return (
    <div className="flex flex-col gap-4 font-inter text-xs text-white/70 w-[220px]">
      <section className="flex flex-col gap-2">
        <DevSectionTitle>Simulated Sensors</DevSectionTitle>
        <button
          type="button"
          onClick={() => setTrailerPresent(!trailerPresent)}
          className={`flex flex-col items-start gap-1 px-3 py-2 rounded border text-left ${
            trailerPresent
              ? 'border-emerald-500/60 text-emerald-300 bg-emerald-500/10'
              : 'border-white/20 text-white/60 hover:border-white/40'
          }`}
        >
          <div className="flex items-center gap-2 text-sm">
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                trailerPresent ? 'bg-emerald-400' : 'bg-white/30'
              }`}
            />
            Trailer Present
          </div>
          <span className="opacity-70 text-[11px]">
            {trailerPresent ? 'Tripped — truck at dock' : 'Click to trip sensor'}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setRestraintOnline(!restraintOnline)}
          className={`flex flex-col items-start gap-1 px-3 py-2 rounded border text-left ${
            restraintOnline
              ? 'border-emerald-500/60 text-emerald-300 bg-emerald-500/10'
              : 'border-amber-500/60 text-amber-300 bg-amber-500/10'
          }`}
        >
          <div className="flex items-center gap-2 text-sm">
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                restraintOnline ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
            />
            {restraintOnline ? 'Restraint Online' : 'Restraint Offline'}
          </div>
          <span className="opacity-70 text-[11px]">
            {restraintOnline
              ? 'Hardware reachable'
              : 'Cannot engage — bypass required'}
          </span>
        </button>
      </section>

      {cameras.map((state, idx) => (
        <section key={idx} className="flex flex-col gap-2">
          <DevSectionTitle>Camera {idx + 1}</DevSectionTitle>
          <CameraControl
            state={state}
            onChange={(s) => setCamera(idx, s)}
          />
        </section>
      ))}

      <section className="flex flex-col gap-2">
        <DevSectionTitle>myQ Subscription</DevSectionTitle>
        <button
          type="button"
          onClick={() => setMyqSubscribed(!myqSubscribed)}
          className={`flex flex-col items-start gap-1 px-3 py-2 rounded border text-left ${
            myqSubscribed
              ? 'border-emerald-500/60 text-emerald-300 bg-emerald-500/10'
              : 'border-amber-500/60 text-amber-300 bg-amber-500/10'
          }`}
        >
          <div className="flex items-center gap-2 text-sm">
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                myqSubscribed ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
            />
            {myqSubscribed ? 'Active' : 'Inactive'}
          </div>
          <span className="opacity-70 text-[11px]">Click to toggle</span>
        </button>
      </section>
    </div>
  )
}

function CameraControl({
  state,
  onChange,
}: {
  state: CameraState
  onChange: (s: CameraState) => void
}) {
  const opts: { value: CameraState; label: string; tone: string }[] = [
    { value: 'connected', label: 'Connected', tone: 'border-emerald-500/60 text-emerald-300 bg-emerald-500/10' },
    { value: 'disconnected', label: 'Disconnected', tone: 'border-rose-500/60 text-rose-300 bg-rose-500/10' },
    { value: 'never', label: 'Remove', tone: 'border-white/40 text-white/70 bg-white/5' },
  ]
  return (
    <div className="flex gap-1">
      {opts.map((o) => {
        const active = state === o.value
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={`flex-1 px-2 py-1.5 rounded border text-[11px] ${
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
