
import AppLayout from "@/components/layouts/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const VeteranAppointments = () => {
  return (
    <AppLayout title="Appointments">
      <Card>
        <CardHeader>
          <CardTitle>Appointment Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This page would allow veterans to view, schedule, and manage their medical appointments.</p>
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default VeteranAppointments;
