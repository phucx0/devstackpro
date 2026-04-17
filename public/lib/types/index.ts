// types/index.ts
// =============================================
// Enums từ DB

import { Enums, Tables, TablesInsert, TablesUpdate } from "@/types/database.types"

// =============================================
export type UserRole      = Enums<'user_role'>      // 'admin' | 'author' | 'user'
export type ArticleStatus = Enums<'article_status'> // 'draft' | 'published' | 'archived'
export type MessageStatus = Enums<'contact_status'> // 'pending' | 'read' | 'replied'

// =============================================
// Row types (1:1 với DB)
// =============================================
export type User         = Tables<'users'>
export type Article      = Tables<'articles'>
export type Tag          = Tables<'tags'>
export type ArticleImage = Tables<'article_images'>
export type ArticleTag   = Tables<'article_tags'>
export type Message      = Tables<'messages'>

// =============================================
// Insert / Update helpers
// =============================================
export type ArticleInsert = TablesInsert<'articles'>
export type ArticleUpdate = TablesUpdate<'articles'>
export type UserInsert    = TablesInsert<'users'>
export type MessageInsert = TablesInsert<'messages'>

// =============================================
// Derived types (join / business logic)
// =============================================
export type ArticleWithAuthor = Article & {
  username: string
  display_name: string
  avatar_url: string | null
  images?: ArticleImage[]
}

export type ArticleWithTags = ArticleWithAuthor & {
  tags: Tag[]
}

// =============================================
// Request types (Form / API payload)
// =============================================
export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  display_name?: string
}

export interface CreateArticleRequest {
  title: string
  slug: string
  description: string
  content_md: string
  content_html?: string
  thumbnail?: File | null
  images?: File[] | null
  status?: ArticleStatus
  tag_ids?: number[]
}

export interface UpdateArticleRequest extends Partial<CreateArticleRequest> {}

export interface MessageFormData {
  name: string
  email: string
  message: string
}

// =============================================
// Response types (API wrapper)
// =============================================
export interface AuthResponse {
  success: boolean
  message: string
  token: string
  user: User
  error?: string
}

export interface ArticleResponse {
  success: boolean
  message?: string
  data: ArticleWithTags
  error?: string
}

export interface ArticlesResponse {
  success: boolean
  data: ArticleWithTags[]
  pagination: {
    page: number
    limit: number
    total: number
    total_pages: number
  }
}

export interface MessageSubmitResponse {
  success: boolean
  message: string
}

export interface MessageListResponse {
  success: boolean
  data: Message[]
  pagination: {
    total: number
    page: number
    limit: number
    total_pages: number
  }
}

export interface MessageSingleResponse {
  success: boolean
  data: Message
}


// Dashboard aggregates
export interface DashboardMetrics {
    totalPosts: number
    totalViews: number
    publishedPosts: number
    draftPosts: number
}

export interface TrafficDataPoint {
    day: number
    views: number
}

export interface RecentActivity {
    id: number
    title: string
    slug: string
    status: ArticleStatus
    created_at: string
    updated_at: string
    views: number
}

export interface DashboardData {
    metrics: DashboardMetrics
    trafficData: TrafficDataPoint[]
    recentActivities: RecentActivity[]
}