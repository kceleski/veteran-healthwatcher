
import { useState } from "react";
import AppLayout from "@/components/layouts/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Calendar, Download, UserPlus } from "lucide-react";
import AvaAnalyticsTooltip from "@/components/AvaAnalyticsTooltip";

// Mock data for patients with behavioral health needs
const behavioralHealthPatients = [
  {
    id: "BH-001",
    name: "James Wilson",
    condition: "PTSD, Depression",
    lastVisit: "2023-10-15",
    nextAppt: "2023-11-05",
    status: "Stable",
    riskLevel: "Moderate",
  },
  {
    id: "BH-002",
    name: "Maria Rodriguez",
    condition: "Anxiety, Insomnia",
    lastVisit: "2023-10-20",
    nextAppt: "2023-11-10",
    status: "Improving",
    riskLevel: "Low",
  },
  {
    id: "BH-003",
    name: "Robert Johnson",
    condition: "Bipolar Disorder",
    lastVisit: "2023-10-22",
    nextAppt: "2023-11-01",
    status: "Needs Review",
    riskLevel: "High",
  },
  {
    id: "BH-004",
    name: "Sarah Thompson",
    condition: "Depression, Substance Use",
    lastVisit: "2023-10-18",
    nextAppt: "2023-11-08",
    status: "Stable",
    riskLevel: "Moderate",
  },
  {
    id: "BH-005",
    name: "Michael Chen",
    condition: "PTSD, Anxiety",
    lastVisit: "2023-10-25",
    nextAppt: "2023-11-15",
    status: "Improving",
    riskLevel: "Moderate",
  },
];

// Treatment plan templates
const treatmentPlans = [
  {
    id: "TP-001",
    name: "PTSD CBT Protocol",
    description: "12-week cognitive behavioral therapy protocol for PTSD",
    conditions: ["PTSD"],
    sessions: 12,
  },
  {
    id: "TP-002",
    name: "Depression Management",
    description: "Combined therapy and medication management for depression",
    conditions: ["Depression", "Major Depressive Disorder"],
    sessions: 8,
  },
  {
    id: "TP-003",
    name: "Anxiety Reduction Program",
    description: "Exposure therapy and mindfulness techniques for anxiety disorders",
    conditions: ["Anxiety", "GAD", "Social Anxiety"],
    sessions: 10,
  },
  {
    id: "TP-004",
    name: "Substance Use Recovery",
    description: "Evidence-based recovery program for substance use disorders",
    conditions: ["Substance Use", "Alcohol Use Disorder"],
    sessions: 16,
  },
];

export default function BehavioralHealth() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("patients");

  // Filter patients based on search term
  const filteredPatients = behavioralHealthPatients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout title="Behavioral Health">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-bold tracking-tight">
              Behavioral Health Management
            </h2>
            <AvaAnalyticsTooltip 
              title="Insight"
              content={
                <p>Behavioral health appointments have increased by 22% in the last quarter. Consider adding more providers to your team.</p>
              }
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
            <Button size="sm">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Patient
            </Button>
          </div>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="patients">Patient List</TabsTrigger>
            <TabsTrigger value="treatment">Treatment Plans</TabsTrigger>
            <TabsTrigger value="reports">Reports & Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="patients">
            <Card>
              <CardHeader>
                <CardTitle>Behavioral Health Patients</CardTitle>
                <CardDescription>
                  Manage and monitor veterans receiving behavioral health services
                </CardDescription>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search patients..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="stable">Stable</SelectItem>
                      <SelectItem value="improving">Improving</SelectItem>
                      <SelectItem value="needsReview">Needs Review</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Risk level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Risk Levels</SelectItem>
                      <SelectItem value="low">Low Risk</SelectItem>
                      <SelectItem value="moderate">Moderate Risk</SelectItem>
                      <SelectItem value="high">High Risk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient</TableHead>
                        <TableHead>Condition</TableHead>
                        <TableHead>Last Visit</TableHead>
                        <TableHead>Next Appointment</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Risk Level</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPatients.map((patient) => (
                        <TableRow key={patient.id}>
                          <TableCell className="font-medium">{patient.name}</TableCell>
                          <TableCell>{patient.condition}</TableCell>
                          <TableCell>{new Date(patient.lastVisit).toLocaleDateString()}</TableCell>
                          <TableCell>{new Date(patient.nextAppt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              patient.status === "Stable"
                                ? "bg-green-100 text-green-800"
                                : patient.status === "Improving"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-amber-100 text-amber-800"
                            }`}>
                              {patient.status}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              patient.riskLevel === "Low"
                                ? "bg-green-100 text-green-800"
                                : patient.riskLevel === "Moderate"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-red-100 text-red-800"
                            }`}>
                              {patient.riskLevel}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="icon">
                                <Calendar className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <UserPlus className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="treatment">
            <Card>
              <CardHeader>
                <CardTitle>Treatment Plan Library</CardTitle>
                <CardDescription>
                  Pre-defined behavioral health treatment protocols and interventions
                </CardDescription>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search treatment plans..."
                      className="pl-8"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter Plans
                  </Button>
                  <Button size="sm">Create New Plan</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {treatmentPlans.map((plan) => (
                    <Card key={plan.id}>
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                        <CardDescription>{plan.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Conditions:</span>
                          <span>{plan.conditions.join(", ")}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-4">
                          <span className="text-muted-foreground">Sessions:</span>
                          <span>{plan.sessions}</span>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button size="sm">Assign</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Behavioral Health Analytics</CardTitle>
                <CardDescription>
                  Data-driven insights into behavioral health treatment outcomes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        Treatment Effectiveness 
                        <AvaAnalyticsTooltip 
                          title="Effectiveness Analysis"
                          content={
                            <p>CBT protocols show a 68% reduction in PTSD symptoms after 8 weeks compared to 42% with medication alone.</p>
                          }
                        />
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="h-80 flex items-center justify-center bg-slate-50 rounded-b-lg">
                      <div className="text-center text-muted-foreground">
                        [Treatment effectiveness chart would display here]
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        Patient Outcomes
                        <AvaAnalyticsTooltip 
                          title="Outcome Trends"
                          content={
                            <p>Veterans using the telehealth platform show 27% better adherence to treatment plans versus in-person only.</p>
                          }
                        />
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="h-80 flex items-center justify-center bg-slate-50 rounded-b-lg">
                      <div className="text-center text-muted-foreground">
                        [Patient outcomes chart would display here]
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
