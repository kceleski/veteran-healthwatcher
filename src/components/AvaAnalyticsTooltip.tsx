
import React from "react";
import { 
  HoverCard, 
  HoverCardContent, 
  HoverCardTrigger 
} from "@/components/ui/hover-card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface AnalyticsTooltipProps {
  title: string;
  content: React.ReactNode;
  variant?: "hover" | "click";
}

const AvaAnalyticsTooltip = ({ 
  title, 
  content, 
  variant = "hover" 
}: AnalyticsTooltipProps) => {
  if (variant === "hover") {
    return (
      <HoverCard>
        <HoverCardTrigger asChild>
          <div className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 cursor-help">
            {title}
            <Info className="h-4 w-4" />
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="w-80 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/dfe0a809-3eca-4b8a-a9c9-8cfbb42dd399.png" 
                alt="AVA AI" 
                className="w-6 h-6 rounded-full" 
              />
              <span className="font-medium">AVA Health Insight</span>
            </div>
            <div className="text-sm">{content}</div>
          </div>
        </HoverCardContent>
      </HoverCard>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 cursor-help">
            {title}
            <Info className="h-4 w-4" />
          </div>
        </TooltipTrigger>
        <TooltipContent className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 max-w-xs">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/dfe0a809-3eca-4b8a-a9c9-8cfbb42dd399.png" 
                alt="AVA AI" 
                className="w-5 h-5 rounded-full" 
              />
              <span className="font-medium text-xs">AVA Health Insight</span>
            </div>
            <div className="text-xs">{content}</div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AvaAnalyticsTooltip;
