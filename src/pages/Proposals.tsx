
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FileText, Plus, Search, Filter, Eye, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RootState, AppDispatch } from '@/store'
import { fetchProposals, generateProposal } from '@/store/slices/proposalsSlice'
import { formatDistanceToNow } from 'date-fns'

export const Proposals = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { proposals, isLoading, generating } = useSelector((state: RootState) => state.proposals)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    dispatch(fetchProposals({}))
  }, [dispatch])

  const handleGenerateProposal = () => {
    dispatch(generateProposal({
      jobId: 'sample-job-id',
      template: 'default',
      customInstructions: 'Generate a professional proposal for this job'
    }))
  }

  const filteredProposals = proposals.filter(proposal => {
    const matchesSearch = proposal.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || proposal.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Proposals</h1>
          <p className="text-muted-foreground">
            Manage and generate AI-powered proposals for your projects
          </p>
        </div>
        <Button onClick={handleGenerateProposal} disabled={generating}>
          <Plus className="mr-2 h-4 w-4" />
          {generating ? 'Generating...' : 'Generate Proposal'}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search proposals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Proposals Grid */}
      {isLoading ? (
        <div className="text-center py-8">Loading proposals...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProposals.map((proposal) => (
            <Card key={proposal.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg line-clamp-2">
                    Proposal {proposal.id.slice(0, 8)}
                  </CardTitle>
                  <Badge variant={proposal.status === 'accepted' ? 'default' : 'secondary'}>
                    {proposal.status || 'draft'}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-3">
                  {proposal.content.slice(0, 150)}...
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <span>
                    Generated {formatDistanceToNow(new Date(proposal.generatedAt), { addSuffix: true })}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="mr-1 h-4 w-4" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="mr-1 h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredProposals.length === 0 && !isLoading && (
        <div className="text-center py-8">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No proposals found</h3>
          <p className="text-muted-foreground">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filters.' 
              : 'Generate your first AI-powered proposal to get started.'
            }
          </p>
        </div>
      )}
    </div>
  )
}
