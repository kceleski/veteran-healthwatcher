
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, subDays, isToday, isYesterday, formatDistanceToNow } from "date-fns";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from "recharts";
import { 
  Activity, 
  Thermometer, 
  Heart, 
  Droplet, 
  Clock, 
  Plus,
  Filter, 
  Pulse
} from "lucide-react";
import AppLayout from "@/components/layouts/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getVitalsForVeteran, addVitalReading } from "@/lib/mockAPI";
import { VitalReading } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

// Type for grouping vitals by day
type GroupedVitals = {
  [key: string]: VitalReading[];
};

// Helper to format vitals data for charts
const formatChartData = (vitals: VitalReading[], type: string) => {
  // Filter by type and sort by timestamp
  const filteredVitals = vitals
    .filter(v => v.type === type)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  return filteredVitals.map(v => {
    // Extract value for chart
    let value: number;
    if (typeof v.value === 'string') {
      if (type === 'blood_pressure') {
        // Extract systolic pressure for charts
        value = parseInt(v.value.split('/')[0], 10);
      } else {
        value = parseFloat(v.value);
      }
    } else {
      value = v.value;
    }

    return {
      timestamp: v.timestamp,
      date: format(new Date(v.timestamp), 'MM/dd'),
      time: format(new Date(v.timestamp), 'h:mm a'),
      value,
      isNormal: v.isNormal,
    };
  });
};

// Helper to format datetime for display
const formatDateTime = (dateTime: string) => {
  const date = new Date(dateTime);
  
  if (isToday(date)) {
    return `Today, ${format(date, 'h:mm a')}`;
  } else if (isYesterday(date)) {
    return `Yesterday, ${format(date, 'h:mm a')}`;
  } else {
    return `${formatDistanceToNow(date, { addSuffix: true })}`;
  }
};

const VeteranVitals = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [timeRange, setTimeRange] = useState("7d");
  const [groupedVitals, setGroupedVitals] = useState<GroupedVitals>({});
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newReading, setNewReading] = useState({
    type: "",
    value: "",
    unit: "",
  });
  
  // Fetch vitals data
  const { data: vitals, isLoading, refetch } = useQuery({
    queryKey: ['vitals', 'v-001', timeRange],
    queryFn: () => getVitalsForVeteran('v-001')
  });

  // Process and group vitals by day
  useEffect(() => {
    if (vitals) {
      const grouped: GroupedVitals = {};
      
      // Filter by time range
      const filteredVitals = vitals.filter(v => {
        const date = new Date(v.timestamp);
        const now = new Date();
        
        if (timeRange === "24h") {
          return date >= subDays(now, 1);
        } else if (timeRange === "7d") {
          return date >= subDays(now, 7);
        } else if (timeRange === "30d") {
          return date >= subDays(now, 30);
        }
        return true;
      });
      
      // Group by day
      filteredVitals.forEach(vital => {
        const day = format(new Date(vital.timestamp), 'yyyy-MM-dd');
        if (!grouped[day]) {
          grouped[day] = [];
        }
        grouped[day].push(vital);
      });
      
      // Sort each day's readings
      Object.keys(grouped).forEach(day => {
        grouped[day].sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      });
      
      setGroupedVitals(grouped);
    }
  }, [vitals, timeRange]);
  
  // Filter vitals based on active tab
  const getFilteredVitals = (dayVitals: VitalReading[]) => {
    if (activeTab === "all") {
      return dayVitals;
    }
    return dayVitals.filter(v => v.type === activeTab);
  };

  // Prepare chart data
  const bloodPressureData = vitals ? formatChartData(vitals, 'blood_pressure') : [];
  const heartRateData = vitals ? formatChartData(vitals, 'heart_rate') : [];
  const temperatureData = vitals ? formatChartData(vitals, 'temperature') : [];
  const oxygenData = vitals ? formatChartData(vitals, 'oxygen') : [];
  const glucoseData = vitals ? formatChartData(vitals, 'glucose') : [];

  // Handle form submission for new reading
  const handleAddReading = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate input
      if (!newReading.type || !newReading.value) {
        toast({
          title: "Missing Information",
          description: "Please fill out all required fields",
          variant: "destructive"
        });
        return;
      }
      
      // Create reading object
      const reading: Omit<VitalReading, 'id'> = {
        timestamp: new Date().toISOString(),
        type: newReading.type as any,
        value: newReading.value,
        unit: newReading.unit,
        isNormal: true, // This would be calculated server-side in a real app
      };
      
      // Add reading
      await addVitalReading('v-001', reading);
      
      // Show success toast
      toast({
        title: "Reading Added",
        description: "Your vital sign reading has been recorded"
      });
      
      // Reset form and close dialog
      setNewReading({
        type: "",
        value: "",
        unit: "",
      });
      setIsAddDialogOpen(false);
      
      // Refresh data
      refetch();
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add reading. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Set unit based on selected type
  const handleTypeChange = (value: string) => {
    setNewReading(prev => {
      let unit = "";
      
      switch (value) {
        case 'blood_pressure':
          unit = 'mmHg';
          break;
        case 'heart_rate':
          unit = 'bpm';
          break;
        case 'temperature':
          unit = '°F';
          break;
        case 'oxygen':
          unit = '%';
          break;
        case 'glucose':
          unit = 'mg/dL';
          break;
        case 'weight':
          unit = 'lbs';
          break;
      }
      
      return { ...prev, type: value, unit };
    });
  };
  
  // Render appropriate icon for vital type
  const getVitalIcon = (type: string) => {
    switch (type) {
      case 'blood_pressure':
        return <Droplet className="h-5 w-5 text-red-500" />;
      case 'heart_rate':
        return <Heart className="h-5 w-5 text-red-500" />;
      case 'temperature':
        return <Thermometer className="h-5 w-5 text-amber-500" />;
      case 'oxygen':
        return <Pulse className="h-5 w-5 text-blue-500" />;
      case 'glucose':
        return <Droplet className="h-5 w-5 text-purple-500" />;
      case 'weight':
        return <Activity className="h-5 w-5 text-green-500" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <AppLayout title="Vital Signs">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Vital Signs Tracking</h1>
            <p className="text-gray-500">Monitor and record your health metrics</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Select Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24 Hours</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Reading
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Vital Sign Reading</DialogTitle>
                  <DialogDescription>
                    Record a new health measurement. Make sure the information is accurate.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddReading}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="type" className="text-right">
                        Type
                      </Label>
                      <Select value={newReading.type} onValueChange={handleTypeChange} required>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blood_pressure">Blood Pressure</SelectItem>
                          <SelectItem value="heart_rate">Heart Rate</SelectItem>
                          <SelectItem value="temperature">Temperature</SelectItem>
                          <SelectItem value="oxygen">Oxygen Saturation</SelectItem>
                          <SelectItem value="glucose">Blood Glucose</SelectItem>
                          <SelectItem value="weight">Weight</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="value" className="text-right">
                        Value
                      </Label>
                      <Input
                        id="value"
                        placeholder={
                          newReading.type === 'blood_pressure' ? '120/80' : 'Enter value'
                        }
                        value={newReading.value}
                        onChange={(e) => setNewReading({ ...newReading, value: e.target.value })}
                        className="col-span-2"
                        required
                      />
                      <div className="text-sm text-gray-500">{newReading.unit}</div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Save Reading</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Blood Pressure Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Droplet className="mr-2 h-5 w-5 text-red-500" />
                Blood Pressure
              </CardTitle>
              <CardDescription>Systolic pressure over time</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : bloodPressureData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={bloodPressureData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }} 
                      tickCount={7}
                    />
                    <YAxis 
                      domain={['dataMin - 10', 'dataMax + 10']} 
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value} mmHg`, 'Systolic']}
                      labelFormatter={(label) => bloodPressureData.find(d => d.date === label)?.time || ''}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      name="Systolic"
                      stroke="#ef4444" 
                      activeDot={{ r: 6 }} 
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-center p-4">
                  <Droplet className="h-12 w-12 text-gray-300 mb-2" />
                  <p className="text-gray-500">No blood pressure data available for the selected time range</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Heart Rate Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Heart className="mr-2 h-5 w-5 text-red-500" />
                Heart Rate
              </CardTitle>
              <CardDescription>Beats per minute over time</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : heartRateData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={heartRateData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }} 
                      tickCount={7}
                    />
                    <YAxis 
                      domain={['dataMin - 5', 'dataMax + 5']} 
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value} bpm`, 'Heart Rate']}
                      labelFormatter={(label) => heartRateData.find(d => d.date === label)?.time || ''}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      name="Heart Rate"
                      stroke="#ef4444" 
                      activeDot={{ r: 6 }} 
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-center p-4">
                  <Heart className="h-12 w-12 text-gray-300 mb-2" />
                  <p className="text-gray-500">No heart rate data available for the selected time range</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Readings</TabsTrigger>
            <TabsTrigger value="blood_pressure">Blood Pressure</TabsTrigger>
            <TabsTrigger value="heart_rate">Heart Rate</TabsTrigger>
            <TabsTrigger value="temperature">Temperature</TabsTrigger>
            <TabsTrigger value="oxygen">Oxygen</TabsTrigger>
            <TabsTrigger value="glucose">Glucose</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-0">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Activity className="mr-2 h-5 w-5 text-blue-500" />
                    {activeTab === 'all' ? 'All Vital Signs' : 
                     activeTab === 'blood_pressure' ? 'Blood Pressure' :
                     activeTab === 'heart_rate' ? 'Heart Rate' :
                     activeTab === 'temperature' ? 'Temperature' :
                     activeTab === 'oxygen' ? 'Oxygen Saturation' :
                     'Blood Glucose'}
                  </div>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                  </Button>
                </CardTitle>
                <CardDescription>
                  {Object.values(groupedVitals).flat().filter(v => 
                    activeTab === 'all' || v.type === activeTab
                  ).length} readings
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                ) : Object.keys(groupedVitals).length > 0 ? (
                  <div className="space-y-6">
                    {Object.keys(groupedVitals)
                      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
                      .map((day) => {
                        const filteredDayVitals = getFilteredVitals(groupedVitals[day]);
                        
                        if (filteredDayVitals.length === 0) {
                          return null;
                        }
                        
                        return (
                          <div key={day}>
                            <h3 className="text-sm font-medium text-gray-500 mb-2">
                              {format(new Date(day), 'EEEE, MMMM d, yyyy')}
                            </h3>
                            <div className="space-y-2">
                              {filteredDayVitals.map((vital) => (
                                <div 
                                  key={vital.id} 
                                  className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-md"
                                >
                                  <div className="flex items-center">
                                    {getVitalIcon(vital.type)}
                                    <div className="ml-3">
                                      <div className="flex items-center">
                                        <span className="font-medium">
                                          {vital.type === 'blood_pressure' ? 'Blood Pressure' :
                                           vital.type === 'heart_rate' ? 'Heart Rate' :
                                           vital.type === 'temperature' ? 'Temperature' :
                                           vital.type === 'oxygen' ? 'Oxygen Saturation' :
                                           vital.type === 'glucose' ? 'Blood Glucose' :
                                           'Weight'}
                                        </span>
                                        <Badge 
                                          variant={vital.isNormal ? "outline" : "destructive"} 
                                          className="ml-2"
                                        >
                                          {vital.isNormal ? 'Normal' : 'Abnormal'}
                                        </Badge>
                                      </div>
                                      <div className="flex items-center text-sm text-gray-500">
                                        <Clock className="h-3 w-3 mr-1" />
                                        <span>
                                          {format(new Date(vital.timestamp), 'h:mm a')}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-lg font-semibold">
                                      {vital.value} {vital.unit}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <Activity className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No vital signs recorded</h3>
                    <p className="text-gray-500 mb-4">Start tracking your health metrics by adding readings</p>
                    <Button onClick={() => setIsAddDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add First Reading
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default VeteranVitals;
