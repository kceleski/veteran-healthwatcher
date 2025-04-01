
import { useState } from "react";
import AppLayout from "@/components/layouts/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  PlusCircle, 
  FileText, 
  User, 
  ChevronRight, 
  Calendar,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Mock data
const carePlans = [
  {
    id: 1,
    patientName: "James Wilson",
    patientId: "VA-10045",
    condition: "Hypertension",
    createdDate: "2023-10-15",
    updatedDate: "2023-11-14",
    status: "active",
    adherence: 92,
    goals: [
      { id: 1, description: "Reduce blood pressure to <140/90", completed: false, dueDate: "2023-12-15" },
      { id: 2, description: "Daily medication compliance", completed: true, dueDate: "Ongoing" },
      { id: 3, description: "Reduce sodium intake", completed: false, dueDate: "2023-11-30" },
    ],
    medications: [
      { id: 1, name: "Lisinopril", dosage: "10mg", frequency: "Once daily", status: "active" },
      { id: 2, name: "Hydrochlorothiazide", dosage: "25mg", frequency: "Once daily", status: "active" }
    ],
    notes: "Patient has shown good compliance with medication regimen. Need to follow up on dietary changes."
  },
  {
    id: 2,
    patientName: "Maria Rodriguez",
    patientId: "VA-10078",
    condition: "Type 2 Diabetes",
    createdDate: "2023-09-10",
    updatedDate: "2023-11-12",
    status: "active",
    adherence: 85,
    goals: [
      { id: 1, description: "Maintain A1C below 7.0%", completed: true, dueDate: "2023-12-10" },
      { id: 2, description: "Daily glucose monitoring", completed: true, dueDate: "Ongoing" },
      { id: 3, description: "30 minutes of exercise 5x weekly", completed: false, dueDate: "Ongoing" },
    ],
    medications: [
      { id: 1, name: "Metformin", dosage: "1000mg", frequency: "Twice daily", status: "active" },
      { id: 2, name: "Glipizide", dosage: "5mg", frequency: "Once daily", status: "discontinued" }
    ],
    notes: "Patient's glucose readings have improved. Has started walking program but needs more consistency."
  },
  {
    id: 3,
    patientName: "Robert Johnson",
    patientId: "VA-10033",
    condition: "PTSD",
    createdDate: "2023-08-22",
    updatedDate: "2023-11-08",
    status: "active",
    adherence: 78,
    goals: [
      { id: 1, description: "Weekly therapy sessions", completed: true, dueDate: "Ongoing" },
      { id: 2, description: "Practice mindfulness daily", completed: false, dueDate: "Ongoing" },
      { id: 3, description: "Identify 3 coping strategies", completed: true, dueDate: "2023-09-30" },
    ],
    medications: [
      { id: 1, name: "Sertraline", dosage: "100mg", frequency: "Once daily", status: "active" },
      { id: 2, name: "Prazosin", dosage: "2mg", frequency: "At bedtime", status: "active" }
    ],
    notes: "Patient reports fewer nightmares. Sleep quality has improved. Continue current therapy approach."
  },
  {
    id: 4,
    patientName: "Sarah Thompson",
    patientId: "VA-10056",
    condition: "Coronary Artery Disease",
    createdDate: "2023-07-05",
    updatedDate: "2023-11-05",
    status: "active",
    adherence: 95,
    goals: [
      { id: 1, description: "Cardiac rehab completion", completed: true, dueDate: "2023-10-15" },
      { id: 2, description: "Low cholesterol diet adherence", completed: true, dueDate: "Ongoing" },
      { id: 3, description: "Stress reduction techniques", completed: false, dueDate: "Ongoing" },
    ],
    medications: [
      { id: 1, name: "Atorvastatin", dosage: "40mg", frequency: "Once daily", status: "active" },
      { id: 2, name: "Aspirin", dosage: "81mg", frequency: "Once daily", status: "active" },
      { id: 3, name: "Metoprolol", dosage: "25mg", frequency: "Twice daily", status: "active" }
    ],
    notes: "Patient completed cardiac rehab with excellent results. Lipid panel shows improvement."
  },
];

const upcomingAppointments = [
  {
    id: 1,
    patientName: "James Wilson",
    patientId: "VA-10045",
    date: "2023-11-20",
    time: "10:00 AM",
    type: "Follow-up",
    provider: "Dr. Sarah Martinez",
    location: "VA Medical Center - Cardiology",
    status: "confirmed"
  },
  {
    id: 2,
    patientName: "Maria Rodriguez",
    patientId: "VA-10078",
    date: "2023-11-21",
    time: "1:30 PM",
    type: "Lab Review",
    provider: "Dr. James Chen",
    location: "Virtual Visit",
    status: "confirmed"
  },
  {
    id: 3,
    patientName: "Robert Johnson",
    patientId: "VA-10033",
    date: "2023-11-22",
    time: "9:15 AM",
    type: "Therapy Session",
    provider: "Dr. Lisa Wong",
    location: "VA Medical Center - Mental Health",
    status: "pending"
  }
];

const ClinicianTreatment = () => {
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [expandedGoals, setExpandedGoals] = useState<{[key: number]: boolean}>({});
  
  const togglePlanSelection = (id: number) => {
    setSelectedPlan(selectedPlan === id ? null : id);
  };
  
  const toggleGoalsExpanded = (id: number) => {
    setExpandedGoals(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  const markGoalComplete = (planId: number, goalId: number) => {
    // In a real app, this would update the database
    toast({
      title: "Goal marked as complete",
      description: "The treatment goal has been updated.",
    });
  };
  
  const getAdherenceColor = (adherence: number) => {
    if (adherence >= 90) return "text-green-600";
    if (adherence >= 75) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <AppLayout title="Treatment Planning">
      <div className="space-y-6">
        <Tabs defaultValue="careplans" className="space-y-4">
          <TabsList>
            <TabsTrigger value="careplans">Care Plans</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="careplans" className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-gray-500">
                Create and manage treatment plans for patients
              </p>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Care Plan
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Patient Care Plans</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {carePlans.map((plan) => (
                        <div 
                          key={plan.id}
                          className={`p-3 rounded-md border cursor-pointer transition-colors ${
                            selectedPlan === plan.id ? 
                            'bg-blue-50 border-blue-200' : 
                            'hover:bg-gray-50'
                          }`}
                          onClick={() => togglePlanSelection(plan.id)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">{plan.patientName}</div>
                              <div className="text-xs text-gray-500">{plan.patientId}</div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          </div>
                          <div className="mt-2 flex justify-between items-center">
                            <div className="text-sm">{plan.condition}</div>
                            <Badge variant="outline" className="text-xs">
                              {plan.status}
                            </Badge>
                          </div>
                          <div className="mt-2 text-xs text-gray-500">
                            Updated: {plan.updatedDate}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="md:col-span-2">
                {selectedPlan !== null ? (
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">
                          {carePlans.find(p => p.id === selectedPlan)?.patientName} - {carePlans.find(p => p.id === selectedPlan)?.condition}
                        </CardTitle>
                        <Button variant="outline" size="sm">
                          <FileText className="mr-2 h-4 w-4" />
                          Edit Plan
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {carePlans.find(p => p.id === selectedPlan) && (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <div className="text-sm font-medium">Patient ID</div>
                              <div className="text-sm">{carePlans.find(p => p.id === selectedPlan)?.patientId}</div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-sm font-medium">Adherence</div>
                              <div className={`text-sm font-bold ${getAdherenceColor(carePlans.find(p => p.id === selectedPlan)?.adherence || 0)}`}>
                                {carePlans.find(p => p.id === selectedPlan)?.adherence}%
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-sm font-medium">Created</div>
                              <div className="text-sm">{carePlans.find(p => p.id === selectedPlan)?.createdDate}</div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-sm font-medium">Updated</div>
                              <div className="text-sm">{carePlans.find(p => p.id === selectedPlan)?.updatedDate}</div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <div className="font-medium">Treatment Goals</div>
                              <Button
                                variant="ghost" 
                                size="sm"
                                onClick={() => toggleGoalsExpanded(selectedPlan)}
                              >
                                {expandedGoals[selectedPlan] ? 'Collapse' : 'Expand All'}
                              </Button>
                            </div>
                            <div className="space-y-2">
                              {carePlans.find(p => p.id === selectedPlan)?.goals.map(goal => (
                                <div key={goal.id} className="flex items-center gap-2 p-2 border rounded-md">
                                  <Checkbox 
                                    id={`goal-${goal.id}`} 
                                    checked={goal.completed}
                                    onCheckedChange={() => markGoalComplete(selectedPlan, goal.id)}
                                  />
                                  <div className="flex-1">
                                    <label 
                                      htmlFor={`goal-${goal.id}`} 
                                      className={`text-sm ${goal.completed ? 'line-through text-gray-500' : ''}`}
                                    >
                                      {goal.description}
                                    </label>
                                    <div className="text-xs text-gray-500">Due: {goal.dueDate}</div>
                                  </div>
                                  {goal.completed ? (
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <></>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <div className="font-medium mb-2">Medications</div>
                            <div className="space-y-2">
                              {carePlans.find(p => p.id === selectedPlan)?.medications.map(med => (
                                <div key={med.id} className="p-2 border rounded-md">
                                  <div className="flex justify-between">
                                    <div className="font-medium">{med.name}</div>
                                    <Badge 
                                      variant="outline" 
                                      className={med.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-700'}
                                    >
                                      {med.status}
                                    </Badge>
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {med.dosage}, {med.frequency}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <div className="font-medium mb-2">Notes</div>
                            <div className="p-3 bg-gray-50 rounded-md text-sm">
                              {carePlans.find(p => p.id === selectedPlan)?.notes}
                            </div>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <div className="h-full flex items-center justify-center p-12 border rounded-lg border-dashed">
                    <div className="text-center">
                      <User className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">Select a patient</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Choose a patient from the left to view their care plan
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="appointments" className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-gray-500">
                View and manage upcoming patient appointments
              </p>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Schedule Appointment
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div 
                      key={appointment.id} 
                      className="p-4 rounded-md border shadow-sm bg-white"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{appointment.patientName}</h3>
                            <span className="text-xs text-gray-500">{appointment.patientId}</span>
                            <Badge 
                              variant="outline" 
                              className={appointment.status === "confirmed" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}
                            >
                              {appointment.status}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium mt-1">
                            {appointment.type} with {appointment.provider}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span>{appointment.date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span>{appointment.time}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{appointment.location}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">Reschedule</Button>
                          <Button size="sm">View Details</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default ClinicianTreatment;
