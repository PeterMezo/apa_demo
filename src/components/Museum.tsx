import { FRAMES } from '../data/museum'
import { PictureFrame } from './PictureFrame'

function Floor({
  position,
  size,
  color,
}: {
  position: [number, number, number]
  size: [number, number]
  color: string
}) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={position} receiveShadow>
      <planeGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.9} metalness={0.05} />
    </mesh>
  )
}

function Ceiling({
  position,
  size,
}: {
  position: [number, number, number]
  size: [number, number]
}) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]} position={position}>
      <planeGeometry args={size} />
      <meshStandardMaterial color="#e8e2d6" roughness={1} />
    </mesh>
  )
}

function WallMesh({
  position,
  size,
  color = '#d9d0c1',
}: {
  position: [number, number, number]
  size: [number, number, number]
  color?: string
}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.85} metalness={0.02} />
    </mesh>
  )
}

function DoorFrame({
  position,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[-1.55, 1.6, 0]}>
        <boxGeometry args={[0.2, 3.2, 0.35]} />
        <meshStandardMaterial color="#5a4030" roughness={0.6} />
      </mesh>
      <mesh position={[1.55, 1.6, 0]}>
        <boxGeometry args={[0.2, 3.2, 0.35]} />
        <meshStandardMaterial color="#5a4030" roughness={0.6} />
      </mesh>
      <mesh position={[0, 3.15, 0]}>
        <boxGeometry args={[3.3, 0.2, 0.35]} />
        <meshStandardMaterial color="#5a4030" roughness={0.6} />
      </mesh>
    </group>
  )
}

export function Museum() {
  return (
    <group>
      {/* Lighting */}
      <ambientLight intensity={0.45} />
      <hemisphereLight args={['#f5f0e6', '#6b6358', 0.55]} />
      <pointLight position={[0, 3.5, 0]} intensity={28} distance={18} decay={2} color="#fff4e5" />
      <pointLight position={[12, 3.5, 0]} intensity={30} distance={18} decay={2} color="#fff8f0" />
      <pointLight position={[12, 3.5, -11]} intensity={30} distance={18} decay={2} color="#f0f4ff" />

      {/* Bejárat */}
      <Floor position={[0, 0, 0]} size={[12, 10]} color="#8a7a65" />
      <Ceiling position={[0, 4, 0]} size={[12, 10]} />
      <WallMesh position={[0, 2, -5]} size={[12, 4, 0.35]} />
      <WallMesh position={[0, 2, 5]} size={[12, 4, 0.35]} />
      <WallMesh position={[-6, 2, 0]} size={[0.35, 4, 10]} />
      {/* East wall with door */}
      <WallMesh position={[6, 2, -3.2]} size={[0.35, 4, 3.6]} />
      <WallMesh position={[6, 2, 3.2]} size={[0.35, 4, 3.6]} />
      <WallMesh position={[6, 3.55, 0]} size={[0.35, 0.9, 2.8]} />
      <DoorFrame position={[6, 0, 0]} rotation={[0, Math.PI / 2, 0]} />

      {/* Galéria */}
      <Floor position={[12, 0, 0]} size={[12, 10]} color="#7d7264" />
      <Ceiling position={[12, 4, 0]} size={[12, 10]} />
      <WallMesh position={[12, 2, 5]} size={[12, 4, 0.35]} color="#d2c8b8" />
      <WallMesh position={[18, 2, 0]} size={[0.35, 4, 10]} color="#d2c8b8" />
      {/* North wall with door to Modern */}
      <WallMesh position={[8.25, 2, -5]} size={[4.5, 4, 0.35]} color="#d2c8b8" />
      <WallMesh position={[15.75, 2, -5]} size={[4.5, 4, 0.35]} color="#d2c8b8" />
      <WallMesh position={[12, 3.55, -5]} size={[3, 0.9, 0.35]} color="#d2c8b8" />
      <DoorFrame position={[12, 0, -5]} />

      {/* Modern */}
      <Floor position={[12, 0, -11]} size={[12, 12]} color="#6e7580" />
      <Ceiling position={[12, 4, -11]} size={[12, 12]} />
      <WallMesh position={[12, 2, -17]} size={[12, 4, 0.35]} color="#c8ced6" />
      <WallMesh position={[6, 2, -11]} size={[0.35, 4, 12]} color="#c8ced6" />
      <WallMesh position={[18, 2, -11]} size={[0.35, 4, 12]} color="#c8ced6" />

      {/* Pedestal / plaque in Bejárat */}
      <mesh position={[0, 0.45, 1.2]}>
        <boxGeometry args={[1.2, 0.9, 0.8]} />
        <meshStandardMaterial color="#4a3b2c" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.95, 1.2]}>
        <boxGeometry args={[1.0, 0.08, 0.65]} />
        <meshStandardMaterial color="#c4a574" metalness={0.4} roughness={0.35} />
      </mesh>

      {FRAMES.map((frame) => (
        <PictureFrame key={frame.id} frame={frame} />
      ))}
    </group>
  )
}
