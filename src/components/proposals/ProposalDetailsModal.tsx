
import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Calendar, DollarSign, FileText, Edit, Save, X } from 'lucide-react'
import { Proposal } from '@/store/slices/jobsSlice'
import { Job } from '@/store/slices/jobsSlice'

interface ProposalDetailsModalProps {
  proposal: Proposal | null
  job: Job | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave?: (proposalId: string, updates: Partial<Proposal>) => void
  mode: 'view' | 'edit'
  onModeChange: (mode: 'view' | 'edit') => void
}

export const ProposalDetailsModal = ({ 
  proposal, 
  job, 
  open, 
  onOpenChange, 
  onSave, 
  mode, 
  onModeChange 
}: ProposalDetailsModalProps) => {
  const [editedContent, setEditedContent] = useState('')
  const [editedStatus, setEditedStatus] = useState('')

  if (!proposal) return null

  const handleEdit = () => {
    setEditedContent(proposal.content)
    setEditedStatus(proposal.status || 'draft')
    onModeChange('edit')
  }

  const handleSave = () => {
    if (onSave) {
      onSave(proposal.id, {
        content: editedContent,
        status: editedStatus
      })
    }
    onModeChange('view')
  }

  const handleCancel = () => {
    onModeChange('view')
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'default'
      case 'accepted':
        return 'default'
      case 'rejected':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'text-blue-600'
      case 'accepted':
        return 'text-green-600'
      case 'rejected':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <DialogTitle className="text-xl font-bold">
                {job?.title || 'Proposal Details'}
              </DialogTitle>
              <DialogDescription className="flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                Generated on {new Date(proposal.generatedAt).toLocaleDateString()}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge 
                variant={getStatusVariant(proposal.status || 'draft')} 
                className={getStatusColor(proposal.status || 'draft')}
              >
                {proposal.status || 'draft'}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Job Information */}
          {job && (
            <div className="space-y-2">
              <h3 className="font-semibold">Job Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {job.budgetMin && job.budgetMax && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-3 w-3 text-muted-foreground" />
                    ${job.budgetMin} - ${job.budgetMax}
                  </div>
                )}
                {job.source && (
                  <div className="flex items-center gap-2">
                    <FileText className="h-3 w-3 text-muted-foreground" />
                    {job.source}
                  </div>
                )}
              </div>
            </div>
          )}

          <Separator />

          {/* Proposal Content */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Proposal Content</h3>
              {mode === 'view' && (
                <Button variant="outline" size="sm" onClick={handleEdit}>
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
              )}
            </div>

            {mode === 'edit' ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="min-h-[200px]"
                    placeholder="Enter proposal content..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={editedStatus} onValueChange={setEditedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <div className="text-sm whitespace-pre-wrap bg-muted/50 p-4 rounded-lg">
                {proposal.content}
              </div>
            )}
          </div>

          {/* Metadata */}
          {proposal.metadata && Object.keys(proposal.metadata).length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">Additional Information</h3>
              <div className="text-sm text-muted-foreground">
                {Object.entries(proposal.metadata).map(([key, value]) => (
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
            {mode === 'edit' ? (
              <>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="h-3 w-3 mr-1" />
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="h-3 w-3 mr-1" />
                  Save Changes
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
