export function useGeolocation() {
  const coords = useState('coords', () => ({ lat: 48.2566402, lng: 11.66403 }))
  const locationName = useState('locationName', () => '')

  async function request() {
    return new Promise<void>((resolve, reject) => {
      if (!navigator.geolocation) return reject(new Error('Geolocation not supported'))
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          coords.value = { lat: pos.coords.latitude, lng: pos.coords.longitude }
          await fetchPlaceName(coords.value.lat, coords.value.lng)
          resolve()
        },
        (err) => reject(err),
        { enableHighAccuracy: true, timeout: 10000 }
      )
    })
  }

  async function fetchPlaceName(lat: number, lng: number) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      )
      const data = await res.json()
      locationName.value = data.display_name || `${lat}, ${lng}`
      console.log(locationName.value)
    } catch {
      locationName.value = `${lat}, ${lng}`
    }
  }

  return { coords, locationName, request }
}