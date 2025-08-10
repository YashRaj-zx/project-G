
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Video, Plus, User, History } from "lucide-react";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import Gloomie from "@/components/Gloomie";
import { Link } from "react-router-dom";

// Types for our data
interface Echo {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  voiceType: string;
  voiceId: string;
  language: string;
  createdAt: string;
}

interface Call {
  id: string;
  echoId: string;
  echoName: string;
  duration: string;
  date: string;
  previewImageUrl: string;
}

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [echoes, setEchoes] = useState<Echo[]>([]);
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [tourActive, setTourActive] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  // Load data from localStorage based on user ID
  useEffect(() => {
    setLoading(true);
    
    if (user) {
      // Get user's echoes
      const storedEchoes = localStorage.getItem(`echoes_${user.id}`);
      if (storedEchoes) {
        setEchoes(JSON.parse(storedEchoes));
      }
      
      // Get user's call history
      const storedCalls = localStorage.getItem(`calls_${user.id}`);
      if (storedCalls) {
        setCalls(JSON.parse(storedCalls));
      }
    }

    // Check if tour has been completed
    const tourCompleted = localStorage.getItem('gloomieTourCompleted');
    if (!tourCompleted) {
      // Start tour after a delay if not completed
      const timer = setTimeout(() => {
        setTourActive(true);
      }, 1000); // 1 second delay
      return () => clearTimeout(timer); // Cleanup the timer
    }

    
    setLoading(false);
  }, [user]);

  const handleStartCall = (echoId: string) => {
    navigate(`/video-call?echo=${echoId}`);
  };

  const handleSignOut = async () => {
    await logout();
    navigate("/login");
    toast.success("Successfully signed out");
  };

  return (
    <div className="relative min-h-screen flex flex-col"> {/* Added relative positioning for Gloomie */}
      {tourActive && <Gloomie />} {/* Render Gloomie conditionally */}
      <NavBar />
      <main className="flex-grow py-16 px-4 pt-24">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gradient mb-1">Welcome, {user?.name || 'Guest'}</h1>
              {user?.email && (
                <p className="text-foreground/60 text-sm mb-2">{user.email}</p>
              )}
              <p className="text-foreground/60 text-base">
                Manage your echoes and past conversations
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="border-echoes-purple text-echoes-purple hover:bg-echoes-light/50"
            >
              Sign Out
            </Button>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-96">
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

                {loading ? (
                  <Card className="h-64 flex items-center justify-center">
                    <p>Loading your echoes...</p>
                  </Card>
                ) : echoes.length === 0 && !loading ? (
                  <Card className="h-64 flex items-center justify-center col-span-2">
                    <CardContent className="flex flex-col items-center justify-center text-center">
                      <p className="text-center text-muted-foreground mb-4">You haven't created any echoes yet.</p>
                      <Link to="/create-echo">
                        <Button className="bg-echoes-purple hover:bg-echoes-accent">
                          Create Your First Echo
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  echoes.map(echo => (
                    <Card key={echo.id} className="h-full">
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-4 mb-2">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src="/ghost-icon.png" alt={echo.name} />
                            <AvatarFallback>{echo.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        </div>
                        <CardTitle>{echo.name}</CardTitle>
                        <CardDescription className="text-foreground/60">
                          Created on {new Date(echo.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="line-clamp-3">{echo.description}</p>
                        <div className="mt-2 text-sm">
                          <span className="font-medium">Language:</span> {echo.language}
                        </div>
                      </CardContent>
                      <CardFooter className="flex gap-2">
                        <Button
                          variant="outline"
                          className="text-echoes-purple border-echoes-purple flex-1"
                          onClick={() => handleStartCall(echo.id)}
                          >
                          <Video className="mr-2 h-4 w-4" />
                          Call
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => navigate(`/edit-echo/${echo.id}`)}
                        >
                          Edit
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>

            </TabsContent>
            
            <TabsContent value="calls">
              {loading ? (
                <Card className="h-64 flex items-center justify-center">
                  <p>Loading call history...</p>
                </Card>
              ) : calls.length === 0 ? (
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
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => navigate(`/call-recording/${call.id}`)}
                        >
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
