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
export type Contact      = Tables<'contact_requests'>
export type ArticleLike  = Tables<'article_likes'>
type Comment  = Tables<'comments'>
export type CommentLike  = Tables<'comment_likes'>

// =============================================
// Insert / Update helpers
// =============================================
export type ArticleInsert = TablesInsert<'articles'>
export type ArticleUpdate = TablesUpdate<'articles'>
export type UserInsert    = TablesInsert<'users'>
export type MessageInsert = TablesInsert<'messages'>


// CommentPublish
export type CommentUser = {
    id: string;
    username: string;
    display_name: string;
    avatar_url: string;
}

export type RawComment = {
    id: string;
    user_id: string;
    parent_id: string | null;
    article_id: string;
    content: string;
    created_at: string;
    user: CommentUser;        
    reply_count: { count: number }[];
};


export interface CommentPublish extends Omit<Comment, "deleted_at"> {
  reply_count: number;
  replies: CommentPublish[];
  user: CommentUser
}

// UserPublish
export type UserPublish = Omit<User, "deleted_at">;
export interface UpdateInfoUser {
  display_name: string;
  bio?: string;
}
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

export type ArticlePublish = Omit<Article, "role" | "deleted_at" | "content_html"> & {
  user: Omit<User, "deleted_at" | "updated_at" | "created_at" | "email">;
  tags: Pick<Tag, "id" | "name">[];
  likes_count: number,
  is_liked: boolean
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
  title: string;
  slug: string;
  description?: string;
  content_md?: string;
  thumbnail?: string;
  status?: "draft" | "published" | "archived";
  tags?: Pick<Tag, "id" | "name">[];
}

export interface UpdateArticleRequest extends Partial<CreateArticleRequest> {
  id: number;
}

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


// ======== CONTACT ==========
export interface ContactFormData {
  email: string,
  name: string,
  message: string
}