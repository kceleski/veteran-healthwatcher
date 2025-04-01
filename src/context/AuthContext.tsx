
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

type User = {
  id: string;
  name: string;
  role: 'veteran' | 'clinician';
  avatar?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user data");
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate authentication - in a real app this would call an API
      let mockUser: User;
      
      if (username.includes('veteran')) {
        mockUser = {
          id: 'v-001',
          name: 'James Wilson',
          role: 'veteran',
          avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=JW'
        };
      } else if (username.includes('clinician')) {
        mockUser = {
          id: 'c-001',
          name: 'Dr. Sarah Johnson',
          role: 'clinician',
          avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SJ'
        };
      } else {
        throw new Error("Invalid username format");
      }
      
      // Save user to local storage
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      // Redirect based on role
      if (mockUser.role === 'veteran') {
        navigate('/veteran/dashboard');
      } else {
        navigate('/clinician/dashboard');
      }
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${mockUser.name}!`,
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userType'); // Clean up from the demo login
    setUser(null);
    navigate('/');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
      duration: 3000,
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
