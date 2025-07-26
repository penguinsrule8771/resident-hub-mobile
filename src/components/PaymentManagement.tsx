import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { CreditCard, Plus, Calendar, CheckCircle, Clock, AlertCircle } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

export default function PaymentManagement() {
  const [payments, setPayments] = useKV('payments', [
    {
      id: 1,
      amount: 1250.00,
      type: 'rent',
      status: 'paid',
      date: '2024-01-01',
      method: 'Bank Transfer',
      balance: 1250.00
    },
    {
      id: 2,
      amount: 1250.00,
      type: 'rent',
      status: 'pending',
      date: '2024-02-01',
      dueDate: '2024-02-05',
      balance: 1250.00
    }
  ])
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  
  const [paymentData, setPaymentData] = useState({
    amount: '',
    paymentMethod: '',
    paymentDate: ''
  })

  const currentBalance = payments.length > 0 ? payments[payments.length - 1].balance : 0
  const pendingPayments = payments.filter(p => p.status === 'pending')
  const paidPayments = payments.filter(p => p.status === 'paid').slice(-5)

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!paymentData.amount || !paymentData.paymentMethod) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const newPayment = {
      id: Date.now(),
      amount: parseFloat(paymentData.amount),
      type: 'rent',
      status: 'paid',
      date: paymentData.paymentDate || new Date().toISOString().split('T')[0],
      method: paymentData.paymentMethod,
      balance: Math.max(0, currentBalance - parseFloat(paymentData.amount))
    }

    setPayments(current => [...current, newPayment])
    
    setPaymentData({
      amount: '',
      paymentMethod: '',
      paymentDate: ''
    })
    
    setIsSubmitting(false)
    setSheetOpen(false)
    toast.success('Payment processed successfully!')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'outline'
      case 'pending': return 'secondary'
      case 'overdue': return 'destructive'
      default: return 'default'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4" />
      case 'pending': return <Clock className="h-4 w-4" />
      case 'overdue': return <AlertCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="h-full overflow-auto">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Payment Management</h1>
            <p className="text-muted-foreground">Manage rent and fees</p>
          </div>
          
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Make Payment
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[70vh]">
              <SheetHeader className="mb-6">
                <SheetTitle>Make a Payment</SheetTitle>
                <SheetDescription>
                  Process your rent payment or other fees.
                </SheetDescription>
              </SheetHeader>
              
              <form onSubmit={handlePayment} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Payment Amount *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={paymentData.amount}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment-method">Payment Method *</Label>
                  <Select value={paymentData.paymentMethod} onValueChange={(value) => setPaymentData(prev => ({ ...prev, paymentMethod: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                      <SelectItem value="credit-card">Credit Card</SelectItem>
                      <SelectItem value="debit-card">Debit Card</SelectItem>
                      <SelectItem value="check">Check</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment-date">Payment Date</Label>
                  <Input
                    id="payment-date"
                    type="date"
                    value={paymentData.paymentDate}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, paymentDate: e.target.value }))}
                  />
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Payment Summary</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Current Balance:</span>
                      <span>${currentBalance.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Amount:</span>
                      <span>${paymentData.amount ? parseFloat(paymentData.amount).toFixed(2) : '0.00'}</span>
                    </div>
                    <div className="flex justify-between font-medium pt-2 border-t">
                      <span>Remaining Balance:</span>
                      <span>${paymentData.amount ? Math.max(0, currentBalance - parseFloat(paymentData.amount)).toFixed(2) : currentBalance.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? 'Processing Payment...' : 'Process Payment'}
                </Button>
              </form>
            </SheetContent>
          </Sheet>
        </div>

        {/* Balance Overview */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Current Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">${currentBalance.toFixed(2)}</p>
              <p className="text-muted-foreground mt-1">
                {currentBalance > 0 ? 'Amount Due' : 'Paid in Full'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Pending Payments */}
        {pendingPayments.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Pending Payments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">${payment.amount.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">
                      Due: {new Date(payment.dueDate || payment.date).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={getStatusColor(payment.status)} className="flex items-center gap-1">
                    {getStatusIcon(payment.status)}
                    {payment.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Payment History */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {paidPayments.length > 0 ? (
              <div className="space-y-3">
                {paidPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium">${payment.amount.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(payment.date).toLocaleDateString()} • {payment.method}
                      </p>
                    </div>
                    <Badge variant={getStatusColor(payment.status)} className="flex items-center gap-1">
                      {getStatusIcon(payment.status)}
                      Paid
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">No payment history</p>
            )}
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <h4 className="font-medium mb-2">Accepted Payment Methods</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Bank Transfer (ACH) - No fee</li>
                <li>• Credit/Debit Cards - 2.5% convenience fee</li>
                <li>• Online Check - $2 processing fee</li>
              </ul>
            </div>
            
            <div className="p-4 rounded-lg bg-muted/50">
              <h4 className="font-medium mb-2">Important Notes</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Rent is due on the 1st of each month</li>
                <li>• Late fees apply after the 5th</li>
                <li>• Payments process within 1-2 business days</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}