<script setup lang="ts">
type Props = {
  distanceKm?: number
  durationMin?: number
  ascentM?: number
  descentM?: number
  nextTrafficLight?: number
  velocityKmh?: number
}
const props = defineProps<Props>()
</script>

<template>
  <div class="px-6 py-4 m-5 flex items-center justify-between bg-white shadow-md rounded-full">
    <div class="text-left">
      <span class="block text-lg font-semibold text-slate-700">
        {{ props.nextTrafficLight ?? '-' }} m
      </span>
      <span class="text-sm text-slate-500">Next light</span>
    </div>

    <div class="text-center">
      <span class="block text-2xl font-bold text-slate-800">
        {{ props.velocityKmh?.toFixed(1) ?? '-' }} km/h
      </span>
      <span class="text-sm text-slate-500">Velocity</span>
    </div>

    <div class="text-right">
      <div class="text-base font-medium">
        {{ props.distanceKm?.toFixed(2) ?? '-' }} km
      </div>
      <div class="text-base font-medium">
        {{ props.durationMin?.toFixed(0) ?? '-' }} min
      </div>
    </div>
  </div>
</template>