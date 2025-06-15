
import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { store } from '@/store'
import { logout } from '@/store/slices/authSlice'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5371/api'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const state = store.getState()
        const token = state.auth.token
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor to handle auth errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          store.dispatch(logout())
        }
        return Promise.reject(error)
      }
    )
  }

  async get<T = any>(url: string, params?: any): Promise<AxiosResponse<T>> {
    return this.client.get(url, { params })
  }

  async post<T = any>(url: string, data?: any): Promise<AxiosResponse<T>> {
    return this.client.post(url, data)
  }

  async put<T = any>(url: string, data?: any): Promise<AxiosResponse<T>> {
    return this.client.put(url, data)
  }

  async delete<T = any>(url: string): Promise<AxiosResponse<T>> {
    return this.client.delete(url)
  }
}

const apiClient = new ApiClient()

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),
  register: (email: string, password: string, username?: string) =>
    apiClient.post('/auth/register', { email, password, username }),
  forgotPassword: (email: string) =>
    apiClient.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) =>
    apiClient.post('/auth/reset-password', { token, password }),
  verifyToken: () =>
    apiClient.get('/auth/verify'),
}

// Jobs API
export const jobsApi = {
  getJobs: (params: any) =>
    apiClient.get('/agent/jobs', params),
  getJobById: (id: string) =>
    apiClient.get(`/agent/jobs/${id}`),
  createJob: (data: any) =>
    apiClient.post('/agent/jobs', data),
}

// Conversations API
export const conversationsApi = {
  getConversations: () =>
    apiClient.get('/memory/conversations'),
  createConversation: (data: any) =>
    apiClient.post('/memory/conversations', data),
  getConversationById: (id: string) =>
    apiClient.get(`/memory/conversations/${id}`),
}

// Proposals API
export const proposalsApi = {
  getProposals: (params: any) =>
    apiClient.get('/agent/proposals', params),
  getProposalById: (id: string) =>
    apiClient.get(`/agent/proposals/${id}`),
  generateProposal: (data: any) =>
    apiClient.post('/agent/proposals', data),
}

export default apiClient
