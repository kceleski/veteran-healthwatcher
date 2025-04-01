
import AppLayout from "@/components/layouts/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const VeteranSymptoms = () => {
  return (
    <AppLayout title="Symptom Reporting">
      <Card>
        <CardHeader>
          <CardTitle>Symptom Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This page would allow veterans to report and track symptoms over time.</p>
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default VeteranSymptoms;
