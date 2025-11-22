export function useGeolocation() {
  const coords = useState('coords', () => ({ lat: 48.2566402, lng: 11.66403 }))

  async function request() {
    return new Promise<void>((resolve, reject) => {
      if (!navigator.geolocation) return reject(new Error('Geolocation not supported'))
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          coords.value = { lat: pos.coords.latitude, lng: pos.coords.longitude }
          resolve()
        },
        (err) => reject(err),
        { enableHighAccuracy: true, timeout: 10000 }
      )
    })
  }

  return { coords, request }
}