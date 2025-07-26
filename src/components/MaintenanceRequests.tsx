import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Plus, Wrench, Clock, CheckCircle, XCircle, Camera } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

export default function MaintenanceRequests() {
  const [requests, setRequests] = useKV('maintenance-requests', [])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    location: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.description || !formData.category) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    
    const newRequest = {
      id: Date.now(),
      ...formData,
      status: 'pending',
      dateSubmitted: new Date().toISOString(),
      dateUpdated: new Date().toISOString()
    }

    setRequests(current => [...current, newRequest])
    
    setFormData({
      title: '',
      description: '',
      category: '',
      priority: 'medium',
      location: ''
    })
    
    setIsSubmitting(false)
    setSheetOpen(false)
    toast.success('Maintenance request submitted successfully!')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'default'
      case 'in-progress': return 'secondary'
      case 'completed': return 'outline'
      case 'cancelled': return 'destructive'
      default: return 'default'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'outline'
      case 'medium': return 'secondary'
      case 'high': return 'destructive'
      default: return 'default'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />
      case 'in-progress': return <Wrench className="h-4 w-4" />
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'cancelled': return <XCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="h-full overflow-auto">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Maintenance Requests</h1>
            <p className="text-muted-foreground">Submit and track repair requests</p>
          </div>
          
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Request
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh]">
              <SheetHeader className="mb-6">
                <SheetTitle>Submit Maintenance Request</SheetTitle>
                <SheetDescription>
                  Describe the issue and we'll get it resolved quickly.
                </SheetDescription>
              </SheetHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Issue Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Brief description of the issue"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="plumbing">Plumbing</SelectItem>
                      <SelectItem value="electrical">Electrical</SelectItem>
                      <SelectItem value="hvac">HVAC</SelectItem>
                      <SelectItem value="appliance">Appliance</SelectItem>
                      <SelectItem value="pest-control">Pest Control</SelectItem>
                      <SelectItem value="locks-keys">Locks & Keys</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - Can wait a few days</SelectItem>
                      <SelectItem value="medium">Medium - Within 24-48 hours</SelectItem>
                      <SelectItem value="high">High - Urgent/Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g., Kitchen, Bathroom, Living Room"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Detailed description of the issue..."
                    rows={4}
                  />
                </div>

                <Button type="button" variant="outline" className="w-full flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Add Photos (Optional)
                </Button>

                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </Button>
              </form>
            </SheetContent>
          </Sheet>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {requests.length > 0 ? (
            requests.map((request) => (
              <Card key={request.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{request.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Request #{request.id} • {request.category}
                        {request.location && ` • ${request.location}`}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <Badge variant={getStatusColor(request.status)} className="flex items-center gap-1">
                        {getStatusIcon(request.status)}
                        {request.status}
                      </Badge>
                      <Badge variant={getPriorityColor(request.priority)}>
                        {request.priority} priority
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{request.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Submitted: {new Date(request.dateSubmitted).toLocaleDateString()}</span>
                    <span>Updated: {new Date(request.dateUpdated).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No maintenance requests</h3>
                <p className="text-muted-foreground mb-4">
                  When you submit a request, it will appear here.
                </p>
                <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                  <SheetTrigger asChild>
                    <Button>Submit Your First Request</Button>
                  </SheetTrigger>
                </Sheet>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}