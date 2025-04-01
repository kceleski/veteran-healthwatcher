
import AppLayout from "@/components/layouts/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ClinicianAnalytics = () => {
  return (
    <AppLayout title="Analytics">
      <Card>
        <CardHeader>
          <CardTitle>Health Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This page would provide advanced analytics and visualizations of patient health data.</p>
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default ClinicianAnalytics;
