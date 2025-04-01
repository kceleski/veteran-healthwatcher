
import AppLayout from "@/components/layouts/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const VeteranResources = () => {
  return (
    <AppLayout title="Resources">
      <Card>
        <CardHeader>
          <CardTitle>Health Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This page would provide educational resources, self-care guides, and information about VA services.</p>
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default VeteranResources;
