<template>
  <div class="max-w-4xl mx-auto">
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">Search</h1>
      <p class="text-gray-600 dark:text-gray-400">
        Find articles, tutorials, and insights across all topics.
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-16">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p class="text-gray-600 dark:text-gray-400">Loading...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-16">
      <div class="text-red-500 mb-4">
        <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>
      </div>
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Failed to load data</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-4">{{ error }}</p>
      <button 
        @click="fetchData"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Try again
      </button>
    </div>

    <template v-else>
      <!-- Search Input -->
      <div class="mb-8">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search posts, tags, or topics..."
            class="block w-full pl-10 pr-4 py-4 text-lg border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-white"
          >
        </div>
        
        <!-- Search Filters -->
        <div class="mt-4 flex flex-wrap gap-2">
          <button
            v-for="filter in searchFilters"
            :key="filter.value"
            @click="selectedFilter = filter.value"
            class="px-4 py-2 rounded-lg border transition-colors"
            :class="selectedFilter === filter.value 
              ? 'bg-blue-600 text-white border-blue-600' 
              : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'"
          >
            {{ filter.label }}
          </button>
        </div>
      </div>

      <!-- Search Results -->
      <div v-if="searchQuery.length > 0">
        <!-- Results Summary -->
        <div class="mb-6">
          <p class="text-gray-600 dark:text-gray-400">
            {{ searchResults.length }} result{{ searchResults.length === 1 ? '' : 's' }} 
            for "<span class="font-medium text-gray-900 dark:text-white">{{ searchQuery }}</span>"
          </p>
        </div>

        <!-- Results -->
        <div v-if="searchResults.length > 0" class="space-y-6">
          <article
            v-for="result in searchResults"
            :key="result.slug"
            class="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md transition-shadow"
          >
            <div class="flex items-center gap-2 mb-3">
              <span
                v-if="result.category"
                class="inline-block px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded"
              >
                {{ result.category.name }}
              </span>
              <span
                v-for="tag in result.tags"
                :key="tag.id"
                class="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded"
              >
                {{ tag.name }}
              </span>
            </div>
            
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              <RouterLink
                :to="`/posts/${result.slug}`"
                class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                v-html="highlightSearchTerm(result.title, searchQuery)"
              />
            </h2>
            
            <p 
              class="text-gray-600 dark:text-gray-400 mb-4"
              v-html="highlightSearchTerm(result.excerpt || '', searchQuery)"
            />
            
            <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <time :datetime="result.updatedAt">{{ formatDate(result.updatedAt) }}</time>
              <span>{{ result.readingTimeMinutes }} min read</span>
            </div>
          </article>
        </div>

        <!-- No Results -->
        <div v-else class="text-center py-16">
          <div class="text-gray-400 dark:text-gray-600 mb-4">
            <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">No results found</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Try searching with different keywords or check your spelling.
          </p>
          <div class="space-y-2">
            <p class="text-sm text-gray-500 dark:text-gray-400">Suggestions:</p>
            <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Use fewer or different keywords</li>
              <li>• Check for typos in your search</li>
              <li>• Try searching for broader topics</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Popular Searches / Topics -->
      <div v-else class="space-y-8">
        <div v-if="popularTags.length > 0" class="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-8">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">Popular Topics</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              v-for="tag in popularTags"
              :key="tag.id"
              @click="searchQuery = tag.name"
              class="text-left p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
            >
              <span class="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 font-medium">
                {{ tag.name }}
              </span>
              <span class="ml-2 text-sm text-gray-500 dark:text-gray-400">({{ tag.postCount }})</span>
            </button>
          </div>
        </div>

        <div v-if="recentPosts.length > 0" class="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-8">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">Recent Posts</h2>
          <div class="space-y-4">
            <div
              v-for="post in recentPosts"
              :key="post.slug"
              class="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div class="flex-1">
                <h3 class="font-medium text-gray-900 dark:text-white mb-1">
                  <RouterLink
                    :to="`/posts/${post.slug}`"
                    class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {{ post.title }}
                  </RouterLink>
                </h3>
                <p v-if="post.excerpt" class="text-sm text-gray-600 dark:text-gray-400 mb-2">{{ post.excerpt }}</p>
                <div class="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-2">
                  <time :datetime="post.updatedAt">{{ formatDate(post.updatedAt) }}</time>
                  <span>•</span>
                  <span>{{ post.readingTimeMinutes }} min read</span>
                </div>
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
import { postsApi, tagsApi } from '@/services/api'
import type { PostListItem, Tag } from '@/types'

// State
const allPosts = ref<PostListItem[]>([])
const allTags = ref<Tag[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const searchQuery = ref('')
const selectedFilter = ref('all')

const searchFilters = [
  { label: 'All', value: 'all' },
  { label: 'Posts', value: 'posts' },
  { label: 'Tags', value: 'tags' },
  { label: 'Recent', value: 'recent' }
]

// Fetch data
const fetchData = async () => {
  loading.value = true
  error.value = null
  
  try {
    const [postsData, tagsData] = await Promise.all([
      postsApi.getAll(),
      tagsApi.getAll()
    ])
    
    allPosts.value = postsData
    allTags.value = tagsData
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load data'
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)

// Popular tags (top 10 by post count)
const popularTags = computed(() => {
  return [...allTags.value]
    .sort((a, b) => b.postCount - a.postCount)
    .slice(0, 10)
})

// Recent posts (top 5 by date)
const recentPosts = computed(() => {
  return [...allPosts.value]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5)
})

// Search results
const searchResults = computed(() => {
  if (!searchQuery.value.trim()) return []

  const query = searchQuery.value.toLowerCase()
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  
  return allPosts.value.filter(post => {
    const matchesTitle = post.title.toLowerCase().includes(query)
    const matchesExcerpt = post.excerpt?.toLowerCase().includes(query) || false
    const matchesTags = post.tags.some(tag => tag.name.toLowerCase().includes(query))
    const matchesCategory = post.category?.name.toLowerCase().includes(query) || false

    switch (selectedFilter.value) {
      case 'tags':
        return matchesTags
      case 'recent':
        const isRecent = new Date(post.updatedAt) > thirtyDaysAgo
        return isRecent && (matchesTitle || matchesExcerpt || matchesTags || matchesCategory)
      case 'posts':
      case 'all':
      default:
        return matchesTitle || matchesExcerpt || matchesTags || matchesCategory
    }
  })
})

const highlightSearchTerm = (text: string, searchTerm: string) => {
  if (!searchTerm.trim() || !text) return text
  
  // Escape special regex characters in search term
  const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escapedTerm})`, 'gi')
  return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">$1</mark>')
}

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'MMM dd, yyyy')
}
</script>
