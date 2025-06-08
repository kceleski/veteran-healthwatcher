
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Index = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (type: "veteran" | "clinician") => {
    // Set a default username based on the selected role
    const loginUsername = type === "veteran" ? "veteran_user" : "clinician_user";
    await login(loginUsername, "password");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <img 
              src="/lovable-uploads/25ca233b-4853-4a14-a3fb-3031eb713a4d.png" 
              alt="Logo" 
              className="h-16"
            />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl mb-4">
            HealthProAssist <span className="text-primary">Vet</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Advanced tool calls powered by Ranger AI, helping veterans live healthier lives through accessibility and empathy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl">Veterans Portal</CardTitle>
              <CardDescription>
                Access your documents, manage appointments, and stay ahead of the chaos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-40 bg-blue-50 rounded-md flex items-center justify-center">
                <svg className="h-20 w-20 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleLogin("veteran")} className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Enter as Veteran"}
              </Button>
            </CardFooter>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl">VSO Portal</CardTitle>
              <CardDescription>
                Monitor your clients, review trends, and manage plans efficiently.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-40 bg-green-50 rounded-md flex items-center justify-center">
                <svg className="h-20 w-20 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleLogin("clinician")} variant="secondary" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Enter as Clinician"}
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="text-center mt-12">
          <div className="flex flex-col items-center">
            <p className="text-sm text-slate-500 mb-2">
              Powered by
            </p>
            <div className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/25ca233b-4853-4a14-a3fb-3031eb713a4d.png" 
                alt="Logo" 
                className="h-8" 
              />
            </div>
            <p className="text-sm text-slate-500 mt-4">
              HealthProAssist Vet -- Powered by Ranger AI
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
