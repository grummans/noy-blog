<template>
  <!-- Loading State -->
  <div v-if="loading" class="max-w-4xl mx-auto text-center py-16">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
    <p class="text-gray-600 dark:text-gray-400">Loading post...</p>
  </div>

  <!-- Error State -->
  <div v-else-if="error" class="max-w-4xl mx-auto text-center py-16">
    <div class="text-red-500 mb-4">
      <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
      </svg>
    </div>
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Failed to load post</h1>
    <p class="text-gray-600 dark:text-gray-400 mb-8">{{ error }}</p>
    <div class="flex gap-4 justify-center">
      <button 
        @click="fetchPost"
        class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Try again
      </button>
      <RouterLink
        to="/posts"
        class="px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors font-medium"
      >
        Browse All Posts
      </RouterLink>
    </div>
  </div>

  <!-- Post Content -->
  <div v-else-if="post" class="max-w-4xl mx-auto">
    <!-- Post Header -->
    <header class="mb-8">
      <!-- Featured Image -->
      <div v-if="post.featuredImageUrl" class="mb-6 rounded-lg overflow-hidden">
        <img 
          :src="post.featuredImageUrl" 
          :alt="post.title"
          class="w-full h-64 md:h-96 object-cover"
        >
      </div>

      <div class="flex items-center gap-2 mb-4 flex-wrap">
        <span
          class="inline-block px-3 py-1 text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full"
        >
          {{ post.category.name }}
        </span>
        <span
          v-for="tag in post.tags"
          :key="tag.id"
          class="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full"
        >
          {{ tag.name }}
        </span>
      </div>
      
      <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
        {{ post.title }}
      </h1>
      
      <p class="text-xl text-gray-600 dark:text-gray-400 mb-6">
        {{ post.excerpt }}
      </p>
      
      <div class="flex items-center justify-between text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800 pb-6">
        <div class="flex items-center space-x-4 flex-wrap">
          <span class="text-sm font-medium">By {{ post.author.displayName }}</span>
          <time :datetime="post.updatedAt" class="text-sm">
            {{ formatDate(post.updatedAt) }}
          </time>
          <span class="text-sm">{{ post.readingTimeMinutes }} min read</span>
          <span class="text-sm">{{ post.viewCount }} views</span>
        </div>
        
        <div class="flex items-center space-x-2">
          <button 
            @click="sharePost"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
            title="Share this post"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
            </svg>
          </button>
          
          <button 
            @click="toggleBookmark"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
            :title="isBookmarked ? 'Remove bookmark' : 'Bookmark this post'"
          >
            <svg class="w-5 h-5" :class="isBookmarked ? 'fill-current text-blue-600' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
            </svg>
          </button>
        </div>
      </div>
    </header>

    <!-- Post Content - Render HTML from API -->
    <article class="prose prose-lg max-w-none mb-12 prose-gray dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-white prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-code:text-gray-800 dark:prose-code:text-gray-200 prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300 prose-li:text-gray-700 dark:prose-li:text-gray-300">
      <div v-html="post.contentHtml"></div>
    </article>

    <!-- Attachments -->
    <div v-if="post.attachments && post.attachments.length > 0" class="mb-8">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Attachments</h3>
      <div class="space-y-2">
        <a 
          v-for="attachment in post.attachments"
          :key="attachment.id"
          :href="getAttachmentUrl(attachment.storagePath)"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-900 dark:text-white">{{ attachment.originalFilename }}</p>
            <p class="text-xs text-gray-500">{{ formatFileSize(attachment.fileSize) }}</p>
          </div>
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
          </svg>
        </a>
      </div>
    </div>

    <!-- Post Footer -->
    <footer class="border-t border-gray-200 dark:border-gray-800 pt-8">
      <!-- Tags -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tags</h3>
        <div class="flex flex-wrap gap-2">
          <RouterLink
            v-for="tag in post.tags"
            :key="tag.id"
            :to="`/tags/${tag.slug}`"
            class="inline-block px-3 py-1 text-sm font-medium bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-full hover:bg-blue-100 hover:text-blue-800 dark:hover:bg-blue-900 dark:hover:text-blue-200 transition-colors"
          >
            {{ tag.name }}
          </RouterLink>
        </div>
      </div>

      <!-- Share Buttons -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Share this post</h3>
        <div class="flex space-x-4">
          <button
            v-for="platform in shareButtons"
            :key="platform.name"
            @click="shareOn(platform.name)"
            class="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          >
            <!-- Twitter Icon -->
            <svg v-if="platform.name === 'Twitter'" class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
            <!-- LinkedIn Icon -->
            <svg v-else-if="platform.name === 'LinkedIn'" class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            <!-- Copy Link Icon -->
            <svg v-else-if="platform.name === 'Copy Link'" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
            </svg>
            {{ platform.name }}
          </button>
        </div>
      </div>

      <!-- Navigation -->
      <div class="flex justify-between items-center">
        <RouterLink
          to="/posts"
          class="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Back to all posts
        </RouterLink>
      </div>
    </footer>
  </div>

  <!-- Post Not Found -->
  <div v-else class="max-w-4xl mx-auto text-center py-16">
    <div class="text-gray-400 dark:text-gray-600 mb-4">
      <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
      </svg>
    </div>
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Post Not Found</h1>
    <p class="text-gray-600 dark:text-gray-400 mb-8">
      The post you're looking for doesn't exist or has been moved.
    </p>
    <RouterLink
      to="/posts"
      class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
    >
      Browse All Posts
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { format } from 'date-fns'
import { postsApi } from '@/services/api'
import type { PostDetail } from '@/types'

// Default site title
const SITE_TITLE = 'Grummans Blog'

const props = defineProps<{
  slug: string
}>()

// State
const post = ref<PostDetail | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const isBookmarked = ref(false)

const shareButtons = [
  { name: 'Twitter' },
  { name: 'LinkedIn' },
  { name: 'Copy Link' }
]

// Fetch post by slug
const fetchPost = async () => {
  loading.value = true
  error.value = null
  post.value = null
  
  try {
    post.value = await postsApi.getBySlug(props.slug)
    
    // Check bookmark status from localStorage
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]')
    isBookmarked.value = bookmarks.includes(props.slug)
    
    // Update page title with post title
    if (post.value) {
      document.title = `${post.value.title} | ${SITE_TITLE}`
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load post'
  } finally {
    loading.value = false
  }
}

// Watch for slug changes (navigation between posts)
watch(() => props.slug, fetchPost)

// Reset title when leaving the page
onUnmounted(() => {
  document.title = SITE_TITLE
})

onMounted(fetchPost)

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'MMMM dd, yyyy')
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getAttachmentUrl = (storagePath: string) => {
  // Base URL for MinIO storage
  return `https://minioconsole.grummans.me/${storagePath}`
}

const sharePost = () => {
  if (navigator.share && post.value) {
    navigator.share({
      title: post.value.title,
      text: post.value.excerpt,
      url: window.location.href
    })
  } else {
    navigator.clipboard.writeText(window.location.href)
  }
}

const shareOn = (platform: string) => {
  if (!post.value) return
  
  const url = window.location.href
  const title = post.value.title
  
  switch (platform) {
    case 'Twitter':
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`)
      break
    case 'LinkedIn':
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`)
      break
    case 'Copy Link':
      navigator.clipboard.writeText(url)
      break
  }
}

const toggleBookmark = () => {
  isBookmarked.value = !isBookmarked.value
  
  // Save to localStorage
  const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]')
  if (isBookmarked.value) {
    bookmarks.push(props.slug)
  } else {
    const index = bookmarks.indexOf(props.slug)
    if (index > -1) bookmarks.splice(index, 1)
  }
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
}
</script>
