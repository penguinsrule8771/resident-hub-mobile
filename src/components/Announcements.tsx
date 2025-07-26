import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bell, Pin, Calendar, Users, AlertTriangle } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'

export default function Announcements() {
  const [announcements, setAnnouncements] = useKV('announcements', [
    {
      id: 1,
      title: 'Pool Maintenance Scheduled',
      content: 'The community pool will be closed for routine maintenance this Friday, January 19th from 8:00 AM to 12:00 PM. We apologize for any inconvenience and appreciate your patience as we work to keep our facilities in excellent condition.',
      date: '2024-01-15',
      priority: 'medium',
      category: 'maintenance',
      read: false,
      pinned: true
    },
    {
      id: 2,
      title: 'New Fitness Equipment Installed',
      content: 'We\'re excited to announce that new cardio equipment has been installed in the fitness center! Come check out the latest treadmills and elliptical machines. The fitness center is open daily from 5:00 AM to 11:00 PM.',
      date: '2024-01-12',
      priority: 'low',
      category: 'amenity',
      read: false,
      pinned: false
    },
    {
      id: 3,
      title: 'Package Delivery Policy Update',
      content: 'Effective February 1st, 2024, we will be implementing a new package delivery system. All packages will be held at the front desk for pickup. Residents will receive email notifications when packages arrive. Please bring a valid ID when picking up packages.',
      date: '2024-01-10',
      priority: 'high',
      category: 'policy',
      read: true,
      pinned: false
    },
    {
      id: 4,
      title: 'Community BBQ Event',
      content: 'Join us for our monthly community BBQ on Saturday, January 27th from 2:00 PM to 5:00 PM at the pool area. Food and drinks will be provided. This is a great opportunity to meet your neighbors and enjoy some delicious food!',
      date: '2024-01-08',
      priority: 'low',
      category: 'event',
      read: true,
      pinned: false
    },
    {
      id: 5,
      title: 'Parking Lot Repainting',
      content: 'The parking lot will be restriped next week. Please move your vehicles to the temporary parking area behind the building. Work will begin Monday at 7:00 AM and is expected to complete by Wednesday evening.',
      date: '2024-01-05',
      priority: 'high',
      category: 'maintenance',
      read: true,
      pinned: false
    }
  ])

  const [filter, setFilter] = useState('all')

  const markAsRead = (id: number) => {
    setAnnouncements(current => 
      current.map(announcement => 
        announcement.id === id 
          ? { ...announcement, read: true }
          : announcement
      )
    )
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'outline'
      case 'medium': return 'secondary'
      case 'high': return 'destructive'
      default: return 'default'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'maintenance': return <AlertTriangle className="h-4 w-4" />
      case 'event': return <Calendar className="h-4 w-4" />
      case 'policy': return <Users className="h-4 w-4" />
      case 'amenity': return <Users className="h-4 w-4" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'maintenance': return 'text-accent'
      case 'event': return 'text-primary'
      case 'policy': return 'text-secondary'
      case 'amenity': return 'text-primary'
      default: return 'text-muted-foreground'
    }
  }

  const filteredAnnouncements = announcements.filter(announcement => {
    if (filter === 'unread') return !announcement.read
    if (filter === 'pinned') return announcement.pinned
    return true
  }).sort((a, b) => {
    // Sort by pinned first, then by date
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  const unreadCount = announcements.filter(a => !a.read).length

  return (
    <div className="h-full overflow-auto">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Announcements</h1>
            <p className="text-muted-foreground">Stay updated with community news</p>
          </div>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Bell className="h-3 w-3" />
              {unreadCount} unread
            </Badge>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'unread' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('unread')}
            className="flex items-center gap-1"
          >
            <Bell className="h-3 w-3" />
            Unread ({unreadCount})
          </Button>
          <Button
            variant={filter === 'pinned' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('pinned')}
            className="flex items-center gap-1"
          >
            <Pin className="h-3 w-3" />
            Pinned
          </Button>
        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          {filteredAnnouncements.length > 0 ? (
            filteredAnnouncements.map((announcement) => (
              <Card 
                key={announcement.id} 
                className={`transition-all hover:shadow-md ${
                  !announcement.read ? 'ring-2 ring-primary/20' : ''
                }`}
                onClick={() => !announcement.read && markAsRead(announcement.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {announcement.pinned && (
                          <Pin className="h-4 w-4 text-primary" />
                        )}
                        <div className={`${getCategoryColor(announcement.category)}`}>
                          {getCategoryIcon(announcement.category)}
                        </div>
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">
                          {announcement.category}
                        </span>
                        {!announcement.read && (
                          <div className="h-2 w-2 bg-primary rounded-full"></div>
                        )}
                      </div>
                      <CardTitle className="text-lg leading-tight">
                        {announcement.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(announcement.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <Badge variant={getPriorityColor(announcement.priority)}>
                      {announcement.priority}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-foreground">
                    {announcement.content}
                  </p>
                  {!announcement.read && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-3 text-primary"
                      onClick={(e) => {
                        e.stopPropagation()
                        markAsRead(announcement.id)
                      }}
                    >
                      Mark as read
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No announcements</h3>
                <p className="text-muted-foreground">
                  {filter === 'unread' 
                    ? "You're all caught up! No unread announcements."
                    : filter === 'pinned'
                    ? "No pinned announcements at this time."
                    : "Check back later for community updates."
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Actions */}
        {unreadCount > 0 && (
          <Card>
            <CardContent className="p-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setAnnouncements(current => 
                    current.map(announcement => ({ ...announcement, read: true }))
                  )
                }}
              >
                Mark All as Read
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Categories Legend */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Categories</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-accent" />
              <span>Maintenance</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span>Events</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-secondary" />
              <span>Policy Updates</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span>Amenities</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}