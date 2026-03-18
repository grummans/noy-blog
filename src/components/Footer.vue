<template>
  <footer class="mt-auto font-mono text-xs flex flex-col sm:flex-row items-center justify-between border-t border-gruvbox-light-bg4 dark:border-gruvbox-dark-bg4 pt-2 pb-2">
    <div class="flex space-x-4 mb-2 sm:mb-0">
      <span class="bg-gruvbox-light-green dark:bg-gruvbox-dark-green text-gruvbox-light-bg dark:text-gruvbox-dark-bg px-2 font-bold uppercase">NORMAL</span>
      <span class="text-gruvbox-light-gray dark:text-gruvbox-dark-gray">grummans.blog</span>
    </div>

    <div class="flex space-x-4 text-gruvbox-light-gray dark:text-gruvbox-dark-gray">
      <a 
        v-for="social in socialLinks" 
        :key="social.name"
        :href="social.url" 
        target="_blank" 
        rel="noopener noreferrer"
        class="hover:text-gruvbox-light-blue dark:hover:text-gruvbox-dark-blue"
      >
        [{{ social.name }}]
      </a>
      <span>utf-8</span>
      <span>|</span>
      <span>100% </span>
    </div>
  </footer>
</template>

<script setup lang="ts">
const socialLinks = [
  { name: 'GitHub', url: 'https://github.com/Grummans' }
]
</script>
