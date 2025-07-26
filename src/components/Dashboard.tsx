import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Wrench, CreditCard, Bell, CalendarCheck, MapPin, Calendar } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'

export default function Dashboard() {
  const [maintenanceRequests] = useKV('maintenance-requests', [])
  const [payments] = useKV('payments', [])
  const [announcements] = useKV('announcements', [
    {
      id: 1,
      title: 'Pool Maintenance Scheduled',
      content: 'The pool will be closed for maintenance this Friday from 8am-12pm.',
      date: '2024-01-15',
      priority: 'medium',
      read: false
    },
    {
      id: 2,
      title: 'New Fitness Equipment',
      content: 'We\'ve added new cardio equipment to the fitness center. Enjoy!',
      date: '2024-01-12',
      priority: 'low',
      read: false
    }
  ])
  const [reservations] = useKV('reservations', [])

  const pendingRequests = maintenanceRequests.filter(req => req.status === 'pending' || req.status === 'in-progress')
  const unreadAnnouncements = announcements.filter(ann => !ann.read)
  const upcomingReservations = reservations.filter(res => new Date(res.date) >= new Date())

  const currentBalance = payments.length > 0 ? payments[payments.length - 1].balance : 1250.00

  return (
    <div className="h-full overflow-auto">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Welcome Home</h1>
            <p className="text-muted-foreground">Apartment 204B • Sunset Gardens</p>
          </div>
          <Avatar className="h-12 w-12">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary text-primary-foreground">JD</AvatarFallback>
          </Avatar>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Rent Balance</p>
                  <p className="text-2xl font-bold">${currentBalance.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Wrench className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-sm font-medium">Open Requests</p>
                  <p className="text-2xl font-bold">{pendingRequests.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Announcements */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span>Recent Announcements</span>
              {unreadAnnouncements.length > 0 && (
                <Badge variant="secondary">{unreadAnnouncements.length} new</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {announcements.slice(0, 3).map((announcement) => (
              <div key={announcement.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                <Bell className="h-4 w-4 text-primary mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{announcement.title}</p>
                    {!announcement.read && (
                      <div className="h-2 w-2 bg-accent rounded-full"></div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {announcement.content}
                  </p>
                </div>
              </div>
            ))}
            {announcements.length === 0 && (
              <p className="text-center text-muted-foreground py-4">No announcements</p>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Reservations */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <CalendarCheck className="h-5 w-5" />
              Upcoming Reservations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingReservations.length > 0 ? (
              <div className="space-y-3">
                {upcomingReservations.slice(0, 3).map((reservation) => (
                  <div key={reservation.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{reservation.amenity}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(reservation.date).toLocaleDateString()} at {reservation.time}
                      </p>
                    </div>
                    <Badge variant="outline">{reservation.status}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">No upcoming reservations</p>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <Wrench className="h-6 w-6" />
              <span className="text-sm">Report Issue</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <Calendar className="h-6 w-6" />
              <span className="text-sm">Book Amenity</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <CreditCard className="h-6 w-6" />
              <span className="text-sm">Pay Rent</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <MapPin className="h-6 w-6" />
              <span className="text-sm">Find Contacts</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}