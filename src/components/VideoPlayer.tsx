import { useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'

interface VideoPlayerProps {
  fluxId: string
}

export function VideoPlayer({ fluxId }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsRef = useRef<Hls | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // URL du flux HLS (à ajuster selon votre configuration serveur)
    const streamUrl = `/video/${fluxId}/index.m3u8`

    // Vérifier si HLS.js est supporté
    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      })

      hlsRef.current = hls

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setError('Erreur réseau. Impossible de charger le flux.')
              hls.startLoad()
              break
            case Hls.ErrorTypes.MEDIA_ERROR:
              setError('Erreur média. Tentative de récupération...')
              hls.recoverMediaError()
              break
            default:
              setError('Erreur fatale. Impossible de lire le flux.')
              hls.destroy()
              break
          }
        }
      })

      hls.loadSource(streamUrl)
      hls.attachMedia(video)

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setError(null)
      })
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Support natif pour Safari
      video.src = streamUrl
      video.addEventListener('error', () => {
        setError('Erreur lors du chargement du flux vidéo.')
      })
    } else {
      setError('Votre navigateur ne supporte pas la lecture de flux HLS.')
    }

    // Cleanup
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }
    }
  }, [fluxId])

  return (
    <div className="relative w-full bg-black rounded-lg overflow-hidden shadow-xl">
      <video
        ref={videoRef}
        controls
        className="w-full aspect-video"
        autoPlay
        muted
      >
        Votre navigateur ne supporte pas la lecture vidéo.
      </video>

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="text-white text-center p-6">
            <p className="text-lg font-semibold mb-2">Erreur de lecture</p>
            <p className="text-sm text-gray-300">{error}</p>
          </div>
        </div>
      )}
    </div>
  )
}
