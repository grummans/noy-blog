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

    <!-- Filter and Search -->
    <div class="mb-8 flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Search posts..." 
          class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
        >
      </div>
      <select 
        v-model="sortBy" 
        class="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
      >
        <option value="date">Sort by Date</option>
        <option value="title">Sort by Title</option>
        <option value="readTime">Sort by Read Time</option>
      </select>
    </div>

    <!-- Posts Grid -->
    <div v-if="filteredPosts.length > 0" class="space-y-6">
      <article 
        v-for="post in filteredPosts" 
        :key="post.slug"
        class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
      >
        <div class="p-6">
          <div class="flex items-center gap-2 mb-3">
            <span 
              v-for="tag in post.tags" 
              :key="tag"
              class="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
              @click="filterByTag(tag)"
            >
              {{ tag }}
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
          
          <p class="text-gray-600 dark:text-gray-400 mb-4">{{ post.description }}</p>
          
          <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <time :datetime="post.pubDate">{{ formatDate(post.pubDate) }}</time>
            <span>{{ post.readTime }} min read</span>
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

    <!-- Pagination (placeholder) -->
    <div v-if="filteredPosts.length > 0" class="mt-12 flex justify-center">
      <nav class="flex items-center space-x-2">
        <button class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700">
          Previous
        </button>
        <button class="px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">
          1
        </button>
        <button class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700">
          Next
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { format } from 'date-fns'

const router = useRouter()

const props = defineProps<{
  tag?: string
}>()

const searchQuery = ref('')
const sortBy = ref('date')

// Sample posts data
const allPosts = ref([
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
])

const title = computed(() => {
  if (props.tag) {
    return `Posts tagged "${props.tag}"`
  }
  return 'All Posts'
})

const subtitle = computed(() => {
  if (props.tag) {
    return `Exploring articles related to ${props.tag}`
  }
  return 'Exploring technology, development, and digital innovation'
})

const filteredPosts = computed(() => {
  let posts = allPosts.value

  // Filter by tag if provided
  if (props.tag) {
    posts = posts.filter(post => 
      post.tags.some(tag => tag.toLowerCase() === props.tag?.toLowerCase())
    )
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    posts = posts.filter(post =>
      post.title.toLowerCase().includes(query) ||
      post.description.toLowerCase().includes(query) ||
      post.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }

  // Sort posts
  posts.sort((a, b) => {
    switch (sortBy.value) {
      case 'title':
        return a.title.localeCompare(b.title)
      case 'readTime':
        return a.readTime - b.readTime
      case 'date':
      default:
        return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
    }
  })

  return posts
})

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'MMM dd, yyyy')
}

const filterByTag = (tag: string) => {
  router.push(`/tags/${tag.toLowerCase()}`)
}
</script>
