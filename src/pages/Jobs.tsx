
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Plus, Search, Filter, Briefcase, DollarSign, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useForm } from 'react-hook-form'
import { RootState, AppDispatch } from '@/store'
import { fetchJobs, createJob, Job } from '@/store/slices/jobsSlice'
import { generateProposal } from '@/store/slices/proposalsSlice'

interface JobFormData {
  title: string
  description: string
  source?: string
  budgetMin?: number
  budgetMax?: number
}

export const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const { jobs, isLoading, pagination } = useSelector((state: RootState) => state.jobs)
  const { generating } = useSelector((state: RootState) => state.proposals)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<JobFormData>()

  useEffect(() => {
    dispatch(fetchJobs({ limit: 20 }))
  }, [dispatch])

  const onSubmit = async (data: JobFormData) => {
    try {
      await dispatch(createJob(data)).unwrap()
      setIsCreateDialogOpen(false)
      reset()
    } catch (error) {
      console.error('Failed to create job:', error)
    }
  }

  const handleGenerateProposal = async (job: Job) => {
    try {
      await dispatch(generateProposal({ jobId: job.id })).unwrap()
    } catch (error) {
      console.error('Failed to generate proposal:', error)
    }
  }

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Jobs</h1>
          <p className="text-muted-foreground">
            Manage your freelance opportunities and generate AI-powered proposals
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Job
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Job</DialogTitle>
              <DialogDescription>
                Add a new freelance job opportunity to track and generate proposals for.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  placeholder="Enter job title"
                  {...register('title', { required: 'Job title is required' })}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter job description"
                  {...register('description')}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budgetMin">Min Budget ($)</Label>
                  <Input
                    id="budgetMin"
                    type="number"
                    placeholder="0"
                    {...register('budgetMin', { valueAsNumber: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budgetMax">Max Budget ($)</Label>
                  <Input
                    id="budgetMax"
                    type="number"
                    placeholder="0"
                    {...register('budgetMax', { valueAsNumber: true })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Input
                  id="source"
                  placeholder="e.g., Upwork, Freelancer, Direct"
                  {...register('source')}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Job</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Jobs Grid */}
      {isLoading ? (
        <div className="text-center py-8">Loading jobs...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg line-clamp-2">{job.title}</CardTitle>
                  {job.source && (
                    <Badge variant="secondary" className="ml-2">
                      {job.source}
                    </Badge>
                  )}
                </div>
                {job.description && (
                  <CardDescription className="line-clamp-3">
                    {job.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <DollarSign className="mr-1 h-4 w-4" />
                    {job.budgetMin && job.budgetMax 
                      ? `$${job.budgetMin} - $${job.budgetMax}`
                      : job.budgetMin 
                      ? `$${job.budgetMin}+`
                      : job.budgetMax
                      ? `Up to $${job.budgetMax}`
                      : 'Budget not specified'
                    }
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="mr-1 h-4 w-4" />
                    {new Date(job.scrapedAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Briefcase className="mr-1 h-4 w-4" />
                    {job.proposals?.length || 0} proposals
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => handleGenerateProposal(job)}
                    disabled={generating}
                  >
                    {generating ? 'Generating...' : 'Generate Proposal'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredJobs.length === 0 && !isLoading && (
        <div className="text-center py-8">
          <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No jobs found</h3>
          <p className="text-muted-foreground">
            {searchTerm ? 'Try adjusting your search terms.' : 'Add your first job to get started.'}
          </p>
        </div>
      )}
    </div>
  )
}
