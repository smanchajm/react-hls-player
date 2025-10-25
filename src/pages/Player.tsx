import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Radio } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { VideoPlayer } from '@/components/VideoPlayer'

export function Player() {
  const { fluxId } = useParams<{ fluxId: string }>()
  const navigate = useNavigate()

  if (!fluxId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">
            ID de session manquant
          </p>
          <Button onClick={() => navigate('/')} className="mt-4">
            Retour à l'accueil
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
            <div className="flex items-center gap-2">
              <Radio className="h-5 w-5 text-red-500 animate-pulse" />
              <span className="font-semibold">Session: {fluxId}</span>
            </div>
            <div className="w-24" /> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Video Player */}
          <VideoPlayer fluxId={fluxId} />

          {/* Info Panel */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-2">
              CookiNUMnetwork - Cours en direct
            </h2>
            <p className="text-muted-foreground">
              Vous êtes connecté à la session <strong>{fluxId}</strong>
            </p>
            <div className="mt-4 p-4 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-900">
                Le flux vidéo et les annotations apparaîtront automatiquement
                lorsque l'instructeur démarrera la session.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
