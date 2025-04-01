
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import AppLayout from "@/components/layouts/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { getSymptomReportsForVeteran, addSymptomReport } from "@/lib/mockAPI";
import { AlertCircle, Brain, FileText, Headphones, Heart, Plus, Thermometer } from "lucide-react";

const symptoms = [
  { id: "pain", name: "Pain", icon: AlertCircle },
  { id: "fatigue", name: "Fatigue", icon: Brain },
  { id: "headache", name: "Headache", icon: Thermometer },
  { id: "anxiety", name: "Anxiety", icon: Heart },
  { id: "hearing", name: "Hearing Issues", icon: Headphones },
];

const VeteranSymptoms = () => {
  const { toast } = useToast();
  const [selectedSymptom, setSelectedSymptom] = useState<string | null>(null);
  const [symptomSeverity, setSymptomSeverity] = useState<number>(3);
  const [symptomDescription, setSymptomDescription] = useState<string>("");
  const [isReporting, setIsReporting] = useState<boolean>(false);

  const { data: symptomReports, isLoading, isError, refetch } = useQuery({
    queryKey: ['symptoms'],
    queryFn: () => getSymptomReportsForVeteran('v-001')
  });

  const handleReport = async () => {
    if (!selectedSymptom) return;

    setIsReporting(true);
    
    try {
      await addSymptomReport('v-001', {
        timestamp: new Date().toISOString(),
        symptoms: [{
          type: symptoms.find(s => s.id === selectedSymptom)?.name || selectedSymptom,
          severity: symptomSeverity,
          description: symptomDescription
        }],
        notes: symptomDescription
      });
      
      toast({
        title: "Symptom reported",
        description: "Your symptom report has been successfully submitted.",
        duration: 3000,
      });
      
      // Reset form
      setSelectedSymptom(null);
      setSymptomSeverity(3);
      setSymptomDescription("");
      refetch();
    } catch (error) {
      toast({
        title: "Error reporting symptom",
        description: "There was a problem submitting your symptom report. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsReporting(false);
    }
  };

  const getSeverityLabel = (severity: number) => {
    if (severity <= 1) return "Very Mild";
    if (severity <= 2) return "Mild";
    if (severity <= 3) return "Moderate";
    if (severity <= 4) return "Severe";
    return "Very Severe";
  };

  const getSeverityColor = (severity: number) => {
    if (severity <= 1) return "bg-green-500";
    if (severity <= 2) return "bg-lime-500";
    if (severity <= 3) return "bg-amber-500";
    if (severity <= 4) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <AppLayout title="Symptom Reporting">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Symptom reporting form */}
        <Card>
          <CardHeader>
            <CardTitle>Report a Symptom</CardTitle>
            <CardDescription>Track your symptoms to help your healthcare team provide better care</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-medium mb-2">Select Symptom</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {symptoms.map((symptom) => {
                    const Icon = symptom.icon;
                    return (
                      <Button
                        key={symptom.id}
                        variant={selectedSymptom === symptom.id ? "default" : "outline"}
                        className="flex items-center justify-start h-auto py-3 gap-2"
                        onClick={() => setSelectedSymptom(symptom.id)}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{symptom.name}</span>
                      </Button>
                    );
                  })}
                  <Button
                    variant={selectedSymptom === "other" ? "default" : "outline"}
                    className="flex items-center justify-start h-auto py-3 gap-2"
                    onClick={() => setSelectedSymptom("other")}
                  >
                    <Plus className="h-4 w-4" />
                    <span>Other</span>
                  </Button>
                </div>
              </div>

              {selectedSymptom && (
                <>
                  <div>
                    <div className="flex justify-between mb-2">
                      <h3 className="text-sm font-medium">Severity</h3>
                      <Badge variant="outline">{getSeverityLabel(symptomSeverity)}</Badge>
                    </div>
                    <Slider
                      value={[symptomSeverity]}
                      min={1}
                      max={5}
                      step={1}
                      onValueChange={(value) => setSymptomSeverity(value[0])}
                    />
                    <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                      <span>Mild</span>
                      <span>Moderate</span>
                      <span>Severe</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Description</h3>
                    <Textarea
                      placeholder="Describe your symptoms in detail..."
                      value={symptomDescription}
                      onChange={(e) => setSymptomDescription(e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button 
              onClick={handleReport}
              disabled={!selectedSymptom || isReporting}
            >
              {isReporting ? "Submitting..." : "Submit Report"}
            </Button>
          </CardFooter>
        </Card>

        {/* Symptom history */}
        <Card>
          <CardHeader>
            <CardTitle>Symptom History</CardTitle>
            <CardDescription>Your recently reported symptoms</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : isError ? (
              <div className="p-4 text-center">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-3" />
                <h3 className="text-lg font-medium mb-1">Unable to load symptom history</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  There was an error loading your symptom reports.
                </p>
                <Button onClick={() => refetch()}>Try Again</Button>
              </div>
            ) : symptomReports && symptomReports.length > 0 ? (
              <div className="space-y-4">
                {symptomReports.map((report) => (
                  <div key={report.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">
                        {format(new Date(report.timestamp), "MMM d, yyyy")}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(report.timestamp), "h:mm a")}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {report.symptoms.map((symptom, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getSeverityColor(symptom.severity)}`} />
                          <div className="font-medium">{symptom.type}</div>
                          <Badge variant="outline">{getSeverityLabel(symptom.severity)}</Badge>
                        </div>
                      ))}
                    </div>
                    
                    {report.notes && (
                      <div className="mt-2 pt-2 border-t text-sm">
                        <p className="text-muted-foreground">{report.notes}</p>
                      </div>
                    )}
                  </div>
                ))}

                <div className="flex justify-center">
                  <Button variant="outline" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    View Complete History
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-medium mb-1">No symptom reports</h3>
                <p className="text-sm text-muted-foreground">
                  You haven't reported any symptoms yet.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default VeteranSymptoms;
