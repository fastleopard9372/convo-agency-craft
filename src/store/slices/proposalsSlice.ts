
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { proposalsApi } from '@/services/api'
import { Proposal } from './jobsSlice'

interface ProposalsState {
  proposals: Proposal[]
  currentProposal: Proposal | null
  isLoading: boolean
  error: string | null
  generating: boolean
}

const initialState: ProposalsState = {
  proposals: [],
  currentProposal: null,
  isLoading: false,
  error: null,
  generating: false,
}

export const fetchProposals = createAsyncThunk(
  'proposals/fetchProposals',
  async (params: { jobId?: string; status?: string }) => {
    const response = await proposalsApi.getProposals(params)
    return response.data
  }
)

export const generateProposal = createAsyncThunk(
  'proposals/generateProposal',
  async (data: { jobId: string; template?: string; customInstructions?: string }) => {
    const response = await proposalsApi.generateProposal(data)
    return response.data
  }
)

const proposalsSlice = createSlice({
  name: 'proposals',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCurrentProposal: (state, action) => {
      state.currentProposal = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProposals.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchProposals.fulfilled, (state, action) => {
        state.isLoading = false
        state.proposals = action.payload.data
      })
      .addCase(fetchProposals.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to fetch proposals'
      })
      .addCase(generateProposal.pending, (state) => {
        state.generating = true
        state.error = null
      })
      .addCase(generateProposal.fulfilled, (state, action) => {
        state.generating = false
        state.proposals.unshift(action.payload.data)
        state.currentProposal = action.payload.data
      })
      .addCase(generateProposal.rejected, (state, action) => {
        state.generating = false
        state.error = action.error.message || 'Failed to generate proposal'
      })
  },
})

export const { clearError, setCurrentProposal } = proposalsSlice.actions
export default proposalsSlice.reducer
