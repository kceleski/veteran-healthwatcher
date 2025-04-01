
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import AppLayout from "@/components/layouts/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getMessagesForVeteran, sendMessage, markMessageAsRead } from "@/lib/mockAPI";
import { 
  AlertCircle, 
  CheckCircle2, 
  ChevronLeft,
  Inbox,
  Mail,
  MessageSquare, 
  PaperPlane,
  Search, 
  Send, 
  User, 
  Users 
} from "lucide-react";

const VeteranMessages = () => {
  const { toast } = useToast();
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessageOpen, setNewMessageOpen] = useState(false);
  const [messageSubject, setMessageSubject] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [recipient, setRecipient] = useState("");
  const [isSending, setIsSending] = useState(false);

  const { data: messages, isLoading, isError, refetch } = useQuery({
    queryKey: ['messages'],
    queryFn: () => getMessagesForVeteran('v-001')
  });

  const handleMarkAsRead = async (messageId: string) => {
    try {
      await markMessageAsRead(messageId);
      refetch();
    } catch (error) {
      toast({
        title: "Error updating message",
        description: "There was a problem marking the message as read.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleSendMessage = async () => {
    if (!recipient || !messageSubject || !messageContent) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields before sending your message.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setIsSending(true);
    
    try {
      await sendMessage({
        sender: 'James Wilson',
        senderRole: 'veteran',
        recipient,
        subject: messageSubject,
        content: messageContent,
        priority: 'normal'
      });
      
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully.",
        duration: 3000,
      });
      
      setNewMessageOpen(false);
      setMessageSubject("");
      setMessageContent("");
      setRecipient("");
      refetch();
    } catch (error) {
      toast({
        title: "Error sending message",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsSending(false);
    }
  };

  const filteredMessages = messages?.filter(msg =>
    msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.sender.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadCount = messages?.filter(msg => !msg.isRead).length || 0;
  const urgentCount = messages?.filter(msg => msg.priority === 'urgent').length || 0;

  const selectedMessageData = messages?.find(m => m.id === selectedMessage);

  const providers = [
    "Dr. Sarah Johnson",
    "Dr. Michael Chen",
    "Dr. Lisa Patel",
    "Mental Health Team",
    "Primary Care Team"
  ];

  return (
    <AppLayout title="Messages">
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle>Secure Messaging</CardTitle>
                <CardDescription>
                  Communicate securely with your healthcare providers
                </CardDescription>
              </div>
              
              <Button onClick={() => setNewMessageOpen(true)}>
                <MessageSquare className="mr-2 h-4 w-4" />
                New Message
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left sidebar with message list */}
              <div className={`w-full md:w-80 ${selectedMessage ? 'hidden md:block' : ''}`}>
                <div className="mb-4 flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input 
                      type="search" 
                      placeholder="Search messages..." 
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex overflow-x-auto space-x-2 py-2">
                  <Badge className="whitespace-nowrap">
                    All ({messages?.length || 0})
                  </Badge>
                  <Badge variant="outline" className="whitespace-nowrap">
                    Unread ({unreadCount})
                  </Badge>
                  <Badge variant="outline" className="whitespace-nowrap">
                    Urgent ({urgentCount})
                  </Badge>
                </div>
                
                <div className="mt-4 space-y-2">
                  {isLoading ? (
                    Array(5).fill(0).map((_, i) => (
                      <div key={i} className="p-3 border rounded-md flex gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                      </div>
                    ))
                  ) : isError ? (
                    <div className="p-4 text-center">
                      <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-3" />
                      <h3 className="text-lg font-medium mb-1">Unable to load messages</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        There was an error loading your messages.
                      </p>
                      <Button onClick={() => refetch()}>Try Again</Button>
                    </div>
                  ) : filteredMessages && filteredMessages.length > 0 ? (
                    filteredMessages.map(message => (
                      <div 
                        key={message.id}
                        className={`p-3 border rounded-md cursor-pointer transition-colors hover:bg-gray-50
                          ${!message.isRead ? 'border-blue-200 bg-blue-50' : ''}
                          ${selectedMessage === message.id ? 'border-blue-500 bg-blue-50' : ''}
                        `}
                        onClick={() => {
                          setSelectedMessage(message.id);
                          if (!message.isRead) {
                            handleMarkAsRead(message.id);
                          }
                        }}
                      >
                        <div className="flex gap-3">
                          <Avatar>
                            {message.senderRole === 'system' ? (
                              <AvatarImage src="/lovable-uploads/25ca233b-4853-4a14-a3fb-3031eb713a4d.png" />
                            ) : null}
                            <AvatarFallback>
                              {message.sender.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div className="font-semibold truncate">
                                {message.sender}
                              </div>
                              <div className="text-xs text-muted-foreground whitespace-nowrap">
                                {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                              </div>
                            </div>
                            
                            <div className="text-sm font-medium truncate">
                              {message.subject}
                            </div>
                            
                            <div className="text-xs text-muted-foreground truncate">
                              {message.content}
                            </div>
                            
                            <div className="mt-1 flex items-center gap-2">
                              {message.priority === 'urgent' && (
                                <Badge variant="destructive" className="text-[10px] px-1 py-0">Urgent</Badge>
                              )}
                              {!message.isRead && (
                                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center border rounded-md">
                      <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <h3 className="text-lg font-medium mb-1">No messages found</h3>
                      <p className="text-sm text-muted-foreground">
                        No messages match your search criteria.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Right side with message content */}
              <div className={`flex-1 ${!selectedMessage ? 'hidden md:block' : ''}`}>
                {selectedMessage ? (
                  selectedMessageData ? (
                    <div>
                      <div className="mb-4 flex items-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="md:hidden"
                          onClick={() => setSelectedMessage(null)}
                        >
                          <ChevronLeft className="h-4 w-4 mr-1" />
                          Back
                        </Button>
                      </div>
                      
                      <div className="border rounded-md p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              {selectedMessageData.senderRole === 'system' ? (
                                <AvatarImage src="/lovable-uploads/25ca233b-4853-4a14-a3fb-3031eb713a4d.png" />
                              ) : null}
                              <AvatarFallback>
                                {selectedMessageData.sender.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div>
                              <div className="font-semibold">{selectedMessageData.sender}</div>
                              <div className="text-sm text-muted-foreground">
                                To: {selectedMessageData.recipient}
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(selectedMessageData.timestamp), { addSuffix: true })}
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <h3 className="text-xl font-semibold mb-2">{selectedMessageData.subject}</h3>
                          <div className="prose prose-sm max-w-none">
                            <p>{selectedMessageData.content}</p>
                          </div>
                        </div>
                        
                        <div className="pt-4 border-t mt-6">
                          <Button 
                            onClick={() => {
                              setNewMessageOpen(true);
                              setRecipient(selectedMessageData.sender);
                              setMessageSubject(`Re: ${selectedMessageData.subject}`);
                            }}
                            className="gap-2"
                          >
                            <Send className="h-4 w-4" />
                            Reply
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center border rounded-md">
                      <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-3" />
                      <h3 className="text-lg font-medium mb-1">Message not found</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        The selected message could not be found.
                      </p>
                      <Button onClick={() => setSelectedMessage(null)}>Back to Messages</Button>
                    </div>
                  )
                ) : (
                  <div className="h-full flex items-center justify-center text-center border rounded-md p-8">
                    <div>
                      <Inbox className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <h3 className="text-lg font-medium mb-1">Select a Message</h3>
                      <p className="text-sm text-muted-foreground">
                        Choose a message from the list to view its contents.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* New Message Dialog */}
      <Dialog open={newMessageOpen} onOpenChange={setNewMessageOpen}>
        <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Message</DialogTitle>
            <DialogDescription>
              Send a secure message to your healthcare team. Urgent medical concerns should not be handled through messaging.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="recipient" className="text-sm font-medium">To:</label>
              <select
                id="recipient"
                className="w-full p-2 border rounded-md"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              >
                <option value="">Select recipient...</option>
                {providers.map(provider => (
                  <option key={provider} value={provider}>{provider}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">Subject:</label>
              <Input 
                id="subject"
                value={messageSubject} 
                onChange={(e) => setMessageSubject(e.target.value)}
                placeholder="Enter subject..."
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">Message:</label>
              <Textarea 
                id="message"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="Type your message here..."
                rows={8}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewMessageOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendMessage} disabled={isSending}>
              {isSending ? (
                "Sending..."
              ) : (
                <>
                  <PaperPlane className="mr-2 h-4 w-4" />
                  Send Message
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default VeteranMessages;
