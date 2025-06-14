
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { jobsApi } from '@/services/api'

export interface Job {
  id: string
  userId: string
  source?: string
  title: string
  description?: string
  budgetMin?: number
  budgetMax?: number
  postedAt?: string
  scrapedAt: string
  metadata?: Record<string, any>
  proposals?: Proposal[]
}

export interface Proposal {
  id: string
  jobId: string
  conversationId?: string
  content: string
  generatedAt: string
  submittedAt?: string
  status?: string
  metadata?: Record<string, any>
}

interface JobsState {
  jobs: Job[]
  currentJob: Job | null
  isLoading: boolean
  error: string | null
  pagination: {
    total: number
    limit: number
    offset: number
  }
}

const initialState: JobsState = {
  jobs: [],
  currentJob: null,
  isLoading: false,
  error: null,
  pagination: {
    total: 0,
    limit: 10,
    offset: 0,
  },
}

export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async (params: { limit?: number; offset?: number; status?: string; source?: string }) => {
    const response = await jobsApi.getJobs(params)
    return response.data
  }
)

export const createJob = createAsyncThunk(
  'jobs/createJob',
  async (jobData: Partial<Job>) => {
    const response = await jobsApi.createJob(jobData)
    return response.data
  }
)

export const fetchJobById = createAsyncThunk(
  'jobs/fetchJobById',
  async (id: string) => {
    const response = await jobsApi.getJobById(id)
    return response.data
  }
)

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCurrentJob: (state, action: PayloadAction<Job | null>) => {
      state.currentJob = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Jobs
      .addCase(fetchJobs.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.isLoading = false
        state.jobs = action.payload.data
        state.pagination = action.payload.pagination
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to fetch jobs'
      })
      // Create Job
      .addCase(createJob.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.isLoading = false
        state.jobs.unshift(action.payload.data)
      })
      .addCase(createJob.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to create job'
      })
      // Fetch Job by ID
      .addCase(fetchJobById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentJob = action.payload.data
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to fetch job'
      })
  },
})

export const { clearError, setCurrentJob } = jobsSlice.actions
export default jobsSlice.reducer
