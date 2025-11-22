type Coordinates = { lat: number; lng: number }

type PlanResult = {
  geojson?: any
  distanceKm?: number
  durationMin?: number
  ascentM?: number
  descentM?: number
  start?: Coordinates
  end?: Coordinates
  error?: string
}

async function geocode(text: string, apiKey: string): Promise<Coordinates | null> {
  const url = 'https://api.openrouteservice.org/geocode/search'
  const res = await fetch(`${url}?api_key=${apiKey}&text=${encodeURIComponent(text)}&size=1`)

  if (!res.ok) {
    console.error('Geocode failed:', res.status, res.statusText)
    const errText = await res.text()
    console.error('Error body:', errText)
    return null
  }

  const data = await res.json()

  const feat = data.features?.[0]
  if (!feat) {
    console.warn('No features returned for', text)
    return null
  }

  const [lng, lat] = feat.geometry.coordinates
  return { lat, lng }
}


export function useRoutePlanner() {
  const config = useRuntimeConfig()
  const apiKey = config.public.orsApiKey

  async function plan(startText: string, endText: string): Promise<PlanResult> {
    try {
      const [start, end] = await Promise.all([
        geocode(startText, apiKey),
        geocode(endText, apiKey),
      ])
      if (!start || !end) return { error: 'Could not geocode start or destination.' }

      const body = {
        coordinates: [[start.lng, start.lat], [end.lng, end.lat]],
        elevation: true,
        instructions: false
      }

      const res = await $fetch('/api/route', {
        method: 'POST',
        body,
      }) as any

      const data = await res
      const feat = data.features?.[0]
      const sum = feat?.properties?.summary

      return {
        geojson: feat,
        distanceKm: sum?.distance ? sum.distance / 1000 : undefined,
        durationMin: sum?.duration ? sum.duration / 60 : undefined,
        ascentM: feat?.properties?.ascent,
        descentM: feat?.properties?.descent,
        start,
        end,
      }
    } catch (e: any) {
      return { error: e.message || 'Unknown error' }
    }
  }

  return { plan }
}