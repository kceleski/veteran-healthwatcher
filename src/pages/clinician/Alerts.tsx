
import AppLayout from "@/components/layouts/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ClinicianAlerts = () => {
  return (
    <AppLayout title="Alerts">
      <Card>
        <CardHeader>
          <CardTitle>Patient Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This page would display all patient alerts, allowing clinicians to prioritize and resolve issues.</p>
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default ClinicianAlerts;
