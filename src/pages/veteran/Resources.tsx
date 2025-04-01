
import { useState } from "react";
import AppLayout from "@/components/layouts/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Book, 
  BookOpen, 
  Calendar, 
  CheckCircle2,
  Download, 
  ExternalLink, 
  File, 
  FileText, 
  Film, 
  Link, 
  Play, 
  Search, 
  ThumbsUp
} from "lucide-react";

const resourceCategories = [
  { id: "mental", name: "Mental Health", icon: Brain },
  { id: "physical", name: "Physical Health", icon: Activity },
  { id: "benefits", name: "VA Benefits", icon: FileText },
  { id: "wellness", name: "Wellness", icon: Heart },
  { id: "caregiving", name: "Caregiving", icon: Users },
];

// Mock data for resources
const resources = [
  {
    id: 1,
    title: "PTSD Treatment Guide",
    description: "Comprehensive information about treatment options for PTSD in veterans.",
    category: "mental",
    type: "guide",
    url: "#",
    thumbnail: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=500&q=80",
    isFavorite: true,
  },
  {
    id: 2,
    title: "Exercise Programs for Veterans",
    description: "Physical activity programs designed for veterans with mobility challenges.",
    category: "physical",
    type: "guide",
    url: "#",
    isFavorite: false,
  },
  {
    id: 3,
    title: "Understanding Your VA Benefits",
    description: "A guide to navigating and maximizing your VA health benefits.",
    category: "benefits",
    type: "document",
    url: "#",
    isFavorite: true,
  },
  {
    id: 4,
    title: "Managing Chronic Pain",
    description: "Strategies and resources for veterans dealing with chronic pain conditions.",
    category: "wellness",
    type: "video",
    url: "#",
    duration: "12:45",
    isFavorite: false,
  },
  {
    id: 5,
    title: "Support for Family Caregivers",
    description: "Resources for family members caring for veterans.",
    category: "caregiving",
    type: "link",
    url: "#",
    isFavorite: false,
  },
  {
    id: 6,
    title: "Mindfulness Meditation Practices",
    description: "Audio guides for mindfulness and meditation techniques.",
    category: "mental",
    type: "audio",
    url: "#",
    duration: "15:20",
    isFavorite: true,
  },
  {
    id: 7,
    title: "Disability Claim Process",
    description: "Step-by-step guide to filing and tracking disability claims.",
    category: "benefits",
    type: "document",
    url: "#",
    isFavorite: false,
  },
  {
    id: 8,
    title: "Nutrition for Veterans",
    description: "Healthy eating guidelines tailored for veterans' unique needs.",
    category: "wellness",
    type: "guide",
    url: "#",
    isFavorite: false,
  },
  {
    id: 9,
    title: "Accessible Home Modifications",
    description: "Information on adapting your home for improved accessibility.",
    category: "physical",
    type: "link",
    url: "#",
    isFavorite: true,
  },
];

// Import icons for resource categories
import { Activity, Brain, FileText as FileIcon, Heart, Users } from "lucide-react";

const VeteranResources = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<number[]>(resources.filter(r => r.isFavorite).map(r => r.id));
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<number | null>(null);

  // Filter resources based on search query and selected category
  const filteredResources = resources.filter(resource => 
    (searchQuery === "" || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      resource.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (selectedCategory === null || resource.category === selectedCategory)
  );

  const favoriteResources = resources.filter(resource => favorites.includes(resource.id));

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const getResourceIcon = (type: string) => {
    switch(type) {
      case "document":
        return <FileText className="h-5 w-5 text-blue-500" />;
      case "video":
        return <Film className="h-5 w-5 text-red-500" />;
      case "audio":
        return <Play className="h-5 w-5 text-green-500" />;
      case "link":
        return <Link className="h-5 w-5 text-purple-500" />;
      case "guide":
      default:
        return <Book className="h-5 w-5 text-amber-500" />;
    }
  };

  return (
    <AppLayout title="Resources">
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Health Resources</CardTitle>
            <CardDescription>Educational materials and self-care guides</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Search and filter */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input 
                    type="search" 
                    placeholder="Search resources..." 
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center space-x-2 overflow-x-auto py-1">
                  <Button 
                    variant={selectedCategory === null ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setSelectedCategory(null)}
                  >
                    All
                  </Button>
                  
                  {resourceCategories.map(category => {
                    const Icon = category.icon;
                    return (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "outline"}
                        size="sm"
                        className="whitespace-nowrap"
                        onClick={() => setSelectedCategory(category.id === selectedCategory ? null : category.id)}
                      >
                        <Icon className="mr-1 h-4 w-4" />
                        {category.name}
                      </Button>
                    );
                  })}
                </div>
              </div>
              
              {/* Resources tabs */}
              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">All Resources</TabsTrigger>
                  <TabsTrigger value="favorites">Favorites</TabsTrigger>
                  <TabsTrigger value="recent">Recently Viewed</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {filteredResources.length > 0 ? (
                      filteredResources.map(resource => (
                        <Card key={resource.id} className="overflow-hidden">
                          {resource.thumbnail && (
                            <div className="h-40 overflow-hidden">
                              <img 
                                src={resource.thumbnail} 
                                alt={resource.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <CardHeader className={resource.thumbnail ? "pt-3" : ""}>
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-2">
                                {getResourceIcon(resource.type)}
                                <Badge variant="outline">
                                  {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                                </Badge>
                              </div>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => toggleFavorite(resource.id)}
                              >
                                <ThumbsUp 
                                  className={`h-4 w-4 ${favorites.includes(resource.id) ? 'fill-blue-500 text-blue-500' : ''}`} 
                                />
                              </Button>
                            </div>
                            <CardTitle className="text-lg">{resource.title}</CardTitle>
                            <CardDescription>{resource.description}</CardDescription>
                          </CardHeader>
                          <CardFooter>
                            {resource.type === 'video' ? (
                              <Button
                                className="w-full"
                                onClick={() => {
                                  setSelectedResource(resource.id);
                                  setVideoDialogOpen(true);
                                }}
                              >
                                <Play className="mr-2 h-4 w-4" />
                                Watch Video
                                {resource.duration && <span className="ml-1">({resource.duration})</span>}
                              </Button>
                            ) : resource.type === 'document' ? (
                              <Button className="w-full">
                                <Download className="mr-2 h-4 w-4" />
                                Download PDF
                              </Button>
                            ) : (
                              <Button className="w-full">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                View Resource
                              </Button>
                            )}
                          </CardFooter>
                        </Card>
                      ))
                    ) : (
                      <div className="col-span-full p-8 text-center">
                        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <h3 className="text-lg font-medium mb-1">No resources found</h3>
                        <p className="text-sm text-muted-foreground">
                          Try adjusting your search or filters to find what you're looking for.
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="favorites">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {favoriteResources.length > 0 ? (
                      favoriteResources.map(resource => (
                        <Card key={resource.id} className="overflow-hidden">
                          {resource.thumbnail && (
                            <div className="h-40 overflow-hidden">
                              <img 
                                src={resource.thumbnail} 
                                alt={resource.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <CardHeader className={resource.thumbnail ? "pt-3" : ""}>
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-2">
                                {getResourceIcon(resource.type)}
                                <Badge variant="outline">
                                  {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                                </Badge>
                              </div>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => toggleFavorite(resource.id)}
                              >
                                <ThumbsUp 
                                  className="h-4 w-4 fill-blue-500 text-blue-500" 
                                />
                              </Button>
                            </div>
                            <CardTitle className="text-lg">{resource.title}</CardTitle>
                            <CardDescription>{resource.description}</CardDescription>
                          </CardHeader>
                          <CardFooter>
                            {resource.type === 'video' ? (
                              <Button 
                                className="w-full"
                                onClick={() => {
                                  setSelectedResource(resource.id);
                                  setVideoDialogOpen(true);
                                }}
                              >
                                <Play className="mr-2 h-4 w-4" />
                                Watch Video
                                {resource.duration && <span className="ml-1">({resource.duration})</span>}
                              </Button>
                            ) : resource.type === 'document' ? (
                              <Button className="w-full">
                                <Download className="mr-2 h-4 w-4" />
                                Download PDF
                              </Button>
                            ) : (
                              <Button className="w-full">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                View Resource
                              </Button>
                            )}
                          </CardFooter>
                        </Card>
                      ))
                    ) : (
                      <div className="col-span-full p-8 text-center">
                        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <h3 className="text-lg font-medium mb-1">No favorites yet</h3>
                        <p className="text-sm text-muted-foreground">
                          Click the thumbs up icon on resources you want to save for quick access.
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="recent">
                  <div className="p-8 text-center">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <h3 className="text-lg font-medium mb-1">No recently viewed resources</h3>
                    <p className="text-sm text-muted-foreground">
                      Resources you view will appear here for easy access.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
        
        {/* Featured resources section */}
        <Card>
          <CardHeader>
            <CardTitle>Recommended for You</CardTitle>
            <CardDescription>
              Resources tailored to your health conditions and interests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/lovable-uploads/25ca233b-4853-4a14-a3fb-3031eb713a4d.png" />
                    <AvatarFallback>AVA</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">AVA Recommends</div>
                    <div className="text-xs text-muted-foreground">Based on your health data</div>
                  </div>
                </div>
                <h3 className="font-medium">PTSD Coping Strategies</h3>
                <p className="text-sm text-muted-foreground my-2">
                  New techniques for managing stress triggers and anxiety.
                </p>
                <Button size="sm" className="mt-2 w-full">View Resource</Button>
              </div>
              
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                <div className="flex items-start gap-3 mb-3">
                  <div className="bg-amber-100 p-2 rounded">
                    <FileText className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <div className="font-semibold">VA Benefit Updates</div>
                    <div className="text-xs text-muted-foreground">New information</div>
                  </div>
                </div>
                <h3 className="font-medium">2023 Benefits Guide</h3>
                <p className="text-sm text-muted-foreground my-2">
                  Important updates to your VA health benefits and coverage.
                </p>
                <Button size="sm" variant="outline" className="mt-2 w-full">Download PDF</Button>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <div className="flex items-start gap-3 mb-3">
                  <div className="bg-green-100 p-2 rounded">
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Upcoming Webinar</div>
                    <div className="text-xs text-muted-foreground">Next Thursday, 2:00 PM</div>
                  </div>
                </div>
                <h3 className="font-medium">Managing Chronic Pain</h3>
                <p className="text-sm text-muted-foreground my-2">
                  Join Dr. Lisa Patel for a live webinar on chronic pain management techniques.
                </p>
                <Button size="sm" className="mt-2 w-full">Register Now</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Video Dialog */}
      <Dialog open={videoDialogOpen} onOpenChange={setVideoDialogOpen}>
        <DialogContent className="sm:max-w-[720px] max-h-[90vh] p-0">
          <div className="aspect-video bg-black flex items-center justify-center">
            <div className="text-white text-center p-8">
              <Play className="h-16 w-16 mx-auto mb-4" />
              <p className="text-lg">
                Video content would play here.
              </p>
            </div>
          </div>
          
          <div className="p-6">
            <DialogHeader>
              <DialogTitle>
                {resources.find(r => r.id === selectedResource)?.title}
              </DialogTitle>
              <DialogDescription>
                {resources.find(r => r.id === selectedResource)?.description}
              </DialogDescription>
            </DialogHeader>
            
            <div className="mt-4 flex justify-between">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              
              <Button onClick={() => setVideoDialogOpen(false)}>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Mark as Complete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default VeteranResources;
