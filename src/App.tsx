import { Canvas } from '@react-three/fiber'
import { Suspense, useCallback, useRef, useState, type ChangeEvent } from 'react'
import { Museum } from './components/Museum'
import { Player } from './components/Player'
import { ROOM_NAMES, type RoomId } from './data/museum'
import { ImageStoreProvider, useImageStore } from './store/images'
import './App.css'

function Hud({
  locked,
  room,
  onEnter,
}: {
  locked: boolean
  room: RoomId
  onEnter: () => void
}) {
  const { uploadImage, nextSlotLabel } = useImageStore()
  const fileRef = useRef<HTMLInputElement>(null)

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) uploadImage(file)
    e.target.value = ''
  }

  return (
    <div className="hud">
      {!locked && (
        <button type="button" className="enter-overlay" onClick={onEnter}>
          <div className="enter-card">
            <p className="brand">Virtuális Múzeum</p>
            <h1>Kattints a belépéshez</h1>
            <p className="hint">
              Egér: körbenézés · Nyilak / WASD: mozgás · Esc: kilépés
            </p>
          </div>
        </button>
      )}

      <div className="top-bar">
        <div className="room-badge">
          <span className="label">Szoba</span>
          <strong>{ROOM_NAMES[room]}</strong>
        </div>
        <div className="controls-hint">
          <span>← → ↑ ↓ / WASD</span>
          <span>Egér: nézés</span>
        </div>
      </div>

      <div className="bottom-bar">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="file-input"
          onChange={onFile}
        />
        <button
          type="button"
          className="upload-btn"
          onClick={() => fileRef.current?.click()}
        >
          Kép feltöltése
        </button>
        <span className="slot-hint">Következő keret: {nextSlotLabel}</span>
      </div>
    </div>
  )
}

function MuseumApp() {
  const [locked, setLocked] = useState(false)
  const [room, setRoom] = useState<RoomId>('bejarat')
  const canvasWrapRef = useRef<HTMLDivElement>(null)

  const onEnter = useCallback(() => {
    const canvas = canvasWrapRef.current?.querySelector('canvas')
    canvas?.requestPointerLock()
  }, [])

  return (
    <div className="app">
      <div className="canvas-wrap" ref={canvasWrapRef}>
        <Canvas
          shadows
          camera={{ fov: 70, near: 0.1, far: 80, position: [0, 1.65, 3.5] }}
          gl={{ antialias: true }}
        >
          <color attach="background" args={['#1a1814']} />
          <fog attach="fog" args={['#1a1814', 18, 42]} />
          <Suspense fallback={null}>
            <Museum />
            <Player onRoomChange={setRoom} onLockChange={setLocked} />
          </Suspense>
        </Canvas>
      </div>
      <Hud locked={locked} room={room} onEnter={onEnter} />
    </div>
  )
}

export default function App() {
  return (
    <ImageStoreProvider>
      <MuseumApp />
    </ImageStoreProvider>
  )
}
