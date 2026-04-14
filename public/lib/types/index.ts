// types/index.ts

export type UserRole = 'user' | 'admin';
export type ArticleStatus = 'draft' | 'published' | 'hidden';

export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  avatar_url?: string | null;
  display_name?: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface UserPublic {
  id: number;
  username: string;
  email: string;
  avatar_url?: string | null;
  display_name?: string | null;
  role: UserRole;
  created_at: string;
}

export interface Article {
  id: number;
  user_id: number;
  title: string;
  slug: string;
  description: string;
  content_md: string;
  content_html?: string | null;
  thumbnail?: string | null;
  views: number;
  status: ArticleStatus;
  created_at: string;
  updated_at: string;
  images?: string[];
}

export interface ArticleWithAuthor extends Article {
  username: string;
  display_name: string;
  avatar_url: string;
  // author: UserPublic;
}

export interface ArticleWithTags extends ArticleWithAuthor {
  tags: Tag[];
}

export interface Tag {
  id: number;
  name: string;
}

export interface ArticleTag {
  article_id: number;
  tag_id: number;
}

// Request/Response Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  display_name?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: UserPublic;
  error?: string;
}

export interface FeaturedArticlesResponse {
  success: boolean;
  data: ArticleWithTags[];
}

export interface ArticleResponse {
  success: boolean;
  message?: string;
  data: ArticleWithTags;
  error?: string;
}


export interface ArticlesResponse {
  success: boolean;
  data: ArticleWithTags[];
  pagination : {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface CreateArticleRequest {
  title: string;
  slug: string;
  description: string;
  content_md: string;
  content_html?: string;
  thumbnail?: File | null;
  images?: File[] | null;
  status?: ArticleStatus;
  tag_ids?: number[];
}

export interface UpdateArticleRequest {
  title?: string;
  slug?: string;
  description?: string;
  content_md?: string;
  thumbnail?: File | null;
  images?: File[] | null;
  status?: ArticleStatus;
  tag_ids?: number[];
}

// CONTACTS 
export interface Contact {
  id: number;
  name: string;
  email: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  created_at: string;
  updated_at: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface ContactSubmitResponse {
  success: boolean;
  message: string;
}

export interface ContactListResponse {
  success: boolean;
  data: Contact[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

export interface ContactSingleResponse {
  success: boolean;
  data: Contact;
}