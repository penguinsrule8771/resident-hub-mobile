import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Calendar, Plus, Clock, Users, Waves, Dumbbell, Coffee, Car } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

export default function AmenityReservations() {
  const [reservations, setReservations] = useKV('reservations', [])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  
  const [reservationData, setReservationData] = useState({
    amenity: '',
    date: '',
    time: '',
    duration: '1',
    guests: '1'
  })

  const amenities = [
    {
      id: 'gym',
      name: 'Fitness Center',
      icon: <Dumbbell className="h-5 w-5" />,
      description: 'Fully equipped gym with cardio and weight equipment',
      capacity: '8 people',
      hours: '5:00 AM - 11:00 PM'
    },
    {
      id: 'pool',
      name: 'Swimming Pool',
      icon: <Waves className="h-5 w-5" />,
      description: 'Outdoor heated pool with lounge area',
      capacity: '15 people',
      hours: '6:00 AM - 10:00 PM'
    },
    {
      id: 'clubhouse',
      name: 'Clubhouse',
      icon: <Users className="h-5 w-5" />,
      description: 'Community room perfect for events and gatherings',
      capacity: '25 people',
      hours: '9:00 AM - 10:00 PM'
    },
    {
      id: 'lounge',
      name: 'Business Lounge',
      icon: <Coffee className="h-5 w-5" />,
      description: 'Quiet workspace with WiFi and conference table',
      capacity: '6 people',
      hours: '24/7'
    },
    {
      id: 'parking',
      name: 'Guest Parking',
      icon: <Car className="h-5 w-5" />,
      description: 'Reserved parking spaces for visitor vehicles',
      capacity: '3 spots',
      hours: '24/7'
    }
  ]

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
    '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reservationData.amenity || !reservationData.date || !reservationData.time) {
      toast.error('Please fill in all required fields')
      return
    }

    // Check for conflicts
    const existingReservations = reservations.filter(
      r => r.amenity === reservationData.amenity && 
           r.date === reservationData.date && 
           r.time === reservationData.time &&
           r.status !== 'cancelled'
    )

    if (existingReservations.length > 0) {
      toast.error('This time slot is already booked')
      return
    }

    setIsSubmitting(true)
    
    const newReservation = {
      id: Date.now(),
      ...reservationData,
      status: 'confirmed',
      dateBooked: new Date().toISOString(),
      amenityName: amenities.find(a => a.id === reservationData.amenity)?.name || reservationData.amenity
    }

    setReservations(current => [...current, newReservation])
    
    setReservationData({
      amenity: '',
      date: '',
      time: '',
      duration: '1',
      guests: '1'
    })
    
    setIsSubmitting(false)
    setSheetOpen(false)
    toast.success('Reservation confirmed!')
  }

  const cancelReservation = (id: number) => {
    setReservations(current => 
      current.map(reservation => 
        reservation.id === id 
          ? { ...reservation, status: 'cancelled' }
          : reservation
      )
    )
    toast.success('Reservation cancelled')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'outline'
      case 'cancelled': return 'destructive'
      case 'completed': return 'secondary'
      default: return 'default'
    }
  }

  const getAmenityIcon = (amenityId: string) => {
    const amenity = amenities.find(a => a.id === amenityId)
    return amenity?.icon || <Calendar className="h-5 w-5" />
  }

  const upcomingReservations = reservations.filter(
    r => r.status === 'confirmed' && new Date(r.date) >= new Date()
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const pastReservations = reservations.filter(
    r => new Date(r.date) < new Date() || r.status === 'cancelled'
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="h-full overflow-auto">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Amenity Reservations</h1>
            <p className="text-muted-foreground">Book community facilities</p>
          </div>
          
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Book Now
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh]">
              <SheetHeader className="mb-6">
                <SheetTitle>Book an Amenity</SheetTitle>
                <SheetDescription>
                  Reserve community facilities for your use.
                </SheetDescription>
              </SheetHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amenity">Amenity *</Label>
                  <Select value={reservationData.amenity} onValueChange={(value) => setReservationData(prev => ({ ...prev, amenity: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select amenity" />
                    </SelectTrigger>
                    <SelectContent>
                      {amenities.map((amenity) => (
                        <SelectItem key={amenity.id} value={amenity.id}>
                          <div className="flex items-center gap-2">
                            {amenity.icon}
                            {amenity.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {reservationData.amenity && (
                  <div className="p-3 bg-muted rounded-lg">
                    {(() => {
                      const selectedAmenity = amenities.find(a => a.id === reservationData.amenity)
                      return selectedAmenity ? (
                        <div className="space-y-1 text-sm">
                          <p><strong>Description:</strong> {selectedAmenity.description}</p>
                          <p><strong>Capacity:</strong> {selectedAmenity.capacity}</p>
                          <p><strong>Hours:</strong> {selectedAmenity.hours}</p>
                        </div>
                      ) : null
                    })()}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={reservationData.date}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setReservationData(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Time *</Label>
                    <Select value={reservationData.time} onValueChange={(value) => setReservationData(prev => ({ ...prev, time: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (hours)</Label>
                    <Select value={reservationData.duration} onValueChange={(value) => setReservationData(prev => ({ ...prev, duration: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 hour</SelectItem>
                        <SelectItem value="2">2 hours</SelectItem>
                        <SelectItem value="3">3 hours</SelectItem>
                        <SelectItem value="4">4 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="guests">Number of Guests</Label>
                    <Input
                      id="guests"
                      type="number"
                      min="1"
                      max="25"
                      value={reservationData.guests}
                      onChange={(e) => setReservationData(prev => ({ ...prev, guests: e.target.value }))}
                    />
                  </div>
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? 'Booking...' : 'Confirm Reservation'}
                </Button>
              </form>
            </SheetContent>
          </Sheet>
        </div>

        {/* Available Amenities */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Available Amenities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {amenities.map((amenity) => (
              <div key={amenity.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  {amenity.icon}
                  <div>
                    <p className="font-medium">{amenity.name}</p>
                    <p className="text-sm text-muted-foreground">{amenity.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {amenity.capacity} • {amenity.hours}
                    </p>
                  </div>
                </div>
                <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                  <SheetTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setReservationData(prev => ({ ...prev, amenity: amenity.id }))}
                    >
                      Book
                    </Button>
                  </SheetTrigger>
                </Sheet>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Reservations */}
        {upcomingReservations.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Reservations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingReservations.map((reservation) => (
                <div key={reservation.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    {getAmenityIcon(reservation.amenity)}
                    <div>
                      <p className="font-medium">{reservation.amenityName}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(reservation.date).toLocaleDateString()} at {reservation.time}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {reservation.duration} hour(s) • {reservation.guests} guest(s)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusColor(reservation.status)}>
                      {reservation.status}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => cancelReservation(reservation.id)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Reservation History */}
        {pastReservations.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Reservation History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {pastReservations.slice(0, 5).map((reservation) => (
                <div key={reservation.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    {getAmenityIcon(reservation.amenity)}
                    <div>
                      <p className="font-medium">{reservation.amenityName}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(reservation.date).toLocaleDateString()} at {reservation.time}
                      </p>
                    </div>
                  </div>
                  <Badge variant={getStatusColor(reservation.status)}>
                    {reservation.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Booking Guidelines */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Booking Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="p-3 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">General Rules</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Reservations can be made up to 30 days in advance</li>
                <li>• Maximum of 4 hours per reservation</li>
                <li>• Cancel at least 24 hours in advance to avoid fees</li>
                <li>• Clean up after use and report any damage</li>
              </ul>
            </div>
            
            <div className="p-3 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Contact Information</h4>
              <p className="text-muted-foreground">
                For special events or questions about amenities, contact the leasing office at (555) 123-4567.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}