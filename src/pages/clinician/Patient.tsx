
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { 
  User,
  Activity,
  Pill,
  AlertCircle,
  Calendar,
  MessageSquare,
  FileText,
  BarChart2,
  Clock,
  ArrowLeft,
  RefreshCw,
  Database,
  AlertTriangle,
  Check,
  Info
} from "lucide-react";
import AppLayout from "@/components/layouts/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  getVeteranById,
  getVitalsForVeteran,
  getMedicationsForVeteran,
  getSymptomReportsForVeteran,
  getAppointmentsForVeteran,
  getAlertsForVeteran,
  getPredictionsForVeteran,
  synchronizeWithVistA
} from "@/lib/mockAPI";
import { Progress } from "@/components/ui/progress";

const ClinicianPatient = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSyncingVistA, setIsSyncingVistA] = useState(false);
  const patientId = id || 'v-001';
  
  // Fetch patient data
  const { data: patient, isLoading: isLoadingPatient } = useQuery({
    queryKey: ['veteran', patientId],
    queryFn: () => getVeteranById(patientId)
  });
  
  // Fetch vital signs
  const { data: vitals, isLoading: isLoadingVitals } = useQuery({
    queryKey: ['vitals', patientId],
    queryFn: () => getVitalsForVeteran(patientId)
  });
  
  // Fetch medications
  const { data: medications, isLoading: isLoadingMedications } = useQuery({
    queryKey: ['medications', patientId],
    queryFn: () => getMedicationsForVeteran(patientId)
  });
  
  // Fetch symptom reports
  const { data: symptoms, isLoading: isLoadingSymptoms } = useQuery({
    queryKey: ['symptoms', patientId],
    queryFn: () => getSymptomReportsForVeteran(patientId)
  });
  
  // Fetch appointments
  const { data: appointments, isLoading: isLoadingAppointments } = useQuery({
    queryKey: ['appointments', patientId],
    queryFn: () => getAppointmentsForVeteran(patientId)
  });
  
  // Fetch alerts
  const { data: alerts, isLoading: isLoadingAlerts } = useQuery({
    queryKey: ['alerts', patientId],
    queryFn: () => getAlertsForVeteran(patientId)
  });
  
  // Fetch AVA predictions
  const { data: predictions, isLoading: isLoadingPredictions } = useQuery({
    queryKey: ['predictions', patientId],
    queryFn: () => getPredictionsForVeteran(patientId)
  });
  
  // Get latest vitals
  const latestVitals = {
    blood_pressure: vitals?.find(v => v.type === 'blood_pressure'),
    heart_rate: vitals?.find(v => v.type === 'heart_rate'),
    temperature: vitals?.find(v => v.type === 'temperature'),
    oxygen: vitals?.find(v => v.type === 'oxygen'),
    glucose: vitals?.find(v => v.type === 'glucose')
  };
  
  // Get active alerts
  const activeAlerts = alerts?.filter(a => !a.isResolved) || [];
  
  // Get latest prediction
  const latestPrediction = predictions && predictions.length > 0 ? predictions[0] : null;
  
  // Get upcoming appointments
  const upcomingAppointments = appointments?.filter(a => 
    new Date(a.dateTime) > new Date() && a.status === 'scheduled'
  ).sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()) || [];
  
  // Sync with VistA EHR
  const handleSyncWithVistA = async () => {
    try {
      setIsSyncingVistA(true);
      const result = await synchronizeWithVistA(patientId);
      
      if (result.success) {
        toast({
          title: "Sync Successful",
          description: result.message,
          duration: 5000
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Failed to synchronize with VistA. Please try again later.",
        variant: "destructive",
        duration: 5000
      });
    } finally {
      setIsSyncingVistA(false);
    }
  };

  return (
    <AppLayout title="">
      <div className="mb-6">
        {/* Back button and sync button */}
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" onClick={() => navigate('/clinician/dashboard')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleSyncWithVistA} 
            disabled={isSyncingVistA}
          >
            {isSyncingVistA ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Sync with VistA
              </>
            )}
          </Button>
        </div>
        
        {/* Patient info card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            {isLoadingPatient ? (
              <div className="flex items-start space-x-4">
                <Skeleton className="h-20 w-20 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-8 w-1/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ) : patient ? (
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-center">
                  <div className="bg-blue-100 text-blue-700 rounded-full h-20 w-20 flex items-center justify-center text-2xl font-bold">
                    {patient.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  
                  <div className="ml-4">
                    <h2 className="text-2xl font-bold">{patient.name}</h2>
                    <p className="text-gray-500">
                      {patient.age} years old • {patient.gender} • {patient.serviceEra}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {patient.conditions.map((condition, index) => (
                        <Badge key={index} variant="secondary">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="md:ml-auto flex items-center mt-4 md:mt-0">
                  <div className="mr-6 text-center">
                    <p className="text-sm text-gray-500">Primary Provider</p>
                    <p className="font-medium">{patient.primaryProvider}</p>
                  </div>
                  
                  <div className="mr-6 text-center">
                    <p className="text-sm text-gray-500">Last Check-in</p>
                    <p className="font-medium">
                      {format(new Date(patient.lastCheckin), 'MMM d, yyyy')}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      patient.riskLevel === 'high' 
                        ? 'bg-red-100 text-red-800' 
                        : patient.riskLevel === 'medium'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {patient.riskLevel.charAt(0).toUpperCase() + patient.riskLevel.slice(1)} Risk
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-2" />
                <h3 className="text-lg font-medium">Patient Not Found</h3>
                <p className="text-gray-500 mt-1">
                  The requested patient information could not be found.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Active alerts */}
        {activeAlerts.length > 0 && (
          <div className="mb-6 space-y-4">
            {activeAlerts.map(alert => (
              <Alert 
                key={alert.id} 
                variant={alert.severity === 'high' ? 'destructive' : 'default'}
                className={
                  alert.severity === 'high' 
                    ? 'border-red-500 bg-red-50' 
                    : alert.severity === 'medium'
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-blue-500 bg-blue-50'
                }
              >
                <AlertCircle className={
                  alert.severity === 'high' 
                    ? 'h-4 w-4 text-red-600' 
                    : alert.severity === 'medium'
                    ? 'h-4 w-4 text-amber-600'
                    : 'h-4 w-4 text-blue-600'
                } />
                <div className="ml-3 flex-1">
                  <div className="flex justify-between">
                    <AlertTitle className="font-semibold">
                      {alert.title}
                    </AlertTitle>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Check className="h-3 w-3 mr-1" />
                        Resolve
                      </Button>
                      {alert.severity === 'high' && (
                        <Button size="sm">
                          Take Action
                        </Button>
                      )}
                    </div>
                  </div>
                  <AlertDescription>{alert.description}</AlertDescription>
                </div>
              </Alert>
            ))}
          </div>
        )}
        
        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview" className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="vitals" className="flex items-center">
              <Activity className="mr-2 h-4 w-4" />
              Vitals
            </TabsTrigger>
            <TabsTrigger value="medications" className="flex items-center">
              <Pill className="mr-2 h-4 w-4" />
              Medications
            </TabsTrigger>
            <TabsTrigger value="symptoms" className="flex items-center">
              <AlertCircle className="mr-2 h-4 w-4" />
              Symptoms
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              Appointments
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              Notes
            </TabsTrigger>
          </TabsList>
          
          {/* Overview tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Latest Vitals */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-lg flex items-center">
                      <Activity className="mr-2 h-5 w-5 text-blue-500" />
                      Latest Vitals
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/clinician/vitals/${patientId}`)}>
                      See All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoadingVitals ? (
                    <div className="space-y-2">
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {latestVitals.blood_pressure && (
                        <div className="flex justify-between items-center border-b pb-2">
                          <div>
                            <p className="font-medium">Blood Pressure</p>
                            <p className="text-xs text-gray-500">
                              {format(new Date(latestVitals.blood_pressure.timestamp), 'MMM d, h:mm a')}
                            </p>
                          </div>
                          <div className={`text-lg ${
                            latestVitals.blood_pressure.isNormal ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {latestVitals.blood_pressure.value} {latestVitals.blood_pressure.unit}
                          </div>
                        </div>
                      )}
                      
                      {latestVitals.heart_rate && (
                        <div className="flex justify-between items-center border-b pb-2">
                          <div>
                            <p className="font-medium">Heart Rate</p>
                            <p className="text-xs text-gray-500">
                              {format(new Date(latestVitals.heart_rate.timestamp), 'MMM d, h:mm a')}
                            </p>
                          </div>
                          <div className={`text-lg ${
                            latestVitals.heart_rate.isNormal ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {latestVitals.heart_rate.value} {latestVitals.heart_rate.unit}
                          </div>
                        </div>
                      )}
                      
                      {latestVitals.temperature && (
                        <div className="flex justify-between items-center border-b pb-2">
                          <div>
                            <p className="font-medium">Temperature</p>
                            <p className="text-xs text-gray-500">
                              {format(new Date(latestVitals.temperature.timestamp), 'MMM d, h:mm a')}
                            </p>
                          </div>
                          <div className={`text-lg ${
                            latestVitals.temperature.isNormal ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {latestVitals.temperature.value} {latestVitals.temperature.unit}
                          </div>
                        </div>
                      )}
                      
                      {latestVitals.oxygen && (
                        <div className="flex justify-between items-center border-b pb-2">
                          <div>
                            <p className="font-medium">Oxygen Saturation</p>
                            <p className="text-xs text-gray-500">
                              {format(new Date(latestVitals.oxygen.timestamp), 'MMM d, h:mm a')}
                            </p>
                          </div>
                          <div className={`text-lg ${
                            latestVitals.oxygen.isNormal ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {latestVitals.oxygen.value} {latestVitals.oxygen.unit}
                          </div>
                        </div>
                      )}
                      
                      {latestVitals.glucose && (
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Blood Glucose</p>
                            <p className="text-xs text-gray-500">
                              {format(new Date(latestVitals.glucose.timestamp), 'MMM d, h:mm a')}
                            </p>
                          </div>
                          <div className={`text-lg ${
                            latestVitals.glucose.isNormal ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {latestVitals.glucose.value} {latestVitals.glucose.unit}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* AVA Prediction */}
              <Card className="bg-gradient-to-br from-slate-50 to-blue-50 border-blue-200">
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-lg flex items-center">
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
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                      AI-powered
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoadingPredictions ? (
                    <Skeleton className="h-40 w-full" />
                  ) : latestPrediction ? (
                    <div className="space-y-4">
                      <p className="font-medium text-blue-800">{latestPrediction.details}</p>
                      
                      <div className="bg-white bg-opacity-70 p-3 rounded-md border border-blue-100">
                        <h4 className="text-sm font-medium mb-2">Suggested Actions:</h4>
                        <ul className="space-y-1">
                          {latestPrediction.suggestedActions.map((action, idx) => (
                            <li key={idx} className="text-sm flex items-start">
                              <Info className="h-4 w-4 text-blue-500 mr-1 mt-0.5 flex-shrink-0" />
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        {latestPrediction.dataPoints.slice(0, 4).map((point, idx) => (
                          <div key={idx} className="bg-white bg-opacity-70 p-2 rounded-md text-sm border border-blue-100">
                            <div className="text-xs text-gray-500">{point.label}</div>
                            <div className="font-medium">{point.value}</div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        Prediction confidence: {Math.round(latestPrediction.confidence * 100)}%
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <svg 
                        className="h-10 w-10 text-gray-300 mx-auto mb-2"
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
                      <p className="text-gray-500">No predictions available for this patient</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Medications */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-lg flex items-center">
                      <Pill className="mr-2 h-5 w-5 text-blue-500" />
                      Active Medications
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/clinician/medications/${patientId}`)}>
                      See All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoadingMedications ? (
                    <div className="space-y-2">
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                  ) : medications && medications.length > 0 ? (
                    <div className="space-y-3">
                      {medications.filter(m => m.isActive).map(med => (
                        <div key={med.id} className="border border-gray-200 rounded-md p-3">
                          <div className="flex justify-between">
                            <div>
                              <h4 className="font-medium">{med.name}</h4>
                              <p className="text-sm text-gray-600">{med.dosage} - {med.frequency}</p>
                            </div>
                            <Badge variant={med.adherenceRate >= 0.8 ? "outline" : "secondary"}>
                              {Math.round(med.adherenceRate * 100)}% adherence
                            </Badge>
                          </div>
                          <div className="mt-2">
                            <Progress value={med.adherenceRate * 100} className="h-2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Pill className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500">No active medications</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Upcoming Appointments */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-lg flex items-center">
                      <Calendar className="mr-2 h-5 w-5 text-blue-500" />
                      Upcoming Appointments
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/clinician/appointments/${patientId}`)}>
                      Schedule
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoadingAppointments ? (
                    <div className="space-y-2">
                      <Skeleton className="h-24 w-full" />
                      <Skeleton className="h-24 w-full" />
                    </div>
                  ) : upcomingAppointments.length > 0 ? (
                    <div className="space-y-3">
                      {upcomingAppointments.map(appointment => (
                        <div key={appointment.id} className="border border-gray-200 rounded-md p-3">
                          <div className="flex justify-between">
                            <h4 className="font-medium">{appointment.title}</h4>
                            <Badge variant={appointment.isVirtual ? "outline" : "secondary"}>
                              {appointment.isVirtual ? 'Virtual' : 'In-person'}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              <span>{appointment.providerName}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>{format(new Date(appointment.dateTime), 'MMMM d, yyyy')}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{format(new Date(appointment.dateTime), 'h:mm a')} ({appointment.duration} min)</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Calendar className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500">No upcoming appointments scheduled</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Recent Symptom Reports */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle className="text-lg flex items-center">
                    <AlertCircle className="mr-2 h-5 w-5 text-blue-500" />
                    Recent Symptom Reports
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/clinician/symptoms/${patientId}`)}>
                    See All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingSymptoms ? (
                  <div className="space-y-2">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                ) : symptoms && symptoms.length > 0 ? (
                  <div className="divide-y">
                    {symptoms.slice(0, 3).map(report => (
                      <div key={report.id} className="py-4">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">
                            Report from {format(new Date(report.timestamp), 'MMMM d, yyyy')}
                          </h4>
                          <Badge>{format(new Date(report.timestamp), 'h:mm a')}</Badge>
                        </div>
                        
                        <div className="mt-2 space-y-2">
                          {report.symptoms.map((symptom, idx) => (
                            <div key={idx} className="bg-gray-50 p-2 rounded-md">
                              <div className="flex justify-between">
                                <span className="font-medium">{symptom.type}</span>
                                <Badge variant={symptom.severity > 3 ? "destructive" : "outline"}>
                                  Severity {symptom.severity}/5
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{symptom.description}</p>
                            </div>
                          ))}
                          
                          {report.notes && (
                            <div className="text-sm">
                              <span className="font-medium">Notes: </span>
                              {report.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <AlertCircle className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No symptom reports available</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t bg-gray-50">
                <div className="w-full flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {symptoms?.length || 0} total reports
                  </div>
                  <Button variant="ghost" size="sm">Export Reports</Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Placeholder for other tabs */}
          <TabsContent value="vitals">
            <Card>
              <CardHeader>
                <CardTitle>Vital Signs</CardTitle>
                <CardDescription>Complete vital sign history and charts</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Detailed vital signs implementation would go here</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="medications">
            <Card>
              <CardHeader>
                <CardTitle>Medications</CardTitle>
                <CardDescription>Complete medication history and adherence</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Detailed medications implementation would go here</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="symptoms">
            <Card>
              <CardHeader>
                <CardTitle>Symptom Reports</CardTitle>
                <CardDescription>Complete symptom history and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Detailed symptom reports implementation would go here</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>Appointments</CardTitle>
                <CardDescription>Schedule and manage appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Detailed appointments implementation would go here</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <CardTitle>Clinical Notes</CardTitle>
                <CardDescription>Treatment notes and documentation</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Detailed clinical notes implementation would go here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default ClinicianPatient;
