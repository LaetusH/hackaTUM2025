<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import L from 'leaflet'

L.Icon.Default.mergeOptions({
  iconUrl: '/marker-icon.png',
  iconRetinaUrl: '/marker-icon-2x.png',
  shadowUrl: '/marker-shadow.png',
})

type LatLng = { lat: number; lng: number }
type Props = {
  center: LatLng
  routeGeoJson?: any
  startMarker?: LatLng
  endMarker?: LatLng
}
const props = defineProps<Props>()

const mapEl = ref<HTMLDivElement | null>(null)
let map: L.Map | null = null
let routeLayer: L.GeoJSON<any> | null = null
let startMarker: L.Marker | null = null
let endMarker: L.Marker | null = null
let attributionControl: L.Control.Attribution | null = null

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
</script>

<template>
  <div ref="mapEl" class="h-full w-full rounded-t-2xl overflow-hidden touch-pan-y"></div>
</template>

<style>
.leaflet-container {
  background: #f8fafc;
}
</style>