<template>
  <div class="max-w-4xl mx-auto font-mono text-sm md:text-base">
    
    <!-- Loading State -->
    <div v-if="loading" class="py-16 text-gruvbox-light-yellow dark:text-gruvbox-dark-yellow">
      Reading file \\.slug.md\...<span class="blinking-cursor"></span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="py-16 text-gruvbox-light-red dark:text-gruvbox-dark-red">
      <div class="mb-4">
        [ERROR]: cat: \\.slug.md\ No such file or directory
      </div>
      <p class="text-gruvbox-light-gray dark:text-gruvbox-dark-gray">{{ error }}</p>
      <div class="mt-8 flex gap-4">
        <button @click="fetchPost" class="hover:underline text-gruvbox-light-fg dark:text-gruvbox-dark-fg">
          [ retry ]
        </button>
        <RouterLink to="/posts" class="hover:underline text-gruvbox-light-blue dark:text-gruvbox-dark-blue">
          [ cd .. ]
        </RouterLink>
      </div>
    </div>

    <!-- Post Content -->
    <div v-else-if="post" class="overflow-hidden">
      <!-- File Metadata / Git Commit Style Header -->
      <header class="mb-8 border border-gruvbox-light-bg4 dark:border-gruvbox-dark-bg4 p-4 text-gruvbox-light-fg dark:text-gruvbox-dark-fg bg-gruvbox-light-bg0_h dark:bg-gruvbox-dark-bg0_h overflow-x-auto whitespace-nowrap">
        <div class="text-gruvbox-light-yellow dark:text-gruvbox-dark-yellow font-bold mb-2 break-normal whitespace-normal text-xl md:text-2xl">
          # {{ post.title }}
        </div>
        <div class="text-gruvbox-light-gray dark:text-gruvbox-dark-gray grid grid-cols-[100px_1fr] gap-x-2">
          <span>Author:</span>  <span class="text-gruvbox-light-aqua dark:text-gruvbox-dark-aqua">{{ post.author.displayName }} &lt;author@grummans.me&gt;</span>
          <span>Date:</span>    <span class="text-gruvbox-light-purple dark:text-gruvbox-dark-purple">{{ formatDate(post.updatedAt) }}</span>
          <span>Category:</span><span class="text-gruvbox-light-green dark:text-gruvbox-dark-green">{{ post.category.name }}</span>
          <span>Tags:</span>    <span class="text-gruvbox-light-blue dark:text-gruvbox-dark-blue flex flex-wrap gap-2">
            <RouterLink v-for="tag in post.tags" :key="tag.id" :to="'/tags/' + tag.slug" class="hover:underline">
              [{{ tag.name }}]
            </RouterLink>
          </span>
          <span>Stats:</span>   <span>{{ post.readingTimeMinutes }} min read | {{ post.viewCount }} views</span>
        </div>
        <div class="mt-4 flex gap-4 text-gruvbox-light-orange dark:text-gruvbox-dark-orange">
          <button @click="toggleBookmark" class="hover:underline">
            {{ isBookmarked ? '[x] bookmarked' : '[ ] bookmark' }}
          </button>
        </div>
      </header>

      <!-- Markdown Article Body -->
      <article class="prose dark:prose-invert max-w-none mb-12">
        <MdPreview :modelValue="post.content || post.contentHtml || ''" :theme="isDark ? 'dark' : 'light'" />
      </article>

      <!-- Attachments -->
      <div v-if="post.attachments && post.attachments.length > 0" class="mb-8 border-t border-gruvbox-light-bg4 dark:border-gruvbox-dark-bg4 pt-4">
        <h3 class="text-lg font-bold text-gruvbox-light-yellow dark:text-gruvbox-dark-yellow mb-4">## Attachments</h3>
        <ul class="list-none space-y-2 m-0 p-0">
          <li v-for="attachment in post.attachments" :key="attachment.id" class="flex gap-4">
            <span class="text-gruvbox-light-gray dark:text-gruvbox-dark-gray">-</span>
            <a :href="getAttachmentUrl(attachment.storagePath)" target="_blank" rel="noopener noreferrer" class="text-gruvbox-light-blue dark:text-gruvbox-dark-blue hover:underline font-bold">
              {{ attachment.originalFilename }}
            </a>
            <span class="text-gruvbox-light-purple dark:text-gruvbox-dark-purple">({{ formatFileSize(attachment.fileSize) }})</span>
          </li>
        </ul>
      </div>

      <!-- Post Footer -->
      <footer class="border-t border-gruvbox-light-bg4 dark:border-gruvbox-dark-bg4 pt-4 mt-8 flex flex-col md:flex-row justify-between text-sm text-gruvbox-light-gray dark:text-gruvbox-dark-gray">
        <!-- Share -->
        <div class="flex gap-4 mb-4 md:mb-0">
          <span>Share:</span>
          <button v-for="platform in shareButtons" :key="platform.name" @click="shareOn(platform.name)" class="hover:text-gruvbox-light-fg dark:hover:text-gruvbox-dark-fg hover:underline">
            [{{ platform.name }}]
          </button>
        </div>
        
        <RouterLink to="/posts" class="hover:text-gruvbox-light-blue dark:hover:text-gruvbox-dark-blue hover:underline">
          <span class="text-gruvbox-light-green dark:text-gruvbox-dark-green">:q</span> (Back to list)
        </RouterLink>
      </footer>
    </div>
  </div>
</template>
<script setup lang="ts">
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { format } from 'date-fns'
import { postsApi } from '../services/api'
import type { PostDetail } from '../types'

const SITE_TITLE = 'Grummans Blog'

const props = defineProps<{
  slug: string
}>()

const post = ref<PostDetail | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const isBookmarked = ref(false)

const isDark = ref(document.documentElement.classList.contains('dark'))

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.attributeName === 'class') {
      isDark.value = document.documentElement.classList.contains('dark')
    }
  })
})

const shareButtons = [
  { name: 'Twitter' },
  { name: 'LinkedIn' },
  { name: 'Copy Link' }
]

const fetchPost = async () => {
  loading.value = true
  error.value = null
  post.value = null

  try {
    post.value = await postsApi.getBySlug(props.slug)

    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]')
    isBookmarked.value = bookmarks.includes(props.slug)

    if (post.value) {
      document.title = `${post.value.title} | ${SITE_TITLE}`
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load post'
  } finally {
    loading.value = false
  }
}

watch(() => props.slug, fetchPost)

onUnmounted(() => {
  document.title = SITE_TITLE
  observer.disconnect()
})

onMounted(() => {
  fetchPost()
  observer.observe(document.documentElement, { attributes: true })
})

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'yyyy-MM-dd')
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getAttachmentUrl = (storagePath: string) => {
  return `https://minioconsole.grummans.me/${storagePath}`
}

const shareOn = (platform: string) => {
  if (!post.value) return

  const url = window.location.href
  const title = post.value.title

  switch (platform) {
    case 'Twitter':
      window.open(`https://twitter.com/intent/tweet?text=${title}&url=${url}`)
      break
    case 'LinkedIn':
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`)
      break
    case 'Copy Link':
      navigator.clipboard.writeText(url)
      break
  }
}

const toggleBookmark = () => {
  isBookmarked.value = !isBookmarked.value
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
