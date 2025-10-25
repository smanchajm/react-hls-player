import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Video } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function Home() {
  const [fluxId, setFluxId] = useState<string>('')
  const navigate = useNavigate()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (fluxId.trim()) {
      navigate(`/player/${encodeURIComponent(fluxId.trim())}`)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Video className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl">CookiNUMnetwork</CardTitle>
          <CardDescription className="text-base">
            Entrez l'identifiant de la session pour rejoindre le cours en direct
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="flux-id" className="text-sm font-medium">
                ID de la session
              </label>
              <Input
                id="flux-id"
                type="text"
                placeholder="ex: cours_cuisine_01"
                value={fluxId}
                onChange={(e) => setFluxId(e.target.value)}
                required
                className="text-base"
              />
            </div>
            <Button type="submit" className="w-full" size="lg">
              Rejoindre la session
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
