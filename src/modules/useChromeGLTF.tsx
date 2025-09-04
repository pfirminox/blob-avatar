import { useEffect, useMemo, useState } from "react"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js"
import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js"

export function useChromeGLTF(glbPath: string, dracoFolder: string) {
  const [gltf, setGltf] = useState<GLTF | null>(null)

  const glbURL = useMemo(() => chrome.runtime.getURL(glbPath), [])
  const dracoPath = useMemo(() => chrome.runtime.getURL(dracoFolder), [])

  useEffect(() => {
    const loader = new GLTFLoader()
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath(dracoPath)
    loader.setDRACOLoader(dracoLoader)

    loader.load(
      glbURL,
      (data) => setGltf(data),
      undefined,
      (err) => console.error("Failed to load GLB:", err)
    )

    // Cleanup function must be a function
    return () => {
      dracoLoader.dispose() // dispose resources
      // Do NOT return anything else
    }
  }, [glbURL, dracoPath])


  return gltf
}