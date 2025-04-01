
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { X, Send, Maximize2, Minimize2 } from "lucide-react";

type ChatMessage = {
  sender: 'user' | 'ava';
  text: string;
  timestamp: Date;
};

type QuickResponse = {
  text: string;
  response: string;
};

const getVeteranResponses = (): QuickResponse[] => [
  { 
    text: "How do I schedule an appointment?", 
    response: "You can schedule a new appointment through the 'Appointments' section. Click on 'New Appointment' and follow the instructions to select a date, time and provider." 
  },
  { 
    text: "What do my vital readings mean?", 
    response: "Your vital readings indicate your current health status. Green ranges are normal, yellow indicates caution, and red suggests immediate attention may be needed. Your care provider has set personalized ranges for your specific health conditions." 
  },
  { 
    text: "Medication reminder settings", 
    response: "I've updated your medication reminder settings. You'll now receive notifications 30 minutes before each scheduled dose." 
  }
];

const getClinicianResponses = (): QuickResponse[] => [
  { 
    text: "Summarize patient status", 
    response: "Patient James Wilson's vitals are mostly within normal ranges. Blood pressure has been slightly elevated over the past 3 days. Medication compliance is at 92%. No critical alerts in the past 24 hours." 
  },
  { 
    text: "Generate treatment report", 
    response: "Treatment report for James Wilson has been generated and saved to his patient record. You can access it through the 'Treatment' section or download it directly from here." 
  },
  { 
    text: "Analyze recent vital trends", 
    response: "Analysis complete. James Wilson's heart rate variability has decreased by 12% over the past week, which may indicate increased stress levels. Recommend follow-up on stress management techniques discussed in previous session." 
  }
];

const AvaAIChatbot = () => {
  const { user } = useAuth();
  const [isMinimized, setIsMinimized] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'ava',
      text: `Hello ${user?.name}! I'm AVA, your AI health assistant. How can I help you today?`,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  
  const isVeteran = user?.role === 'veteran';
  const quickResponses = isVeteran ? getVeteranResponses() : getClinicianResponses();

  const handleQuickResponse = (response: QuickResponse) => {
    // Add user message
    const userMessage: ChatMessage = {
      sender: 'user',
      text: response.text,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate typing delay then add AVA response
    setTimeout(() => {
      const avaResponse: ChatMessage = {
        sender: 'ava',
        text: response.response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, avaResponse]);
    }, 1000);
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      sender: 'user',
      text: inputText,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    
    // Simulate typing delay then add generic AVA response
    setTimeout(() => {
      const avaResponse: ChatMessage = {
        sender: 'ava',
        text: "I'm still learning about that. In the meantime, you might find it helpful to use one of the quick responses below.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, avaResponse]);
    }, 1000);
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isMinimized ? (
        <Button 
          onClick={() => setIsMinimized(false)}
          className="rounded-full w-14 h-14 bg-blue-500 hover:bg-blue-600 p-0 flex items-center justify-center shadow-lg"
        >
          <div className="relative">
            <img 
              src="/lovable-uploads/dfe0a809-3eca-4b8a-a9c9-8cfbb42dd399.png" 
              alt="AVA AI Assistant" 
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
          </div>
        </Button>
      ) : (
        <Card className="w-80 sm:w-96 shadow-xl border-blue-200 overflow-hidden flex flex-col" style={{ height: '500px' }}>
          {/* Chatbot header */}
          <div className="bg-blue-500 text-white p-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/dfe0a809-3eca-4b8a-a9c9-8cfbb42dd399.png" 
                alt="AVA AI Assistant" 
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <div className="font-medium">AVA AI Health Assistant</div>
                <div className="text-xs opacity-90">Online</div>
              </div>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={() => setIsMinimized(true)} className="text-white hover:bg-blue-600 h-8 w-8">
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsMinimized(true)} className="text-white hover:bg-blue-600 h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-3 bg-gray-50 flex flex-col gap-3">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === 'user' 
                      ? 'bg-blue-500 text-white rounded-br-none' 
                      : 'bg-white border border-gray-200 rounded-bl-none'
                  }`}
                >
                  {message.text}
                  <div className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Quick responses */}
          <div className="p-2 bg-gray-50 border-t border-gray-200 overflow-x-auto flex gap-2">
            {quickResponses.map((response, index) => (
              <Button 
                key={index} 
                variant="outline" 
                size="sm" 
                className="whitespace-nowrap text-xs"
                onClick={() => handleQuickResponse(response)}
              >
                {response.text}
              </Button>
            ))}
          </div>
          
          {/* Input area */}
          <div className="p-2 border-t border-gray-200 bg-white flex gap-2">
            <Input
              placeholder="Type a message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AvaAIChatbot;
