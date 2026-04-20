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
    <div v-else-if="post" class="overflow-visible">
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
      <article class="prose dark:prose-invert max-w-none mb-12 markdown-body">
        <div v-html="parsedContent" @click="handleContentClick"></div>
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
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { format } from 'date-fns'
import { postsApi } from '../services/api'
import type { PostDetail } from '../types'
import { renderMarkdown } from '../utils/markdownRenderer'

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

const parsedContent = computed(() => {
  return renderMarkdown(post.value?.content ?? '')
})

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

const handleContentClick = async (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (target.classList.contains('copy-code-btn')) {
    const container = target.closest('.code-block-container')
    if (!container) return
    const codeEl = container.querySelector('code')
    if (!codeEl) return

    try {
      await navigator.clipboard.writeText(codeEl.innerText)
      const originalText = target.innerText
      target.innerText = 'Copied!'
      target.classList.add('text-gruvbox-light-green', 'dark:text-gruvbox-dark-green')
      setTimeout(() => {
        target.innerText = originalText
        target.classList.remove('text-gruvbox-light-green', 'dark:text-gruvbox-dark-green')
      }, 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
      target.innerText = 'Failed'
    }
  }
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

<style scoped>
/* Fine-tune prose list offset, particularly for double-digit ordered lists */
:deep(.markdown-body ol),
:deep(.markdown-body ul) {
  list-style-position: outside !important;
  padding-left: 2.5em !important; /* more padding to avoid cut-off numbers */
}
:deep(.markdown-body li) {
  margin-left: 0;
  padding-left: 0.25em;
}

/* Fine-tune prose code block margins to make the container stand out */
:deep(.markdown-body pre),
:deep(.markdown-body pre.hljs) {
  margin: 1.5em 0 !important;
  border-radius: 0.5rem !important;
  padding: 1.25em !important;
  /* Use a slightly darker/different background than the main #282828 body so it forms a visible box */
  background-color: #1d2021 !important; 
  border: 1px solid #3c3836 !important;
  overflow-x: auto !important;
}

/* Fix up the fenced code block container specifically so the <pre> inside doesn't double-margin/double-border */
:deep(.markdown-body .code-block-container pre),
:deep(.markdown-body .code-block-container pre.hljs) {
  margin: 0 !important;
  border-radius: 0 0 0.5rem 0.5rem !important;
  border: none !important;
  border-top: 1px solid #3c3836 !important;
}

:deep(.markdown-body code) {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
}

:deep(.markdown-body pre code),
:deep(.markdown-body pre.hljs code) {
  background-color: transparent !important;
  color: inherit !important;
  padding: 0 !important;
  border-width: 0 !important;
}
</style>
