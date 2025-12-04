<template>
  <div class="max-w-4xl mx-auto">
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">Tags</h1>
      <p class="text-gray-600 dark:text-gray-400">
        Explore posts by topic and discover content that interests you most.
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-16">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p class="text-gray-600 dark:text-gray-400">Loading tags...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-16">
      <div class="text-red-500 mb-4">
        <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>
      </div>
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Failed to load tags</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-4">{{ error }}</p>
      <button 
        @click="fetchData"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Try again
      </button>
    </div>

    <template v-else>
      <!-- Tag Cloud -->
      <div v-if="sortedTags.length > 0" class="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-8 mb-8">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">Popular Tags</h2>
        <div class="flex flex-wrap gap-3">
          <RouterLink
            v-for="tag in sortedTags"
            :key="tag.id"
            :to="`/tags/${tag.slug}`"
            class="inline-flex items-center px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
            :style="{ fontSize: getTagSize(tag.postCount) + 'rem' }"
          >
            <span class="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
              {{ tag.name }}
            </span>
            <span class="ml-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
              {{ tag.postCount }}
            </span>
          </RouterLink>
        </div>
      </div>

      <!-- Tag List -->
      <div v-if="sortedTags.length > 0" class="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div class="p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">All Tags ({{ sortedTags.length }})</h2>
        </div>
        
        <div class="divide-y divide-gray-200 dark:divide-gray-800">
          <div
            v-for="tag in sortedTags"
            :key="tag.id"
            class="p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div class="flex items-center justify-between">
              <div>
                <RouterLink
                  :to="`/tags/${tag.slug}`"
                  class="text-lg font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {{ tag.name }}
                </RouterLink>
              </div>
              <div class="flex items-center space-x-4">
                <span class="text-sm text-gray-500 dark:text-gray-400">
                  {{ tag.postCount }} {{ tag.postCount === 1 ? 'post' : 'posts' }}
                </span>
                <RouterLink
                  :to="`/tags/${tag.slug}`"
                  class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                >
                  View posts →
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No Tags -->
      <div v-else class="text-center py-16">
        <p class="text-gray-600 dark:text-gray-400">No tags available yet.</p>
      </div>

      <!-- Recent Posts by Top Tags -->
      <div v-if="topTagsWithPosts.length > 0" class="mt-12">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Browse by Popular Tags</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            v-for="tagData in topTagsWithPosts"
            :key="tagData.tag.id"
            class="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6"
          >
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ tagData.tag.name }}
              </h3>
              <RouterLink
                :to="`/tags/${tagData.tag.slug}`"
                class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
              >
                View all {{ tagData.tag.postCount }} →
              </RouterLink>
            </div>
            
            <div class="space-y-3">
              <div
                v-for="post in tagData.posts"
                :key="post.id"
                class="block group"
              >
                <RouterLink
                  :to="`/posts/${post.slug}`"
                  class="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <h4 class="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-1 line-clamp-1">
                    {{ post.title }}
                  </h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ formatDate(post.updatedAt) }} • {{ post.readingTimeMinutes }} min read
                  </p>
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { format } from 'date-fns'
import { tagsApi, postsApi } from '@/services/api'
import type { Tag, PostListItem } from '@/types'

// State
const allTags = ref<Tag[]>([])
const allPosts = ref<PostListItem[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

// Fetch data
const fetchData = async () => {
  loading.value = true
  error.value = null
  
  try {
    const [tagsData, postsData] = await Promise.all([
      tagsApi.getAll(),
      postsApi.getAll()
    ])
    
    allTags.value = tagsData
    allPosts.value = postsData
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load data'
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)

const sortedTags = computed(() => {
  return [...allTags.value].sort((a, b) => b.postCount - a.postCount)
})

// Get top 4 tags with their recent posts
const topTagsWithPosts = computed(() => {
  const topTags = sortedTags.value.slice(0, 4)
  
  return topTags.map(tag => {
    const postsForTag = allPosts.value
      .filter(post => post.tags.some(t => t.id === tag.id))
      .slice(0, 3)
    
    return {
      tag,
      posts: postsForTag
    }
  }).filter(item => item.posts.length > 0)
})

const getTagSize = (count: number) => {
  if (allTags.value.length === 0) return 1
  const maxCount = Math.max(...allTags.value.map(tag => tag.postCount))
  const minSize = 0.875 // 14px
  const maxSize = 1.25 // 20px
  const ratio = count / maxCount
  return minSize + (maxSize - minSize) * ratio
}

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'MMM dd, yyyy')
}
</script>
