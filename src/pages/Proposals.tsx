
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FileText, Calendar, ExternalLink, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RootState, AppDispatch } from '@/store'
import { fetchProposals } from '@/store/slices/proposalsSlice'
import { formatDistanceToNow } from 'date-fns'

export const Proposals = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { proposals, isLoading } = useSelector((state: RootState) => state.proposals)

  useEffect(() => {
    dispatch(fetchProposals({}))
  }, [dispatch])

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'submitted':
        return 'default'
      case 'accepted':
        return 'success'
      case 'rejected':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Proposals</h1>
          <p className="text-muted-foreground">
            View and manage your AI-generated proposals
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading proposals...</div>
      ) : (
        <div className="space-y-4">
          {proposals.map((proposal) => (
            <Card key={proposal.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">
                      Proposal for Job #{proposal.jobId.slice(0, 8)}
                    </CardTitle>
                    <CardDescription>
                      Generated {formatDistanceToNow(new Date(proposal.generatedAt), { addSuffix: true })}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getStatusColor(proposal.status)}>
                      {proposal.status || 'draft'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {proposal.content}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-1 h-4 w-4" />
                    {proposal.submittedAt 
                      ? `Submitted ${formatDistanceToNow(new Date(proposal.submittedAt), { addSuffix: true })}`
                      : 'Not submitted yet'
                    }
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="mr-1 h-4 w-4" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="mr-1 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {proposals.length === 0 && !isLoading && (
        <div className="text-center py-8">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No proposals yet</h3>
          <p className="text-muted-foreground">
            Generate your first AI-powered proposal from the Jobs section.
          </p>
        </div>
      )}
    </div>
  )
}
