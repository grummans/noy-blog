// API Response wrapper
export interface ApiResponse<T> {
  code: number
  message: string | null
  data: T
}

// Category
export interface Category {
  id: number
  name: string
  slug: string
  postCount: number
}

// Tag
export interface Tag {
  id: number
  name: string
  slug: string
  postCount: number
}

// Author
export interface Author {
  id: number
  username: string
  displayName: string
}

// Attachment
export interface Attachment {
  id: number
  postId: number
  originalFilename: string
  storedFilename: string
  fileType: 'IMAGE' | 'VIDEO' | 'OTHER'
  mimeType: string
  fileSize: number
  storagePath: string
  altText: string | null
  displayOrder: number
  uploadedAt: string
}

// Post for listing (from GET /c/posts or GET /c/posts/featured)
export interface PostListItem {
  id: number
  title: string
  slug: string
  excerpt: string
  featuredImageUrl: string
  category: Category
  tags: Tag[]
  readingTimeMinutes: number
  updatedAt: string
}

// Post detail (from GET /c/posts/slug/{slug} or GET /c/posts/{id})
export interface PostDetail {
  id: number
  title: string
  slug: string
  excerpt: string
  viewCount: number
  isFeatured: boolean
  featuredImageUrl: string
  content: string | null
  contentHtml: string
  readingTimeMinutes: number
  updatedAt: string
  status: 'PUBLISHED' | 'DRAFT'
  metaTitle: string
  metaDescription: string
  category: Category
  tags: Tag[]
  author: Author
  attachments: Attachment[]
}
