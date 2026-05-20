import { StopHandIcon, WifiIcon } from '../icons/Icons'

export function TopGraphic() {
  return (
    <>
      <div className="absolute" style={{ left: 123, top: 0, width: 233, height: 233 }}>
        <StopHandIcon />
      </div>
      <div className="absolute" style={{ right: 14, top: 12, width: 36, height: 36 }}>
        <WifiIcon />
      </div>
    </>
  )
}
