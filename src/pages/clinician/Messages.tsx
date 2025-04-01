
import { useState } from "react";
import AppLayout from "@/components/layouts/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MessageSquare,
  Send,
  Search,
  Phone,
  Video,
  Paperclip,
  Image,
  Clock,
  ChevronRight,
  MoreHorizontal,
  Users,
  UserPlus
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Mock data for patients
const patients = [
  {
    id: 1,
    name: "James Wilson",
    patientId: "VA-10045",
    avatar: "/placeholder.svg",
    lastMessage: "Thank you doctor, I'll take the medication as prescribed.",
    timestamp: "10:23 AM",
    unread: true,
    online: true
  },
  {
    id: 2,
    name: "Maria Rodriguez",
    patientId: "VA-10078",
    avatar: "/placeholder.svg",
    lastMessage: "My blood glucose readings have been within range this week.",
    timestamp: "Yesterday",
    unread: false,
    online: false
  },
  {
    id: 3,
    name: "Robert Johnson",
    patientId: "VA-10033",
    avatar: "/placeholder.svg",
    lastMessage: "I've been experiencing some side effects from the new medication.",
    timestamp: "Yesterday",
    unread: true,
    online: false
  },
  {
    id: 4,
    name: "Sarah Thompson",
    patientId: "VA-10056",
    avatar: "/placeholder.svg",
    lastMessage: "When is my next appointment scheduled?",
    timestamp: "Monday",
    unread: false,
    online: true
  },
  {
    id: 5,
    name: "Michael Davis",
    patientId: "VA-10061",
    avatar: "/placeholder.svg",
    lastMessage: "The new exercise program is working well for me.",
    timestamp: "Oct 10",
    unread: false,
    online: true
  }
];

// Mock message history
const messageHistory = [
  {
    id: 1,
    sender: "clinician",
    content: "Good morning, Mr. Wilson. How have you been feeling since our last appointment?",
    timestamp: "2023-11-15T09:45:00",
    read: true
  },
  {
    id: 2,
    sender: "patient",
    content: "Good morning, Dr. Martinez. I've been following the new medication regimen, and my blood pressure seems more stable now.",
    timestamp: "2023-11-15T09:50:00",
    read: true
  },
  {
    id: 3,
    sender: "clinician",
    content: "That's excellent news. Have you been experiencing any side effects?",
    timestamp: "2023-11-15T09:52:00",
    read: true
  },
  {
    id: 4,
    sender: "patient",
    content: "Just mild dizziness in the mornings, but it usually goes away after breakfast.",
    timestamp: "2023-11-15T09:55:00",
    read: true
  },
  {
    id: 5,
    sender: "clinician",
    content: "That's not unusual with this medication. If it persists or gets worse, please let me know immediately. Have you been keeping track of your blood pressure readings?",
    timestamp: "2023-11-15T10:00:00",
    read: true
  },
  {
    id: 6,
    sender: "patient",
    content: "Yes, I've been recording them in the app twice daily as you recommended. The readings have been mostly between 130/85 and 140/90.",
    timestamp: "2023-11-15T10:05:00",
    read: true
  },
  {
    id: 7,
    sender: "patient",
    content: "Should I continue with the same dosage?",
    timestamp: "2023-11-15T10:06:00",
    read: true
  },
  {
    id: 8,
    sender: "clinician",
    content: "Yes, please continue with the current dosage. We're seeing progress, but I'd like to get those numbers consistently below 130/80. Remember to take the medication at the same time each day.",
    timestamp: "2023-11-15T10:15:00",
    read: true
  },
  {
    id: 9,
    sender: "clinician",
    content: "I've also looked at your recent lab results, and your cholesterol levels have improved. Keep up with the dietary changes we discussed.",
    timestamp: "2023-11-15T10:18:00",
    read: true
  },
  {
    id: 10,
    sender: "patient",
    content: "Thank you doctor, I'll take the medication as prescribed.",
    timestamp: "2023-11-15T10:23:00",
    read: false
  }
];

const ClinicianMessages = () => {
  const { toast } = useToast();
  const [selectedPatient, setSelectedPatient] = useState(patients[0]);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState(messageHistory);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.patientId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    
    const newMessage = {
      id: messages.length + 1,
      sender: "clinician",
      content: messageInput,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    setMessages([...messages, newMessage]);
    setMessageInput("");
    
    toast({
      title: "Message sent",
      description: "Your message has been sent successfully.",
      duration: 3000,
    });
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatMessageDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <AppLayout title="Messages">
      <div className="h-[calc(100vh-140px)] flex flex-col">
        <Tabs defaultValue="messages" className="flex-1">
          <div className="flex h-12 items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="messages" className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                Messages
              </TabsTrigger>
              <TabsTrigger value="teams" className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                Care Teams
              </TabsTrigger>
            </TabsList>
            <Button size="sm" variant="outline" className="flex items-center gap-1">
              <UserPlus className="h-4 w-4" />
              New Message
            </Button>
          </div>
          
          <TabsContent value="messages" className="flex-1 h-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
              <Card className="lg:col-span-1 overflow-hidden">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-lg">Patient Messages</CardTitle>
                </CardHeader>
                <div className="px-4 pb-2">
                  <Command className="rounded-lg border shadow-sm">
                    <CommandInput 
                      placeholder="Search patients..." 
                      value={searchQuery} 
                      onValueChange={setSearchQuery}
                    />
                    <CommandList>
                      <CommandEmpty>No patients found.</CommandEmpty>
                      <CommandGroup>
                        {filteredPatients.map((patient) => (
                          <CommandItem 
                            key={patient.id}
                            onSelect={() => setSelectedPatient(patient)}
                            className="flex items-center p-2 cursor-pointer"
                          >
                            <div className={`flex-1 flex items-start gap-3 ${selectedPatient.id === patient.id ? 'font-medium' : ''}`}>
                              <div className="relative">
                                <Avatar>
                                  <AvatarImage src={patient.avatar} alt={patient.name} />
                                  <AvatarFallback>
                                    {patient.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                {patient.online && (
                                  <span className="absolute bottom-0 right-0 rounded-full bg-green-500 h-2.5 w-2.5 border-2 border-white" />
                                )}
                              </div>
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-medium">{patient.name}</p>
                                  <span className="text-xs text-gray-400">{patient.timestamp}</span>
                                </div>
                                <p className="text-xs text-gray-500 line-clamp-1">
                                  {patient.patientId}
                                </p>
                                <p className="text-xs text-gray-500 line-clamp-1">
                                  {patient.lastMessage}
                                </p>
                              </div>
                              {patient.unread && (
                                <div className="ml-2 h-2 w-2 bg-blue-600 rounded-full" />
                              )}
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </div>
                <CardContent className="p-0">
                  <div className="overflow-auto max-h-[calc(100vh-350px)]">
                    {filteredPatients.map(patient => (
                      <div 
                        key={patient.id}
                        className={`p-4 cursor-pointer flex items-start gap-3 border-b hover:bg-gray-50 ${selectedPatient.id === patient.id ? 'bg-blue-50' : ''}`}
                        onClick={() => setSelectedPatient(patient)}
                      >
                        <div className="relative">
                          <Avatar>
                            <AvatarImage src={patient.avatar} alt={patient.name} />
                            <AvatarFallback>
                              {patient.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          {patient.online && (
                            <span className="absolute bottom-0 right-0 rounded-full bg-green-500 h-2.5 w-2.5 border-2 border-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{patient.name}</p>
                            <span className="text-xs text-gray-400">{patient.timestamp}</span>
                          </div>
                          <p className="text-xs text-gray-500 truncate">{patient.patientId}</p>
                          <p className="text-xs text-gray-500 truncate">{patient.lastMessage}</p>
                        </div>
                        {patient.unread && (
                          <div className="ml-2 h-2 w-2 bg-blue-600 rounded-full" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="lg:col-span-2 flex flex-col overflow-hidden">
                <CardHeader className="p-4 pb-3 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={selectedPatient.avatar} alt={selectedPatient.name} />
                          <AvatarFallback>
                            {selectedPatient.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {selectedPatient.online && (
                          <span className="absolute bottom-0 right-0 rounded-full bg-green-500 h-2.5 w-2.5 border-2 border-white" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{selectedPatient.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {selectedPatient.patientId}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500">
                          {selectedPatient.online ? 'Online' : 'Offline'}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" title="Video call">
                        <Video className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Voice call">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Patient details">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-0 flex-1 overflow-auto">
                  <div className="flex flex-col p-4 space-y-4 min-h-[400px] max-h-[calc(100vh-350px)] overflow-auto">
                    {messages.map((message, index) => {
                      const showDate = index === 0 || formatMessageDate(message.timestamp) !== formatMessageDate(messages[index - 1].timestamp);
                      
                      return (
                        <div key={message.id} className="flex flex-col">
                          {showDate && (
                            <div className="flex justify-center my-2">
                              <Badge variant="outline" className="bg-gray-100">
                                {formatMessageDate(message.timestamp)}
                              </Badge>
                            </div>
                          )}
                          <div className={`flex ${message.sender === "clinician" ? "justify-end" : "justify-start"}`}>
                            <div className={`flex gap-2 max-w-[80%] ${message.sender === "clinician" ? "flex-row-reverse" : ""}`}>
                              {message.sender === "patient" && (
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={selectedPatient.avatar} alt={selectedPatient.name} />
                                  <AvatarFallback>
                                    {selectedPatient.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                              <div className={`flex flex-col ${message.sender === "clinician" ? "items-end" : "items-start"}`}>
                                <div className={`p-3 rounded-lg text-sm ${
                                  message.sender === "clinician"
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-100 text-gray-800"
                                }`}>
                                  {message.content}
                                </div>
                                <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                                  <Clock className="h-3 w-3" />
                                  <span>{formatMessageTime(message.timestamp)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
                
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Image className="h-4 w-4" />
                    </Button>
                    <Input
                      placeholder="Type your message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button onClick={handleSendMessage}>
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="teams">
            <Card>
              <CardHeader>
                <CardTitle>Care Team Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <p>This section would provide access to care team communications and group messaging.</p>
                <div className="mt-4">
                  <Button>Create New Team</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default ClinicianMessages;
