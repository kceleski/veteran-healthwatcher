
import AppLayout from "@/components/layouts/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, RefreshCw, FileText, Search } from "lucide-react";

const ClinicianVista = () => {
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
              <Button className="flex-1" variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Synchronize Data
              </Button>
              <Button className="flex-1" variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Import Documents
              </Button>
            </div>
            
            <div className="p-4 bg-blue-50 text-blue-800 rounded-md border border-blue-200">
              <p className="font-medium mb-1">System Status: Connected</p>
              <p className="text-sm">Last synchronization completed successfully at 10:15 AM today.</p>
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
                  <div className="text-sm text-gray-500">Today, 10:15 AM</div>
                </div>
                <div className="text-sm text-green-600">Completed Successfully</div>
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
    </AppLayout>
  );
};

export default ClinicianVista;
