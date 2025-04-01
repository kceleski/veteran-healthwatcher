
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function RoleSwitcher() {
  const { user, switchRole } = useAuth();
  const navigate = useNavigate();

  const handleRoleSwitch = () => {
    const newRole = user?.role === 'veteran' ? 'clinician' : 'veteran';
    switchRole(newRole);
    navigate(`/${newRole}/dashboard`);
  };

  return (
    <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-full">
      <div className="flex items-center space-x-2">
        <Label htmlFor="role-switch" className={`text-xs font-medium ${user?.role === 'veteran' ? 'text-blue-600' : 'text-gray-500'}`}>
          Veteran
        </Label>
        <Switch 
          id="role-switch" 
          checked={user?.role === 'clinician'}
          onCheckedChange={handleRoleSwitch}
        />
        <Label htmlFor="role-switch" className={`text-xs font-medium ${user?.role === 'clinician' ? 'text-blue-600' : 'text-gray-500'}`}>
          Clinician
        </Label>
      </div>
    </div>
  );
}
