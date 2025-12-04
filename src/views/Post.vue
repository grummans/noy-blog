<template>
  <div v-if="post" class="max-w-4xl mx-auto">
    <!-- Post Header -->
    <header class="mb-8">
      <div class="flex items-center gap-2 mb-4">
        <span
          v-for="tag in post.tags"
          :key="tag"
          class="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full"
        >
          {{ tag }}
        </span>
      </div>
      
      <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
        {{ post.title }}
      </h1>
      
      <p class="text-xl text-gray-600 dark:text-gray-400 mb-6">
        {{ post.description }}
      </p>
      
      <div class="flex items-center justify-between text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800 pb-6">
        <div class="flex items-center space-x-4">
          <time :datetime="post.pubDate" class="text-sm">
            Published {{ formatDate(post.pubDate) }}
          </time>
          <span class="text-sm">{{ post.readTime }} min read</span>
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

    <!-- Post Content -->
    <article class="prose prose-lg dark:prose-invert max-w-none mb-12">
      <div v-html="post.content"></div>
    </article>

    <!-- Post Footer -->
    <footer class="border-t border-gray-200 dark:border-gray-800 pt-8">
      <!-- Tags -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tags</h3>
        <div class="flex flex-wrap gap-2">
          <RouterLink
            v-for="tag in post.tags"
            :key="tag"
            :to="`/tags/${tag.toLowerCase()}`"
            class="inline-block px-3 py-1 text-sm font-medium bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-full hover:bg-blue-100 hover:text-blue-800 dark:hover:bg-blue-900 dark:hover:text-blue-200 transition-colors"
          >
            {{ tag }}
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
        
        <div class="flex space-x-4">
          <button
            v-if="previousPost"
            @click="$router.push(`/posts/${previousPost.slug}`)"
            class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
          >
            ← Previous
          </button>
          <button
            v-if="nextPost"
            @click="$router.push(`/posts/${nextPost.slug}`)"
            class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
          >
            Next →
          </button>
        </div>
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
import { ref, computed, onMounted } from 'vue'
import { format } from 'date-fns'

const props = defineProps<{
  slug: string
}>()

const isBookmarked = ref(false)

// Sample post data - in a real app, this would be fetched from an API or CMS
const allPosts = [
  {
    slug: 'getting-started-vue-3',
    title: 'Getting Started with Vue 3 and TypeScript',
    description: 'Learn how to set up a modern Vue 3 project with TypeScript, Vite, and best practices for scalable development.',
    content: `
      <h2>Introduction</h2>
      <p>Vue 3 represents a significant evolution in the Vue.js ecosystem, bringing improved performance, better TypeScript support, and a more flexible architecture. In this comprehensive guide, we'll explore how to set up a modern Vue 3 project with TypeScript and establish best practices for scalable development.</p>
      
      <h2>Why Vue 3 and TypeScript?</h2>
      <p>The combination of Vue 3 and TypeScript offers several compelling advantages:</p>
      <ul>
        <li><strong>Type Safety:</strong> Catch errors at compile time rather than runtime</li>
        <li><strong>Better IDE Support:</strong> Enhanced autocomplete, refactoring, and navigation</li>
        <li><strong>Improved Performance:</strong> Vue 3's Composition API and TypeScript's optimizations</li>
        <li><strong>Scalability:</strong> Better code organization for large applications</li>
      </ul>

      <h2>Setting Up Your Development Environment</h2>
      <p>Before we dive into creating our Vue 3 + TypeScript project, let's ensure we have the right tools installed.</p>
      
      <h3>Prerequisites</h3>
      <ul>
        <li>Node.js (version 16 or higher)</li>
        <li>npm or yarn package manager</li>
        <li>A code editor with TypeScript support (VS Code recommended)</li>
      </ul>

      <h2>Creating Your First Vue 3 + TypeScript Project</h2>
      <p>The easiest way to get started is using Vite, which provides excellent TypeScript support out of the box:</p>
      
      <pre><code>npm create vue@latest my-vue-app
cd my-vue-app
npm install
npm run dev</code></pre>

      <p>This command will create a new Vue 3 project with TypeScript configured and ready to use.</p>

      <h2>Project Structure Best Practices</h2>
      <p>A well-organized project structure is crucial for maintainability. Here's a recommended structure:</p>
      
      <pre><code>src/
  components/        # Reusable components
    common/         # Generic components
    ui/            # UI-specific components
  views/            # Page components
  composables/      # Vue 3 composables
  utils/           # Utility functions
  types/           # TypeScript type definitions
  stores/          # State management
  assets/          # Static assets</code></pre>

      <h2>Conclusion</h2>
      <p>Vue 3 with TypeScript provides a powerful foundation for building modern web applications. By following the best practices outlined in this guide, you'll be well-equipped to create scalable, maintainable applications that leverage the full power of both technologies.</p>
    `,
    tags: ['Vue', 'TypeScript', 'Frontend'],
    pubDate: '2024-01-15T00:00:00Z',
    readTime: 8
  },
  {
    slug: 'tailwind-css-tips',
    title: '10 Tailwind CSS Tips for Better UI Design',
    description: 'Discover advanced Tailwind CSS techniques to create beautiful and responsive user interfaces.',
    content: `
      <h2>Introduction</h2>
      <p>Tailwind CSS has revolutionized how we approach utility-first styling. While it's easy to get started with Tailwind, mastering its advanced features can significantly improve your UI design workflow and results.</p>
      
      <h2>1. Custom Color Palettes</h2>
      <p>Don't rely solely on Tailwind's default colors. Create custom color palettes that match your brand:</p>
      
      <pre><code>// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        }
      }
    }
  }
}</code></pre>

      <h2>2. Utilize Component Classes</h2>
      <p>For repeated patterns, create component classes using @apply directive:</p>
      
      <pre><code>.btn-primary {
  @apply px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors;
}</code></pre>

      <h2>3. Responsive Design Made Easy</h2>
      <p>Tailwind's responsive utilities make it simple to create adaptive layouts:</p>
      
      <pre><code>&lt;div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"&gt;
  &lt;!-- Your content --&gt;
&lt;/div&gt;</code></pre>

      <h2>Conclusion</h2>
      <p>These tips will help you create more maintainable and beautiful UIs with Tailwind CSS. Remember, the key is to balance utility classes with custom components for optimal results.</p>
    `,
    tags: ['CSS', 'Design', 'Tailwind'],
    pubDate: '2024-01-10T00:00:00Z',
    readTime: 6
  }
]

const post = computed(() => {
  return allPosts.find(p => p.slug === props.slug)
})

const currentIndex = computed(() => {
  return allPosts.findIndex(p => p.slug === props.slug)
})

const previousPost = computed(() => {
  const index = currentIndex.value
  return index > 0 ? allPosts[index - 1] : null
})

const nextPost = computed(() => {
  const index = currentIndex.value
  return index < allPosts.length - 1 ? allPosts[index + 1] : null
})

const shareButtons = [
  { name: 'Twitter' },
  { name: 'LinkedIn' },
  { name: 'Copy Link' }
]

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'MMMM dd, yyyy')
}

const sharePost = () => {
  if (navigator.share && post.value) {
    navigator.share({
      title: post.value.title,
      text: post.value.description,
      url: window.location.href
    })
  } else {
    // Fallback: copy to clipboard
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
  // In a real app, you'd save this to localStorage or a backend
}

onMounted(() => {
  // In a real app, you might track page views here
  console.log(`Viewing post: ${props.slug}`)
})
</script>
