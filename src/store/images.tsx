import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { FRAMES } from '../data/museum'

type ImageMap = Record<string, string>

type ImageStoreValue = {
  images: ImageMap
  uploadImage: (file: File) => void
  nextSlotLabel: string
}

const ImageStoreContext = createContext<ImageStoreValue | null>(null)

export function ImageStoreProvider({ children }: { children: ReactNode }) {
  const [images, setImages] = useState<ImageMap>({})
  const [nextIndex, setNextIndex] = useState(0)

  const uploadImage = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return
    const url = URL.createObjectURL(file)
    const frameId = FRAMES[nextIndex % FRAMES.length].id
    setImages((prev) => {
      const old = prev[frameId]
      if (old) URL.revokeObjectURL(old)
      return { ...prev, [frameId]: url }
    })
    setNextIndex((i) => i + 1)
  }, [nextIndex])

  const nextSlotLabel = FRAMES[nextIndex % FRAMES.length].id

  const value = useMemo(
    () => ({ images, uploadImage, nextSlotLabel }),
    [images, uploadImage, nextSlotLabel],
  )

  return (
    <ImageStoreContext.Provider value={value}>
      {children}
    </ImageStoreContext.Provider>
  )
}

export function useImageStore() {
  const ctx = useContext(ImageStoreContext)
  if (!ctx) throw new Error('useImageStore must be used within ImageStoreProvider')
  return ctx
}
