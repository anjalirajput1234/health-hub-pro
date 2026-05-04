import { useState } from "react";
import { useParams, Link, useLocation } from "wouter";
import { CreditCard, Smartphone, ShieldCheck, FileText, ArrowRight } from "lucide-react";
import { 
  useGetAppointment, 
  usePayAppointment,
  getGetAppointmentQueryKey 
} from "@/lib/api-client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

export default function Payment() {
  const { id } = useParams<{ id: string }>();
  const appointmentId = parseInt(id || "0", 10);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");
  
  const { data: appointment, isLoading } = useGetAppointment(appointmentId, {
    query: { enabled: !!appointmentId, queryKey: getGetAppointmentQueryKey(appointmentId) }
  });

  const payAppointment = usePayAppointment();

  const handleUpiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!upiId.includes("@")) {
      toast({ title: "Invalid UPI ID", description: "Please enter a valid UPI ID (e.g. name@upi)", variant: "destructive" });
      return;
    }
    processPayment("upi");
  };

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cardNumber.replace(/\s/g, '').length < 15) {
      toast({ title: "Invalid Card", description: "Please enter a valid card number", variant: "destructive" });
      return;
    }
    processPayment("card");
  };

  const processPayment = (method: string) => {
    payAppointment.mutate({
      id: appointmentId,
      data: {
        paymentMethod: method,
        upiId: method === "upi" ? upiId : undefined,
        cardNumber: method === "card" ? cardNumber.replace(/\s/g, '').slice(-4) : undefined,
      }
    }, {
      onSuccess: () => {
        toast({
          title: "Payment Successful!",
          description: "Your appointment has been confirmed. Generating your OPD Parchi.",
        });
        setLocation(`/appointments/${appointmentId}`);
      },
      onError: () => {
        toast({
          title: "Payment Failed",
          description: "There was an error processing your payment. Please try again.",
          variant: "destructive"
        });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Skeleton className="h-10 w-1/3 mb-8" />
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2"><Skeleton className="h-[400px] w-full" /></div>
          <div><Skeleton className="h-[300px] w-full" /></div>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return <div className="container mx-auto px-4 py-16 text-center">Appointment not found</div>;
  }

  if (appointment.paymentStatus === 'paid') {
    return (
      <div className="container mx-auto px-4 py-16 max-w-lg text-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldCheck className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Payment Already Completed</h2>
        <p className="text-slate-600 mb-8">This appointment has already been paid for and confirmed.</p>
        <Button asChild size="lg" className="w-full">
          <Link href={`/appointments/${appointment.id}`}>View OPD Parchi</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Secure Payment</h1>
          <p className="text-slate-600">Choose a payment method to confirm your appointment</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <div className="lg:col-span-2">
            <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center gap-2 text-sm text-slate-600 font-medium">
                <ShieldCheck className="w-4 h-4 text-green-600" /> 100% Secure & Encrypted Transaction
              </div>
              <CardContent className="p-0">
                <Tabs defaultValue="upi" className="w-full">
                  <div className="border-b px-6 pt-4 bg-white">
                    <TabsList className="w-full grid grid-cols-2 bg-slate-100 p-1 rounded-lg h-auto mb-4">
                      <TabsTrigger value="upi" className="py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md">
                        <Smartphone className="w-4 h-4 mr-2" /> UPI / QR
                      </TabsTrigger>
                      <TabsTrigger value="card" className="py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md">
                        <CreditCard className="w-4 h-4 mr-2" /> Debit / Credit Card
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="upi" className="m-0 p-6 sm:p-8">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                      <div className="flex-1 w-full order-2 md:order-1">
                        <h3 className="font-bold text-lg mb-4 text-slate-900">Pay via UPI ID</h3>
                        <form onSubmit={handleUpiSubmit} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="upiId">Enter your UPI ID</Label>
                            <Input 
                              id="upiId" 
                              placeholder="e.g. 9876543210@paytm" 
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                              className="h-12"
                            />
                            <p className="text-xs text-slate-500">A payment request will be sent to your UPI app.</p>
                          </div>
                          <Button 
                            type="submit" 
                            className="w-full h-12 text-base font-bold bg-[#1E6FD9] hover:bg-[#155AB3]"
                            disabled={payAppointment.isPending || !upiId}
                          >
                            {payAppointment.isPending ? "Processing..." : `Pay ₹${appointment.consultationFee}`}
                          </Button>
                        </form>
                      </div>
                      
                      <div className="hidden md:flex items-center justify-center py-4">
                        <div className="w-px h-32 bg-slate-200 relative">
                          <span className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-white px-2 text-xs font-medium text-slate-400 uppercase">OR</span>
                        </div>
                      </div>

                      <div className="flex-1 w-full order-1 md:order-2 flex flex-col items-center border-b md:border-b-0 pb-8 md:pb-0">
                        <h3 className="font-bold text-lg mb-4 text-slate-900 text-center">Scan QR Code</h3>
                        <div className="w-48 h-48 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center p-4 relative group cursor-pointer hover:border-primary transition-colors">
                          {/* Fake QR code visualization */}
                          <div className="grid grid-cols-4 grid-rows-4 gap-1 w-full h-full opacity-60 group-hover:opacity-100 transition-opacity">
                            {Array(16).fill(0).map((_, i) => (
                              <div key={i} className={`bg-slate-800 rounded-sm ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-20'}`}></div>
                            ))}
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                            <Button size="sm" onClick={() => processPayment("upi")}>Simulate Scan</Button>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-4 text-center">Open any UPI app to scan & pay</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="card" className="m-0 p-6 sm:p-8">
                    <form onSubmit={handleCardSubmit} className="space-y-6 max-w-md mx-auto">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <Input 
                            id="cardNumber" 
                            placeholder="XXXX XXXX XXXX XXXX" 
                            className="pl-10 h-12 font-mono text-lg"
                            value={cardNumber}
                            onChange={(e) => {
                              // Auto format with spaces
                              let val = e.target.value.replace(/\D/g, '');
                              val = val.replace(/(\d{4})/g, '$1 ').trim();
                              setCardNumber(val.substring(0, 19)); // limit length
                            }}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input 
                            id="expiry" 
                            placeholder="MM/YY" 
                            className="h-12"
                            value={expiry}
                            onChange={(e) => {
                              let val = e.target.value.replace(/\D/g, '');
                              if (val.length > 2) val = val.substring(0, 2) + '/' + val.substring(2);
                              setExpiry(val.substring(0, 5));
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input 
                            id="cvv" 
                            type="password"
                            placeholder="123" 
                            maxLength={4}
                            className="h-12"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cardName">Cardholder Name</Label>
                        <Input 
                          id="cardName" 
                          placeholder="Name on card" 
                          className="h-12 text-transform: uppercase"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full h-14 text-lg font-bold rounded-xl mt-4"
                        disabled={payAppointment.isPending || cardNumber.length < 15 || !expiry || !cvv}
                      >
                        {payAppointment.isPending ? "Processing..." : `Pay ₹${appointment.consultationFee}`}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-24 border-slate-200 shadow-sm bg-white">
              <CardHeader className="bg-slate-50 pb-4 border-b border-slate-100">
                <CardTitle className="text-lg">Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-primary shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 leading-tight">OPD Consultation</h4>
                    <p className="text-sm text-slate-500">Dr. {appointment.doctorName}</p>
                    <p className="text-xs text-slate-400 mt-1">{appointment.appointmentDate} at {appointment.appointmentTime}</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm text-slate-600 mb-6">
                  <div className="flex justify-between">
                    <span>Consultation Fee</span>
                    <span className="font-medium text-slate-900">₹{appointment.consultationFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform Fee</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes</span>
                    <span className="font-medium text-slate-900">Included</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between items-end mb-6">
                  <span className="font-bold text-slate-900">Total to Pay</span>
                  <span className="text-2xl font-bold text-primary">₹{appointment.consultationFee}</span>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <h5 className="font-semibold text-slate-900 text-sm mb-1">Patient Details</h5>
                  <p className="text-sm text-slate-600">{appointment.patientName}</p>
                  <p className="text-xs text-slate-500">{appointment.patientPhone}</p>
                  <p className="text-xs text-slate-500">{appointment.patientEmail}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
