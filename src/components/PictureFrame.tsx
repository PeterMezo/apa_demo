import { useTexture } from '@react-three/drei'
import { useLayoutEffect } from 'react'
import * as THREE from 'three'
import type { FrameDef } from '../data/museum'
import { useImageStore } from '../store/images'

type Props = {
  frame: FrameDef
}

function Artwork({
  src,
  width,
  height,
}: {
  src: string
  width: number
  height: number
}) {
  const texture = useTexture(src)
  useLayoutEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 8
  }, [texture])

  return (
    <mesh position={[0, 0, 0.06]}>
      <planeGeometry args={[width * 0.88, height * 0.88]} />
      <meshStandardMaterial map={texture} roughness={0.85} metalness={0.05} />
    </mesh>
  )
}

export function PictureFrame({ frame }: Props) {
  const { images } = useImageStore()
  const src = images[frame.id] ?? frame.placeholder
  const { width, height } = frame
  const frameDepth = 0.08
  const border = 0.12

  return (
    <group position={frame.position} rotation={frame.rotation}>
      {/* Outer frame */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[width + border * 2, height + border * 2, frameDepth]} />
        <meshStandardMaterial color="#3b2a1a" roughness={0.55} metalness={0.15} />
      </mesh>
      {/* Matte / backing */}
      <mesh position={[0, 0, frameDepth * 0.35]}>
        <boxGeometry args={[width, height, 0.02]} />
        <meshStandardMaterial color="#f2efe8" roughness={1} />
      </mesh>
      <Artwork key={src} src={src} width={width} height={height} />
      <pointLight position={[0, 0.4, 1.1]} intensity={1.4} distance={4} decay={2} />
    </group>
  )
}
