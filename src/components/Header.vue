<template>
  <header class="border-b-2 border-gruvbox-light-bg4 dark:border-gruvbox-dark-bg4 pb-2 mb-4 font-mono text-sm max-w-full overflow-x-auto whitespace-nowrap">
    <nav class="flex items-center space-x-1">
      <div class="px-2 py-1 bg-gruvbox-light-bg1 dark:bg-gruvbox-dark-bg1 text-gruvbox-light-fg dark:text-gruvbox-dark-fg font-bold">
        <RouterLink to="/" class="hover:text-gruvbox-light-blue dark:hover:text-gruvbox-dark-blue">~</RouterLink>
      </div>

      <div v-for="item in navItems" :key="item.name" class="flex items-center">
        <span class="text-gruvbox-light-bg4 dark:text-gruvbox-dark-bg4">|</span>
        <RouterLink
          :to="item.path"
          class="px-3 py-1 hover:bg-gruvbox-light-bg2 dark:hover:bg-gruvbox-dark-bg2"
          :class="[
            $route.path === item.path 
              ? 'bg-gruvbox-light-yellow dark:bg-gruvbox-dark-yellow text-gruvbox-light-bg dark:text-gruvbox-dark-bg font-bold' 
              : 'text-gruvbox-light-fg dark:text-gruvbox-dark-fg'
          ]"
        >
          {{ item.name }}
        </RouterLink>
      </div>
      <div class="flex-grow"></div>
      
      <button 
        @click="toggleTheme" 
        class="px-2 py-1 hover:bg-gruvbox-light-bg2 dark:hover:bg-gruvbox-dark-bg2 text-gruvbox-light-blue dark:text-gruvbox-dark-blue flex items-center gap-2"
        aria-label="Toggle theme"
      >
        <span>[:set background={{ isDark ? 'light' : 'dark' }}]</span>
      </button>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { useDark } from '@vueuse/core'

const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: '',
  storageKey: 'theme',
  storage: localStorage
})

const toggleTheme = () => {
  isDark.value = !isDark.value
}

const navItems = [
  { name: 'Posts.md', path: '/posts' },
  { name: 'Tags.json', path: '/tags' },
  { name: 'About.txt', path: '/about' },
  { name: '/Search/', path: '/search' }
]
</script>
