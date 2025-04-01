
import { useState } from "react";
import AppLayout from "@/components/layouts/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from "recharts";
import {
  Download,
  Calendar,
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Filter
} from "lucide-react";

// Mock data for analytics
const patientTrendData = [
  { month: "Jan", bp: 138, glucose: 110, weight: 185, target: 135 },
  { month: "Feb", bp: 142, glucose: 130, weight: 186, target: 135 },
  { month: "Mar", bp: 140, glucose: 125, weight: 187, target: 135 },
  { month: "Apr", bp: 145, glucose: 140, weight: 185, target: 135 },
  { month: "May", bp: 137, glucose: 120, weight: 183, target: 135 },
  { month: "Jun", bp: 133, glucose: 115, weight: 181, target: 135 },
  { month: "Jul", bp: 130, glucose: 105, weight: 180, target: 135 },
  { month: "Aug", bp: 132, glucose: 110, weight: 179, target: 135 },
  { month: "Sep", bp: 129, glucose: 112, weight: 178, target: 135 },
  { month: "Oct", bp: 128, glucose: 108, weight: 176, target: 135 },
  { month: "Nov", bp: 127, glucose: 106, weight: 175, target: 135 },
];

const medicationAdherenceData = [
  { name: "Fully Adherent", value: 68 },
  { name: "Partially Adherent", value: 22 },
  { name: "Non-Adherent", value: 10 },
];

const adherenceColors = ["#4ade80", "#facc15", "#ef4444"];

const populationHealthData = [
  { age: "18-30", hypertension: 15, diabetes: 8, ptsd: 22, other: 18 },
  { age: "31-45", hypertension: 25, diabetes: 15, ptsd: 30, other: 22 },
  { age: "46-60", hypertension: 40, diabetes: 28, ptsd: 25, other: 30 },
  { age: "61-75", hypertension: 55, diabetes: 35, ptsd: 18, other: 45 },
  { age: "76+", hypertension: 48, diabetes: 30, ptsd: 10, other: 38 },
];

const appointmentTypeData = [
  { name: "Follow-up", value: 45 },
  { name: "Initial Consult", value: 20 },
  { name: "Emergency", value: 10 },
  { name: "Therapy", value: 15 },
  { name: "Specialist Referral", value: 10 },
];

const appointmentColors = ["#3b82f6", "#a855f7", "#ef4444", "#10b981", "#f59e0b"];

const ClinicianAnalytics = () => {
  const [chartType, setChartType] = useState<"line" | "bar">("line");

  return (
    <AppLayout title="Analytics">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-gray-500">
            Data-driven insights to improve patient outcomes
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              Date Range
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="patient" className="space-y-4">
          <TabsList>
            <TabsTrigger value="patient">Patient Trends</TabsTrigger>
            <TabsTrigger value="population">Population Health</TabsTrigger>
            <TabsTrigger value="operational">Operational</TabsTrigger>
          </TabsList>
          
          <TabsContent value="patient" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="md:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">Patient Health Metrics</CardTitle>
                    <CardDescription>Systolic BP vs. Blood Glucose Over Time</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className={chartType === "line" ? "bg-blue-50 text-blue-700" : ""}
                      onClick={() => setChartType("line")}
                    >
                      <LineChartIcon className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className={chartType === "bar" ? "bg-blue-50 text-blue-700" : ""}
                      onClick={() => setChartType("bar")}
                    >
                      <BarChart3 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      {chartType === "line" ? (
                        <LineChart
                          data={patientTrendData}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <Tooltip />
                          <Legend />
                          <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="bp"
                            name="Blood Pressure (Systolic)"
                            stroke="#3b82f6"
                            activeDot={{ r: 8 }}
                          />
                          <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="target"
                            name="BP Target"
                            stroke="#3b82f6"
                            strokeDasharray="5 5"
                            strokeWidth={1}
                          />
                          <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="glucose"
                            name="Blood Glucose"
                            stroke="#ef4444"
                          />
                        </LineChart>
                      ) : (
                        <BarChart
                          data={patientTrendData}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="bp" name="Blood Pressure (Systolic)" fill="#3b82f6" />
                          <Bar dataKey="glucose" name="Blood Glucose" fill="#ef4444" />
                        </BarChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Medication Adherence</CardTitle>
                  <CardDescription>Patient compliance with prescribed medications</CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={medicationAdherenceData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {medicationAdherenceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={adherenceColors[index % adherenceColors.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Weight Tracking</CardTitle>
                <CardDescription>Monthly weight measurements</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={patientTrendData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={['dataMin - 10', 'dataMax + 10']} />
                      <Tooltip />
                      <Area type="monotone" dataKey="weight" name="Weight (lbs)" stroke="#10b981" fill="#10b98133" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="population" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Population Health by Age Group</CardTitle>
                <CardDescription>Distribution of conditions across veteran age groups</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={populationHealthData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="age" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="hypertension" name="Hypertension" stackId="a" fill="#3b82f6" />
                      <Bar dataKey="diabetes" name="Diabetes" stackId="a" fill="#ef4444" />
                      <Bar dataKey="ptsd" name="PTSD" stackId="a" fill="#f59e0b" />
                      <Bar dataKey="other" name="Other Conditions" stackId="a" fill="#a855f7" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="operational" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Appointment Types</CardTitle>
                  <CardDescription>Distribution of appointment categories</CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={appointmentTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {appointmentTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={appointmentColors[index % appointmentColors.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Patient Satisfaction</CardTitle>
                  <CardDescription>Monthly satisfaction ratings</CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { month: "Jan", rating: 4.2 },
                          { month: "Feb", rating: 4.3 },
                          { month: "Mar", rating: 4.1 },
                          { month: "Apr", rating: 4.4 },
                          { month: "May", rating: 4.6 },
                          { month: "Jun", rating: 4.7 },
                          { month: "Jul", rating: 4.8 },
                          { month: "Aug", rating: 4.7 },
                          { month: "Sep", rating: 4.9 },
                          { month: "Oct", rating: 4.8 },
                          { month: "Nov", rating: 4.7 },
                        ]}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis domain={[3.5, 5]} />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="rating"
                          name="Patient Satisfaction (1-5)"
                          stroke="#10b981"
                          strokeWidth={2}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default ClinicianAnalytics;
