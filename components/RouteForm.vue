<script setup lang="ts">
import { ref } from 'vue'
import { useGeocodeSuggestions } from '@/composables/useGeocodeSuggestions'
import { useDebounceFn } from '@vueuse/core'

const props = defineProps<{
  startValue?: string
}>()

const start = ref(props.startValue ?? '')
watch(() => props.startValue, (val) => {
  if (val) start.value = val
})

const emit = defineEmits<{
  (e: 'submit', payload: { start: string; end: string }): void
  (e: 'use-current-location'): void
}>()

const end = ref('')

const { suggestions, search, loading } = useGeocodeSuggestions()
const activeField = ref<'start' | 'end' | null>(null)

function selectSuggestion(s: any) {
  if (activeField.value === 'start') start.value = s.label
  if (activeField.value === 'end') end.value = s.label
  suggestions.value = []
}

function setCurrentLocation(label: string) {
  start.value = label
}

const debouncedSearch = useDebounceFn((q: string) => search(q), 500)
</script>

<template>
  <form @submit.prevent="emit('submit', { start, end })" class="p-6 grid gap-2">
    <div class="flex gap-2">
      <div class="relative flex-1">
        <input
          v-model="start"
          type="text"
          placeholder="Start location"
          @input="activeField='start'; debouncedSearch(start)"
          class="w-full rounded-md border px-3 py-3 focus:ring-2 focus:ring-primary focus:outline-none"
        />
        <ul v-if="suggestions.length && activeField==='start'" class="absolute z-50 bg-white border rounded-md mt-1 w-full">
          <li
            v-for="s in suggestions"
            :key="s.label + '-' + s.coords.lat + '-' + s.coords.lng"
            @click="selectSuggestion(s)"
            class="px-3 py-2 hover:bg-slate-100 cursor-pointer"
          >
            {{ s.label }}
          </li>
        </ul>
      </div>
      <button
        type="button"
        @click="emit('use-current-location')"
        class="rounded-md bg-primary px-4 py-3 bg-gray-100 font-semibold shadow cursor-pointer transition-colors duration-200 flex items-center justify-center"
      >
        <span class="sm:hidden">📍</span>
        <span class="hidden sm:inline">📍 Current location</span>
      </button>
    </div>

    <div class="relative">
      <input
        v-model="end"
        type="text"
        placeholder="Destination"
        @input="activeField='end'; debouncedSearch(end)"
        class="w-full rounded-md border px-3 py-3 focus:ring-2 focus:ring-primary focus:outline-none"
      />
      <ul v-if="suggestions.length && activeField==='end'" class="absolute z-50 bg-white border rounded-md mt-1 w-full">
        <li
          v-for="s in suggestions"
          :key="s.label + '-' + s.coords.lat + '-' + s.coords.lng"
          @click="selectSuggestion(s)"
          class="px-3 py-2 hover:bg-slate-100 cursor-pointer"
        >
          {{ s.label }}
        </li>
      </ul>
    </div>

    <button type="submit" class="w-full rounded-md bg-primary px-4 py-3 font-semibold bg-gray-100 cursor-pointer shadow transition-colors duration-200">
      Plan route
    </button>
  </form>
</template>