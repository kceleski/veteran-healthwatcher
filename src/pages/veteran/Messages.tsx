
import AppLayout from "@/components/layouts/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const VeteranMessages = () => {
  return (
    <AppLayout title="Messages">
      <Card>
        <CardHeader>
          <CardTitle>Secure Messaging</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This page would contain the secure messaging system for communicating with healthcare providers.</p>
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default VeteranMessages;
