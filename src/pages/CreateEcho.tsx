
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
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import { User, Upload } from "lucide-react";

// Form validation schema
const echoFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }).max(500, { message: "Description cannot exceed 500 characters." }),
  voiceType: z.string().min(1, { message: "Please select a voice type." }),
  personalityTraits: z.string().min(5, { message: "Please describe some personality traits." }),
  memories: z.string().optional(),
});

const CreateEcho = () => {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof echoFormSchema>>({
    resolver: zodResolver(echoFormSchema),
    defaultValues: {
      name: "",
      description: "",
      voiceType: "",
      personalityTraits: "",
      memories: "",
    },
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setPhotoFile(file);
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreview(previewUrl);
    }
  };

  const onSubmit = (data: z.infer<typeof echoFormSchema>) => {
    if (!photoFile) {
      toast.error("Please upload a photo for your Echo");
      return;
    }

    // In a real app, we would send this data to a backend
    console.log("Form data:", data);
    console.log("Photo file:", photoFile);

    toast.success("Echo created successfully!");
    navigate("/video-call"); // Redirect to the video call page with the new echo
  };

  return (
    <div className="min-h-screen flex flex-col">
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
                          className="w-full h-full object-cover"
                        />
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
                      onChange={handlePhotoChange} 
                    />
                    <FormDescription className="text-center">
                      Upload a clear photo for your Echo's appearance.
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
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="voiceType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Voice Type</FormLabel>
                        <FormControl>
                          <select 
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                          >
                            <option value="">Select a voice type</option>
                            <option value="warm">Warm & Friendly</option>
                            <option value="authoritative">Authoritative</option>
                            <option value="soothing">Calm & Soothing</option>
                            <option value="energetic">Energetic & Upbeat</option>
                          </select>
                        </FormControl>
                        <FormDescription>
                          How would you like your Echo to sound?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Provide details about your Echo's identity, background, and purpose.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Example: compassionate, witty, thoughtful, direct
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Include important events, places, or people that your Echo should know about.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
    </div>
  );
};

export default CreateEcho;
