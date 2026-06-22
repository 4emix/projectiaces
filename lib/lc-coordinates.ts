// Coordinate lookup for IACES Local Committees.
// Markers are placed by committee name (city / university) where known,
// falling back to the country centroid so newly added committees still appear.

export type LatLng = [number, number]

// Exact committee-name → [lat, lng] (city / campus level)
const BY_NAME: Record<string, LatLng> = {
  "lc mostar": [43.343, 17.808],
  "lc cairo": [30.044, 31.236],
  "lc lyon": [45.764, 4.835],
  "lc karlsruhe": [49.006, 8.403],
  "lc thessaloniki": [40.64, 22.944],
  "lc budapest": [47.497, 19.04],
  "lc salerno": [40.682, 14.768],
  "aneic mexico": [19.433, -99.133],
  "lc delft": [52.011, 4.357],
  "lc lisbon": [38.722, -9.139],
  "lc porto": [41.158, -8.629],
  "lc timisoara": [45.749, 21.227],
  "lc belgrade": [44.787, 20.448],
  "lc ljubljana": [46.056, 14.505],
  "lc alzaiem alazhari": [15.64, 32.61],
  "lc khartoum": [15.5, 32.56],
  "lc boğaziçi": [41.085, 29.051],
  "lc bogazici": [41.085, 29.051],
  "lc hacettepe": [39.867, 32.735],
  "lc itu": [41.105, 29.024],
  "lc metu": [39.891, 32.783],
  "lc muyap": [40.99, 29.065],
  "lc yildiz": [41.026, 28.952],
  "lc yıldız": [41.026, 28.952],
}

// Country centroid fallback
const BY_COUNTRY: Record<string, LatLng> = {
  "bosnia and herzegovina": [43.9, 17.7],
  egypt: [26.8, 30.8],
  france: [46.6, 2.2],
  germany: [51.2, 10.4],
  greece: [39.0, 22.0],
  hungary: [47.2, 19.5],
  italy: [42.8, 12.8],
  mexico: [23.6, -102.5],
  netherland: [52.1, 5.3],
  netherlands: [52.1, 5.3],
  portugal: [39.5, -8.0],
  romania: [45.9, 24.9],
  serbia: [44.0, 21.0],
  slovenia: [46.1, 14.8],
  sudan: [15.5, 30.2],
  turkey: [39.0, 35.2],
  türkiye: [39.0, 35.2],
}

const norm = (value: string) => value.trim().toLowerCase()

export function getCommitteeCoordinates(name: string, country: string): LatLng | null {
  const byName = BY_NAME[norm(name)]
  if (byName) return byName
  const byCountry = BY_COUNTRY[norm(country)]
  if (byCountry) return byCountry
  return null
}

// Slightly spread overlapping markers (same coordinates) so each stays clickable.
export function jitter([lat, lng]: LatLng, index: number): LatLng {
  if (index === 0) return [lat, lng]
  const angle = index * 2.39996 // golden angle, in radians
  const radius = 0.18 * Math.sqrt(index)
  return [lat + radius * Math.cos(angle), lng + radius * Math.sin(angle)]
}
