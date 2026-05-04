import { useParams, Link } from "wouter";
import { Printer, Download, MapPin, Calendar, Clock, CheckCircle2, Clock3 } from "lucide-react";
import { format } from "date-fns";
import { useGetAppointment, getGetAppointmentQueryKey } from "@/lib/api-client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function AppointmentDetail() {
  const { id } = useParams<{ id: string }>();
  const appointmentId = parseInt(id || "0", 10);
  
  const { data: appointment, isLoading } = useGetAppointment(appointmentId, {
    query: { enabled: !!appointmentId, queryKey: getGetAppointmentQueryKey(appointmentId) }
  });

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Skeleton className="h-16 w-1/2 mb-8 mx-auto" />
        <Skeleton className="h-[600px] w-full rounded-2xl" />
      </div>
    );
  }

  if (!appointment) {
    return <div className="container mx-auto px-4 py-16 text-center">Appointment not found</div>;
  }

  const isPaid = appointment.paymentStatus === 'paid';

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Controls - Hidden when printing */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 print:hidden">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">OPD Parchi / Appointment Details</h1>
            <p className="text-slate-500 text-sm">Please show this slip at the hospital reception</p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            {isPaid ? (
              <>
                <Button variant="outline" className="flex-1 sm:flex-none" onClick={handlePrint}>
                  <Printer className="w-4 h-4 mr-2" /> Print Slip
                </Button>
                <Button className="flex-1 sm:flex-none" onClick={handlePrint}>
                  <Download className="w-4 h-4 mr-2" /> Download PDF
                </Button>
              </>
            ) : (
              <Button asChild className="w-full sm:w-auto font-bold bg-green-600 hover:bg-green-700">
                <Link href={`/appointments/${appointment.id}/pay`}>
                  Complete Payment
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Printable Slip Area */}
        <Card className="bg-white border-2 border-slate-200 shadow-lg overflow-hidden print:shadow-none print:border-none">
          {/* Header */}
          <div className="bg-slate-900 text-white p-6 md:p-8 flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-1 tracking-wider">DOCTORKHOJ</h2>
              <p className="text-blue-200 text-sm">Digital OPD Services, Palamu</p>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Slip Number</p>
              <p className="text-xl font-mono font-bold bg-white/10 px-3 py-1 rounded inline-block">{appointment.slipNumber}</p>
            </div>
          </div>

          <CardContent className="p-6 md:p-8">
            {/* Status Banner */}
            <div className={`p-4 rounded-lg mb-8 flex items-center justify-between border ${
              isPaid ? "bg-green-50 border-green-200 text-green-800" : "bg-amber-50 border-amber-200 text-amber-800"
            }`}>
              <div className="flex items-center gap-3">
                {isPaid ? <CheckCircle2 className="w-6 h-6 text-green-600" /> : <Clock3 className="w-6 h-6 text-amber-600" />}
                <div>
                  <p className="font-bold text-lg">{isPaid ? "Payment Successful" : "Payment Pending"}</p>
                  <p className="text-sm opacity-90">
                    {isPaid 
                      ? `Transaction ID: ${appointment.transactionId || 'N/A'}` 
                      : "Please pay the consultation fee to confirm appointment"}
                  </p>
                </div>
              </div>
              <Badge className={isPaid ? "bg-green-600 hover:bg-green-700" : "bg-amber-500 hover:bg-amber-600 text-white"}>
                {isPaid ? "PAID" : "UNPAID"}
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              {/* Patient Details */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b pb-2">Patient Information</h3>
                <dl className="space-y-3 text-sm">
                  <div className="grid grid-cols-3 gap-2">
                    <dt className="text-slate-500 font-medium">Name</dt>
                    <dd className="col-span-2 font-bold text-slate-900">{appointment.patientName}</dd>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <dt className="text-slate-500 font-medium">Age/Gender</dt>
                    <dd className="col-span-2 font-medium text-slate-900">{appointment.patientAge} yrs, {appointment.patientGender}</dd>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <dt className="text-slate-500 font-medium">Contact</dt>
                    <dd className="col-span-2 font-medium text-slate-900">{appointment.patientPhone}</dd>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <dt className="text-slate-500 font-medium">Email</dt>
                    <dd className="col-span-2 font-medium text-slate-900">{appointment.patientEmail}</dd>
                  </div>
                </dl>
              </div>

              {/* Doctor/Hospital Details */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b pb-2">Consultation Details</h3>
                <dl className="space-y-3 text-sm">
                  <div className="grid grid-cols-3 gap-2">
                    <dt className="text-slate-500 font-medium">Doctor</dt>
                    <dd className="col-span-2 font-bold text-primary">{appointment.doctorName}</dd>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <dt className="text-slate-500 font-medium">Specialty</dt>
                    <dd className="col-span-2 font-medium text-slate-900">{appointment.specialization}</dd>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <dt className="text-slate-500 font-medium">Hospital</dt>
                    <dd className="col-span-2 font-medium text-slate-900">{appointment.hospitalName || "Independent Clinic"}</dd>
                  </div>
                </dl>
              </div>
            </div>

            <Separator className="my-8" />

            {/* Schedule */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 flex flex-col sm:flex-row items-center gap-6 justify-center text-center sm:text-left">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Date</p>
                  <p className="font-bold text-lg text-slate-900">
                    {appointment.appointmentDate}
                  </p>
                </div>
              </div>
              
              <div className="hidden sm:block w-px h-12 bg-slate-200"></div>
              
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-3 rounded-full text-purple-600">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Time</p>
                  <p className="font-bold text-lg text-slate-900">{appointment.appointmentTime}</p>
                </div>
              </div>
            </div>

            {appointment.symptoms && (
              <div className="mt-8">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Symptoms/Reason for Visit</h3>
                <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-100">
                  {appointment.symptoms}
                </p>
              </div>
            )}

            {/* Footer */}
            <div className="mt-12 pt-6 border-t flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
              <p>Generated via DoctorKhoj Platform on {new Date(appointment.createdAt).toLocaleDateString()}</p>
              <div className="text-right">
                <p className="font-medium text-slate-900">Consultation Fee: ₹{appointment.consultationFee}</p>
                <p>Status: <span className="uppercase font-bold text-slate-700">{appointment.status}</span></p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
