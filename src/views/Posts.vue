<template>
  <div class="max-w-4xl mx-auto font-mono text-sm md:text-base">
    <div class="mb-6 border-b border-gruvbox-light-bg4 dark:border-gruvbox-dark-bg4 pb-4">
      <h1 class="text-xl font-bold text-gruvbox-light-yellow dark:text-gruvbox-dark-yellow mb-2">
        <span class="text-gruvbox-light-orange dark:text-gruvbox-dark-orange">$</span> ls -la ./posts
      </h1>
      <p class="text-gruvbox-light-gray dark:text-gruvbox-dark-gray">
        {{ subtitle }}
      </p>
    </div>

    <!-- Filter and Search Status -->
    <div v-if="hasActiveFilters" class="mb-4 text-gruvbox-light-aqua dark:text-gruvbox-dark-aqua flex gap-4 flex-wrap">
      <span>[grep filters]:</span>
      <span v-if="searchQuery">""</span>
      <span v-if="selectedCategory">category:{{ getCategoryName(selectedCategory) }}</span>
      <span v-if="selectedTag || props.tag">tag:{{ selectedTag || props.tag }}</span>
      <button @click="clearAllFilters" class="text-gruvbox-light-red dark:text-gruvbox-dark-red hover:underline">
        [ clear ]
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="py-8 text-gruvbox-light-yellow dark:text-gruvbox-dark-yellow">
      Loading directory...<span class="blinking-cursor"></span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="py-8 text-gruvbox-light-red dark:text-gruvbox-dark-red">
      [ERROR]: {{ error }}
      <br>
      <button @click="fetchPosts" class="mt-4 hover:underline text-gruvbox-light-fg dark:text-gruvbox-dark-fg">
        [ retry ]
      </button>
    </div>

    <template v-else>
      <!-- Filter Inputs (Mimicking terminal prompts) -->
      <div class="mb-8 flex flex-col sm:flex-row gap-4">
        <div class="flex-1 flex items-center bg-transparent border-b border-gruvbox-light-bg4 dark:border-gruvbox-dark-bg4">
          <span class="text-gruvbox-light-blue dark:text-gruvbox-dark-blue mr-2">/</span>
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search..." 
            class="w-full py-1 bg-transparent focus:outline-none text-gruvbox-light-fg dark:text-gruvbox-dark-fg placeholder-gruvbox-light-bg4 dark:placeholder-gruvbox-dark-bg4"
          >
        </div>
        <div class="flex gap-4">
          <select 
            v-model="selectedCategory" 
            class="bg-transparent border-b border-gruvbox-light-bg4 dark:border-gruvbox-dark-bg4 text-gruvbox-light-fg dark:text-gruvbox-dark-fg focus:outline-none"
          >
            <option value="">All Categories</option>
            <option v-for="category in categories" :key="category.id" :value="category.slug" class="bg-gruvbox-light-bg dark:bg-gruvbox-dark-bg">
              {{ category.name }}
            </option>
          </select>
          <select 
            v-model="sortBy" 
            class="bg-transparent border-b border-gruvbox-light-bg4 dark:border-gruvbox-dark-bg4 text-gruvbox-light-fg dark:text-gruvbox-dark-fg focus:outline-none"
          >
            <option value="date" class="bg-gruvbox-light-bg dark:bg-gruvbox-dark-bg">-t</option>
            <option value="title" class="bg-gruvbox-light-bg dark:bg-gruvbox-dark-bg">-S</option>
          </select>
        </div>
      </div>

      <!-- Posts List -->
      <div v-if="paginatedPosts.length > 0" class="overflow-x-auto">
        <table class="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr class="text-gruvbox-light-gray dark:text-gruvbox-dark-gray border-b border-gruvbox-light-bg4 dark:border-gruvbox-dark-bg4">
              <th class="py-2 pr-4 font-normal text-left">Permissions</th>
              <th class="py-2 pr-4 font-normal text-left">Size</th>
              <th class="py-2 pr-4 font-normal text-left">Date</th>
              <th class="py-2 font-normal text-left">Name</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="post in paginatedPosts" 
              :key="post.slug"
              class="group hover:bg-gruvbox-light-bg1 dark:hover:bg-gruvbox-dark-bg1"
            >
              <td class="py-1 pr-4 text-gruvbox-light-green dark:text-gruvbox-dark-green">-rw-r--r--</td>
              <td class="py-1 pr-4 text-gruvbox-light-purple dark:text-gruvbox-dark-purple text-left">{{ post.readingTimeMinutes }}k</td>
              <td class="py-1 pr-4 text-gruvbox-light-aqua dark:text-gruvbox-dark-aqua">{{ formatDate(post.updatedAt) }}</td>
              <td class="py-1 truncate max-w-xs sm:max-w-md">
                <RouterLink 
                  :to="'/posts/' + post.slug" 
                  class="text-gruvbox-light-fg dark:text-gruvbox-dark-fg group-hover:text-gruvbox-light-yellow dark:group-hover:text-gruvbox-dark-yellow font-bold group-hover:underline"
                >
                  {{ post.slug }}.md
                </RouterLink>
                <span v-if="post.category" class="ml-2 text-xs text-gruvbox-light-gray dark:text-gruvbox-dark-gray">
                  [{{ post.category.name }}]
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- No Posts Found -->
      <div v-else class="py-8 text-gruvbox-light-gray dark:text-gruvbox-dark-gray">
        ls: cannot access matching files: No such file or directory
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-8 flex justify-between items-center border-t border-gruvbox-light-bg4 dark:border-gruvbox-dark-bg4 pt-4">
        <button 
          :disabled="currentPage === 1"
          @click="currentPage--"
          class="px-2 py-1 text-gruvbox-light-blue dark:text-gruvbox-dark-blue hover:bg-gruvbox-light-bg1 dark:hover:bg-gruvbox-dark-bg1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          &lt; prev
        </button>
        <span class="text-gruvbox-light-gray dark:text-gruvbox-dark-gray">
          page {{ currentPage }} / {{ totalPages }}
        </span>
        <button 
          :disabled="currentPage === totalPages"
          @click="currentPage++"
          class="px-2 py-1 text-gruvbox-light-blue dark:text-gruvbox-dark-blue hover:bg-gruvbox-light-bg1 dark:hover:bg-gruvbox-dark-bg1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          next &gt;
        </button>
      </div>
    </template>
  </div>
</template><script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { format } from 'date-fns'
import { postsApi, categoriesApi } from '../services/api'
import type { PostListItem, Category } from '../types'

const router = useRouter()

const props = defineProps<{
  tag?: string
}>()

// State
const allPosts = ref<PostListItem[]>([])
const categories = ref<Category[]>([])
const loading = ref(true)
const error = ref('')

// Filters
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedTag = ref('')
const sortBy = ref('date')

// Pagination
const currentPage = ref(1)
const postsPerPage = 12

// Derived State
const subtitle = computed(() => {
  if (props.tag) return `Showing posts tagged with "${props.tag}"`
  return 'Explore all articles, tutorials, and thoughts.'
})

const hasActiveFilters = computed(() => {
  return searchQuery.value || selectedCategory.value || props.tag || selectedTag.value
})

const getCategoryName = (slug: string) => {
  const cat = categories.value.find(c => c.slug === slug)
  return cat ? cat.name : slug
}

const clearAllFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  selectedTag.value = ''
  if (props.tag) {
    router.push('/posts')
  }
}

const fetchPosts = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const [postsRes, categoriesRes] = await Promise.all([
      postsApi.getAll(), // Fetch more for client-side filtering
      categoriesApi.getAll()
    ])

    allPosts.value = postsRes
    categories.value = categoriesRes
  } catch (err: any) {
    error.value = err.message || 'Failed to load posts'
  } finally {
    loading.value = false
  }
}

// Reset pagination when filters change
watch([searchQuery, selectedCategory, selectedTag, sortBy], () => {
  currentPage.value = 1
})

const filteredPosts = computed(() => {
  let posts = [...allPosts.value]

  // Filter by tag if provided from URL
  if (props.tag) {
    posts = posts.filter(post =>
      post.tags.some(tag => tag.slug.toLowerCase() === props.tag?.toLowerCase())
    )
  }

  // Filter by selected tag
  if (selectedTag.value) {
    posts = posts.filter(post =>
      post.tags.some(tag => tag.slug.toLowerCase() === selectedTag.value.toLowerCase())
    )
  }

  if (selectedCategory.value) {
    posts = posts.filter(post => post.category.slug === selectedCategory.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    posts = posts.filter(post =>
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query) ||
      post.tags.some(tag => tag.name.toLowerCase().includes(query)) ||
      post.category.name.toLowerCase().includes(query)
    )
  }

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

const totalPages = computed(() => Math.ceil(filteredPosts.value.length / postsPerPage))

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * postsPerPage
  const end = start + postsPerPage
  return filteredPosts.value.slice(start, end)
})

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'yyyy-MM-dd')
}

onMounted(() => {
  fetchPosts()
})
</script>
