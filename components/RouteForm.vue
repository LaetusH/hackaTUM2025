<script setup lang="ts">
import { ref } from 'vue'
import { useGeocodeSuggestions } from '@/composables/useGeocodeSuggestions'

const emit = defineEmits<{
  (e: 'submit', payload: { start: string; end: string }): void
}>()

const start = ref('')
const end = ref('')

const { suggestions, search, loading } = useGeocodeSuggestions()
const activeField = ref<'start' | 'end' | null>(null)

function selectSuggestion(s: any) {
  if (activeField.value === 'start') start.value = s.label
  if (activeField.value === 'end') end.value = s.label
  suggestions.value = []
}

import { useDebounceFn } from '@vueuse/core'

const debouncedSearch = useDebounceFn((q: string) => search(q), 300)
</script>

<template>
  <form @submit.prevent="emit('submit', { start, end })" class="p-4 grid gap-3">
    <div class="relative">
      <input
        v-model="start"
        type="text"
        placeholder="Start location"
        @input="activeField='start'; debouncedSearch(start)"
        class="w-full rounded-md border px-3 py-3"
      />
      <ul v-if="suggestions.length" class="absolute z-50 bg-white border rounded-md mt-1 w-full">
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

    <div class="relative">
      <input
        v-model="end"
        type="text"
        placeholder="Destination"
        @input="activeField='end'; debouncedSearch(end)"
        class="w-full rounded-md border px-3 py-3"
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

    <button type="submit" class="mt-2 w-full rounded-md bg-primary px-4 py-3">
      Plan route
    </button>
  </form>
</template>