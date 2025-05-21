
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Video, Plus, User, History } from "lucide-react";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

// Sample mock data - in a real app, this would come from a backend
interface Echo {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  createdAt: string;
}

interface Call {
  id: string;
  echoName: string;
  duration: string;
  date: string;
  previewImageUrl: string;
}

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [echoes, setEchoes] = useState<Echo[]>([]);
  const [calls, setCalls] = useState<Call[]>([]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      toast.error("Please login to access your dashboard");
    }
  }, [isAuthenticated, navigate]);

  // Get user data
  useEffect(() => {
    if (isAuthenticated) {
      // Mock data - in a real app, fetch data from backend
      setEchoes([
        {
          id: "1",
          name: "Grandma Echo",
          description: "A warm and caring echo of my grandmother",
          imageUrl: "/placeholder.svg",
          createdAt: "2023-05-10"
        },
        {
          id: "2",
          name: "Mentor Echo",
          description: "Professional mentor with career advice",
          imageUrl: "/placeholder.svg",
          createdAt: "2023-05-15"
        }
      ]);
      
      setCalls([
        {
          id: "1",
          echoName: "Grandma Echo",
          duration: "25 minutes",
          date: "2023-05-20",
          previewImageUrl: "/placeholder.svg"
        },
        {
          id: "2",
          echoName: "Mentor Echo",
          duration: "45 minutes",
          date: "2023-05-22",
          previewImageUrl: "/placeholder.svg"
        }
      ]);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow py-16 px-4 pt-24">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gradient mb-2">Welcome, {user?.name}</h1>
            <p className="text-foreground/60">Manage your echoes and past conversations</p>
          </div>

          <Tabs defaultValue="echoes" className="space-y-8">
            <TabsList className="mb-6">
              <TabsTrigger value="echoes" className="flex gap-2">
                <User className="h-4 w-4" />
                My Echoes
              </TabsTrigger>
              <TabsTrigger value="calls" className="flex gap-2">
                <History className="h-4 w-4" />
                Call History
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="echoes">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link to="/create-echo">
                  <Card className="h-full border-dashed border-2 border-echoes-purple/30 hover:border-echoes-purple/70 transition-colors bg-echoes-light/5">
                    <CardContent className="h-64 flex flex-col items-center justify-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-echoes-purple/10 flex items-center justify-center">
                        <Plus className="h-8 w-8 text-echoes-purple" />
                      </div>
                      <h3 className="text-xl font-medium text-center">Create New Echo</h3>
                      <p className="text-sm text-foreground/60 text-center">Design a new digital companion</p>
                    </CardContent>
                  </Card>
                </Link>
                
                {echoes.map(echo => (
                  <Card key={echo.id} className="h-full">
                    <CardHeader className="pb-2">
                      <div className="w-16 h-16 rounded-full overflow-hidden mb-2">
                        <img src={echo.imageUrl} alt={echo.name} className="w-full h-full object-cover" />
                      </div>
                      <CardTitle>{echo.name}</CardTitle>
                      <CardDescription className="text-foreground/60">
                        Created on {new Date(echo.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-3">{echo.description}</p>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="text-echoes-purple border-echoes-purple flex-1"
                        onClick={() => navigate(`/video-call?echo=${echo.id}`)}
                      >
                        <Video className="mr-2 h-4 w-4" />
                        Call
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Edit
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="calls">
              {calls.length === 0 ? (
                <div className="text-center py-20 bg-echoes-light/5 rounded-lg">
                  <h3 className="text-xl font-medium mb-2">No calls yet</h3>
                  <p className="text-foreground/60 mb-6">Make your first call to an echo to see history</p>
                  <Button onClick={() => navigate("/create-echo")} className="bg-echoes-purple hover:bg-echoes-accent">
                    Create Your First Echo
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {calls.map(call => (
                    <Card key={call.id} className="overflow-hidden">
                      <div className="h-40 overflow-hidden">
                        <img src={call.previewImageUrl} alt={call.echoName} className="w-full h-full object-cover" />
                      </div>
                      <CardHeader>
                        <CardTitle>{call.echoName}</CardTitle>
                        <CardDescription>
                          {new Date(call.date).toLocaleDateString()} • {call.duration}
                        </CardDescription>
                      </CardHeader>
                      <CardFooter>
                        <Button variant="outline" className="w-full">
                          View Recording
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
