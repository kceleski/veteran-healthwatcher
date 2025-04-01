
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { 
  Activity, 
  Thermometer, 
  Heart, 
  Droplet, 
  Calendar, 
  MessageSquare, 
  Pill, 
  ChevronRight,
  Plus
} from "lucide-react";
import AppLayout from "@/components/layouts/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  getVeteranById, 
  getVitalsForVeteran, 
  getMedicationsForVeteran,
  getSymptomReportsForVeteran,
  getAppointmentsForVeteran,
  getMessagesForVeteran,
  getPredictionsForVeteran
} from "@/lib/mockAPI";
import { VitalReading, Appointment, Message } from "@/lib/mockData";
import { useNavigate } from "react-router-dom";

const VeteranDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [latestVitals, setLatestVitals] = useState<Record<string, VitalReading | null>>({
    blood_pressure: null,
    heart_rate: null,
    temperature: null,
    oxygen: null,
    glucose: null
  });
  
  // Fetch veteran profile
  const { data: veteran, isLoading: isLoadingVeteran } = useQuery({
    queryKey: ['veteran', 'v-001'],
    queryFn: () => getVeteranById('v-001')
  });
  
  // Fetch vital signs
  const { data: vitals, isLoading: isLoadingVitals } = useQuery({
    queryKey: ['vitals', 'v-001'],
    queryFn: () => getVitalsForVeteran('v-001')
  });
  
  // Fetch appointments
  const { data: appointments, isLoading: isLoadingAppointments } = useQuery({
    queryKey: ['appointments', 'v-001'],
    queryFn: () => getAppointmentsForVeteran('v-001')
  });
  
  // Fetch messages
  const { data: messages, isLoading: isLoadingMessages } = useQuery({
    queryKey: ['messages', 'v-001'],
    queryFn: () => getMessagesForVeteran('v-001')
  });
  
  // Fetch medications
  const { data: medications, isLoading: isLoadingMedications } = useQuery({
    queryKey: ['medications', 'v-001'],
    queryFn: () => getMedicationsForVeteran('v-001')
  });
  
  // Fetch predictions from AVA
  const { data: predictions, isLoading: isLoadingPredictions } = useQuery({
    queryKey: ['predictions', 'v-001'],
    queryFn: () => getPredictionsForVeteran('v-001')
  });
  
  // Process vital signs data
  useEffect(() => {
    if (vitals) {
      const vitalsByType: Record<string, VitalReading[]> = {
        blood_pressure: vitals.filter(v => v.type === 'blood_pressure'),
        heart_rate: vitals.filter(v => v.type === 'heart_rate'),
        temperature: vitals.filter(v => v.type === 'temperature'),
        oxygen: vitals.filter(v => v.type === 'oxygen'),
        glucose: vitals.filter(v => v.type === 'glucose')
      };
      
      const latest: Record<string, VitalReading | null> = {};
      
      for (const [type, readings] of Object.entries(vitalsByType)) {
        if (readings.length > 0) {
          // Sort by timestamp descending
          const sorted = [...readings].sort((a, b) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
          latest[type] = sorted[0];
        } else {
          latest[type] = null;
        }
      }
      
      setLatestVitals(latest);
    }
  }, [vitals]);

  // Find upcoming appointments
  const upcomingAppointments = appointments?.filter(
    appt => new Date(appt.dateTime) > new Date() && appt.status === 'scheduled'
  ).sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()) || [];

  // Find unread messages
  const unreadMessages = messages?.filter(msg => !msg.isRead) || [];
  
  // Get medications due today
  const todayMedications = medications?.filter(med => med.isActive) || [];
  
  // Get latest prediction
  const latestPrediction = predictions?.length ? predictions[0] : null;

  return (
    <AppLayout title="Veteran Dashboard">
      {/* Welcome and Summary */}
      <div className="mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          {isLoadingVeteran ? (
            <>
              <Skeleton className="h-8 w-1/3 mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold">Welcome, {veteran?.name.split(' ')[0]}</h2>
              <p className="text-gray-600">
                Here's a summary of your health status and upcoming activities.
              </p>
            </>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Latest Vitals Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5 text-blue-500" />
              Latest Vitals
            </CardTitle>
            <CardDescription>Your most recent health measurements</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingVitals ? (
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {latestVitals.blood_pressure && (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Droplet className="mr-2 h-5 w-5 text-red-500" />
                      <div>
                        <p className="font-medium">Blood Pressure</p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(latestVitals.blood_pressure.timestamp), 'MMM d, h:mm a')}
                        </p>
                      </div>
                    </div>
                    <span className={`text-lg font-semibold ${
                      latestVitals.blood_pressure.isNormal ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {latestVitals.blood_pressure.value} {latestVitals.blood_pressure.unit}
                    </span>
                  </div>
                )}
                
                {latestVitals.heart_rate && (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Heart className="mr-2 h-5 w-5 text-red-500" />
                      <div>
                        <p className="font-medium">Heart Rate</p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(latestVitals.heart_rate.timestamp), 'MMM d, h:mm a')}
                        </p>
                      </div>
                    </div>
                    <span className={`text-lg font-semibold ${
                      latestVitals.heart_rate.isNormal ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {latestVitals.heart_rate.value} {latestVitals.heart_rate.unit}
                    </span>
                  </div>
                )}
                
                {latestVitals.oxygen && (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Droplet className="mr-2 h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">Oxygen</p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(latestVitals.oxygen.timestamp), 'MMM d, h:mm a')}
                        </p>
                      </div>
                    </div>
                    <span className={`text-lg font-semibold ${
                      latestVitals.oxygen.isNormal ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {latestVitals.oxygen.value} {latestVitals.oxygen.unit}
                    </span>
                  </div>
                )}
                
                {latestVitals.temperature && (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Thermometer className="mr-2 h-5 w-5 text-amber-500" />
                      <div>
                        <p className="font-medium">Temperature</p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(latestVitals.temperature.timestamp), 'MMM d, h:mm a')}
                        </p>
                      </div>
                    </div>
                    <span className={`text-lg font-semibold ${
                      latestVitals.temperature.isNormal ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {latestVitals.temperature.value} {latestVitals.temperature.unit}
                    </span>
                  </div>
                )}
                
                {latestVitals.glucose && (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Droplet className="mr-2 h-5 w-5 text-purple-500" />
                      <div>
                        <p className="font-medium">Glucose</p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(latestVitals.glucose.timestamp), 'MMM d, h:mm a')}
                        </p>
                      </div>
                    </div>
                    <span className={`text-lg font-semibold ${
                      latestVitals.glucose.isNormal ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {latestVitals.glucose.value} {latestVitals.glucose.unit}
                    </span>
                  </div>
                )}
                
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => navigate('/veteran/vitals')}
                >
                  <Activity className="mr-2 h-4 w-4" />
                  View All Vitals
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      
        {/* Upcoming Appointments */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-blue-500" />
              Upcoming Appointments
            </CardTitle>
            <CardDescription>Your scheduled medical appointments</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingAppointments ? (
              <div className="space-y-2">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.slice(0, 2).map((appointment) => (
                  <div key={appointment.id} className="bg-gray-50 p-3 rounded-md border border-gray-200">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{appointment.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded ${
                        appointment.isVirtual ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {appointment.isVirtual ? 'Virtual' : 'In-person'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      <p>{appointment.providerName}</p>
                      <p>{format(new Date(appointment.dateTime), 'EEEE, MMMM d')}</p>
                      <p>{format(new Date(appointment.dateTime), 'h:mm a')}</p>
                    </div>
                  </div>
                ))}
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/veteran/appointments')}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Manage Appointments
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Calendar className="h-12 w-12 text-gray-300 mb-2" />
                <p className="text-gray-500 mb-4">No upcoming appointments scheduled</p>
                <Button onClick={() => navigate('/veteran/appointments')}>
                  <Plus className="mr-2 h-4 w-4" />
                  Schedule New Appointment
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Messages */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <MessageSquare className="mr-2 h-5 w-5 text-blue-500" />
              Messages
            </CardTitle>
            <CardDescription>
              {unreadMessages.length > 0 ? 
                `You have ${unreadMessages.length} unread message${unreadMessages.length > 1 ? 's' : ''}` : 
                'Your healthcare communications'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingMessages ? (
              <div className="space-y-2">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : messages && messages.length > 0 ? (
              <div className="space-y-3">
                {messages.slice(0, 3).map((message) => (
                  <div 
                    key={message.id} 
                    className={`p-3 rounded-md border ${
                      !message.isRead ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="font-medium text-sm">
                        {message.sender}
                        {!message.isRead && (
                          <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                            New
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {format(new Date(message.timestamp), 'MMM d')}
                      </div>
                    </div>
                    <div className="text-sm font-medium mt-1">{message.subject}</div>
                    <div className="text-xs text-gray-600 mt-1 line-clamp-1">
                      {message.content}
                    </div>
                  </div>
                ))}
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/veteran/messages')}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  View All Messages
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <MessageSquare className="h-12 w-12 text-gray-300 mb-2" />
                <p className="text-gray-500 mb-4">No messages in your inbox</p>
                <Button onClick={() => navigate('/veteran/messages')}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  New Message
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daily Medications */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Pill className="mr-2 h-5 w-5 text-blue-500" />
              Daily Medications
            </CardTitle>
            <CardDescription>Track your medication schedule</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingMedications ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : todayMedications.length > 0 ? (
              <div className="space-y-4">
                {todayMedications.map((med) => (
                  <div key={med.id} className="border border-gray-200 rounded-md p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{med.name}</h4>
                        <p className="text-sm text-gray-600">{med.dosage} - {med.frequency}</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-block text-xs px-2 py-1 bg-green-100 text-green-800 rounded-md">
                          Active
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <div className="flex justify-between mb-1 text-xs">
                        <span>Adherence</span>
                        <span>{Math.round(med.adherenceRate * 100)}%</span>
                      </div>
                      <Progress value={med.adherenceRate * 100} className="h-2" />
                    </div>
                  </div>
                ))}
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/veteran/medications')}
                >
                  <Pill className="mr-2 h-4 w-4" />
                  View All Medications
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Pill className="h-12 w-12 text-gray-300 mb-2" />
                <p className="text-gray-500">No active medications</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AVA Insights */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="flex items-center">
                <svg 
                  className="mr-2 h-5 w-5 text-blue-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
                AVA Health Insights
              </CardTitle>
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">AI-powered</span>
            </div>
            <CardDescription>Personalized health analysis from AVA</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingPredictions ? (
              <Skeleton className="h-40 w-full" />
            ) : latestPrediction ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-blue-900">{latestPrediction.details}</h3>
                  
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {latestPrediction.dataPoints.slice(0, 4).map((point, idx) => (
                      <div key={idx} className="bg-white bg-opacity-70 p-2 rounded-md text-sm">
                        <div className="text-xs text-gray-500">{point.label}</div>
                        <div className="font-medium">{point.value}</div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Recommendations:</h4>
                    <ul className="space-y-1">
                      {latestPrediction.suggestedActions.map((action, idx) => (
                        <li key={idx} className="text-sm flex items-start">
                          <ChevronRight className="h-4 w-4 text-blue-500 mr-1 mt-0.5 flex-shrink-0" />
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Prediction confidence: {Math.round(latestPrediction.confidence * 100)}%</span>
                  <span>Updated {format(new Date(latestPrediction.timestamp), 'MMM d, yyyy')}</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <svg 
                  className="h-12 w-12 text-gray-300 mb-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
                <p className="text-gray-500">
                  AVA needs more data to provide personalized insights.
                  <br />
                  Continue tracking your health regularly.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default VeteranDashboard;
