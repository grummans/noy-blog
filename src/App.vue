<script setup lang="ts">
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <div id="app" class="min-h-screen bg-white dark:bg-gray-900">
    <Header />
    <main class="container mx-auto px-4 py-8">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>
