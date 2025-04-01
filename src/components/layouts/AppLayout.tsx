
import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Home, 
  Activity, 
  Pill, 
  Calendar, 
  MessageSquare, 
  BookOpen, 
  AlertCircle, 
  FileText, 
  BarChart2, 
  Database, 
  Menu, 
  X, 
  LogOut, 
  Settings,
  HelpCircle,
  Bell
} from "lucide-react";

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
  showNav?: boolean;
}

const VeteranNavItems = [
  { name: "Dashboard", path: "/veteran/dashboard", icon: Home },
  { name: "Vitals", path: "/veteran/vitals", icon: Activity },
  { name: "Medications", path: "/veteran/medications", icon: Pill },
  { name: "Symptoms", path: "/veteran/symptoms", icon: AlertCircle },
  { name: "Appointments", path: "/veteran/appointments", icon: Calendar },
  { name: "Messages", path: "/veteran/messages", icon: MessageSquare },
  { name: "Resources", path: "/veteran/resources", icon: BookOpen },
];

const ClinicianNavItems = [
  { name: "Dashboard", path: "/clinician/dashboard", icon: Home },
  { name: "Alerts", path: "/clinician/alerts", icon: AlertCircle },
  { name: "Treatment", path: "/clinician/treatment", icon: FileText },
  { name: "Analytics", path: "/clinician/analytics", icon: BarChart2 },
  { name: "Messages", path: "/clinician/messages", icon: MessageSquare },
  { name: "VistA", path: "/clinician/vista", icon: Database },
];

export default function AppLayout({ children, title, showNav = true }: AppLayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isVeteran = user?.role === "veteran";
  const navItems = isVeteran ? VeteranNavItems : ClinicianNavItems;
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <span className="text-xl font-bold text-blue-600">VetGuardian</span>
              </Link>
            </div>
            
            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
                {mobileMenuOpen ? <X /> : <Menu />}
              </Button>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-80 overflow-auto">
                    <div className="p-3 bg-blue-50 border-l-4 border-blue-500 my-1">
                      <p className="font-semibold">Appointment Reminder</p>
                      <p className="text-sm text-gray-600">You have an appointment tomorrow at 10:00 AM</p>
                    </div>
                    <div className="p-3 bg-amber-50 border-l-4 border-amber-500 my-1">
                      <p className="font-semibold">Medication Alert</p>
                      <p className="text-sm text-gray-600">Your prescription is ready for pickup</p>
                    </div>
                    <div className="p-3 my-1">
                      <p className="font-semibold">AVA Health Tip</p>
                      <p className="text-sm text-gray-600">Remember to track your blood pressure today</p>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* User menu */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                    <DropdownMenuLabel className="font-normal text-xs text-gray-500">
                      {user.role === 'veteran' ? 'Veteran' : 'Clinician'}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/help')}>
                      <HelpCircle className="mr-2 h-4 w-4" />
                      <span>Help</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Skeleton className="h-8 w-8 rounded-full" />
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile navigation menu */}
      {showNav && mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <nav className="px-4 py-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-2 my-1 text-sm rounded-md ${
                  location.pathname === item.path
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
      
      {/* Main content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar navigation */}
        {showNav && (
          <aside className="hidden md:block w-64 bg-white border-r border-gray-200 overflow-y-auto">
            <nav className="p-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-2 text-sm rounded-md ${
                    location.pathname === item.path
                      ? "bg-blue-100 text-blue-700 font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </aside>
        )}
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-4 py-6">
            {title && (
              <h1 className="text-2xl font-bold mb-6">{title}</h1>
            )}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
