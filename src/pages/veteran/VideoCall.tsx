
import VideoCall from "@/components/VideoCall";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const VeteranVideoCall = () => {
  const params = useParams();
  
  useEffect(() => {
    // Set full screen mode for better experience
    document.body.classList.add('video-call-active');
    
    return () => {
      document.body.classList.remove('video-call-active');
    };
  }, []);
  
  return <VideoCall appointmentId={params.appointmentId} />;
};

export default VeteranVideoCall;
