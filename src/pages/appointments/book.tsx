import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CalendarIcon, Clock, Stethoscope, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { 
  useGetDoctor, 
  useCreateAppointment,
  getGetDoctorQueryKey 
} from "@/lib/api-client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const bookingSchema = z.object({
  patientName: z.string().min(2, "Name must be at least 2 characters"),
  patientAge: z.coerce.number().min(0, "Invalid age").max(120, "Invalid age"),
  patientGender: z.string().min(1, "Please select a gender"),
  patientPhone: z.string().regex(/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"),
  patientEmail: z.string().email("Please enter a valid email address"),
  appointmentDate: z.date({
    required_error: "A date of birth is required.",
  }),
  appointmentTime: z.string().min(1, "Please select a time"),
  symptoms: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export default function BookAppointment() {
  const { doctorId } = useParams<{ doctorId: string }>();
  const docId = parseInt(doctorId || "0", 10);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const { data: doctor, isLoading: doctorLoading } = useGetDoctor(docId, {
    query: { enabled: !!docId, queryKey: getGetDoctorQueryKey(docId) }
  });

  const createAppointment = useCreateAppointment();

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      patientName: "",
      patientAge: undefined,
      patientGender: "",
      patientPhone: "",
      patientEmail: "",
      symptoms: "",
      appointmentTime: "",
    },
  });

  const onSubmit = (data: BookingFormValues) => {
    createAppointment.mutate({
      data: {
        patientName: data.patientName,
        patientAge: data.patientAge,
        patientGender: data.patientGender,
        patientPhone: data.patientPhone,
        patientEmail: data.patientEmail,
        appointmentTime: data.appointmentTime,
        symptoms: data.symptoms,
        doctorId: docId,
        appointmentDate: format(data.appointmentDate, "yyyy-MM-dd"),
      }
    }, {
      onSuccess: (appointment) => {
        toast({
          title: "Appointment Booked!",
          description: "Your appointment has been tentatively booked. Please proceed to payment.",
        });
        setLocation(`/appointments/${appointment.id}/pay`);
      },
      onError: (error) => {
        toast({
          title: "Booking Failed",
          description: "There was an error booking your appointment. Please try again.",
          variant: "destructive"
        });
      }
    });
  };

  const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM"
  ];

  if (doctorLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Skeleton className="h-32 w-full rounded-2xl mb-8" />
        <Skeleton className="h-[600px] w-full rounded-2xl" />
      </div>
    );
  }

  if (!doctor) {
    return <div className="container mx-auto px-4 py-16 text-center">Doctor not found</div>;
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Book Appointment</h1>
          <p className="text-slate-600">Fill in the details below to generate your OPD parchi</p>
        </div>

        {/* Doctor Summary Card */}
        <Card className="mb-8 border-primary/20 shadow-sm bg-white overflow-hidden">
          <div className="flex p-4 sm:p-6 items-center gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100 overflow-hidden">
              {doctor.imageUrl ? (
                <img src={doctor.imageUrl} alt={doctor.name} className="w-full h-full object-cover" />
              ) : (
                <Stethoscope className="w-8 h-8 text-blue-300" />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-slate-900 mb-1">{doctor.name}</h2>
              <p className="text-primary font-medium mb-1">{doctor.specialization}</p>
              <p className="text-sm text-slate-500">{doctor.hospitalName || "Independent Clinic"}</p>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-sm text-slate-500 mb-1">Consultation Fee</p>
              <p className="text-2xl font-bold text-slate-900">₹{doctor.consultationFee}</p>
            </div>
          </div>
          <div className="bg-blue-50/50 p-4 border-t border-blue-100 sm:hidden flex justify-between items-center">
            <p className="text-sm font-medium text-slate-600">Consultation Fee</p>
            <p className="text-lg font-bold text-slate-900">₹{doctor.consultationFee}</p>
          </div>
        </Card>

        {/* Booking Form */}
        <Card className="shadow-md border-slate-200 bg-white">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-6">
            <CardTitle>Patient Details & Scheduling</CardTitle>
            <CardDescription>All fields marked with * are required for your digital OPD parchi</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="patientName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} className="h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="patientAge"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Age *</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="Years" {...field} className="h-12" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="patientGender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="patientPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number *</FormLabel>
                          <FormControl>
                            <Input placeholder="10-digit mobile number" {...field} className="h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="patientEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="For sending payment receipt" {...field} className="h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">Appointment Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="appointmentDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Preferred Date *</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={`h-12 pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => {
                                  // Can't book in the past, or more than 30 days in future
                                  const today = new Date();
                                  today.setHours(0, 0, 0, 0);
                                  const maxDate = new Date();
                                  maxDate.setDate(today.getDate() + 30);
                                  return date < today || date > maxDate;
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="appointmentTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Time *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12">
                                <SelectValue placeholder="Select time slot" />
                                <Clock className="absolute right-9 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {timeSlots.map(time => (
                                <SelectItem key={time} value={time}>{time}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="symptoms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Symptoms / Reason for visit (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Briefly describe your symptoms or medical issue..." 
                            className="resize-none min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="pt-4 border-t">
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full h-14 text-lg font-bold rounded-xl"
                    disabled={createAppointment.isPending}
                  >
                    {createAppointment.isPending ? "Processing..." : (
                      <span className="flex items-center gap-2">
                        Proceed to Payment (₹{doctor.consultationFee}) <ArrowRight className="w-5 h-5" />
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
