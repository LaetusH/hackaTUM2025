<script setup lang="ts">
import RouteForm from '@/components/RouteForm.vue'
import MapView from '@/components/MapView.vue'
import RouteDetails from '@/components/RouteDetails.vue'
import { useGeolocation } from '@/composables/useGeolocation'
import { useRoutePlanner } from '@/composables/useRoutePlanner'

const { coords, request } = useGeolocation()
const { plan } = useRoutePlanner()

const routeGeoJson = ref<any>(null)
const startMarker = ref<{ lat: number; lng: number } | undefined>()
const endMarker = ref<{ lat: number; lng: number } | undefined>()
const distanceKm = ref<number | undefined>()
const durationMin = ref<number | undefined>()
const ascentM = ref<number | undefined>()
const descentM = ref<number | undefined>()
const loading = ref(false)
const error = ref<string | null>(null)

async function onSubmit({ start, end }: { start: string; end: string }) {
  error.value = null
  loading.value = true
  try {
    const res = await plan(start, end)
    if (res.error) {
      error.value = res.error
      return
    }
    routeGeoJson.value = res.geojson
    startMarker.value = res.start
    endMarker.value = res.end
    distanceKm.value = res.distanceKm
    durationMin.value = res.durationMin
    ascentM.value = res.ascentM
    descentM.value = res.descentM
  } finally {
    loading.value = false
  }
}

async function useCurrentLocation() {
  try {
    await request()
  } catch (e) {
    error.value = 'Unable to retrieve current location.'
  }
}

async function sendLocation() {
  if (!coords.value) return
  const res = await $fetch('/location', {
    baseURL: 'http://localhost:8000',
    method: 'POST',
    body: {
      lat: coords.value.lat,
      lng: coords.value.lng,
    },
  })
  console.log(res)
}
</script>

<template>
  <section class="grid gap-2">
    <RouteForm @submit="onSubmit" @use-current-location="useCurrentLocation" />

    <div v-if="loading" class="px-4 py-2 text-sm text-slate-500">Planning route…</div>
    <div v-if="error" class="px-4 py-2 text-sm text-red-600">{{ error }}</div>

    <MapView
      :center="coords"
      :route-geo-json="routeGeoJson"
      :start-marker="startMarker"
      :end-marker="endMarker"
    />

    <RouteDetails
      :distance-km="distanceKm"
      :duration-min="durationMin"
      :ascent-m="ascentM"
      :descent-m="descentM"
    />
  </section>
  <div>
    <button @click="request">📍 Standort abfragen</button>
    <button @click="sendLocation" :disabled="!coords">➡️ An Backend senden</button>
    <p v-if="coords">Lat: {{ coords.lat }}, Lng: {{ coords.lng }}</p>
  </div>
</template>