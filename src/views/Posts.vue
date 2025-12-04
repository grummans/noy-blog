<template>
  <div class="max-w-4xl mx-auto">
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        {{ title }}
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        {{ subtitle }}
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-16">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p class="text-gray-600 dark:text-gray-400">Loading posts...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-16">
      <div class="text-red-500 mb-4">
        <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>
      </div>
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Failed to load posts</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-4">{{ error }}</p>
      <button 
        @click="fetchPosts"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Try again
      </button>
    </div>

    <template v-else>
      <!-- Active Filters -->
      <div v-if="hasActiveFilters" class="mb-4 flex flex-wrap items-center gap-2">
        <span class="text-sm text-gray-500 dark:text-gray-400">Active filters:</span>
        
        <span 
          v-if="props.tag"
          class="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full"
        >
          Tag: {{ props.tag }}
          <button @click="clearTagFilter" class="hover:text-blue-600 dark:hover:text-blue-300">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </span>
        
        <span 
          v-if="selectedCategory"
          class="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full"
        >
          Category: {{ getCategoryName(selectedCategory) }}
          <button @click="selectedCategory = ''" class="hover:text-purple-600 dark:hover:text-purple-300">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </span>
        
        <span 
          v-if="selectedTag"
          class="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full"
        >
          Tag: {{ selectedTag }}
          <button @click="selectedTag = ''" class="hover:text-blue-600 dark:hover:text-blue-300">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </span>
        
        <span 
          v-if="searchQuery"
          class="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 rounded-full"
        >
          Search: "{{ searchQuery }}"
          <button @click="searchQuery = ''" class="hover:text-gray-600 dark:hover:text-gray-300">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </span>
        
        <button 
          @click="clearAllFilters"
          class="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
        >
          Clear all
        </button>
      </div>

      <!-- Filter and Search -->
      <div class="mb-8 flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search posts..." 
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-white"
          >
        </div>
        <div class="relative">
          <select 
            v-model="selectedCategory" 
            class="appearance-none px-4 py-3 pr-10 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-white cursor-pointer"
          >
            <option value="">All Categories</option>
            <option v-for="category in categories" :key="category.id" :value="category.slug">
              {{ category.name }}
            </option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
        <div class="relative">
          <select 
            v-model="sortBy" 
            class="appearance-none px-4 py-3 pr-10 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-white cursor-pointer"
          >
            <option value="date">Sort by Date</option>
            <option value="title">Sort by Title</option>
            <option value="readTime">Sort by Read Time</option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Posts Grid -->
      <div v-if="paginatedPosts.length > 0" class="space-y-6">
        <article 
          v-for="post in paginatedPosts" 
          :key="post.slug"
          class="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-md transition-shadow"
        >
          <div class="flex flex-col sm:flex-row sm:items-center p-4 gap-4">
            <!-- Featured Image - Small thumbnail, centered vertically -->
            <div v-if="post.featuredImageUrl" class="w-24 h-24 flex-shrink-0">
              <img 
                :src="post.featuredImageUrl" 
                :alt="post.title"
                class="w-full h-full object-cover rounded-lg"
              >
            </div>
            
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2 flex-wrap">
                <span 
                  class="inline-block px-2 py-1 text-xs font-medium rounded cursor-pointer transition-colors"
                  :class="selectedCategory === post.category.slug 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 hover:bg-purple-200 dark:hover:bg-purple-800'"
                  @click="toggleCategory(post.category.slug)"
                >
                  {{ post.category.name }}
                </span>
                <span 
                  v-for="tag in post.tags.slice(0, 3)" 
                  :key="tag.id"
                  class="inline-block px-2 py-1 text-xs font-medium rounded cursor-pointer transition-colors"
                  :class="selectedTag === tag.slug 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800'"
                  @click="filterByTag(tag.slug)"
                >
                  {{ tag.name }}
                </span>
                <span v-if="post.tags.length > 3" class="text-xs text-gray-500 dark:text-gray-400">
                  +{{ post.tags.length - 3 }} more
                </span>
              </div>
              
              <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                <RouterLink 
                  :to="`/posts/${post.slug}`" 
                  class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {{ post.title }}
                </RouterLink>
              </h2>
              
              <p class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{{ post.excerpt }}</p>
              
              <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <time :datetime="post.updatedAt">{{ formatDate(post.updatedAt) }}</time>
                <span>{{ post.readingTimeMinutes }} min read</span>
              </div>
            </div>
          </div>
        </article>
      </div>

      <!-- No Posts Found -->
      <div v-else class="text-center py-16">
        <div class="text-gray-400 dark:text-gray-600 mb-4">
          <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">No posts found</h3>
        <p class="text-gray-600 dark:text-gray-400">
          {{ searchQuery ? 'Try adjusting your search terms.' : 'No posts available yet.' }}
        </p>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-12 flex justify-center">
        <nav class="flex items-center space-x-2">
          <button 
            :disabled="currentPage === 1"
            @click="currentPage--"
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <button 
            v-for="page in visiblePages" 
            :key="page"
            @click="currentPage = page"
            class="px-3 py-2 text-sm font-medium rounded-md"
            :class="currentPage === page 
              ? 'text-white bg-blue-600 border border-transparent hover:bg-blue-700' 
              : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800'"
          >
            {{ page }}
          </button>
          
          <button 
            :disabled="currentPage === totalPages"
            @click="currentPage++"
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </nav>
      </div>
      
      <!-- Results count -->
      <div v-if="filteredPosts.length > 0" class="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
        Showing {{ (currentPage - 1) * postsPerPage + 1 }}-{{ Math.min(currentPage * postsPerPage, filteredPosts.length) }} of {{ filteredPosts.length }} posts
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { format } from 'date-fns'
import { postsApi, categoriesApi } from '@/services/api'
import type { PostListItem, Category } from '@/types'

const router = useRouter()

const props = defineProps<{
  tag?: string
}>()

// State
const allPosts = ref<PostListItem[]>([])
const categories = ref<Category[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const searchQuery = ref('')
const sortBy = ref('date')
const selectedCategory = ref('')
const selectedTag = ref('')
const currentPage = ref(1)
const postsPerPage = 5

// Fetch data
const fetchPosts = async () => {
  loading.value = true
  error.value = null
  
  try {
    const [postsData, categoriesData] = await Promise.all([
      postsApi.getAll(),
      categoriesApi.getAll()
    ])
    
    allPosts.value = postsData
    categories.value = categoriesData
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load posts'
  } finally {
    loading.value = false
  }
}

onMounted(fetchPosts)

// Reset page when filters change
watch([searchQuery, selectedCategory, selectedTag, sortBy, () => props.tag], () => {
  currentPage.value = 1
})

// Check if any filter is active
const hasActiveFilters = computed(() => {
  return !!props.tag || !!selectedCategory.value || !!selectedTag.value || !!searchQuery.value
})

// Get category name by slug
const getCategoryName = (slug: string) => {
  const category = categories.value.find(c => c.slug === slug)
  return category?.name || slug
}

// Clear tag filter from URL
const clearTagFilter = () => {
  router.push('/posts')
}

// Clear all filters
const clearAllFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  selectedTag.value = ''
  if (props.tag) {
    router.push('/posts')
  }
}

const title = computed(() => {
  if (props.tag) {
    return `Posts tagged "${props.tag}"`
  }
  if (selectedTag.value) {
    return `Posts tagged "${selectedTag.value}"`
  }
  if (selectedCategory.value) {
    const category = categories.value.find(c => c.slug === selectedCategory.value)
    return category ? `Posts in "${category.name}"` : 'All Posts'
  }
  return 'All Posts'
})

const subtitle = computed(() => {
  if (props.tag || selectedTag.value) {
    return `Exploring articles related to ${props.tag || selectedTag.value}`
  }
  return 'Exploring technology, development, and digital innovation'
})

const filteredPosts = computed(() => {
  let posts = [...allPosts.value]

  // Filter by tag if provided from URL
  if (props.tag) {
    posts = posts.filter(post => 
      post.tags.some(tag => tag.slug.toLowerCase() === props.tag?.toLowerCase())
    )
  }

  // Filter by selected tag (from clicking on tag badge)
  if (selectedTag.value) {
    posts = posts.filter(post => 
      post.tags.some(tag => tag.slug.toLowerCase() === selectedTag.value.toLowerCase())
    )
  }

  // Filter by category
  if (selectedCategory.value) {
    posts = posts.filter(post => post.category.slug === selectedCategory.value)
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    posts = posts.filter(post =>
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query) ||
      post.tags.some(tag => tag.name.toLowerCase().includes(query)) ||
      post.category.name.toLowerCase().includes(query)
    )
  }

  // Sort posts
  posts.sort((a, b) => {
    switch (sortBy.value) {
      case 'title':
        return a.title.localeCompare(b.title)
      case 'readTime':
        return a.readingTimeMinutes - b.readingTimeMinutes
      case 'date':
      default:
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    }
  })

  return posts
})

// Pagination
const totalPages = computed(() => Math.ceil(filteredPosts.value.length / postsPerPage))

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * postsPerPage
  const end = start + postsPerPage
  return filteredPosts.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages: number[] = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 5) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    if (current <= 3) {
      pages.push(1, 2, 3, 4, 5)
    } else if (current >= total - 2) {
      for (let i = total - 4; i <= total; i++) pages.push(i)
    } else {
      for (let i = current - 2; i <= current + 2; i++) pages.push(i)
    }
  }
  
  return pages
})

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'MMM dd, yyyy')
}

// Toggle tag filter (click to select, click again to deselect)
const filterByTag = (tagSlug: string) => {
  if (selectedTag.value === tagSlug) {
    selectedTag.value = ''
  } else {
    selectedTag.value = tagSlug
  }
}

// Toggle category filter (click to select, click again to deselect)
const toggleCategory = (categorySlug: string) => {
  if (selectedCategory.value === categorySlug) {
    selectedCategory.value = ''
  } else {
    selectedCategory.value = categorySlug
  }
}
</script>
