
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow py-32 flex items-center">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 text-gradient">404</h1>
          <p className="text-xl md:text-2xl text-foreground/80 mb-12">
            The page you're looking for has traveled beyond our reach.
          </p>
          <Link to="/">
            <Button className="bg-echoes-purple hover:bg-echoes-accent text-white">
              Return Home
            </Button>
          </Link>
          <div className="mt-16">
            <div className="w-64 h-64 mx-auto rounded-full bg-echoes-purple/10 flex items-center justify-center">
              <div className="w-40 h-40 rounded-full bg-echoes-purple/20 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-echoes-purple/30"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
