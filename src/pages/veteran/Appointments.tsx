
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { format, addDays, isAfter, isBefore, isToday } from "date-fns";
import AppLayout from "@/components/layouts/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertCircle, ArrowRight, Calendar, Clock, MapPin, MessageCircle, MonitorSmartphone, User, VideoIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getAppointmentsForVeteran, updateAppointmentStatus } from "@/lib/mockAPI";

const VeteranAppointments = () => {
  const { toast } = useToast();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState<string | null>(null);

  const { data: appointments, isLoading, isError, refetch } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => getAppointmentsForVeteran('v-001')
  });

  const handleCancelAppointment = async () => {
    if (!appointmentToCancel) return;
    
    try {
      await updateAppointmentStatus(appointmentToCancel, 'canceled');
      
      toast({
        title: "Appointment canceled",
        description: "Your appointment has been successfully canceled.",
        duration: 3000,
      });
      
      setCancelDialogOpen(false);
      refetch();
    } catch (error) {
      toast({
        title: "Error canceling appointment",
        description: "There was a problem canceling your appointment. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleJoinAppointment = (appointmentId: string) => {
    toast({
      title: "Joining appointment",
      description: "Connecting to your virtual appointment...",
      duration: 3000,
    });
  };

  const upcomingAppointments = appointments?.filter(app => 
    isAfter(new Date(app.dateTime), new Date()) && app.status === 'scheduled'
  ).sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
  
  const pastAppointments = appointments?.filter(app => 
    isBefore(new Date(app.dateTime), new Date()) || app.status === 'completed' || app.status === 'canceled'
  ).sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());

  const todayAppointments = upcomingAppointments?.filter(app => 
    isToday(new Date(app.dateTime))
  );

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'scheduled':
        return <Badge className="bg-green-500">Scheduled</Badge>;
      case 'completed':
        return <Badge variant="outline" className="border-green-500 text-green-700">Completed</Badge>;
      case 'canceled':
        return <Badge variant="outline" className="border-red-500 text-red-700">Canceled</Badge>;
      case 'rescheduled':
        return <Badge variant="outline" className="border-amber-500 text-amber-700">Rescheduled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AppLayout title="Appointments">
      <div className="grid gap-6">
        {/* Today's appointments summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-blue-500" />
              Today's Appointments
            </CardTitle>
            <CardDescription>{format(new Date(), 'EEEE, MMMM d, yyyy')}</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : isError ? (
              <div className="p-4 text-center">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-3" />
                <h3 className="text-lg font-medium mb-1">Unable to load appointments</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  There was an error loading your appointment information.
                </p>
                <Button onClick={() => refetch()}>Try Again</Button>
              </div>
            ) : todayAppointments && todayAppointments.length > 0 ? (
              <div className="space-y-4">
                {todayAppointments.map(appointment => (
                  <div key={appointment.id} className="p-4 border rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1">
                          <h3 className="font-medium">{appointment.title}</h3>
                          {getStatusBadge(appointment.status)}
                        </div>
                        <div className="flex items-center mt-1 text-sm text-muted-foreground">
                          <User className="h-3 w-3 mr-1" />
                          <span>{appointment.providerName}</span>
                          <span className="mx-1">•</span>
                          <span>{appointment.department}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <div className="flex items-center text-sm font-medium">
                          <Clock className="h-4 w-4 mr-1 text-blue-500" />
                          <span>{format(new Date(appointment.dateTime), 'h:mm a')}</span>
                          <span className="mx-1">•</span>
                          <span>{appointment.duration} min</span>
                        </div>
                        
                        {appointment.isVirtual && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <VideoIcon className="h-3 w-3" />
                            Virtual
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4 flex flex-wrap gap-2">
                      {appointment.isVirtual ? (
                        <Button 
                          className="flex items-center gap-1"
                          onClick={() => handleJoinAppointment(appointment.id)}
                        >
                          <VideoIcon className="h-4 w-4 mr-1" />
                          Join Meeting
                        </Button>
                      ) : (
                        <Button variant="outline" className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          Directions
                        </Button>
                      )}
                      
                      <Button variant="outline" className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Message Provider
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="text-destructive hover:text-destructive"
                        onClick={() => {
                          setAppointmentToCancel(appointment.id);
                          setCancelDialogOpen(true);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-medium mb-1">No appointments today</h3>
                <p className="text-sm text-muted-foreground">
                  You don't have any appointments scheduled for today.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* All appointments */}
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>Your scheduled appointments</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-24 w-full" />
                    ))}
                  </div>
                ) : upcomingAppointments && upcomingAppointments.length > 0 ? (
                  <div className="divide-y">
                    {upcomingAppointments.map(appointment => (
                      <div key={appointment.id} className="py-4 first:pt-0 last:pb-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1">
                              <h3 className="font-medium">{appointment.title}</h3>
                              {getStatusBadge(appointment.status)}
                            </div>
                            <div className="flex items-center mt-1 text-sm text-muted-foreground">
                              <User className="h-3 w-3 mr-1" />
                              <span>{appointment.providerName}</span>
                              <span className="mx-1">•</span>
                              <span>{appointment.department}</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            <div className="flex flex-col text-sm items-end">
                              <div className="font-medium">
                                {format(new Date(appointment.dateTime), 'EEE, MMM d, yyyy')}
                              </div>
                              <div className="flex items-center text-muted-foreground">
                                <Clock className="h-3 w-3 mr-1" />
                                <span>{format(new Date(appointment.dateTime), 'h:mm a')}</span>
                                <span className="mx-1">•</span>
                                <span>{appointment.duration} min</span>
                              </div>
                            </div>
                            
                            {appointment.isVirtual && (
                              <Badge variant="outline" className="flex items-center gap-1">
                                <VideoIcon className="h-3 w-3" />
                                Virtual
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-destructive hover:text-destructive"
                            onClick={() => {
                              setAppointmentToCancel(appointment.id);
                              setCancelDialogOpen(true);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button variant="outline" size="sm">
                            Reschedule
                          </Button>
                          <Button variant="outline" size="sm">
                            Add to Calendar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <h3 className="text-lg font-medium mb-1">No upcoming appointments</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      You don't have any appointments scheduled.
                    </p>
                    <Button>Schedule an Appointment</Button>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Schedule New Appointment
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="past">
            <Card>
              <CardHeader>
                <CardTitle>Past Appointments</CardTitle>
                <CardDescription>Your appointment history</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-24 w-full" />
                    ))}
                  </div>
                ) : pastAppointments && pastAppointments.length > 0 ? (
                  <div className="divide-y">
                    {pastAppointments.map(appointment => (
                      <div key={appointment.id} className="py-4 first:pt-0 last:pb-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1">
                              <h3 className="font-medium">{appointment.title}</h3>
                              {getStatusBadge(appointment.status)}
                            </div>
                            <div className="flex items-center mt-1 text-sm text-muted-foreground">
                              <User className="h-3 w-3 mr-1" />
                              <span>{appointment.providerName}</span>
                              <span className="mx-1">•</span>
                              <span>{appointment.department}</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-col text-sm items-end">
                            <div className="font-medium">
                              {format(new Date(appointment.dateTime), 'EEE, MMM d, yyyy')}
                            </div>
                            <div className="flex items-center text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{format(new Date(appointment.dateTime), 'h:mm a')}</span>
                            </div>
                          </div>
                        </div>
                        
                        {appointment.notes && (
                          <div className="mt-2 text-sm text-muted-foreground">
                            <p>{appointment.notes}</p>
                          </div>
                        )}
                        
                        {appointment.status === 'completed' && (
                          <div className="mt-3">
                            <Button variant="outline" size="sm">
                              View Summary
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <h3 className="text-lg font-medium mb-1">No past appointments</h3>
                    <p className="text-sm text-muted-foreground">
                      You don't have any past appointments.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Cancel Appointment Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Appointment</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this appointment? You'll need to reschedule if you still need to see your provider.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              Keep Appointment
            </Button>
            <Button variant="destructive" onClick={handleCancelAppointment}>
              Yes, Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default VeteranAppointments;
