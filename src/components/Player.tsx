import { PointerLockControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef, type ComponentRef } from 'react'
import * as THREE from 'three'
import { collides, getRoomAt, type RoomId } from '../data/museum'

type Props = {
  onRoomChange: (room: RoomId) => void
  onLockChange: (locked: boolean) => void
}

const SPEED = 4.5

export function Player({ onRoomChange, onLockChange }: Props) {
  const { camera } = useThree()
  const keys = useRef<Record<string, boolean>>({})
  const roomRef = useRef<RoomId>('bejarat')
  const controlsRef = useRef<ComponentRef<typeof PointerLockControls>>(null)

  useEffect(() => {
    camera.position.set(0, 1.65, 3.5)
    camera.rotation.set(0, 0, 0)
  }, [camera])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keys.current[e.code] = true
    }
    const up = (e: KeyboardEvent) => {
      keys.current[e.code] = false
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [])

  useFrame((_, delta) => {
    const locked = controlsRef.current?.isLocked ?? false
    if (!locked) return

    const front = new THREE.Vector3()
    camera.getWorldDirection(front)
    front.y = 0
    front.normalize()

    const right = new THREE.Vector3()
      .crossVectors(front, new THREE.Vector3(0, 1, 0))
      .normalize()

    const move = new THREE.Vector3()
    const k = keys.current
    if (k.ArrowUp || k.KeyW) move.add(front)
    if (k.ArrowDown || k.KeyS) move.sub(front)
    if (k.ArrowRight || k.KeyD) move.add(right)
    if (k.ArrowLeft || k.KeyA) move.sub(right)

    if (move.lengthSq() > 0) {
      move.normalize().multiplyScalar(SPEED * delta)
      const nx = camera.position.x + move.x
      const nz = camera.position.z + move.z

      if (!collides(nx, nz)) {
        camera.position.x = nx
        camera.position.z = nz
      } else {
        if (!collides(nx, camera.position.z)) camera.position.x = nx
        if (!collides(camera.position.x, nz)) camera.position.z = nz
      }
    }

    camera.position.y = 1.65

    const room = getRoomAt(camera.position.x, camera.position.z)
    if (room !== roomRef.current) {
      roomRef.current = room
      onRoomChange(room)
    }
  })

  return (
    <PointerLockControls
      ref={controlsRef}
      onLock={() => onLockChange(true)}
      onUnlock={() => onLockChange(false)}
    />
  )
}
