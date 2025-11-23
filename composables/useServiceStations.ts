import Papa from 'papaparse'
import proj4 from 'proj4'

const utm32 = '+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs'

export type ServiceStation = { lat: number; lng: number; name: string; pump: boolean; tools: boolean }

export async function useServiceStations(): Promise<ServiceStation[]> {
  const response = await fetch('/ruhver_radservicestation_point.csv')
  const text = await response.text()
  const parsed = Papa.parse(text, { header: true })

  return parsed.data
    .map((row: any) => {
      const match = row.shape?.match(/POINT \(([^ ]+) ([^ ]+)\)/)
      if (!match) return null
      const x = parseFloat(match[1])
      const y = parseFloat(match[2])
      const [lng, lat] = proj4(utm32, 'WGS84', [x, y])
      return {
        lat,
        lng,
        name: row.standort || 'Service Station',
        pump: row.luftpumpe === 'Ja',
        tools: row.servicestation === 'Ja',
      }
    })
    .filter((d): d is ServiceStation => d !== null)
}