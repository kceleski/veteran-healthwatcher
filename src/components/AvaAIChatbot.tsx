
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { X, Send, Minimize2 } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

type ChatMessage = {
  sender: 'user' | 'ava';
  text: string;
  timestamp: Date;
};

type QuickResponse = {
  text: string;
  response: string;
};

type MoodOption = {
  emoji: string;
  label: string;
  response: string;
};

const moodOptions: MoodOption[] = [
  { emoji: "😊", label: "Great", response: "That's wonderful! It's great to hear you're feeling good today. Remember that maintaining a positive mood can help with overall health outcomes." },
  { emoji: "🙂", label: "Good", response: "I'm glad you're feeling good today! Maintaining a positive outlook is beneficial for your health." },
  { emoji: "😐", label: "Okay", response: "Thanks for sharing. Remember that it's normal to have neutral days. Is there anything specific on your mind that you'd like to discuss?" },
  { emoji: "😕", label: "Not Great", response: "I'm sorry to hear you're not feeling great today. Would you like to talk about what's bothering you? Sometimes sharing can help lighten the load." },
  { emoji: "😢", label: "Bad", response: "I'm sorry you're feeling bad today. Remember that your healthcare team is here to support you. Would you like me to provide some resources that might help?" },
];

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
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [showMoodPrompt, setShowMoodPrompt] = useState(false);
  const [hasCheckedMood, setHasCheckedMood] = useState(false);
  
  const isVeteran = user?.role === 'veteran';
  const quickResponses = isVeteran ? getVeteranResponses() : getClinicianResponses();

  // Initialize chat with greeting and mood check when user appears
  useEffect(() => {
    if (user && messages.length === 0) {
      const initialMessage: ChatMessage = {
        sender: 'ava',
        text: `Hello ${user.name}! I'm AVA, your AI health assistant.`,
        timestamp: new Date()
      };
      
      setMessages([initialMessage]);
      
      // Show mood prompt for veterans only
      if (isVeteran) {
        setShowMoodPrompt(true);
      }
    }
  }, [user, isVeteran, messages.length]);

  const handleMoodSelection = (mood: MoodOption) => {
    // Add user mood message
    const userMessage: ChatMessage = {
      sender: 'user',
      text: `I'm feeling ${mood.label} today ${mood.emoji}`,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Add AVA response to mood
    setTimeout(() => {
      const avaResponse: ChatMessage = {
        sender: 'ava',
        text: mood.response,
        timestamp: new Date()
      };
      
      // Add analytics insight based on mood
      const insightMessage: ChatMessage = {
        sender: 'ava',
        text: getAnalyticsInsightBasedOnMood(mood.label),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, avaResponse, insightMessage]);
    }, 1000);
    
    setShowMoodPrompt(false);
    setHasCheckedMood(true);
  };

  const getAnalyticsInsightBasedOnMood = (mood: string) => {
    // Provide personalized insights based on mood
    if (mood === "Great" || mood === "Good") {
      return "Based on your health data, I've noticed your mood often improves after you've had a good night's sleep. Your sleep patterns have been more consistent this week!";
    } else if (mood === "Okay") {
      return "Looking at your data, I notice your blood pressure readings tend to be better on days when you report feeling better. Have you taken your blood pressure reading today?";
    } else {
      return "I've noticed a pattern in your health data where mood dips often correlate with days before your medication refill is due. Your next refill date is coming up in 3 days.";
    }
  };

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

            {/* Mood check prompt */}
            {showMoodPrompt && (
              <Popover open={showMoodPrompt} onOpenChange={setShowMoodPrompt}>
                <PopoverTrigger asChild>
                  <div></div> {/* Empty div as trigger, automatically shown */}
                </PopoverTrigger>
                <PopoverContent className="w-80 bg-white p-4 rounded-lg shadow-md">
                  <div className="space-y-4">
                    <div className="text-center">
                      <h4 className="font-medium">How are you feeling today?</h4>
                      <p className="text-sm text-gray-500">
                        Your mood can impact your health. Let me know so I can personalize my assistance.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-5 gap-1">
                      {moodOptions.map((mood) => (
                        <Button
                          key={mood.label}
                          variant="ghost"
                          className="flex flex-col items-center p-2 h-auto"
                          onClick={() => handleMoodSelection(mood)}
                        >
                          <span className="text-2xl mb-1">{mood.emoji}</span>
                          <span className="text-xs">{mood.label}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
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
