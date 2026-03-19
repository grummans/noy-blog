<script setup lang="ts">
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <div id="app" class="min-h-screen flex flex-col p-4 max-w-4xl mx-auto selection:bg-gruvbox-light-gray selection:text-gruvbox-light-bg dark:selection:bg-gruvbox-dark-gray dark:selection:text-gruvbox-dark-bg">
    <Header />
    <main class="flex-grow py-6">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>
