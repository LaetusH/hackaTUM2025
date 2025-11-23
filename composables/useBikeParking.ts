import Papa from 'papaparse'
import proj4 from 'proj4'

const utm32 = '+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs'

export type Parking = { coords: [number, number][], name: string }

export async function useBikeParking(): Promise<Parking[]> {
  const response = await fetch('/opendata_ruhver_fahrradparken_line.csv')
  const text = await response.text()
  const parsed = Papa.parse(text, { header: true })

  return parsed.data
    .map((row: any) => {
      const shape: string = row.shape ?? ''
      const match = shape.match(/MULTILINESTRING\s*\(\((.+)\)\)/)
      if (!match || !match[1]) return null

      const coords: [number, number][] = match[1]
        .split(',')
        .map((pair: string): [number, number] | null => {
          const [xStr, yStr] = pair.trim().split(/\s+/)
          const x = parseFloat(xStr)
          const y = parseFloat(yStr)
          if (!Number.isFinite(x) || !Number.isFinite(y)) return null
          const [lng, lat] = proj4(utm32, 'WGS84', [x, y])
          return [lat, lng]
        })
        .filter((c): c is [number, number] => c !== null)

      return { coords, name: row.ortsangabe || row.standort || 'Bike Parking' }
    })
    .filter((d): d is Parking => d !== null)
}