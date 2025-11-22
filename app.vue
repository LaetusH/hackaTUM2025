<script setup lang="ts">
import MainApp from './components/MainApp.vue';

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'},
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
    { name: 'apple-mobile-web-app-title', content: 'Tempute' }
  ],
  link: [
    { rel: 'apple-touch-icon', href: '/icons/logo-192x192.png' }
  ]
})
</script>
<template>
  <div>
    <MainApp/>
  </div>
</template>