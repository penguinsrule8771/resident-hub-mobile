import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { House, Wrench, CreditCard, Calendar, Phone, Bell } from '@phosphor-icons/react'
import { Toaster } from '@/components/ui/sonner'
import Dashboard from '@/components/Dashboard'
import MaintenanceRequests from '@/components/MaintenanceRequests'
import PaymentManagement from '@/components/PaymentManagement'
import Announcements from '@/components/Announcements'
import AmenityReservations from '@/components/AmenityReservations'
import ContactDirectory from '@/components/ContactDirectory'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-screen flex flex-col">
        <div className="flex-1 overflow-hidden">
          <TabsContent value="dashboard" className="h-full m-0">
            <Dashboard />
          </TabsContent>
          
          <TabsContent value="maintenance" className="h-full m-0">
            <MaintenanceRequests />
          </TabsContent>
          
          <TabsContent value="payments" className="h-full m-0">
            <PaymentManagement />
          </TabsContent>
          
          <TabsContent value="announcements" className="h-full m-0">
            <Announcements />
          </TabsContent>
          
          <TabsContent value="amenities" className="h-full m-0">
            <AmenityReservations />
          </TabsContent>
          
          <TabsContent value="contacts" className="h-full m-0">
            <ContactDirectory />
          </TabsContent>
        </div>

        <TabsList className="grid grid-cols-6 h-16 bg-card border-t rounded-none">
          <TabsTrigger value="dashboard" className="flex flex-col gap-1 h-full">
            <House size={20} />
            <span className="text-xs">Home</span>
          </TabsTrigger>
          
          <TabsTrigger value="maintenance" className="flex flex-col gap-1 h-full">
            <Wrench size={20} />
            <span className="text-xs">Repairs</span>
          </TabsTrigger>
          
          <TabsTrigger value="payments" className="flex flex-col gap-1 h-full">
            <CreditCard size={20} />
            <span className="text-xs">Payments</span>
          </TabsTrigger>
          
          <TabsTrigger value="announcements" className="flex flex-col gap-1 h-full">
            <Bell size={20} />
            <span className="text-xs">News</span>
          </TabsTrigger>
          
          <TabsTrigger value="amenities" className="flex flex-col gap-1 h-full">
            <Calendar size={20} />
            <span className="text-xs">Book</span>
          </TabsTrigger>
          
          <TabsTrigger value="contacts" className="flex flex-col gap-1 h-full">
            <Phone size={20} />
            <span className="text-xs">Contacts</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}

export default App