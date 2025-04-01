
import AppLayout from "@/components/layouts/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ClinicianTreatment = () => {
  return (
    <AppLayout title="Treatment Planning">
      <Card>
        <CardHeader>
          <CardTitle>Care Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This page would allow clinicians to create and manage patient treatment plans.</p>
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default ClinicianTreatment;
