// lib/api.ts

import {
    LoginRequest,
    RegisterRequest,
    AuthResponse,
    ArticleResponse,
    ArticlesResponse,
    CreateArticleRequest,
    UpdateArticleRequest,
    ArticleStatus,
} from '@/public/lib/types';

const API_BASE_URL = 'https://easytrade.site/api/v2';

// Helper function để xử lý response
async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const error = await response.json().catch(() => ({
            error: 'Network error',
        }));
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }
    return response.json();
}

// Auth APIs
export const authAPI = {
  // Đăng nhập
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    return handleResponse<AuthResponse>(response);
  },

  // Đăng ký
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/register.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return handleResponse<AuthResponse>(response);
  },

  // Lấy thông tin user hiện tại (cần token)
  getCurrentUser: async (token: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse<AuthResponse>(response);
  },
};

// Article APIs
export const articleAPI = {
  // Lấy danh sách bài viết
  getArticles: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    tag?: string;
  }): Promise<ArticlesResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.status) searchParams.append('status', params.status);
    if (params?.tag) searchParams.append('tag', params.tag);

    const response = await fetch(
      `${API_BASE_URL}/articles?${searchParams.toString()}`, {
        cache: "no-cache"
      }
    );
    return handleResponse<ArticlesResponse>(response);
  },

  // Lấy bài viết theo ID
  getArticleById: async (id: number): Promise<ArticleResponse> => {
    const response = await fetch(`${API_BASE_URL}/articles/${id}`);
    return handleResponse<ArticleResponse>(response);
  },

  // Lấy bài viết theo slug
  getArticleBySlug: async (slug: string): Promise<ArticleResponse> => {
    const response = await fetch(`${API_BASE_URL}/articles/${slug}`);
    return handleResponse<ArticleResponse>(response);
  },

  // Tạo bài viết mới (cần token)
  createArticle: async (
    data: CreateArticleRequest,
    token: string
  ): Promise<ArticleResponse> => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("slug", data.slug);
    formData.append("content_md", data.content_md);
    formData.append("status", data.status ?? "draft");
    if (data.thumbnail) formData.append("thumbnail", data.thumbnail);

    const response = await fetch(`${API_BASE_URL}/admin/articles`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    return handleResponse<ArticleResponse>(response);
  },

  // Cập nhật bài viết (cần token)
  updateArticle: async (
    id: number,
    data: FormData,
    token: string
  ): Promise<ArticleResponse> => {
    const response = await fetch(`${API_BASE_URL}/admin/articles/${id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    });
    return handleResponse<ArticleResponse>(response);
  },

  // Xóa bài viết (cần token)
  deleteArticle: async (
    id: number,
    token: string
  ): Promise<{ success: boolean; message: string }> => {
    const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },
  // ADMIN 
  // Lấy chi tiết bài viết theo user_id & article_id 
  getAdminArticleById: async (
    article_id: number,
    token: string
  ): Promise<ArticleResponse> => {
    const response = await fetch(`${API_BASE_URL}/admin/articles/${article_id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse<ArticleResponse>(response);
  },

  // Lấy danh sách bài viết theo user_id 
  getAdminArticles: async (
    token: string,
    params?: {
      page?: number;
      limit?: number;
      status?: string|null;
      tag?: string;
    }
  ): Promise<ArticlesResponse> => {
    const url = new URL(`${API_BASE_URL}/admin/articles`);
    if (params) {
      if (params.page) url.searchParams.append("page", params.page.toString());
      if (params.limit) url.searchParams.append("limit", params.limit.toString());
      if (params.status) url.searchParams.append("status", params.status);
      if (params.tag) url.searchParams.append("tag", params.tag);
    }

    const response = await fetch(`${url.toString()}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse<ArticlesResponse>(response);
  },

  // Tăng view count
  incrementViews: async (id: number): Promise<void> => {
    await fetch(`${API_BASE_URL}/articles/${id}/view`, {
      method: 'POST',
    });
  },
};

// Tag APIs
export const tagAPI = {
  // Lấy tất cả tags
  getAllTags: async (): Promise<{ success: boolean; data: any[] }> => {
    const response = await fetch(`${API_BASE_URL}/tags`);
    return handleResponse(response);
  },

  // Tạo tag mới (cần token admin)
  createTag: async (
    name: string,
    token: string
  ): Promise<{ success: boolean; data: any }> => {
    const response = await fetch(`${API_BASE_URL}/tags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });
    return handleResponse(response);
  },
};