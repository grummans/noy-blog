<template>
  <div class="max-w-4xl mx-auto">
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">Tags</h1>
      <p class="text-gray-600 dark:text-gray-400">
        Explore posts by topic and discover content that interests you most.
      </p>
    </div>

    <!-- Tag Cloud -->
    <div class="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-8 mb-8">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">Popular Tags</h2>
      <div class="flex flex-wrap gap-3">
        <RouterLink
          v-for="tag in sortedTags"
          :key="tag.name"
          :to="`/tags/${tag.name.toLowerCase()}`"
          class="inline-flex items-center px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
          :style="{ fontSize: getTagSize(tag.count) + 'rem' }"
        >
          <span class="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
            {{ tag.name }}
          </span>
          <span class="ml-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
            {{ tag.count }}
          </span>
        </RouterLink>
      </div>
    </div>

    <!-- Tag List -->
    <div class="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div class="p-6 border-b border-gray-200 dark:border-gray-800">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">All Tags</h2>
      </div>
      
      <div class="divide-y divide-gray-200 dark:divide-gray-800">
        <div
          v-for="tag in sortedTags"
          :key="tag.name"
          class="p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <div class="flex items-center justify-between">
            <div>
              <RouterLink
                :to="`/tags/${tag.name.toLowerCase()}`"
                class="text-lg font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {{ tag.name }}
              </RouterLink>
              <p class="text-gray-600 dark:text-gray-400 mt-1">
                {{ tag.description }}
              </p>
            </div>
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-500 dark:text-gray-400">
                {{ tag.count }} {{ tag.count === 1 ? 'post' : 'posts' }}
              </span>
              <RouterLink
                :to="`/tags/${tag.name.toLowerCase()}`"
                class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
              >
                View posts →
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Posts by Category -->
    <div class="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div
        v-for="category in featuredCategories"
        :key="category.name"
        class="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Recent in {{ category.name }}
          </h3>
          <RouterLink
            :to="`/tags/${category.name.toLowerCase()}`"
            class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
          >
            View all →
          </RouterLink>
        </div>
        
        <div class="space-y-3">
          <div
            v-for="post in category.recentPosts"
            :key="post.slug"
            class="block group"
          >
            <RouterLink
              :to="`/posts/${post.slug}`"
              class="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <h4 class="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-1">
                {{ post.title }}
              </h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ formatDate(post.pubDate) }} • {{ post.readTime }} min read
              </p>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { format } from 'date-fns'

// Sample data - in a real app, this would come from your content management system
const allTags = [
  {
    name: 'Vue',
    count: 8,
    description: 'Vue.js framework tutorials, tips, and best practices'
  },
  {
    name: 'TypeScript',
    count: 6,
    description: 'Type-safe JavaScript development with TypeScript'
  },
  {
    name: 'JavaScript',
    count: 12,
    description: 'Modern JavaScript features, ES6+, and vanilla JS techniques'
  },
  {
    name: 'CSS',
    count: 5,
    description: 'Styling techniques, layouts, and CSS frameworks'
  },
  {
    name: 'Frontend',
    count: 10,
    description: 'Frontend development practices and technologies'
  },
  {
    name: 'Design',
    count: 4,
    description: 'UI/UX design principles and web design techniques'
  },
  {
    name: 'Tailwind',
    count: 3,
    description: 'Tailwind CSS utility-first framework guides'
  },
  {
    name: 'Development',
    count: 7,
    description: 'General software development practices and methodologies'
  },
  {
    name: 'ES6+',
    count: 4,
    description: 'Modern JavaScript features and syntax'
  },
  {
    name: 'Mobile',
    count: 2,
    description: 'Mobile-first development and responsive design'
  }
]

const sortedTags = computed(() => {
  return [...allTags].sort((a, b) => b.count - a.count)
})

const featuredCategories = [
  {
    name: 'Vue',
    recentPosts: [
      {
        slug: 'getting-started-vue-3',
        title: 'Getting Started with Vue 3 and TypeScript',
        pubDate: '2024-01-15T00:00:00Z',
        readTime: 8
      },
      {
        slug: 'vue-composition-api-guide',
        title: 'Mastering Vue 3 Composition API',
        pubDate: '2023-12-28T00:00:00Z',
        readTime: 12
      }
    ]
  },
  {
    name: 'JavaScript',
    recentPosts: [
      {
        slug: 'modern-javascript-features',
        title: 'Modern JavaScript Features You Should Know',
        pubDate: '2024-01-05T00:00:00Z',
        readTime: 10
      },
      {
        slug: 'async-await-best-practices',
        title: 'Async/Await Best Practices',
        pubDate: '2023-12-15T00:00:00Z',
        readTime: 6
      }
    ]
  }
]

const getTagSize = (count: number) => {
  const maxCount = Math.max(...allTags.map(tag => tag.count))
  const minSize = 0.875 // 14px
  const maxSize = 1.125 // 18px
  const ratio = count / maxCount
  return minSize + (maxSize - minSize) * ratio
}

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'MMM dd, yyyy')
}
</script>
