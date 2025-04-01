
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
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl mb-4">
            VetGuardian <span className="text-blue-600">Health</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Advanced telehealth monitoring powered by AVA AI, helping veterans live healthier lives through continuous health tracking and early intervention.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl">Veterans Portal</CardTitle>
              <CardDescription>
                Access your health data, manage appointments, and stay connected with your care team.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-40 bg-blue-50 rounded-md flex items-center justify-center">
                <svg className="h-20 w-20 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
              <CardTitle className="text-2xl">Clinicians Portal</CardTitle>
              <CardDescription>
                Monitor your patients, review health trends, and manage care plans efficiently.
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
          <p className="text-sm text-slate-500">
            VetGuardian Health - VISN 8 Telehealth Solution - Powered by AVA AI
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
