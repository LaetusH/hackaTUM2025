<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import L from 'leaflet'

L.Icon.Default.mergeOptions({
  iconUrl: '/marker-icon.png',
  iconRetinaUrl: '/marker-icon-2x.png',
  shadowUrl: '/marker-shadow.png',
})

type LatLng = { lat: number; lng: number }
type Dispenser = { lat: number; lng: number; name: string }
type ServiceStation = { lat: number; lng: number; name: string; pump: boolean; tools: boolean }
type Parking = { coords: [number, number][], name: string }

type Props = {
  center: LatLng
  routeGeoJson?: any
  startMarker?: LatLng
  endMarker?: LatLng
  waterDispensers?: Dispenser[]
  serviceStations?: ServiceStation[]
  bikeParking?: Parking[]
  routeStarted?: boolean
}
const props = defineProps<Props>()

let overlayGroup: L.LayerGroup | null = null

const mapEl = ref<HTMLDivElement | null>(null)
let map: L.Map | null = null
let dispenserLayer: L.LayerGroup | null = null

const waterIcon = L.icon({
  iconUrl: 'water-drop.png',
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28]
})
const serviceIcon = L.icon({
  iconUrl: 'tool.png',
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28]
})
const parkingIcon = L.icon({
  iconUrl: 'parking.png',
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28]
})

let routeLayer: L.GeoJSON<any> | null = null
let startMarker: L.Marker | null = null
let endMarker: L.Marker | null = null
let attributionControl: L.Control.Attribution | null = null

const showOverlays = ref(true)

function toggleOverlays() {
  if (!map || !overlayGroup) return
  showOverlays.value = !showOverlays.value
  if (showOverlays.value) {
    overlayGroup.addTo(map)
  } else {
    map.removeLayer(overlayGroup)
  }
}

onMounted(() => {
  if (!mapEl.value) return

  map = L.map(mapEl.value, {
    zoomControl: false,
    attributionControl: false
  }).setView([props.center.lat, props.center.lng], 13)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
  }).addTo(map)

  attributionControl = L.control.attribution({ position: 'bottomright'}).addTo(map)
  overlayGroup = L.layerGroup().addTo(map)
})

function reloadPage() {
  window.location.reload()
}

watch(() => props.waterDispensers, (dispensers) => {
  if (!overlayGroup || !dispensers) return
  overlayGroup.clearLayers()
  dispensers.forEach(d =>
    L.marker([d.lat, d.lng], { icon: waterIcon, title: d.name })
      .bindPopup(`<strong>${d.name}</strong>`)
      .addTo(overlayGroup!)
  )
})

watch(() => props.serviceStations, (stations) => {
  if (!overlayGroup || !stations) return
  stations.forEach(s =>
    L.marker([s.lat, s.lng], { icon: serviceIcon })
      .bindPopup(`<b>${s.name}</b><br/>Pump: ${s.pump ? '✅' : '❌'}<br/>Tools: ${s.tools ? '✅' : '❌'}`)
      .addTo(overlayGroup!)
  )
})

watch(() => props.bikeParking, (parkings) => {
  if (!overlayGroup || !parkings) return
  parkings.forEach(p =>
    L.polygon(p.coords, { color: 'green', fillColor: 'lightgreen', fillOpacity: 0.4, weight: 4 })
      .bindPopup(`<b>${p.name}</b>`)
      .addTo(overlayGroup!)
  )
})

watch(() => props.routeGeoJson, (geo) => {
  if (!map || !geo) return
  if (routeLayer) routeLayer.remove()

  routeLayer = L.geoJSON(geo, {
    style: { color: '#0EA5E9', weight: 5 }
  }).addTo(map)

  const bounds = routeLayer.getBounds()
  map.fitBounds(bounds, { padding: [24, 24] })

  if (attributionControl) {
    map.removeControl(attributionControl)
    attributionControl = L.control.attribution({ position: 'topright' }).addTo(map)
  }
})

watch(() => props.startMarker, (pos) => {
  if (!map || !pos) return
  if (startMarker) startMarker.remove()
  startMarker = L.marker([pos.lat, pos.lng], { title: 'Start' }).addTo(map)
})

watch(() => props.endMarker, (pos) => {
  if (!map || !pos) return
  if (endMarker) endMarker.remove()
  endMarker = L.marker([pos.lat, pos.lng], { title: 'Destination' }).addTo(map)
})

watch(() => props.routeStarted, (started) => {
  console.log('routeStarted prop:', started)
})

</script>

<template>
  <div class="relative h-full w-full">
    <div ref="mapEl" class="h-full w-full overflow-hidden touch-pan-y z-10"></div>
    <button
      v-if="props.routeStarted"
      @click="toggleOverlays"
      class="absolute top-6 left-6 z-20 bg-white px-3 py-2 rounded shadow-md"
    >
      {{ showOverlays ? 'Hide Extras' : 'Show Extras' }}
    </button>
    <button
      v-if="props.routeStarted"
      @click="reloadPage"
      class="absolute top-6 right-6 z-20 bg-white rounded-full shadow p-1"
    >
      <img src="/cancel.png" alt="Cancel" class="w-12 h-12" />
    </button>

  </div>
</template>

<style>
.leaflet-container {
  background: #f8fafc;
}
</style>