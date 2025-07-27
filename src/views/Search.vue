<template>
  <div class="max-w-4xl mx-auto">
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">Search</h1>
      <p class="text-gray-600 dark:text-gray-400">
        Find articles, tutorials, and insights across all topics.
      </p>
    </div>

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
          class="block w-full pl-10 pr-4 py-4 text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
          @input="performSearch"
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
            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'"
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
          class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
        >
          <div class="flex items-center gap-2 mb-3">
            <span
              v-for="tag in result.tags"
              :key="tag"
              class="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded"
            >
              {{ tag }}
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
            v-html="highlightSearchTerm(result.description, searchQuery)"
          />
          
          <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <time :datetime="result.pubDate">{{ formatDate(result.pubDate) }}</time>
            <span>{{ result.readTime }} min read</span>
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
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">Popular Topics</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            v-for="topic in popularTopics"
            :key="topic"
            @click="searchQuery = topic; performSearch()"
            class="text-left p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
          >
            <span class="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 font-medium">
              {{ topic }}
            </span>
          </button>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">Recent Posts</h2>
        <div class="space-y-4">
          <div
            v-for="post in recentPosts"
            :key="post.slug"
            class="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
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
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">{{ post.description }}</p>
              <div class="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-2">
                <time :datetime="post.pubDate">{{ formatDate(post.pubDate) }}</time>
                <span>•</span>
                <span>{{ post.readTime }} min read</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { format } from 'date-fns'

const searchQuery = ref('')
const selectedFilter = ref('all')

const searchFilters = [
  { label: 'All', value: 'all' },
  { label: 'Posts', value: 'posts' },
  { label: 'Tags', value: 'tags' },
  { label: 'Recent', value: 'recent' }
]

const popularTopics = [
  'Vue.js', 'TypeScript', 'JavaScript', 'CSS', 'Frontend Development',
  'Web Design', 'Tailwind CSS', 'React', 'Node.js', 'API Development'
]

// Sample posts data
const allPosts = [
  {
    slug: 'getting-started-vue-3',
    title: 'Getting Started with Vue 3 and TypeScript',
    description: 'Learn how to set up a modern Vue 3 project with TypeScript, Vite, and best practices for scalable development.',
    tags: ['Vue', 'TypeScript', 'Frontend'],
    pubDate: '2024-01-15T00:00:00Z',
    readTime: 8
  },
  {
    slug: 'tailwind-css-tips',
    title: '10 Tailwind CSS Tips for Better UI Design',
    description: 'Discover advanced Tailwind CSS techniques to create beautiful and responsive user interfaces.',
    tags: ['CSS', 'Design', 'Tailwind'],
    pubDate: '2024-01-10T00:00:00Z',
    readTime: 6
  },
  {
    slug: 'modern-javascript-features',
    title: 'Modern JavaScript Features You Should Know',
    description: 'Explore the latest JavaScript features that can improve your code quality and developer experience.',
    tags: ['JavaScript', 'ES6+', 'Development'],
    pubDate: '2024-01-05T00:00:00Z',
    readTime: 10
  },
  {
    slug: 'vue-composition-api-guide',
    title: 'Mastering Vue 3 Composition API',
    description: 'Deep dive into Vue 3 Composition API with practical examples and best practices.',
    tags: ['Vue', 'JavaScript', 'Frontend'],
    pubDate: '2023-12-28T00:00:00Z',
    readTime: 12
  },
  {
    slug: 'responsive-design-principles',
    title: 'Responsive Design Principles for 2024',
    description: 'Learn the fundamental principles of responsive web design and how to implement them effectively.',
    tags: ['Design', 'CSS', 'Mobile'],
    pubDate: '2023-12-20T00:00:00Z',
    readTime: 7
  }
]

const recentPosts = computed(() => {
  return allPosts.slice(0, 3)
})

const searchResults = computed(() => {
  if (!searchQuery.value.trim()) return []

  const query = searchQuery.value.toLowerCase()
  
  return allPosts.filter(post => {
    const matchesTitle = post.title.toLowerCase().includes(query)
    const matchesDescription = post.description.toLowerCase().includes(query)
    const matchesTags = post.tags.some(tag => tag.toLowerCase().includes(query))

    switch (selectedFilter.value) {
      case 'tags':
        return matchesTags
      case 'recent':
        const isRecent = new Date(post.pubDate) > new Date('2024-01-01')
        return isRecent && (matchesTitle || matchesDescription || matchesTags)
      case 'posts':
      case 'all':
      default:
        return matchesTitle || matchesDescription || matchesTags
    }
  })
})

const performSearch = () => {
  // This would typically trigger analytics or search tracking
  console.log(`Searching for: ${searchQuery.value}`)
}

const highlightSearchTerm = (text: string, searchTerm: string) => {
  if (!searchTerm.trim()) return text
  
  const regex = new RegExp(`(${searchTerm})`, 'gi')
  return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">$1</mark>')
}

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'MMM dd, yyyy')
}
</script>
