export type Wall = {
  minX: number
  maxX: number
  minZ: number
  maxZ: number
}

export type FrameDef = {
  id: string
  position: [number, number, number]
  rotation: [number, number, number]
  width: number
  height: number
  placeholder: string
  room: RoomId
}

export type RoomId = 'bejarat' | 'galeria' | 'modern'

export const ROOM_NAMES: Record<RoomId, string> = {
  bejarat: 'Bejárat',
  galeria: 'Galéria',
  modern: 'Modern terem',
}

/** Collision AABBs for solid wall segments (XZ plane). */
export const WALLS: Wall[] = [
  // Bejárat — north / south / west
  { minX: -6.2, maxX: 6.2, minZ: -5.25, maxZ: -4.75 },
  { minX: -6.2, maxX: 6.2, minZ: 4.75, maxZ: 5.25 },
  { minX: -6.25, maxX: -5.75, minZ: -5.2, maxZ: 5.2 },
  // Bejárat east (door gap z -1.4..1.4)
  { minX: 5.75, maxX: 6.25, minZ: -5.2, maxZ: -1.4 },
  { minX: 5.75, maxX: 6.25, minZ: 1.4, maxZ: 5.2 },
  // Galéria — south / east
  { minX: 5.8, maxX: 18.2, minZ: 4.75, maxZ: 5.25 },
  { minX: 17.75, maxX: 18.25, minZ: -5.2, maxZ: 5.2 },
  // Galéria north (door gap x 10.5..13.5 → Modern)
  { minX: 5.8, maxX: 10.5, minZ: -5.25, maxZ: -4.75 },
  { minX: 13.5, maxX: 18.2, minZ: -5.25, maxZ: -4.75 },
  // Modern — north / west / east
  { minX: 5.8, maxX: 18.2, minZ: -17.25, maxZ: -16.75 },
  { minX: 5.75, maxX: 6.25, minZ: -17.2, maxZ: -4.8 },
  { minX: 17.75, maxX: 18.25, minZ: -17.2, maxZ: -4.8 },
]

export const FRAMES: FrameDef[] = [
  // Bejárat (4)
  {
    id: 'f1',
    position: [-3.2, 2.1, -4.85],
    rotation: [0, 0, 0],
    width: 2.2,
    height: 1.6,
    placeholder: '/placeholders/1.svg',
    room: 'bejarat',
  },
  {
    id: 'f2',
    position: [0.5, 2.1, -4.85],
    rotation: [0, 0, 0],
    width: 2.0,
    height: 1.5,
    placeholder: '/placeholders/2.svg',
    room: 'bejarat',
  },
  {
    id: 'f3',
    position: [3.5, 2.1, -4.85],
    rotation: [0, 0, 0],
    width: 1.8,
    height: 1.4,
    placeholder: '/placeholders/3.svg',
    room: 'bejarat',
  },
  {
    id: 'f4',
    position: [-5.85, 2.1, 0],
    rotation: [0, Math.PI / 2, 0],
    width: 2.4,
    height: 1.7,
    placeholder: '/placeholders/4.svg',
    room: 'bejarat',
  },
  // Galéria (4)
  {
    id: 'f5',
    position: [9, 2.15, 4.85],
    rotation: [0, Math.PI, 0],
    width: 2.3,
    height: 1.65,
    placeholder: '/placeholders/5.svg',
    room: 'galeria',
  },
  {
    id: 'f6',
    position: [13.5, 2.15, 4.85],
    rotation: [0, Math.PI, 0],
    width: 2.1,
    height: 1.55,
    placeholder: '/placeholders/6.svg',
    room: 'galeria',
  },
  {
    id: 'f7',
    position: [17.85, 2.2, -1.5],
    rotation: [0, -Math.PI / 2, 0],
    width: 2.5,
    height: 1.8,
    placeholder: '/placeholders/7.svg',
    room: 'galeria',
  },
  {
    id: 'f8',
    position: [17.85, 2.2, 2.2],
    rotation: [0, -Math.PI / 2, 0],
    width: 2.0,
    height: 1.5,
    placeholder: '/placeholders/8.svg',
    room: 'galeria',
  },
  // Modern (4)
  {
    id: 'f9',
    position: [9, 2.2, -16.85],
    rotation: [0, 0, 0],
    width: 2.4,
    height: 1.7,
    placeholder: '/placeholders/9.svg',
    room: 'modern',
  },
  {
    id: 'f10',
    position: [13.5, 2.2, -16.85],
    rotation: [0, 0, 0],
    width: 2.2,
    height: 1.6,
    placeholder: '/placeholders/10.svg',
    room: 'modern',
  },
  {
    id: 'f11',
    position: [6.15, 2.15, -11],
    rotation: [0, Math.PI / 2, 0],
    width: 2.3,
    height: 1.65,
    placeholder: '/placeholders/11.svg',
    room: 'modern',
  },
  {
    id: 'f12',
    position: [17.85, 2.15, -12.5],
    rotation: [0, -Math.PI / 2, 0],
    width: 2.6,
    height: 1.85,
    placeholder: '/placeholders/12.svg',
    room: 'modern',
  },
]

export function getRoomAt(x: number, z: number): RoomId {
  if (x >= 6 && x <= 18 && z >= -17 && z <= -5) return 'modern'
  if (x >= 6 && x <= 18 && z >= -5 && z <= 5) return 'galeria'
  return 'bejarat'
}

const PLAYER_RADIUS = 0.35

export function collides(x: number, z: number): boolean {
  for (const w of WALLS) {
    if (
      x + PLAYER_RADIUS > w.minX &&
      x - PLAYER_RADIUS < w.maxX &&
      z + PLAYER_RADIUS > w.minZ &&
      z - PLAYER_RADIUS < w.maxZ
    ) {
      return true
    }
  }
  // Keep player inside museum outer bounds
  if (x < -5.7 || x > 17.7) return true
  if (z > 4.7) return true
  if (z < -16.7) return true
  // Missing corner: west of modern/galeria at z < -5 and x < 6
  if (x < 6.3 && z < -5) return true
  return false
}
