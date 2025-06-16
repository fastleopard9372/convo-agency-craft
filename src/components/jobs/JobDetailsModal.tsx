
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { DollarSign, Calendar, Briefcase, ExternalLink } from 'lucide-react'
import { Job } from '@/store/slices/jobsSlice'

interface JobDetailsModalProps {
  job: Job | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onGenerateProposal: (job: Job) => void
  generating: boolean
}

export const JobDetailsModal = ({ job, open, onOpenChange, onGenerateProposal, generating }: JobDetailsModalProps) => {
  if (!job) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <DialogTitle className="text-xl font-bold line-clamp-2 pr-4">
                {job.title}
              </DialogTitle>
              {job.source && (
                <Badge variant="secondary">
                  {job.source}
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Budget and Date Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {job.budgetMin && job.budgetMax 
                  ? `$${job.budgetMin} - $${job.budgetMax}`
                  : job.budgetMin 
                  ? `$${job.budgetMin}+`
                  : job.budgetMax
                  ? `Up to $${job.budgetMax}`
                  : 'Budget not specified'
                }
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                Posted: {new Date(job.scrapedAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <Separator />

          {/* Description */}
          {job.description && (
            <div className="space-y-2">
              <h3 className="font-semibold">Description</h3>
              <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                {job.description}
              </div>
            </div>
          )}

          {/* Proposals Count */}
          <div className="flex items-center space-x-2">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {job.proposals?.length || 0} proposals generated
            </span>
          </div>

          {/* Metadata */}
          {job.metadata && Object.keys(job.metadata).length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">Additional Information</h3>
              <div className="text-sm text-muted-foreground">
                {Object.entries(job.metadata).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                    <span>{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button 
              onClick={() => onGenerateProposal(job)}
              disabled={generating}
            >
              {generating ? 'Generating...' : 'Generate Proposal'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
