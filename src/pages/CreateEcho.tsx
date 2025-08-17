
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import { User, Upload } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VoiceCloner from "@/components/VoiceCloner";
import Gloomie from "@/components/Gloomie";

// Form validation schema
const echoFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }).max(500, { message: "Description cannot exceed 500 characters." }),
  voiceType: z.string().min(1, { message: "Please select a voice type." }),
  voiceId: z.string().min(1, { message: "Please select a voice." }),
  personalityTraits: z.string().min(5, { message: "Please describe some personality traits." }),
  memories: z.string().optional(),
});

// Voice options by language
const voiceOptions = {
  english: [
    { id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah" },
    { id: "CwhRBWXzGAHq8TQ4Fs17", name: "Roger" },
    { id: "IKne3meq5aSn9XLyUdCD", name: "Charlie" },
    { id: "JBFqnCBsd6RMkjVDRZzb", name: "George" },
  ],
  hindi: [
    { id: "hindi-voice-1", name: "Priya" },
    { id: "hindi-voice-2", name: "Raj" },
  ],
  telugu: [
    { id: "telugu-voice-1", name: "Anu" },
    { id: "telugu-voice-2", name: "Ravi" },
  ],
  urdu: [
    { id: "urdu-voice-1", name: "Ayesha" },
    { id: "urdu-voice-2", name: "Farhan" },
  ],
};

const CreateEcho = () => {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("english");
  const [availableVoices, setAvailableVoices] = useState(voiceOptions.english);
  const [activeTab, setActiveTab] = useState<string>("predefined");
  const [clonedVoice, setClonedVoice] = useState<{id: string, name: string} | null>(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please sign in to create your Echo");
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const form = useForm<z.infer<typeof echoFormSchema>>({
    resolver: zodResolver(echoFormSchema),
    defaultValues: {
      name: "",
      description: "",
      voiceType: "",
      voiceId: "",
      personalityTraits: "",
      memories: "",
    },
  });

  // Update available voices when language changes
  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    setAvailableVoices(voiceOptions[language as keyof typeof voiceOptions]);
    form.setValue("voiceId", ""); // Reset voice selection
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setPhotoFile(file);
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreview(previewUrl);
    }
  };

  // Handle when a voice is cloned
  const handleVoiceCloned = (voiceId: string, name: string) => {
    setClonedVoice({ id: voiceId, name });
    form.setValue("voiceId", voiceId);
    toast.success(`Voice "${name}" cloned successfully!`);
    // Switch to predefined tab
    setActiveTab("predefined");
  };

  const onSubmit = (data: z.infer<typeof echoFormSchema>) => {
    if (!photoFile) {
      toast.error("Please upload a photo for your Echo");
      return;
    }

    // In a real app, we would send this data to a backend
    console.log("Form data:", data);
    console.log("Photo file:", photoFile);
    console.log("Cloned voice:", clonedVoice);
    
    // Save echo data to localStorage for the dashboard
    const userId = JSON.parse(localStorage.getItem('user') || '{}').id;
    const existingEchoes = JSON.parse(localStorage.getItem(`echoes_${userId}`) || '[]');
    
    const newEcho = {
      id: Date.now().toString(),
      name: data.name,
      description: data.description,
      imageUrl: photoPreview || '/placeholder.svg',
      voiceType: data.voiceType,
      voiceId: data.voiceId,
      language: selectedLanguage,
      personalityTraits: data.personalityTraits,
      memories: data.memories || "",
      createdAt: new Date().toISOString(),
      isClonedVoice: !!clonedVoice,
      clonedVoiceName: clonedVoice?.name || null
    };
    
    localStorage.setItem(`echoes_${userId}`, JSON.stringify([...existingEchoes, newEcho]));

    toast.success("Echo created successfully!");
    navigate("/dashboard"); // Redirect to the dashboard page with the new echo
  };

  return (
    <><div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gradient mb-3">Create Your Echo</h1>
            <p className="text-foreground/60 max-w-xl mx-auto">
              Design your digital companion by providing details about their appearance,
              personality, and memories to make your Echo uniquely yours.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Photo Upload Column */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Appearance</h2>
                  <div className="flex flex-col items-center space-y-4">
                    <div
                      className="w-48 h-48 rounded-full overflow-hidden border-2 border-dashed border-echoes-purple/50 flex items-center justify-center bg-echoes-purple/5"
                    >
                      {photoPreview ? (
                        <img
                          src={photoPreview}
                          alt="Echo preview"
                          className="w-full h-full object-cover" />
                      ) : (
                        <User className="h-16 w-16 text-echoes-purple/40" />
                      )}
                    </div>

                    <Label
                      htmlFor="photo-upload"
                      className="cursor-pointer bg-echoes-purple/10 hover:bg-echoes-purple/20 text-echoes-purple px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
                    >
                      <Upload className="h-4 w-4" />
                      Upload Photo
                    </Label>
                    <Input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoChange} />
                    <FormDescription className="text-center">
                      Upload a clear photo for your Echo's appearance. We'll generate a human-like avatar that can communicate virtually.
                    </FormDescription>
                  </div>
                </div>

                {/* Form Fields Column */}
                <div className="md:col-span-2 space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Echo Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter a name for your Echo" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is how you'll refer to your Echo during conversations.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )} />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Voice Selection</h3>

                    <Tabs defaultValue="predefined" value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="grid grid-cols-2 mb-4">
                        <TabsTrigger value="predefined">Predefined Voices</TabsTrigger>
                        <TabsTrigger value="clone">Clone a Voice</TabsTrigger>
                      </TabsList>

                      <TabsContent value="predefined" className="space-y-4">
                        <div className="space-y-3">
                          <Label>Select Language</Label>
                          <RadioGroup
                            defaultValue="english"
                            className="grid grid-cols-2 gap-2 sm:grid-cols-4"
                            onValueChange={handleLanguageChange}
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="english" id="english" />
                              <Label htmlFor="english">English</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="hindi" id="hindi" />
                              <Label htmlFor="hindi">Hindi</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="telugu" id="telugu" />
                              <Label htmlFor="telugu">Telugu</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="urdu" id="urdu" />
                              <Label htmlFor="urdu">Urdu</Label>
                            </div>
                          </RadioGroup>
                        </div>

                        <FormField
                          control={form.control}
                          name="voiceType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Voice Type</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a voice type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="warm">Warm & Friendly</SelectItem>
                                  <SelectItem value="authoritative">Authoritative</SelectItem>
                                  <SelectItem value="soothing">Calm & Soothing</SelectItem>
                                  <SelectItem value="energetic">Energetic & Upbeat</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                How would you like your Echo to sound?
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )} />

                        <FormField
                          control={form.control}
                          name="voiceId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Voice Selection</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder={clonedVoice ? clonedVoice.name : "Select a voice"} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {clonedVoice && (
                                    <SelectItem value={clonedVoice.id} className="font-medium text-echoes-purple">
                                      {clonedVoice.name} (Cloned)
                                    </SelectItem>
                                  )}
                                  <SelectItem value="divider" disabled className="py-0 my-1">
                                    <hr className="border-t border-gray-200" />
                                  </SelectItem>
                                  {availableVoices.map((voice) => (
                                    <SelectItem key={voice.id} value={voice.id}>
                                      {voice.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Choose a specific voice for your Echo.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )} />
                      </TabsContent>

                      <TabsContent value="clone">
                        <VoiceCloner onVoiceCloned={handleVoiceCloned} />
                      </TabsContent>
                    </Tabs>
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your Echo in detail..."
                            className="resize-none min-h-[100px]"
                            {...field} />
                        </FormControl>
                        <FormDescription>
                          Provide details about your Echo's identity, background, and purpose.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )} />

                  <FormField
                    control={form.control}
                    name="personalityTraits"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Personality Traits</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe personality traits of your Echo..."
                            className="resize-none"
                            {...field} />
                        </FormControl>
                        <FormDescription>
                          Example: compassionate, witty, thoughtful, direct
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )} />

                  <FormField
                    control={form.control}
                    name="memories"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Shared Memories (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Add specific memories you'd like your Echo to remember..."
                            className="resize-none"
                            {...field} />
                        </FormControl>
                        <FormDescription>
                          Include important events, places, or people that your Echo should know about.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )} />
                </div>
              </div>

              <div className="flex justify-center pt-6">
                <Button
                  type="submit"
                  className="bg-echoes-purple hover:bg-echoes-accent text-white px-8 py-2"
                >
                  Create My Echo
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </main>
      <Footer />
    </div><Gloomie /></>
  );
};

export default CreateEcho;
