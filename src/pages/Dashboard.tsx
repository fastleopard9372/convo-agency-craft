
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  Briefcase, 
  MessageSquare, 
  FileText, 
  TrendingUp,
  DollarSign,
  Clock
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { RootState, AppDispatch } from '@/store'
import { fetchJobs } from '@/store/slices/jobsSlice'
import { fetchConversations } from '@/store/slices/conversationsSlice'
import { fetchProposals } from '@/store/slices/proposalsSlice'

export const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { jobs } = useSelector((state: RootState) => state.jobs)
  const { conversations } = useSelector((state: RootState) => state.conversations)
  const { proposals } = useSelector((state: RootState) => state.proposals)
  const { user } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    dispatch(fetchJobs({ limit: 5 }))
    dispatch(fetchConversations())
    dispatch(fetchProposals({}))
  }, [dispatch])

  const stats = [
    {
      name: 'Active Jobs',
      value: jobs.length,
      icon: Briefcase,
      change: '+12%',
      changeType: 'positive',
    },
    {
      name: 'Conversations',
      value: conversations.length,
      icon: MessageSquare,
      change: '+5%',
      changeType: 'positive',
    },
    {
      name: 'Proposals Generated',
      value: proposals.length,
      icon: FileText,
      change: '+18%',
      changeType: 'positive',
    },
    {
      name: 'Success Rate',
      value: '76%',
      icon: TrendingUp,
      change: '+3%',
      changeType: 'positive',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.username || user?.email}</h1>
          <p className="text-muted-foreground">
            Here's what's happening with your freelance projects today.
          </p>
        </div>
        <Button>Create New Job</Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Jobs */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recent Jobs</CardTitle>
            <CardDescription>Latest job opportunities and applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {jobs.slice(0, 3).map((job) => (
                <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{job.title}</p>
                    <p className="text-sm text-muted-foreground">
                      ${job.budgetMin} - ${job.budgetMax}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {new Date(job.scrapedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Memory Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Memory Usage</CardTitle>
            <CardDescription>Current storage utilization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Used</span>
              <span>450 MB of {user?.memoryQuotaMb || 1000} MB</span>
            </div>
            <Progress value={45} className="h-2" />
            <p className="text-xs text-muted-foreground">
              You have plenty of space for more conversations and files.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest interactions and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {conversations.slice(0, 5).map((conversation) => (
              <div key={conversation.id} className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm">
                    New conversation started
                    {conversation.summary && `: ${conversation.summary}`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(conversation.startedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
