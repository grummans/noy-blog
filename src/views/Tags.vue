<template>
  <div class="max-w-4xl mx-auto font-mono text-sm md:text-base">
    <div class="mb-8 border-b border-gruvbox-light-bg4 dark:border-gruvbox-dark-bg4 pb-4">
      <h1 class="text-xl font-bold text-gruvbox-light-yellow dark:text-gruvbox-dark-yellow mb-2">
        <span class="text-gruvbox-light-orange dark:text-gruvbox-dark-orange">$</span> cat tags.json | jq 'keys'
      </h1>
      <p class="text-gruvbox-light-gray dark:text-gruvbox-dark-gray">
        [ Explore tags and topics ]
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="py-8 text-gruvbox-light-yellow dark:text-gruvbox-dark-yellow">
      Querying tags...<span class="blinking-cursor"></span>
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
      <div class="mb-12">
        <h2 class="text-gruvbox-light-purple dark:text-gruvbox-dark-purple font-bold mb-4">## All Tags</h2>
        <div class="flex flex-wrap gap-4">
          <RouterLink
            v-for="tag in sortedTags"
            :key="tag.id"
            :to="'/tags/' + tag.slug"
            class="text-gruvbox-light-fg dark:text-gruvbox-dark-fg hover:text-gruvbox-light-yellow dark:hover:text-gruvbox-dark-yellow hover:underline"
          >
            "{{ tag.name }}": <span class="text-gruvbox-light-blue dark:text-gruvbox-dark-blue">{{ tag.postCount }}</span>,
          </RouterLink>
        </div>
      </div>

      <div v-if="topTagsWithPosts.length > 0">
        <h2 class="text-gruvbox-light-purple dark:text-gruvbox-dark-purple font-bold mb-4">## Top Tags Preview</h2>
        <div class="space-y-8">
          <div v-for="tagData in topTagsWithPosts" :key="tagData.tag.id">
            <h3 class="text-gruvbox-light-yellow dark:text-gruvbox-dark-yellow font-bold mb-2">
              [{{ tagData.tag.name }}]
            </h3>
            
            <ul class="space-y-1">
              <li v-for="post in tagData.posts" :key="post.id" class="flex gap-2">
                <span class="text-gruvbox-light-green dark:text-gruvbox-dark-green">-rw-r--r--</span>
                <RouterLink :to="'/posts/' + post.slug" class="text-gruvbox-light-fg dark:text-gruvbox-dark-fg hover:text-gruvbox-light-aqua dark:hover:text-gruvbox-dark-aqua hover:underline truncate">
                  {{ post.slug }}.md
                </RouterLink>
              </li>
            </ul>
            <div class="mt-2 text-xs">
              <RouterLink :to="'/tags/' + tagData.tag.slug" class="text-gruvbox-light-gray dark:text-gruvbox-dark-gray hover:text-gruvbox-light-fg dark:hover:text-gruvbox-dark-fg hover:underline">
                [ view all {{ tagData.tag.postCount }} files ... ]
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

import { tagsApi, postsApi } from '../services/api'
import type { Tag, PostListItem } from '../types'

const allTags = ref<Tag[]>([])
const allPosts = ref<PostListItem[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const fetchData = async () => {
  loading.value = true
  error.value = null
  try {
    const [tagsData, postsData] = await Promise.all([
      tagsApi.getAll(),
      postsApi.getAll()
    ])
    allTags.value = tagsData
    allPosts.value = postsData
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load data'
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)

const sortedTags = computed(() => {
  return [...allTags.value].sort((a, b) => b.postCount - a.postCount)
})

const topTagsWithPosts = computed(() => {
  const topTags = sortedTags.value.slice(0, 4)
  return topTags.map(tag => {
    const postsForTag = allPosts.value
      .filter(post => post.tags.some(t => t.id === tag.id))
      .slice(0, 4)
    return { tag, posts: postsForTag }
  }).filter(item => item.posts.length > 0)
})
</script>
