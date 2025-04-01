
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Mic, MicOff, Video, VideoOff, Phone, MessageSquare, Users, Settings, Volume2, VolumeX } from "lucide-react";

interface VideoCallProps {
  appointmentId?: string;
}

const VideoCall = ({ appointmentId }: VideoCallProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const params = useParams();
  const id = appointmentId || params.appointmentId;
  
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [callTime, setCallTime] = useState(0);
  const [isAudioOn, setIsAudioOn] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const isVeteran = user?.role === "veteran";
  
  useEffect(() => {
    // Initialize call timer
    const timer = setInterval(() => {
      setCallTime(prev => prev + 1);
    }, 1000);
    
    // Simulate connection delay
    const connectionTimer = setTimeout(() => {
      setIsConnected(true);
      
      // Start playing the video based on user role
      if (videoRef.current) {
        videoRef.current.muted = false;
        videoRef.current.play().catch(e => console.log("Auto-play prevented:", e));
      }
      
      toast({
        title: "Connected to call",
        description: isVeteran ? "Dr. Sarah Johnson has joined the call" : "Veteran James Wilson has joined the call",
      });
    }, 3000);
    
    return () => {
      clearInterval(timer);
      clearTimeout(connectionTimer);
    };
  }, [toast, isVeteran]);
  
  const handleEndCall = () => {
    toast({
      title: "Call ended",
      description: `Call duration: ${formatTime(callTime)}`,
    });
    
    // Navigate back to appointments for veterans or patient page for clinicians
    if (isVeteran) {
      navigate('/veteran/appointments');
    } else {
      navigate('/clinician/dashboard');
    }
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
    toast({
      title: isMuted ? "Microphone enabled" : "Microphone muted",
      duration: 2000,
    });
  };
  
  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    toast({
      title: isVideoOn ? "Camera turned off" : "Camera turned on",
      duration: 2000,
    });
  };
  
  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn);
    if (videoRef.current) {
      videoRef.current.muted = !isAudioOn;
    }
    toast({
      title: isAudioOn ? "Speaker muted" : "Speaker enabled",
      duration: 2000,
    });
  };
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-screen bg-black">
      {/* Video area */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        {/* Main video */}
        <div className="w-full h-full flex items-center justify-center">
          {!isConnected ? (
            <div className="text-center text-white">
              <div className="animate-pulse mb-4">Connecting to secure telehealth session...</div>
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto animate-spin"></div>
            </div>
          ) : (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              loop
              playsInline
              src={isVeteran ? "/video/veteran-view.mp4" : "/video/doctor-view.mp4"}
            />
          )}
        </div>
        
        {/* Self view */}
        {isVideoOn && isConnected && (
          <div className="absolute bottom-4 right-4 w-48 h-36 rounded-lg overflow-hidden border-2 border-white shadow-lg">
            {/* This would be your camera view. Using a placeholder for demo */}
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <Avatar className="h-24 w-24">
                <img src={user?.avatar} alt={user?.name} />
              </Avatar>
            </div>
          </div>
        )}
        
        {/* Call time */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full">
          {formatTime(callTime)}
        </div>
      </div>
      
      {/* Controls */}
      <div className="bg-gray-900 p-4">
        <div className="flex justify-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            className={`rounded-full h-12 w-12 ${isMuted ? 'bg-red-500 text-white border-red-500 hover:bg-red-600' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
            onClick={toggleMute}
          >
            {isMuted ? <MicOff /> : <Mic />}
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className={`rounded-full h-12 w-12 ${!isVideoOn ? 'bg-red-500 text-white border-red-500 hover:bg-red-600' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
            onClick={toggleVideo}
          >
            {isVideoOn ? <Video /> : <VideoOff />}
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className={`rounded-full h-12 w-12 ${!isAudioOn ? 'bg-red-500 text-white border-red-500 hover:bg-red-600' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
            onClick={toggleAudio}
          >
            {isAudioOn ? <Volume2 /> : <VolumeX />}
          </Button>
          
          <Button
            variant="destructive"
            size="icon"
            className="rounded-full h-12 w-12"
            onClick={handleEndCall}
          >
            <Phone className="rotate-[135deg]" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-12 w-12 bg-gray-800 text-white hover:bg-gray-700"
          >
            <MessageSquare />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-12 w-12 bg-gray-800 text-white hover:bg-gray-700"
          >
            <Users />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-12 w-12 bg-gray-800 text-white hover:bg-gray-700"
          >
            <Settings />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
