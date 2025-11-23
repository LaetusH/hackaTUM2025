import Papa from 'papaparse'
import proj4 from 'proj4'

const utm32 = '+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs'

export type Dispenser = { lat: number; lng: number; name: string }

export async function useWaterDispensers(): Promise<Dispenser[]> {
  const response = await fetch('/opendata_trinkwasserbrunnen.csv')
  const text = await response.text()
  const parsed = Papa.parse(text, { header: true })

  return parsed.data
    .map((row: any) => {
      const match = row.shape?.match(/POINT \(([^ ]+) ([^ ]+)\)/)
      if (!match) return null
      const x = parseFloat(match[1])
      const y = parseFloat(match[2])
      const [lng, lat] = proj4(utm32, 'WGS84', [x, y])
      return { lat, lng, name: row.bezeichnung || 'Trinkbrunnen' }
    })
    .filter((d): d is Dispenser => d !== null)
}