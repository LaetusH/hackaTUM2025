export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()

  try {
    const res = await $fetch('https://api.openrouteservice.org/v2/directions/cycling-regular/geojson', {
        method: 'POST',
        headers: {
        Authorization: config.orsApiKey,
        'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
        'Content-Type': 'application/json; charset=utf-8',
        },
        body,
    })
    return res
  } catch (err: any) {
    console.error('ORS error:', err)
    return { error: err.message || 'ORS request failed'}
  }
})