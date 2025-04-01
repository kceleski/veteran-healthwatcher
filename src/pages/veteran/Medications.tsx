
import AppLayout from "@/components/layouts/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const VeteranMedications = () => {
  return (
    <AppLayout title="Medications">
      <Card>
        <CardHeader>
          <CardTitle>Medication Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This page would contain the veteran's medication information, dosage schedules, and adherence tracking.</p>
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default VeteranMedications;
