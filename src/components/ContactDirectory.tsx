import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { 
  Phone, 
  Envelope, 
  Clock, 
  Shield, 
  Wrench, 
  MapPin, 
  Car,
  Heart,
  Building,
  UserCircle,
  Fire,
  Siren
} from '@phosphor-icons/react'

export default function ContactDirectory() {
  const [searchTerm, setSearchTerm] = useState('')

  const contacts = [
    {
      id: 1,
      category: 'emergency',
      name: 'Emergency Services',
      title: '911',
      phone: '911',
      email: '',
      hours: '24/7',
      description: 'Police, Fire, Medical Emergency',
      urgent: true
    },
    {
      id: 2,
      category: 'emergency',
      name: 'Poison Control',
      title: 'National Poison Control',
      phone: '1-800-222-1222',
      email: '',
      hours: '24/7',
      description: 'Poison emergency assistance',
      urgent: true
    },
    {
      id: 3,
      category: 'property',
      name: 'Leasing Office',
      title: 'Main Office',
      phone: '(555) 123-4567',
      email: 'office@sunsetgardens.com',
      hours: 'Mon-Fri 9AM-6PM, Sat 10AM-4PM',
      description: 'General inquiries, leasing, renewals'
    },
    {
      id: 4,
      category: 'property',
      name: 'Property Manager',
      title: 'Sarah Johnson',
      phone: '(555) 123-4568',
      email: 'sarah.johnson@sunsetgardens.com',
      hours: 'Mon-Fri 9AM-5PM',
      description: 'Property management, resident concerns'
    },
    {
      id: 5,
      category: 'maintenance',
      name: 'Maintenance Emergency',
      title: '24/7 Emergency Line',
      phone: '(555) 123-4569',
      email: 'emergency@sunsetgardens.com',
      hours: '24/7',
      description: 'Water leaks, power outages, lockouts',
      urgent: true
    },
    {
      id: 6,
      category: 'maintenance',
      name: 'Maintenance Office',
      title: 'Non-Emergency Repairs',
      phone: '(555) 123-4570',
      email: 'maintenance@sunsetgardens.com',
      hours: 'Mon-Fri 8AM-5PM',
      description: 'General repairs and maintenance requests'
    },
    {
      id: 7,
      category: 'security',
      name: 'Security Office',
      title: 'Building Security',
      phone: '(555) 123-4571',
      email: 'security@sunsetgardens.com',
      hours: '24/7',
      description: 'Security concerns, gate access, visitor issues'
    },
    {
      id: 8,
      category: 'services',
      name: 'Concierge',
      title: 'Resident Services',
      phone: '(555) 123-4572',
      email: 'concierge@sunsetgardens.com',
      hours: 'Mon-Fri 8AM-8PM, Weekends 10AM-6PM',
      description: 'Package pickup, amenity reservations, general assistance'
    },
    {
      id: 9,
      category: 'local',
      name: 'City Hospital',
      title: 'Sunrise Medical Center',
      phone: '(555) 789-0123',
      email: '',
      hours: '24/7',
      description: '2.5 miles away - Full service hospital'
    },
    {
      id: 10,
      category: 'local',
      name: 'Pharmacy',
      title: 'RxPlus Pharmacy',
      phone: '(555) 789-0124',
      email: '',
      hours: 'Mon-Fri 8AM-10PM, Weekends 9AM-9PM',
      description: '0.3 miles away - Prescription and over-the-counter'
    },
    {
      id: 11,
      category: 'local',
      name: 'Police (Non-Emergency)',
      title: 'Metro Police Department',
      phone: '(555) 789-0125',
      email: '',
      hours: '24/7',
      description: 'Non-emergency police matters'
    },
    {
      id: 12,
      category: 'utilities',
      name: 'Electric Company',
      title: 'Metro Electric',
      phone: '1-800-555-POWER',
      email: 'service@metroelectric.com',
      hours: '24/7',
      description: 'Power outages and electrical service'
    },
    {
      id: 13,
      category: 'utilities',
      name: 'Gas Company',
      title: 'City Gas & Energy',
      phone: '1-800-555-GAS1',
      email: '',
      hours: '24/7',
      description: 'Gas leaks and service issues'
    },
    {
      id: 14,
      category: 'utilities',
      name: 'Water Department',
      title: 'Municipal Water',
      phone: '(555) 789-0130',
      email: 'water@cityservices.gov',
      hours: 'Mon-Fri 7AM-4PM',
      description: 'Water service and billing'
    }
  ]

  const categories = [
    {
      id: 'emergency',
      name: 'Emergency',
      icon: <Siren className="h-5 w-5" />,
      color: 'text-destructive'
    },
    {
      id: 'property',
      name: 'Property Management',
      icon: <Building className="h-5 w-5" />,
      color: 'text-primary'
    },
    {
      id: 'maintenance',
      name: 'Maintenance',
      icon: <Wrench className="h-5 w-5" />,
      color: 'text-accent'
    },
    {
      id: 'security',
      name: 'Security',
      icon: <Shield className="h-5 w-5" />,
      color: 'text-secondary'
    },
    {
      id: 'services',
      name: 'Resident Services',
      icon: <UserCircle className="h-5 w-5" />,
      color: 'text-primary'
    },
    {
      id: 'local',
      name: 'Local Services',
      icon: <MapPin className="h-5 w-5" />,
      color: 'text-muted-foreground'
    },
    {
      id: 'utilities',
      name: 'Utilities',
      icon: <Fire className="h-5 w-5" />,
      color: 'text-muted-foreground'
    }
  ]

  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' || contact.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId) || categories[0]
  }

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`
  }

  const handleEmail = (email: string) => {
    window.location.href = `mailto:${email}`
  }

  // Emergency contacts for quick access
  const emergencyContacts = contacts.filter(contact => contact.urgent)

  return (
    <div className="h-full overflow-auto">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Contact Directory</h1>
          <p className="text-muted-foreground">Important numbers and contacts</p>
        </div>

        {/* Emergency Contacts - Quick Access */}
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Siren className="h-5 w-5" />
              Emergency Contacts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {emergencyContacts.map((contact) => (
              <div key={contact.id} className="flex items-center justify-between p-3 rounded-lg bg-background border border-destructive/20">
                <div>
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-sm text-muted-foreground">{contact.description}</p>
                </div>
                <Button 
                  className="bg-destructive hover:bg-destructive/90"
                  onClick={() => handleCall(contact.phone)}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Search */}
        <div className="space-y-3">
          <Input
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          
          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-1 whitespace-nowrap"
              >
                {category.icon}
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Contacts List */}
        <div className="space-y-4">
          {categories.map((category) => {
            const categoryContacts = filteredContacts.filter(contact => contact.category === category.id)
            
            if (categoryContacts.length === 0 || (selectedCategory !== 'all' && selectedCategory !== category.id)) {
              return null
            }

            return (
              <Card key={category.id}>
                <CardHeader className="pb-3">
                  <CardTitle className={`flex items-center gap-2 ${category.color}`}>
                    {category.icon}
                    {category.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {categoryContacts.map((contact) => (
                    <div key={contact.id} className="p-4 rounded-lg border bg-card">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{contact.name}</h3>
                            {contact.urgent && (
                              <Badge variant="destructive" className="text-xs">
                                Emergency
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{contact.title}</p>
                          <p className="text-sm text-muted-foreground mt-1">{contact.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <Clock className="h-4 w-4" />
                        <span>{contact.hours}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleCall(contact.phone)}
                          className="flex items-center gap-1"
                        >
                          <Phone className="h-3 w-3" />
                          {contact.phone}
                        </Button>
                        
                        {contact.email && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEmail(contact.email)}
                            className="flex items-center gap-1"
                          >
                            <Envelope className="h-3 w-3" />
                            Email
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredContacts.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Phone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No contacts found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or category filter.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Important Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Important Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="p-3 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Property Address</h4>
              <p className="text-muted-foreground">
                Sunset Gardens Apartments<br />
                1234 Sunset Boulevard<br />
                Sunshine City, SC 12345
              </p>
            </div>
            
            <div className="p-3 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">After Hours</h4>
              <p className="text-muted-foreground">
                For maintenance emergencies after business hours, call the emergency maintenance line. 
                For all other inquiries, please contact the leasing office during business hours.
              </p>
            </div>
            
            <div className="p-3 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Emergency Procedures</h4>
              <p className="text-muted-foreground">
                In case of fire, earthquake, or other emergency, follow posted evacuation procedures. 
                Assembly point is located in the main parking lot.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}