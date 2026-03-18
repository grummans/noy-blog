<template>
  <div class="flex flex-col min-h-[70vh] font-mono justify-center pl-8 md:pl-24 lg:pl-32 xl:pl-48 py-12">
    <!-- Greeting -->
    <div class="text-gruvbox-light-yellow dark:text-gruvbox-dark-yellow mb-8 md:mb-12 font-bold text-sm md:text-base">
      Good {{ timeOfDay }}, Grummans
    </div>

    <!-- Recent files -->
    <div class="mb-8 md:mb-10">
      <h2 class="text-gruvbox-light-orange dark:text-gruvbox-dark-orange font-bold mb-2">Recent files</h2>
      <div v-if="loading" class="text-gruvbox-light-yellow dark:text-gruvbox-dark-yellow">
        Reading directory...<span class="blinking-cursor"></span>
      </div>
      <div v-else-if="error" class="text-gruvbox-light-red dark:text-gruvbox-dark-red">
        [ERROR] {{ error }}
      </div>
      <ul v-else-if="featuredPosts.length > 0" class="flex flex-col space-y-1">
        <li v-for="(post, index) in featuredPosts.slice(0, 5)" :key="post.id" class="flex items-center group cursor-pointer">
          <span class="text-gruvbox-light-gray dark:text-gruvbox-dark-gray mr-2 select-none">
            <span v-if="index === 0" class="group-hover:hidden">•</span>
            <span v-else class="group-hover:hidden">◦</span>
            <span class="hidden group-hover:inline">▸</span>
          </span>
          <RouterLink
            :to="'/posts/' + (post.slug || post.id)"
            class="flex items-center space-x-4 w-full"
            :class="index === 0 ? 'text-gruvbox-light-yellow dark:text-gruvbox-dark-yellow group-hover:text-gruvbox-light-yellow dark:group-hover:text-gruvbox-dark-yellow' : 'text-gruvbox-light-yellow/70 dark:text-gruvbox-dark-yellow/70 group-hover:text-gruvbox-light-yellow dark:group-hover:text-gruvbox-dark-yellow text-gruvbox-light-orange dark:text-gruvbox-dark-orange opacity-80 group-hover:opacity-100'"
          >
            <span class="truncate">{{ post.title.toLowerCase().replace(/\s+/g, '-') }}.md</span>
            <span class="text-xs flex-shrink-0 text-gruvbox-light-gray dark:text-gruvbox-dark-gray group-hover:text-gruvbox-light-aqua dark:group-hover:text-gruvbox-dark-aqua">{{ formatDate(post.updatedAt) }}</span>
          </RouterLink>
        </li>
      </ul>
      <div v-else class="text-gruvbox-light-gray dark:text-gruvbox-dark-gray">
        No files found.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { format } from 'date-fns'
import { postsApi } from '../services/api'
import type { DashboardPost } from '../types'

const featuredPosts = ref<DashboardPost[]>([])
const loading = ref(true)
const error = ref('')

const timeOfDay = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'morning'
  if (hour < 18) return 'afternoon'
  return 'evening'
})

const fetchFeaturedPosts = async () => {
  try {
    loading.value = true
    error.value = ''
    const response = await postsApi.getDashboard()
    // It is up to 5 posts
    featuredPosts.value = response
  } catch (err: any) {
    error.value = err.message || 'Failed to connect to backend shell.'
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), 'yyyy-MM-dd')
  } catch (e) {
    return dateString
  }
}

onMounted(() => {
  fetchFeaturedPosts()
})
</script>


