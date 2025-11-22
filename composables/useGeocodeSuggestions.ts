export function useGeocodeSuggestions() {
  const config = useRuntimeConfig()
  const apiKey = config.public.orsApiKey

  const suggestions = ref<any[]>([])
  const loading = ref(false)

  async function search(query: string) {
    if (!query || query.length < 3) {
      suggestions.value = []
      return
    }
    loading.value = true
    try {
      const url = `https://api.openrouteservice.org/geocode/autocomplete?api_key=${apiKey}&text=${encodeURIComponent(query)}&size=5`
      const res = await fetch(url)
      const data = await res.json()
      suggestions.value = data.features.map((f: any) => ({
        label: f.properties.label,
        coords: {
          lat: f.geometry.coordinates[1],
          lng: f.geometry.coordinates[0],
        },
      }))
    } catch (err) {
      console.error(err)
      suggestions.value = []
    } finally {
      loading.value = false
    }
  }

  return { suggestions, search, loading }
}