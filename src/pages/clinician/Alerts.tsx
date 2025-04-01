
import { useState } from "react";
import AppLayout from "@/components/layouts/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { 
  AlertCircle, 
  Clock, 
  ArrowUpDown, 
  CheckCircle2,
  BellRing,
  HeartPulse, 
  Thermometer, 
  Pill
} from "lucide-react";

// Mock data for patient alerts
const patientAlerts = [
  {
    id: 1,
    patient: "James Wilson",
    patientId: "VA-10045",
    type: "vital",
    metric: "Blood Pressure",
    value: "180/110 mmHg",
    threshold: "140/90 mmHg",
    severity: "high",
    timestamp: "2023-11-15T08:23:00",
    status: "unresolved",
    description: "Systolic and diastolic readings significantly above threshold."
  },
  {
    id: 2,
    patient: "Maria Rodriguez",
    patientId: "VA-10078",
    type: "vital",
    metric: "Heart Rate",
    value: "120 bpm",
    threshold: "100 bpm",
    severity: "medium",
    timestamp: "2023-11-15T09:45:00",
    status: "unresolved",
    description: "Sustained elevated heart rate for over 30 minutes."
  },
  {
    id: 3,
    patient: "Robert Johnson",
    patientId: "VA-10033",
    type: "medication",
    metric: "Missed Dose",
    value: "Lisinopril",
    severity: "medium",
    timestamp: "2023-11-15T07:00:00",
    status: "resolved",
    description: "Patient has missed morning dose of blood pressure medication."
  },
  {
    id: 4,
    patient: "Sarah Thompson",
    patientId: "VA-10056",
    type: "symptom",
    metric: "Chest Pain",
    value: "7/10 severity",
    severity: "high",
    timestamp: "2023-11-14T22:15:00",
    status: "unresolved",
    description: "Patient reporting intermittent chest pain with radiation to left arm."
  },
  {
    id: 5,
    patient: "Michael Davis",
    patientId: "VA-10061",
    type: "vital",
    metric: "Blood Glucose",
    value: "245 mg/dL",
    threshold: "180 mg/dL",
    severity: "medium",
    timestamp: "2023-11-15T11:10:00",
    status: "unresolved",
    description: "Fasting blood glucose significantly elevated."
  },
  {
    id: 6,
    patient: "Jennifer Lee",
    patientId: "VA-10092",
    type: "system",
    metric: "Device Connection",
    value: "Disconnected",
    severity: "low",
    timestamp: "2023-11-15T10:30:00",
    status: "resolved",
    description: "Patient's blood pressure monitor has been offline for more than 24 hours."
  },
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "high":
      return "bg-red-100 text-red-800 border-red-200";
    case "medium":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "low":
      return "bg-blue-100 text-blue-800 border-blue-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusColor = (status: string) => {
  return status === "resolved" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800";
};

const getAlertIcon = (type: string) => {
  switch (type) {
    case "vital":
      return <HeartPulse className="h-5 w-5 text-red-600" />;
    case "medication":
      return <Pill className="h-5 w-5 text-blue-600" />;
    case "symptom":
      return <Thermometer className="h-5 w-5 text-amber-600" />;
    default:
      return <AlertCircle className="h-5 w-5 text-gray-600" />;
  }
};

const ClinicianAlerts = () => {
  const { toast } = useToast();
  const [alerts, setAlerts] = useState(patientAlerts);
  const [activeTab, setActiveTab] = useState("all");

  const filteredAlerts = activeTab === "all" 
    ? alerts 
    : activeTab === "resolved" 
      ? alerts.filter(alert => alert.status === "resolved") 
      : alerts.filter(alert => alert.status === "unresolved");

  const resolveAlert = (id: number) => {
    const updatedAlerts = alerts.map(alert => 
      alert.id === id ? { ...alert, status: "resolved" } : alert
    );
    setAlerts(updatedAlerts);
    toast({
      title: "Alert resolved",
      description: "The patient alert has been marked as resolved.",
      duration: 3000,
    });
  };

  return (
    <AppLayout title="Patient Alerts">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-500">
              Monitor and manage critical patient alerts that require attention.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <BellRing className="h-3 w-3" />
              <span>{alerts.filter(a => a.status === "unresolved").length} Unresolved</span>
            </Badge>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <ArrowUpDown className="h-3 w-3" />
              Sort
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Alerts</TabsTrigger>
            <TabsTrigger value="unresolved">Unresolved</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">All Patient Alerts ({filteredAlerts.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredAlerts.length > 0 ? (
                    filteredAlerts.map((alert) => (
                      <div 
                        key={alert.id} 
                        className="p-4 rounded-md border shadow-sm bg-white flex justify-between items-start"
                      >
                        <div className="flex gap-3">
                          <div className="mt-0.5">
                            {getAlertIcon(alert.type)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{alert.patient}</h3>
                              <span className="text-xs text-gray-500">{alert.patientId}</span>
                              <div className={`text-xs px-2 py-0.5 rounded-full ${getSeverityColor(alert.severity)}`}>
                                {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                              </div>
                            </div>
                            <p className="text-sm font-medium mt-1">
                              {alert.metric}: <span className="font-bold">{alert.value}</span>
                              {alert.threshold && <span className="text-xs text-gray-500"> (Threshold: {alert.threshold})</span>}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                              <Clock className="h-3 w-3" />
                              <span>{new Date(alert.timestamp).toLocaleString()}</span>
                              <span className={`px-2 py-0.5 rounded-full ${getStatusColor(alert.status)}`}>
                                {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          {alert.status === "unresolved" ? (
                            <Button 
                              onClick={() => resolveAlert(alert.id)}
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1"
                            >
                              <CheckCircle2 className="h-3 w-3" />
                              Resolve
                            </Button>
                          ) : (
                            <Badge variant="outline" className="bg-green-50 text-green-700">Resolved</Badge>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No alerts in this category</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="unresolved" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Unresolved Alerts ({filteredAlerts.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredAlerts.length > 0 ? (
                    filteredAlerts.map((alert) => (
                      <div 
                        key={alert.id} 
                        className="p-4 rounded-md border shadow-sm bg-white flex justify-between items-start"
                      >
                        <div className="flex gap-3">
                          <div className="mt-0.5">
                            {getAlertIcon(alert.type)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{alert.patient}</h3>
                              <span className="text-xs text-gray-500">{alert.patientId}</span>
                              <div className={`text-xs px-2 py-0.5 rounded-full ${getSeverityColor(alert.severity)}`}>
                                {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                              </div>
                            </div>
                            <p className="text-sm font-medium mt-1">
                              {alert.metric}: <span className="font-bold">{alert.value}</span>
                              {alert.threshold && <span className="text-xs text-gray-500"> (Threshold: {alert.threshold})</span>}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                              <Clock className="h-3 w-3" />
                              <span>{new Date(alert.timestamp).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <Button 
                            onClick={() => resolveAlert(alert.id)}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <CheckCircle2 className="h-3 w-3" />
                            Resolve
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No unresolved alerts</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="resolved" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resolved Alerts ({filteredAlerts.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredAlerts.length > 0 ? (
                    filteredAlerts.map((alert) => (
                      <div 
                        key={alert.id} 
                        className="p-4 rounded-md border shadow-sm bg-white flex justify-between items-start"
                      >
                        <div className="flex gap-3">
                          <div className="mt-0.5">
                            {getAlertIcon(alert.type)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{alert.patient}</h3>
                              <span className="text-xs text-gray-500">{alert.patientId}</span>
                              <div className={`text-xs px-2 py-0.5 rounded-full ${getSeverityColor(alert.severity)}`}>
                                {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                              </div>
                            </div>
                            <p className="text-sm font-medium mt-1">
                              {alert.metric}: <span className="font-bold">{alert.value}</span>
                              {alert.threshold && <span className="text-xs text-gray-500"> (Threshold: {alert.threshold})</span>}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                              <Clock className="h-3 w-3" />
                              <span>{new Date(alert.timestamp).toLocaleString()}</span>
                              <Badge variant="outline" className="bg-green-50 text-green-700">Resolved</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No resolved alerts</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default ClinicianAlerts;
