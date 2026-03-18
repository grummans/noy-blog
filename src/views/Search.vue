<template>
  <div class="max-w-4xl mx-auto font-mono text-sm md:text-base">
    <div class="mb-8 border-b border-gruvbox-light-bg4 dark:border-gruvbox-dark-bg4 pb-4">
      <h1 class="text-xl font-bold text-gruvbox-light-yellow dark:text-gruvbox-dark-yellow mb-2">
        <span class="text-gruvbox-light-orange dark:text-gruvbox-dark-orange">$</span> telescope find_files
      </h1>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="py-8 text-gruvbox-light-yellow dark:text-gruvbox-dark-yellow">
      Indexing workspace...<span class="blinking-cursor"></span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="py-8 text-gruvbox-light-red dark:text-gruvbox-dark-red">
      [ERROR]: {{ error }}
      <br>
      <button @click="fetchData" class="mt-4 hover:underline text-gruvbox-light-fg dark:text-gruvbox-dark-fg">
        [ retry ]
      </button>
    </div>

    <template v-else>
      <!-- Search Input -->
      <div class="mb-8 p-4 border border-gruvbox-light-bg4 dark:border-gruvbox-dark-bg4 bg-gruvbox-light-bg0_h dark:bg-gruvbox-dark-bg0_h shadow-[4px_4px_0_0_#a89984] dark:shadow-[4px_4px_0_0_#7c6f64] text-gruvbox-light-gray dark:text-gruvbox-dark-gray">
        <div class="flex items-center mb-4 border-b border-gruvbox-light-bg4 dark:border-gruvbox-dark-bg4 pb-2">
          <span class="text-gruvbox-light-blue dark:text-gruvbox-dark-blue mr-2">></span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Regex search..."
            class="flex-1 bg-transparent border-none focus:outline-none text-gruvbox-light-fg dark:text-gruvbox-dark-fg placeholder-gruvbox-light-bg4 dark:placeholder-gruvbox-dark-bg4 outline-none active:outline-none"
            autofocus
          >
        </div>
        
        <!-- Search Filters -->
        <div class="flex flex-wrap gap-4 text-sm">
          <span>--type=</span>
          <button
            v-for="filter in searchFilters"
            :key="filter.value"
            @click="selectedFilter = filter.value"
            class="hover:text-gruvbox-light-yellow dark:hover:text-gruvbox-dark-yellow transition-colors"
            :class="selectedFilter === filter.value ? 'text-gruvbox-light-yellow dark:text-gruvbox-dark-yellow font-bold underline' : 'text-gruvbox-light-gray dark:text-gruvbox-dark-gray'"
          >
            {{ filter.value }}
          </button>
        </div>
      </div>

      <!-- Search Results -->
      <div v-if="searchQuery.length > 0">
        <div class="mb-4 text-gruvbox-light-aqua dark:text-gruvbox-dark-aqua">
          Matches found: {{ searchResults.length }}
        </div>

        <ul class="space-y-4">
          <li v-for="result in searchResults" :key="result.slug" class="group">
            <div class="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
              <span class="text-gruvbox-light-green dark:text-gruvbox-dark-green whitespace-nowrap">./posts/</span>
              <RouterLink :to="'/posts/' + result.slug" class="text-gruvbox-light-fg dark:text-gruvbox-dark-fg font-bold group-hover:underline truncate" v-html="highlightSearchTerm(result.slug + '.md', searchQuery)">
              </RouterLink>
            </div>
            
            <div class="pl-0 sm:pl-8 mt-1 text-gruvbox-light-gray dark:text-gruvbox-dark-gray text-sm">
              <span class="text-gruvbox-light-purple dark:text-gruvbox-dark-purple">Line 1: </span>
              <span v-html="highlightSearchTerm(result.title, searchQuery)"></span>
            </div>
          </li>
        </ul>
      </div>

      <!-- Default Empty State -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
        <div>
          <h3 class="text-gruvbox-light-yellow dark:text-gruvbox-dark-yellow mb-2 font-bold">[ Quick Jumps ]</h3>
          <ul class="space-y-1">
            <li v-for="post in recentPosts" :key="post.slug">
              <span class="text-gruvbox-light-gray dark:text-gruvbox-dark-gray mr-2">*</span>
              <RouterLink :to="'/posts/' + post.slug" class="text-gruvbox-light-blue dark:text-gruvbox-dark-blue hover:underline hover:text-gruvbox-light-aqua dark:hover:text-gruvbox-dark-aqua truncate block max-w-[200px] sm:max-w-xs">
                {{ post.slug }}.md
              </RouterLink>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 class="text-gruvbox-light-yellow dark:text-gruvbox-dark-yellow mb-2 font-bold">[ Top Tags ]</h3>
          <div class="flex flex-wrap gap-2">
            <RouterLink
              v-for="tag in popularTags"
              :key="tag.id"
              :to="'/tags/' + tag.slug"
              class="text-gruvbox-light-gray dark:text-gruvbox-dark-gray hover:text-gruvbox-light-fg dark:hover:text-gruvbox-dark-fg hover:underline"
            >
              {{ tag.name }}({{ tag.postCount }})
            </RouterLink>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

import { postsApi, tagsApi } from '../services/api'
import type { PostListItem, Tag } from '../types'

const allPosts = ref<PostListItem[]>([])
const allTags = ref<Tag[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const searchQuery = ref('')
const selectedFilter = ref('all')

const searchFilters = [
  { label: 'All', value: 'all' },
  { label: 'Posts', value: 'posts' },
  { label: 'Tags', value: 'tags' },
  { label: 'Recent', value: 'recent' }
]

const fetchData = async () => {
  loading.value = true
  error.value = null
  try {
    const [postsData, tagsData] = await Promise.all([
      postsApi.getAll(),
      tagsApi.getAll()
    ])
    allPosts.value = postsData
    allTags.value = tagsData
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load data'
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)

const popularTags = computed(() => {
  return [...allTags.value].sort((a, b) => b.postCount - a.postCount).slice(0, 10)
})

const recentPosts = computed(() => {
  return [...allPosts.value].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 5)
})

const searchResults = computed(() => {
  if (!searchQuery.value.trim()) return []

  const query = searchQuery.value.toLowerCase()
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  return allPosts.value.filter(post => {
    const matchesTitle = post.title.toLowerCase().includes(query)
    const matchesExcerpt = post.excerpt?.toLowerCase().includes(query) || false
    const matchesTags = post.tags.some(tag => tag.name.toLowerCase().includes(query))
    const matchesCategory = post.category?.name.toLowerCase().includes(query) || false

    switch (selectedFilter.value) {
      case 'tags': return matchesTags
      case 'recent': return new Date(post.updatedAt) > thirtyDaysAgo && (matchesTitle || matchesExcerpt || matchesTags || matchesCategory)
      case 'posts':
      case 'all':
      default: return matchesTitle || matchesExcerpt || matchesTags || matchesCategory
    }
  })
})

const highlightSearchTerm = (text: string, searchTerm: string) => {
  if (!searchTerm.trim() || !text) return text
  const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escapedTerm})`, 'gi')
  return text.replace(regex, '<span class="bg-gruvbox-light-yellow text-gruvbox-light-bg dark:bg-gruvbox-dark-yellow dark:text-gruvbox-dark-bg px-1">$1</span>')
}
</script>
