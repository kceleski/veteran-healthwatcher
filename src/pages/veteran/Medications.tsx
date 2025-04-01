
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import AppLayout from "@/components/layouts/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle2, Clock, Info, Pill } from "lucide-react";
import { getMedicationsForVeteran, updateMedicationAdherence } from "@/lib/mockAPI";
import { Skeleton } from "@/components/ui/skeleton";

const VeteranMedications = () => {
  const { toast } = useToast();
  const [adherenceUpdates, setAdherenceUpdates] = useState<Record<string, boolean>>({});

  const { data: medications, isLoading, isError, refetch } = useQuery({
    queryKey: ['medications'],
    queryFn: () => getMedicationsForVeteran('v-001')
  });

  const handleAdherenceUpdate = async (medicationId: string, taken: boolean) => {
    try {
      await updateMedicationAdherence(medicationId, taken);
      setAdherenceUpdates((prev) => ({ ...prev, [medicationId]: taken }));
      
      toast({
        title: taken ? "Medication marked as taken" : "Medication skipped",
        description: `Your medication log has been updated.`,
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error updating medication",
        description: "There was a problem updating your medication. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const getCurrentSchedule = () => {
    const now = new Date();
    const hour = now.getHours();
    
    if (hour >= 5 && hour < 12) return "morning";
    if (hour >= 12 && hour < 18) return "afternoon";
    return "evening";
  };

  const sortedMedications = medications?.sort((a, b) => {
    // Show active medications first
    if (a.isActive !== b.isActive) return a.isActive ? -1 : 1;
    // Sort by adherence rate (ascending)
    return a.adherenceRate - b.adherenceRate;
  });

  return (
    <AppLayout title="Medications">
      <div className="grid gap-6">
        <Tabs defaultValue={getCurrentSchedule()} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="morning" className="flex items-center">
              <Pill className="mr-2 h-4 w-4" />
              Morning
            </TabsTrigger>
            <TabsTrigger value="afternoon" className="flex items-center">
              <Pill className="mr-2 h-4 w-4" />
              Afternoon
            </TabsTrigger>
            <TabsTrigger value="evening" className="flex items-center">
              <Pill className="mr-2 h-4 w-4" />
              Evening
            </TabsTrigger>
          </TabsList>
          
          {["morning", "afternoon", "evening"].map((timeOfDay) => (
            <TabsContent key={timeOfDay} value={timeOfDay}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {timeOfDay === "morning" ? "Morning" : timeOfDay === "afternoon" ? "Afternoon" : "Evening"} Medications
                  </CardTitle>
                  <CardDescription>
                    {timeOfDay === "morning" ? "6am - 12pm" : timeOfDay === "afternoon" ? "12pm - 6pm" : "6pm - bedtime"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-4">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-5 w-40" />
                            <Skeleton className="h-4 w-60" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : isError ? (
                    <div className="p-4 text-center">
                      <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-3" />
                      <h3 className="text-lg font-medium mb-1">Unable to load medications</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        There was an error loading your medication information.
                      </p>
                      <Button onClick={() => refetch()}>Try Again</Button>
                    </div>
                  ) : sortedMedications && sortedMedications.length > 0 ? (
                    <div className="space-y-4">
                      {sortedMedications.map((medication) => (
                        <div 
                          key={medication.id} 
                          className={`p-4 border rounded-lg ${!medication.isActive ? 'opacity-60 bg-muted/30' : ''}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <Pill className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <h4 className="font-medium">{medication.name} {medication.dosage}</h4>
                                <p className="text-sm text-muted-foreground">{medication.instructions}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {medication.isActive ? (
                                <Badge variant="outline" className="ml-auto">
                                  {medication.frequency}
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-muted">Inactive</Badge>
                              )}
                            </div>
                          </div>
                          
                          {medication.isActive && (
                            <div className="mt-4 flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`medication-${medication.id}`}
                                  checked={adherenceUpdates[medication.id] ?? false}
                                  onCheckedChange={(checked) => {
                                    handleAdherenceUpdate(medication.id, checked === true);
                                  }}
                                />
                                <label 
                                  htmlFor={`medication-${medication.id}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  Mark as taken
                                </label>
                              </div>
                              
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>Start date: {format(new Date(medication.startDate), 'MMM d, yyyy')}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
                      <h3 className="text-lg font-medium mb-1">No medications for this time period</h3>
                      <p className="text-sm text-muted-foreground">
                        You don't have any medications scheduled for this time of day.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
        
        {/* Adherence summary */}
        <Card>
          <CardHeader>
            <CardTitle>Medication Adherence</CardTitle>
            <CardDescription>Your medication adherence over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {!isLoading && !isError && medications && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {medications
                    .filter(med => med.isActive)
                    .slice(0, 3)
                    .map((medication) => {
                      const adherenceRate = adherenceUpdates[medication.id] !== undefined 
                        ? (adherenceUpdates[medication.id] ? 1 : 0)
                        : medication.adherenceRate;
                      
                      // Determine color based on adherence rate
                      const color = adherenceRate >= 0.8 ? "bg-green-500" : 
                                    adherenceRate >= 0.6 ? "bg-amber-500" : 
                                    "bg-red-500";
                      
                      return (
                        <div key={`adherence-${medication.id}`} className="p-4 border rounded-lg">
                          <h4 className="font-medium text-sm">{medication.name}</h4>
                          <div className="mt-2 h-2 bg-gray-200 rounded-full">
                            <div 
                              className={`h-2 rounded-full ${color}`}
                              style={{ width: `${adherenceRate * 100}%` }}
                            ></div>
                          </div>
                          <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                            <span>Adherence</span>
                            <span>{Math.round(adherenceRate * 100)}%</span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
              
              <div className="flex justify-center mt-4">
                <Button variant="outline" className="flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  View Complete History
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default VeteranMedications;
