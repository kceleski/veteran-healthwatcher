
import AppLayout from "@/components/layouts/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, RefreshCw, FileText, Search, FileImage, FileAudio, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const ClinicianVista = () => {
  const [isDocumentDialogOpen, setIsDocumentDialogOpen] = useState(false);
  const [isSyncDialogOpen, setIsSyncDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [syncProgress, setSyncProgress] = useState(0);
  const [lastSyncTime, setLastSyncTime] = useState("Today, 10:15 AM");
  const [syncStatus, setSyncStatus] = useState("Completed Successfully");
  const { toast } = useToast();

  const documents = [
    {
      id: "doc1",
      name: "Patient Medical History.pdf",
      type: "PDF",
      size: "2.4 MB",
      date: "May 15, 2023",
      icon: <FileText className="h-8 w-8 text-red-500" />,
      security: "Restricted"
    },
    {
      id: "doc2",
      name: "Chest X-Ray Results.jpg",
      type: "Image",
      size: "8.1 MB",
      date: "Jun 22, 2023",
      icon: <FileImage className="h-8 w-8 text-blue-500" />,
      security: "Sensitive"
    },
    {
      id: "doc3",
      name: "Cardiology Consultation.pdf",
      type: "PDF",
      size: "1.7 MB",
      date: "Jul 10, 2023",
      icon: <FileText className="h-8 w-8 text-red-500" />,
      security: "Restricted"
    },
    {
      id: "doc4",
      name: "Recorded Session Notes.mp3",
      type: "Audio",
      size: "5.3 MB",
      date: "Aug 3, 2023",
      icon: <FileAudio className="h-8 w-8 text-green-500" />,
      security: "Confidential"
    }
  ];

  const handleImportClick = () => {
    setIsDocumentDialogOpen(true);
  };

  const handleSyncClick = () => {
    setIsSyncDialogOpen(true);
    setSyncProgress(0);
    
    // Simulate sync progress
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const now = new Date();
            const formattedTime = format(now, "h:mm a");
            setLastSyncTime(`Today, ${formattedTime}`);
            setSyncStatus("Completed Successfully");
            setIsSyncDialogOpen(false);
            toast({
              title: "Synchronization Complete",
              description: "All patient data has been synchronized successfully.",
              variant: "default",
            });
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleImportDocument = () => {
    if (!selectedDocument) {
      toast({
        title: "Selection Required",
        description: "Please select a document to import",
        variant: "destructive"
      });
      return;
    }

    const documentName = documents.find(doc => doc.id === selectedDocument)?.name;
    
    setIsDocumentDialogOpen(false);
    
    toast({
      title: "Document Imported Successfully",
      description: `${documentName} has been imported from VistA`,
      variant: "default"
    });
    
    setTimeout(() => setSelectedDocument(null), 500);
  };

  return (
    <AppLayout title="VistA Integration">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="mr-2 h-5 w-5 text-blue-500" />
            VistA Electronic Health Record System
          </CardTitle>
          <CardDescription>
            Connect to and synchronize data with the VA's central electronic health record system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <Button className="flex-1">
                <Search className="mr-2 h-4 w-4" />
                Search Patient Records
              </Button>
              <Button className="flex-1" variant="outline" onClick={handleSyncClick}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Synchronize Data
              </Button>
              <Button className="flex-1" variant="outline" onClick={handleImportClick}>
                <FileText className="mr-2 h-4 w-4" />
                Import Documents
              </Button>
            </div>
            
            <div className="p-4 bg-blue-50 text-blue-800 rounded-md border border-blue-200">
              <p className="font-medium mb-1">System Status: Connected</p>
              <p className="text-sm">Last synchronization completed successfully at {lastSyncTime.includes("Today") ? lastSyncTime.replace("Today, ", "") : lastSyncTime}.</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Synchronizations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="p-3 border border-gray-200 rounded-md">
                <div className="flex justify-between">
                  <div className="font-medium">Full Data Sync</div>
                  <div className="text-sm text-gray-500">{lastSyncTime}</div>
                </div>
                <div className="text-sm text-green-600">{syncStatus}</div>
              </div>
              <div className="p-3 border border-gray-200 rounded-md">
                <div className="flex justify-between">
                  <div className="font-medium">Patient Record Update</div>
                  <div className="text-sm text-gray-500">Yesterday, 3:30 PM</div>
                </div>
                <div className="text-sm text-green-600">Completed Successfully</div>
              </div>
              <div className="p-3 border border-gray-200 rounded-md">
                <div className="flex justify-between">
                  <div className="font-medium">Medication Records Sync</div>
                  <div className="text-sm text-gray-500">May 10, 2023, 9:45 AM</div>
                </div>
                <div className="text-sm text-amber-600">Partial Completion</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-gray-50 rounded-md">
                  <div className="text-sm text-gray-500">API Version</div>
                  <div className="font-medium">v3.2.1</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <div className="text-sm text-gray-500">Connection Status</div>
                  <div className="font-medium text-green-600">Connected</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <div className="text-sm text-gray-500">Last Heartbeat</div>
                  <div className="font-medium">1 minute ago</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <div className="text-sm text-gray-500">Data Encryption</div>
                  <div className="font-medium">AES-256</div>
                </div>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-md">
                <h3 className="font-medium mb-2">Integration Documentation</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Access complete documentation for the VistA integration API and data synchronization protocols.
                </p>
                <Button variant="outline" size="sm">View Documentation</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Document Import Dialog */}
      <Dialog open={isDocumentDialogOpen} onOpenChange={setIsDocumentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Import Documents from VistA</DialogTitle>
            <DialogDescription>
              Select documents to import from the VistA Electronic Health Record System.
              All transfers are encrypted and secure.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="rounded-md border border-blue-100 bg-blue-50 p-2 mb-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Security Notice</p>
                  <p>All document transfers comply with VA security protocols and HIPAA regulations.</p>
                </div>
              </div>
            </div>
            
            <RadioGroup value={selectedDocument || ""} onValueChange={setSelectedDocument}>
              <div className="space-y-3">
                {documents.map(doc => (
                  <div 
                    key={doc.id} 
                    className={`flex items-center space-x-3 border p-3 rounded-md ${
                      selectedDocument === doc.id ? "border-blue-500 bg-blue-50" : "border-gray-200"
                    }`}
                  >
                    <RadioGroupItem value={doc.id} id={doc.id} />
                    <Label htmlFor={doc.id} className="flex items-center flex-1 cursor-pointer">
                      <div className="mr-3">{doc.icon}</div>
                      <div className="flex-1">
                        <div className="font-medium">{doc.name}</div>
                        <div className="text-sm text-gray-500">
                          {doc.type} • {doc.size} • {doc.date}
                        </div>
                      </div>
                      <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-800 border-amber-200">
                        {doc.security}
                      </Badge>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
          
          <DialogFooter className="flex items-center justify-between sm:justify-between">
            <Button variant="outline" onClick={() => setIsDocumentDialogOpen(false)}>
              Cancel
            </Button>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-1.5" />
              <span className="text-xs text-green-600 mr-4">Secure Connection</span>
              <Button onClick={handleImportDocument}>Import Document</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sync Dialog */}
      <Dialog open={isSyncDialogOpen} onOpenChange={setIsSyncDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Synchronizing with VistA</DialogTitle>
            <DialogDescription>
              Please wait while we synchronize with the VistA Electronic Health Record System...
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-6">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${syncProgress}%` }}
              ></div>
            </div>
            
            <div className="text-center">
              <p className="text-lg font-semibold">{syncProgress}%</p>
              <p className="text-sm text-gray-500">
                {syncProgress < 30 && "Establishing secure connection..."}
                {syncProgress >= 30 && syncProgress < 60 && "Retrieving patient records..."}
                {syncProgress >= 60 && syncProgress < 90 && "Processing medical data..."}
                {syncProgress >= 90 && "Finalizing synchronization..."}
              </p>
            </div>
            
            <Alert className="bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-500" />
              <AlertTitle className="text-blue-700">Secure Synchronization</AlertTitle>
              <AlertDescription className="text-blue-600">
                All data is being transferred using end-to-end encryption following VA security protocols.
              </AlertDescription>
            </Alert>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default ClinicianVista;
