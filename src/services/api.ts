import type { ApiResponse, PostListItem, PostDetail, Category, Tag } from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8085/api'

// Generic fetch wrapper
async function fetchApi<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`)
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  
  const result: ApiResponse<T> = await response.json()
  
  if (result.code !== 200) {
    throw new Error(result.message || 'API error')
  }
  
  return result.data
}

// Posts API
export const postsApi = {
  // Get all published posts
  getAll: () => fetchApi<PostListItem[]>('/c/posts'),
  
  // Get featured posts (for home page)
  getFeatured: () => fetchApi<PostListItem[]>('/c/posts/featured'),
  
  // Get post detail by slug (recommended for SEO-friendly URLs)
  getBySlug: (slug: string) => fetchApi<PostDetail>(`/c/posts/slug/${slug}`),
  
  // Get post detail by ID
  getById: (id: number) => fetchApi<PostDetail>(`/c/posts/${id}`),
}

// Categories API
export const categoriesApi = {
  // Get all categories
  getAll: () => fetchApi<Category[]>('/c/categories'),
}

// Tags API
export const tagsApi = {
  // Get all tags
  getAll: () => fetchApi<Tag[]>('/c/tags'),
}

export default {
  posts: postsApi,
  categories: categoriesApi,
  tags: tagsApi,
}
