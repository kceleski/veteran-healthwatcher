
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import AppLayout from "@/components/layouts/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { getVeterans, getAllAlerts } from "@/lib/mockAPI";
import { Alert, FilterList, Users, Activity, AlertCircle, Calendar, Clock, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const ClinicianDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch veterans
  const { data: veterans, isLoading: isLoadingVeterans } = useQuery({
    queryKey: ['veterans'],
    queryFn: getVeterans
  });
  
  // Fetch all alerts
  const { data: alerts, isLoading: isLoadingAlerts } = useQuery({
    queryKey: ['alerts'],
    queryFn: getAllAlerts
  });
  
  // Filter veterans by search query
  const filteredVeterans = veterans?.filter(veteran => 
    veteran.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    veteran.conditions.some(condition => 
      condition.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
  
  // Count alerts by risk level
  const highRiskCount = veterans?.filter(v => v.riskLevel === 'high').length || 0;
  const mediumRiskCount = veterans?.filter(v => v.riskLevel === 'medium').length || 0;
  const lowRiskCount = veterans?.filter(v => v.riskLevel === 'low').length || 0;
  
  // Count alerts by severity
  const highSeverityCount = alerts?.filter(a => a.severity === 'high' && !a.isResolved).length || 0;
  const mediumSeverityCount = alerts?.filter(a => a.severity === 'medium' && !a.isResolved).length || 0;
  const lowSeverityCount = alerts?.filter(a => a.severity === 'low' && !a.isResolved).length || 0;
  
  // Handle clicking on a patient
  const handlePatientClick = (patientId: string) => {
    navigate(`/clinician/patient/${patientId}`);
  };

  return (
    <AppLayout title="Clinician Dashboard">
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5 text-blue-500" />
              Patient Overview
            </CardTitle>
            <CardDescription>Your assigned patient panel</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingVeterans ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-red-50 p-3 rounded-md">
                  <div className="text-2xl font-bold text-red-600">{highRiskCount}</div>
                  <div className="text-xs text-red-600">High Risk</div>
                </div>
                <div className="bg-amber-50 p-3 rounded-md">
                  <div className="text-2xl font-bold text-amber-600">{mediumRiskCount}</div>
                  <div className="text-xs text-amber-600">Medium Risk</div>
                </div>
                <div className="bg-green-50 p-3 rounded-md">
                  <div className="text-2xl font-bold text-green-600">{lowRiskCount}</div>
                  <div className="text-xs text-green-600">Low Risk</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <AlertCircle className="mr-2 h-5 w-5 text-blue-500" />
              Active Alerts
            </CardTitle>
            <CardDescription>Alerts requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingAlerts ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-red-50 p-3 rounded-md">
                  <div className="text-2xl font-bold text-red-600">{highSeverityCount}</div>
                  <div className="text-xs text-red-600">High</div>
                </div>
                <div className="bg-amber-50 p-3 rounded-md">
                  <div className="text-2xl font-bold text-amber-600">{mediumSeverityCount}</div>
                  <div className="text-xs text-amber-600">Medium</div>
                </div>
                <div className="bg-green-50 p-3 rounded-md">
                  <div className="text-2xl font-bold text-green-600">{lowSeverityCount}</div>
                  <div className="text-xs text-green-600">Low</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-blue-500" />
              Today's Schedule
            </CardTitle>
            <CardDescription>{format(new Date(), 'EEEE, MMMM d, yyyy')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="text-sm">Appointments</div>
                <Badge>12</Badge>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm">Virtual Visits</div>
                <Badge>5</Badge>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm">In-person</div>
                <Badge>7</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Patient list */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-blue-500" />
                Patient Panel
              </CardTitle>
              <CardDescription>
                {filteredVeterans ? `${filteredVeterans.length} veterans in your care` : 'Loading patient data...'}
              </CardDescription>
            </div>
            <div className="relative max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input 
                type="search"
                placeholder="Search patients or conditions..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingVeterans ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : filteredVeterans && filteredVeterans.length > 0 ? (
            <div className="space-y-2">
              <div className="grid grid-cols-12 gap-2 py-2 px-4 bg-gray-50 rounded-md text-sm font-medium text-gray-500">
                <div className="col-span-4">Name</div>
                <div className="col-span-1">Age</div>
                <div className="col-span-3">Service Era</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Last Check-in</div>
              </div>
              
              {filteredVeterans.map((veteran) => (
                <div 
                  key={veteran.id}
                  className="grid grid-cols-12 gap-2 p-4 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer"
                  onClick={() => handlePatientClick(veteran.id)}
                >
                  <div className="col-span-4">
                    <div className="font-medium">{veteran.name}</div>
                    <div className="text-xs text-gray-500">
                      {veteran.conditions.join(", ")}
                    </div>
                  </div>
                  <div className="col-span-1 flex items-center">
                    {veteran.age}
                  </div>
                  <div className="col-span-3 flex items-center">
                    {veteran.serviceEra}
                  </div>
                  <div className="col-span-2 flex items-center">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      veteran.riskLevel === 'high' 
                        ? 'bg-red-100 text-red-800' 
                        : veteran.riskLevel === 'medium'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {veteran.riskLevel.charAt(0).toUpperCase() + veteran.riskLevel.slice(1)} Risk
                    </span>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <Clock className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-sm">
                      {format(new Date(veteran.lastCheckin), 'MMM d')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No patients found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent alerts and activity */}
      <Tabs defaultValue="alerts" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="alerts" className="flex items-center">
            <Alert className="mr-2 h-4 w-4" />
            Recent Alerts
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center">
            <Activity className="mr-2 h-4 w-4" />
            Patient Activity
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="alerts">
          <Card>
            <CardContent className="p-6">
              {isLoadingAlerts ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              ) : alerts && alerts.filter(a => !a.isResolved).length > 0 ? (
                <div className="space-y-4">
                  {alerts
                    .filter(alert => !alert.isResolved)
                    .sort((a, b) => {
                      // Sort by severity first (high -> medium -> low)
                      const severityOrder = { high: 0, medium: 1, low: 2 };
                      const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
                      if (severityDiff !== 0) return severityDiff;
                      
                      // Then by timestamp (newest first)
                      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
                    })
                    .slice(0, 5)
                    .map((alert) => {
                      const veteran = veterans?.find(v => v.id === alert.veteranId);
                      
                      return (
                        <div 
                          key={alert.id} 
                          className={`p-4 rounded-md border-l-4 ${
                            alert.severity === 'high' 
                              ? 'border-l-red-500 bg-red-50' 
                              : alert.severity === 'medium'
                              ? 'border-l-amber-500 bg-amber-50'
                              : 'border-l-blue-500 bg-blue-50'
                          }`}
                        >
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <div>
                              <div className="flex items-center">
                                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                  alert.severity === 'high' 
                                    ? 'bg-red-200 text-red-800' 
                                    : alert.severity === 'medium'
                                    ? 'bg-amber-200 text-amber-800'
                                    : 'bg-blue-200 text-blue-800'
                                } mr-2`}>
                                  {alert.severity.toUpperCase()}
                                </span>
                                <h3 className="font-medium">
                                  {alert.title}
                                </h3>
                              </div>
                              
                              <p className="text-sm mt-1">
                                {alert.description}
                              </p>
                              
                              <div className="flex items-center mt-2 text-xs text-gray-500">
                                <span className="font-medium mr-2">
                                  {veteran?.name}
                                </span>
                                <span>
                                  {format(new Date(alert.timestamp), 'MMM d, h:mm a')}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant={alert.severity === 'high' ? 'default' : 'outline'}
                                onClick={() => navigate(`/clinician/patient/${alert.veteranId}`)}
                              >
                                View Patient
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  toast({
                                    title: "Alert resolved",
                                    description: "The alert has been marked as resolved.",
                                    duration: 3000,
                                  });
                                }}
                              >
                                Mark Resolved
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  }
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/clinician/alerts')}
                  >
                    View All Alerts
                  </Button>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No active alerts</h3>
                  <p className="text-gray-500">All patient alerts have been addressed</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-md">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">Vitals Recorded</span>
                    <span className="text-sm text-gray-500">Today at 9:35 AM</span>
                  </div>
                  <p className="text-sm mt-1">
                    <span className="font-medium">James Wilson</span> recorded blood pressure reading of 142/86 mmHg
                  </p>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-md">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-green-500" />
                    <span className="font-medium">Appointment Completed</span>
                    <span className="text-sm text-gray-500">Yesterday at 2:15 PM</span>
                  </div>
                  <p className="text-sm mt-1">
                    <span className="font-medium">George Thompson</span> completed a virtual appointment with Dr. Sarah Johnson
                  </p>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-md">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                    <span className="font-medium">Symptom Reported</span>
                    <span className="text-sm text-gray-500">Yesterday at 10:30 AM</span>
                  </div>
                  <p className="text-sm mt-1">
                    <span className="font-medium">Patricia Davis</span> reported increased headache severity (4/5) and frequency
                  </p>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/clinician/analytics')}
                >
                  View All Activity
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

export default ClinicianDashboard;
