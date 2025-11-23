<script setup lang="ts">
type Props = {
  distanceKm?: number
  durationMin?: number
  ascentM?: number
  descentM?: number
  nextTrafficLight?: number
  velocityKmh?: number
  targetVelocityKmh?: number
}
const props = defineProps<Props>()
const velocity = props.velocityKmh ?? 0
const targetVelocity = props.targetVelocityKmh ?? 0

const velocityColorClass = computed(() => {
  if (velocity === 0) return 'bg-white text-black'
  if (Math.abs(velocity - targetVelocity) < 1) return 'bg-green-200 text-green-800'
  if (Math.abs(velocity - targetVelocity) < 3) return 'bg-yellow-200 text-yellow-800'
  if (Math.abs(velocity - targetVelocity) >= 3) return 'bg-red-200 text-red-800'
})

const arrowIcon = computed(() => {
  if (velocity < targetVelocity) return '/arrow-up.png'
  if (velocity > targetVelocity) return '/arrow-down.png'
})
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
      <div
        class="inline-flex items-center justify-center p-1 sm:p-3 sm:gap-2 rounded-full font-bold text-2xl"
        :class="velocityColorClass"
      >
        <img v-if="arrowIcon" :src="arrowIcon" alt="trend" class="sm:ml-2 w-5 h-5" />
        {{ props.velocityKmh?.toFixed(1) ?? '-' }} km/h
        <img v-if="arrowIcon" :src="arrowIcon" alt="trend" class="sm:mr-2 w-5 h-5" />
      </div>
      <span class="text-sm text-slate-500"></span>
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