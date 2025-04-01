
import AppLayout from "@/components/layouts/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ClinicianMessages = () => {
  return (
    <AppLayout title="Messages">
      <Card>
        <CardHeader>
          <CardTitle>Patient Communications</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This page would allow clinicians to manage communications with veterans under their care.</p>
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default ClinicianMessages;
