import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Target, Users } from "lucide-react";
import { Link } from "react-router-dom";
import heroRobot from "@/assets/hero-robot.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-300 to-yellow-200">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6">
        <div className="flex items-center gap-2">
          <Zap className="h-8 w-8 text-foreground" />
          <span className="text-2xl font-bold text-foreground">Pulse Robot</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#" className="text-foreground hover:text-foreground/80 transition-colors">Home</a>
          <a href="#" className="text-foreground hover:text-foreground/80 transition-colors">About</a>
          <a href="#" className="text-foreground hover:text-foreground/80 transition-colors">Contact</a>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-500/20 text-orange-800 border border-orange-300">
                01 Purpose
              </span>
            </div>
            
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Atlas: Where Code
                <br />
                Meets Motion
              </h1>
              <p className="text-xl text-foreground/80 max-w-lg">
                The humanoid companion that learns and adapts alongside you.
              </p>
            </div>

            <Button 
              asChild
              size="lg"
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link to="/dashboard" className="flex items-center gap-2">
                Request Access
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>

          <div className="relative">
            <div className="relative z-10">
              <img
                src={heroRobot}
                alt="Atlas Robot Companion"
                className="w-full h-auto max-w-lg mx-auto"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-yellow-300/20 rounded-3xl blur-3xl" />
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
              <Target className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Smart Task Management</h3>
            <p className="text-foreground/70">AI-powered task prioritization and team collaboration tools.</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Team Analytics</h3>
            <p className="text-foreground/70">Real-time insights into team performance and productivity metrics.</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Gamification</h3>
            <p className="text-foreground/70">Level up your productivity with points, streaks, and achievements.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
