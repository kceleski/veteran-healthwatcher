
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
  XCircle,
  Search
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  createCarePlan, 
  updateCarePlan, 
  scheduleAppointment, 
  updateAppointmentStatus, 
  searchPatients 
} from "@/lib/mockAPI";

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
    status: "confirmed",
    notes: "Regular check-up on blood pressure and medication efficacy."
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
    status: "confirmed",
    notes: "Review recent A1C results and adjust diabetes care plan if needed."
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
    status: "pending",
    notes: "Weekly therapy session focusing on managing anxiety triggers."
  }
];

const ClinicianTreatment = () => {
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [expandedGoals, setExpandedGoals] = useState<{[key: number]: boolean}>({});
  
  // New state for dialogs
  const [newPlanDialog, setNewPlanDialog] = useState(false);
  const [editPlanDialog, setEditPlanDialog] = useState(false);
  const [scheduleDialog, setScheduleDialog] = useState(false);
  const [rescheduleDialog, setRescheduleDialog] = useState<number | null>(null);
  const [viewDetailsDialog, setViewDetailsDialog] = useState<number | null>(null);
  const [searchDialog, setSearchDialog] = useState(false);
  
  // Form states
  const [newPlanForm, setNewPlanForm] = useState({
    patientId: "",
    patientName: "",
    condition: "",
    goals: "",
    medications: "",
    notes: ""
  });
  
  const [editPlanForm, setEditPlanForm] = useState({
    goals: "",
    medications: "",
    notes: ""
  });
  
  const [appointmentForm, setAppointmentForm] = useState({
    patientId: "",
    patientName: "",
    date: "",
    time: "",
    type: "",
    provider: "",
    location: "",
    notes: ""
  });
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  
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

  // Handler for creating a new care plan
  const handleCreatePlan = async () => {
    try {
      await createCarePlan({
        patientId: newPlanForm.patientId,
        patientName: newPlanForm.patientName,
        condition: newPlanForm.condition,
        goals: newPlanForm.goals,
        medications: newPlanForm.medications,
        notes: newPlanForm.notes
      });
      
      toast({
        title: "Care Plan Created",
        description: `New care plan for ${newPlanForm.patientName} has been created.`,
      });
      
      setNewPlanDialog(false);
      setNewPlanForm({
        patientId: "",
        patientName: "",
        condition: "",
        goals: "",
        medications: "",
        notes: ""
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create care plan. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handler for editing a care plan
  const handleEditPlan = async () => {
    if (!selectedPlan) return;
    
    try {
      await updateCarePlan(selectedPlan, {
        goals: editPlanForm.goals,
        medications: editPlanForm.medications,
        notes: editPlanForm.notes
      });
      
      toast({
        title: "Care Plan Updated",
        description: "The care plan has been successfully updated.",
      });
      
      setEditPlanDialog(false);
      setEditPlanForm({
        goals: "",
        medications: "",
        notes: ""
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update care plan. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handler for scheduling a new appointment
  const handleScheduleAppointment = async () => {
    try {
      await scheduleAppointment({
        patientId: appointmentForm.patientId,
        patientName: appointmentForm.patientName,
        date: appointmentForm.date,
        time: appointmentForm.time,
        type: appointmentForm.type,
        provider: appointmentForm.provider,
        location: appointmentForm.location,
        notes: appointmentForm.notes
      });
      
      toast({
        title: "Appointment Scheduled",
        description: `New appointment for ${appointmentForm.patientName} has been scheduled.`,
      });
      
      setScheduleDialog(false);
      setAppointmentForm({
        patientId: "",
        patientName: "",
        date: "",
        time: "",
        type: "",
        provider: "",
        location: "",
        notes: ""
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule appointment. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handler for rescheduling an appointment
  const handleRescheduleAppointment = async (appointmentId: number) => {
    try {
      await updateAppointmentStatus(String(appointmentId), "rescheduled");
      
      toast({
        title: "Appointment Rescheduled",
        description: "The appointment has been successfully rescheduled.",
      });
      
      setRescheduleDialog(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reschedule appointment. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handler for searching patient records
  const handleSearch = async () => {
    try {
      const results = await searchPatients(searchQuery);
      setSearchResults(results);
      
      toast({
        title: "Search Complete",
        description: `Found ${results.length} matching patient records.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search patient records. Please try again.",
        variant: "destructive"
      });
    }
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
              <div className="flex space-x-2">
                <p className="text-gray-500">
                  Create and manage treatment plans for patients
                </p>
                <Button variant="outline" size="sm" onClick={() => setSearchDialog(true)}>
                  <Search className="h-4 w-4 mr-1" />
                  Search Records
                </Button>
              </div>
              <Button onClick={() => setNewPlanDialog(true)}>
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
                        <Button variant="outline" size="sm" onClick={() => setEditPlanDialog(true)}>
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
              <Button onClick={() => setScheduleDialog(true)}>
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
                          <Button size="sm" variant="outline" onClick={() => setRescheduleDialog(appointment.id)}>
                            Reschedule
                          </Button>
                          <Button size="sm" onClick={() => setViewDetailsDialog(appointment.id)}>
                            View Details
                          </Button>
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
      
      {/* New Care Plan Dialog */}
      <Dialog open={newPlanDialog} onOpenChange={setNewPlanDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Care Plan</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new treatment plan for a patient.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="patientId" className="text-right">
                Patient ID
              </Label>
              <Input
                id="patientId"
                value={newPlanForm.patientId}
                onChange={(e) => setNewPlanForm({...newPlanForm, patientId: e.target.value})}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="patientName" className="text-right">
                Patient Name
              </Label>
              <Input
                id="patientName"
                value={newPlanForm.patientName}
                onChange={(e) => setNewPlanForm({...newPlanForm, patientName: e.target.value})}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="condition" className="text-right">
                Condition
              </Label>
              <Input
                id="condition"
                value={newPlanForm.condition}
                onChange={(e) => setNewPlanForm({...newPlanForm, condition: e.target.value})}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="goals" className="text-right">
                Goals
              </Label>
              <Textarea
                id="goals"
                value={newPlanForm.goals}
                onChange={(e) => setNewPlanForm({...newPlanForm, goals: e.target.value})}
                className="col-span-3"
                placeholder="Enter treatment goals, one per line"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="medications" className="text-right">
                Medications
              </Label>
              <Textarea
                id="medications"
                value={newPlanForm.medications}
                onChange={(e) => setNewPlanForm({...newPlanForm, medications: e.target.value})}
                className="col-span-3"
                placeholder="Enter medications, one per line"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={newPlanForm.notes}
                onChange={(e) => setNewPlanForm({...newPlanForm, notes: e.target.value})}
                className="col-span-3"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewPlanDialog(false)}>Cancel</Button>
            <Button onClick={handleCreatePlan}>Create Plan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Care Plan Dialog */}
      <Dialog open={editPlanDialog} onOpenChange={setEditPlanDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Care Plan</DialogTitle>
            <DialogDescription>
              Update the treatment plan details.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-goals" className="text-right">
                Goals
              </Label>
              <Textarea
                id="edit-goals"
                value={editPlanForm.goals}
                onChange={(e) => setEditPlanForm({...editPlanForm, goals: e.target.value})}
                className="col-span-3"
                placeholder="Enter updated treatment goals, one per line"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-medications" className="text-right">
                Medications
              </Label>
              <Textarea
                id="edit-medications"
                value={editPlanForm.medications}
                onChange={(e) => setEditPlanForm({...editPlanForm, medications: e.target.value})}
                className="col-span-3"
                placeholder="Enter updated medications, one per line"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-notes" className="text-right">
                Notes
              </Label>
              <Textarea
                id="edit-notes"
                value={editPlanForm.notes}
                onChange={(e) => setEditPlanForm({...editPlanForm, notes: e.target.value})}
                className="col-span-3"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditPlanDialog(false)}>Cancel</Button>
            <Button onClick={handleEditPlan}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Schedule Appointment Dialog */}
      <Dialog open={scheduleDialog} onOpenChange={setScheduleDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Schedule New Appointment</DialogTitle>
            <DialogDescription>
              Fill in the details to schedule a new appointment.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="app-patientId" className="text-right">
                Patient ID
              </Label>
              <Input
                id="app-patientId"
                value={appointmentForm.patientId}
                onChange={(e) => setAppointmentForm({...appointmentForm, patientId: e.target.value})}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="app-patientName" className="text-right">
                Patient Name
              </Label>
              <Input
                id="app-patientName"
                value={appointmentForm.patientName}
                onChange={(e) => setAppointmentForm({...appointmentForm, patientName: e.target.value})}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="app-date" className="text-right">
                Date
              </Label>
              <Input
                id="app-date"
                type="date"
                value={appointmentForm.date}
                onChange={(e) => setAppointmentForm({...appointmentForm, date: e.target.value})}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="app-time" className="text-right">
                Time
              </Label>
              <Input
                id="app-time"
                type="time"
                value={appointmentForm.time}
                onChange={(e) => setAppointmentForm({...appointmentForm, time: e.target.value})}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="app-type" className="text-right">
                Type
              </Label>
              <Select 
                onValueChange={(value) => setAppointmentForm({...appointmentForm, type: value})}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select appointment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="follow-up">Follow-up</SelectItem>
                  <SelectItem value="initial">Initial Consultation</SelectItem>
                  <SelectItem value="therapy">Therapy Session</SelectItem>
                  <SelectItem value="lab-review">Lab Review</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="app-provider" className="text-right">
                Provider
              </Label>
              <Input
                id="app-provider"
                value={appointmentForm.provider}
                onChange={(e) => setAppointmentForm({...appointmentForm, provider: e.target.value})}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="app-location" className="text-right">
                Location
              </Label>
              <Select 
                onValueChange={(value) => setAppointmentForm({...appointmentForm, location: value})}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VA Medical Center - Primary Care">VA Medical Center - Primary Care</SelectItem>
                  <SelectItem value="VA Medical Center - Cardiology">VA Medical Center - Cardiology</SelectItem>
                  <SelectItem value="VA Medical Center - Mental Health">VA Medical Center - Mental Health</SelectItem>
                  <SelectItem value="Virtual Visit">Virtual Visit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="app-notes" className="text-right">
                Notes
              </Label>
              <Textarea
                id="app-notes"
                value={appointmentForm.notes}
                onChange={(e) => setAppointmentForm({...appointmentForm, notes: e.target.value})}
                className="col-span-3"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setScheduleDialog(false)}>Cancel</Button>
            <Button onClick={handleScheduleAppointment}>Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Reschedule Appointment Dialog */}
      <Dialog open={rescheduleDialog !== null} onOpenChange={() => setRescheduleDialog(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
            <DialogDescription>
              Select a new date and time for this appointment.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reschedule-date" className="text-right">
                New Date
              </Label>
              <Input
                id="reschedule-date"
                type="date"
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reschedule-time" className="text-right">
                New Time
              </Label>
              <Input
                id="reschedule-time"
                type="time"
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reschedule-reason" className="text-right">
                Reason
              </Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="provider-unavailable">Provider Unavailable</SelectItem>
                  <SelectItem value="patient-request">Patient Request</SelectItem>
                  <SelectItem value="scheduling-conflict">Scheduling Conflict</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setRescheduleDialog(null)}>Cancel</Button>
            <Button onClick={() => rescheduleDialog && handleRescheduleAppointment(rescheduleDialog)}>
              Confirm Reschedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View Appointment Details Dialog */}
      <Dialog open={viewDetailsDialog !== null} onOpenChange={() => setViewDetailsDialog(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
          </DialogHeader>
          
          {viewDetailsDialog !== null && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-lg">
                  {upcomingAppointments.find(a => a.id === viewDetailsDialog)?.type} - {upcomingAppointments.find(a => a.id === viewDetailsDialog)?.patientName}
                </h3>
                <p className="text-sm text-gray-500">{upcomingAppointments.find(a => a.id === viewDetailsDialog)?.patientId}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Date</p>
                  <p className="text-sm">{upcomingAppointments.find(a => a.id === viewDetailsDialog)?.date}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Time</p>
                  <p className="text-sm">{upcomingAppointments.find(a => a.id === viewDetailsDialog)?.time}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Provider</p>
                  <p className="text-sm">{upcomingAppointments.find(a => a.id === viewDetailsDialog)?.provider}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm">{upcomingAppointments.find(a => a.id === viewDetailsDialog)?.location}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium">Status</p>
                <div className="mt-1">
                  <Badge variant="outline" className={upcomingAppointments.find(a => a.id === viewDetailsDialog)?.status === "confirmed" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}>
                    {upcomingAppointments.find(a => a.id === viewDetailsDialog)?.status}
                  </Badge>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium">Notes</p>
                <p className="text-sm bg-gray-50 p-3 mt-1 rounded-md">
                  {upcomingAppointments.find(a => a.id === viewDetailsDialog)?.notes || "No notes available for this appointment."}
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setViewDetailsDialog(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Search Patient Records Dialog */}
      <Dialog open={searchDialog} onOpenChange={setSearchDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Search Patient Records</DialogTitle>
            <DialogDescription>
              Enter a patient name, ID, or condition to search.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" onClick={handleSearch}>Search</Button>
          </div>
          
          {searchResults.length > 0 && (
            <div className="mt-4 max-h-[300px] overflow-auto">
              <p className="text-sm text-gray-500 mb-2">Found {searchResults.length} results</p>
              {searchResults.map((result, index) => (
                <div key={index} className="p-3 border rounded-md mb-2 bg-gray-50">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{result.name}</p>
                      <p className="text-xs text-gray-500">{result.id}</p>
                    </div>
                    <Button variant="link" size="sm" className="p-0 h-auto">View</Button>
                  </div>
                  <p className="text-sm mt-1">{result.conditions.join(', ')}</p>
                </div>
              ))}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSearchDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default ClinicianTreatment;
