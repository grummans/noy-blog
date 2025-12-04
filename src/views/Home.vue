<template>
  <div class="max-w-4xl mx-auto">
    <!-- Hero Section -->
    <section class="text-center py-16">
      <h1 class="text-5xl font-bold text-gray-900 dark:text-white mb-6">
        Welcome to Grummans Blog
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
        A modern blog exploring technology, development, and digital innovation. 
        Join me on this journey through code, design, and tech trends.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <RouterLink 
          to="/posts" 
          class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Read Latest Posts
          <svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
          </svg>
        </RouterLink>
        <RouterLink 
          to="/about" 
          class="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors font-medium"
        >
          About Me
        </RouterLink>
      </div>
    </section>

    <!-- Featured Posts -->
    <section class="py-16">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Featured Posts</h2>
        <RouterLink 
          to="/posts" 
          class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
        >
          View all posts →
        </RouterLink>
      </div>
      
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">Loading featured posts...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-500 mb-4">{{ error }}</p>
        <button 
          @click="fetchFeaturedPosts"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try again
        </button>
      </div>

      <!-- Featured Posts Grid -->
      <div v-else-if="featuredPosts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <article 
          v-for="post in featuredPosts" 
          :key="post.id"
          class="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-md transition-shadow"
        >
          <!-- Featured Image -->
          <div v-if="post.featuredImageUrl" class="aspect-video overflow-hidden">
            <img 
              :src="post.featuredImageUrl" 
              :alt="post.title"
              class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            >
          </div>
          
          <div class="p-6">
            <div class="flex items-center gap-2 mb-3 flex-wrap">
              <span 
                class="inline-block px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded"
              >
                {{ post.category.name }}
              </span>
              <span 
                v-for="tag in post.tags.slice(0, 2)" 
                :key="tag.id"
                class="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded"
              >
                {{ tag.name }}
              </span>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
              <RouterLink 
                :to="`/posts/${post.slug}`" 
                class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {{ post.title }}
              </RouterLink>
            </h3>
            <p class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{{ post.excerpt }}</p>
            <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <time :datetime="post.updatedAt">{{ formatDate(post.updatedAt) }}</time>
              <span>{{ post.readingTimeMinutes }} min read</span>
            </div>
          </div>
        </article>
      </div>

      <!-- No Featured Posts -->
      <div v-else class="text-center py-12">
        <p class="text-gray-600 dark:text-gray-400">No featured posts yet.</p>
        <RouterLink 
          to="/posts" 
          class="text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block"
        >
          Browse all posts →
        </RouterLink>
      </div>
    </section>

    <!-- Newsletter/CTA Section -->
    <section class="py-16 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl">
      <div class="text-center px-6">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Stay Updated
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          Get notified when I publish new articles about technology and development.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input 
            type="email" 
            placeholder="Enter your email" 
            class="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-white"
          >
          <button class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Subscribe
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { format } from 'date-fns'
import { postsApi } from '@/services/api'
import type { PostListItem } from '@/types'

// State
const featuredPosts = ref<PostListItem[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

// Fetch featured posts
const fetchFeaturedPosts = async () => {
  loading.value = true
  error.value = null
  
  try {
    featuredPosts.value = await postsApi.getFeatured()
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load featured posts'
  } finally {
    loading.value = false
  }
}

onMounted(fetchFeaturedPosts)

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'MMM dd, yyyy')
}
</script>
