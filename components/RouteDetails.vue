<script setup lang="ts">
type Props = {
  distanceKm?: number
  durationMin?: number
  ascentM?: number
  descentM?: number
}
const props = defineProps<Props>()
</script>

<template>
  <div class="px-4 py-3 grid gap-2">
    <div class="flex items-center justify-between">
      <span class="text-sm text-slate-500">Distance</span>
      <span class="text-base font-medium">{{ props.distanceKm?.toFixed(2) ?? '-' }} km</span>
    </div>
    <div class="flex items-center justify-between">
      <span class="text-sm text-slate-500">Estimated time</span>
      <span class="text-base font-medium">{{ props.durationMin?.toFixed(0) ?? '-' }} min</span>
    </div>
    <div class="flex items-center justify-between">
      <span class="text-sm text-slate-500">Elevation</span>
      <span class="text-base font-medium">
        ↑ {{ props.ascentM ?? '-' }} m · ↓ {{ props.descentM ?? '-' }} m
      </span>
    </div>
  </div>
</template>