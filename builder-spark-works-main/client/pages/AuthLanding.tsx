import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Smartphone, 
  Home, 
  Shirt, 
  Sofa, 
  BookOpen, 
  Dumbbell, 
  Sparkles, 
  ShoppingCart, 
  Car, 
  Heart, 
  Gamepad2, 
  Briefcase, 
  Gem, 
  TreePine,
  ArrowRight,
  CheckCircle,
  Users,
  Leaf,
  Shield
} from "lucide-react";
import type { AuthResponse } from "@shared/api";

const features = [
  {
    icon: Leaf,
    title: "Eco-Friendly",
    description: "Reduce waste by buying and selling second-hand items"
  },
  {
    icon: Shield,
    title: "Secure",
    description: "Safe transactions with verified users and secure payments"
  },
  {
    icon: Users,
    title: "Community",
    description: "Join a community of environmentally conscious buyers and sellers"
  }
];

const categories = [
  { icon: Smartphone, name: "Electronics", color: "text-blue-600" },
  { icon: Home, name: "Home Appliances", color: "text-green-600" },
  { icon: Shirt, name: "Fashion", color: "text-pink-600" },
  { icon: Sofa, name: "Furniture", color: "text-amber-600" },
  { icon: BookOpen, name: "Books", color: "text-purple-600" },
  { icon: Dumbbell, name: "Sports", color: "text-orange-600" },
  { icon: Sparkles, name: "Beauty", color: "text-rose-600" },
  { icon: ShoppingCart, name: "Groceries", color: "text-lime-600" },
  { icon: Car, name: "Automotive", color: "text-gray-600" },
  { icon: Heart, name: "Health", color: "text-red-600" },
  { icon: Gamepad2, name: "Toys", color: "text-yellow-600" },
  { icon: Briefcase, name: "Office", color: "text-indigo-600" },
  { icon: Gem, name: "Jewelry", color: "text-violet-600" },
  { icon: TreePine, name: "Garden", color: "text-emerald-600" }
];

interface AuthLandingProps {
  onAuth: (resp: AuthResponse) => void;
}

export default function AuthLanding({ onAuth }: AuthLandingProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (mode: "login" | "register") => {
    setIsLoading(true);
    setError("");
    
    try {
      const res = await fetch(`/api/auth/${mode === "login" ? "login" : "register"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          mode === "login"
            ? { email, password }
            : { email, password, username }
        ),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Authentication failed");
      
      const auth = data as AuthResponse;
      localStorage.setItem("ecofinds_user", JSON.stringify(auth.user));
      localStorage.setItem("ecofinds_token", auth.token);
      onAuth(auth);
      
      // Redirect to home page after successful authentication
      navigate("/home");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-pink-500/30 to-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-40 right-1/3 w-64 h-64 bg-gradient-to-r from-emerald-500/30 to-teal-500/30 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-pink-400 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-700"></div>
        <div className="absolute top-1/2 left-1/3 w-4 h-4 bg-purple-400 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-500"></div>
        <div className="absolute bottom-1/4 left-1/2 w-3 h-3 bg-yellow-400 rounded-full animate-bounce delay-1200"></div>
      </div>
      {/* Header */}
      <header className="px-6 py-8 relative z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 group">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-3xl blur-lg opacity-60 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-2xl blur opacity-80 group-hover:opacity-100 transition-all duration-300"></div>
              <div className="relative inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-white font-black text-3xl shadow-2xl group-hover:scale-105 transition-all duration-300 group-hover:rotate-3">
                EF
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-5xl tracking-tight bg-gradient-to-r from-pink-400 via-purple-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent group-hover:animate-pulse">
                EcoFinds
              </span>
              <span className="text-sm font-bold text-cyan-300 -mt-1 tracking-widest group-hover:text-pink-300 transition-colors duration-300">
                NEXT-GEN MARKETPLACE
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-white/90">Join the Green Revolution</p>
            <p className="text-sm text-cyan-300">Make every purchase count</p>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Marketing Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-6xl font-black text-gray-900 leading-tight">
                  Buy & Sell
                  <span className="block bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 bg-clip-text text-transparent">
                    Sustainably
                  </span>
                </h1>
                <div className="h-1 w-24 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
              </div>
              <p className="text-2xl text-gray-700 leading-relaxed font-medium">
                Join thousands of eco-conscious users buying and selling second-hand items. 
                <span className="text-emerald-600 font-bold"> Reduce waste, save money, and help the planet.</span>
              </p>
              <div className="flex items-center gap-4 text-emerald-600">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-emerald-500 rounded-full"></div>
                  <span className="font-semibold">35+ Products Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-teal-500 rounded-full"></div>
                  <span className="font-semibold">15 Categories</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-emerald-500 rounded-full"></div>
                  <span className="font-semibold">100% Eco-Friendly</span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="grid sm:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center space-y-4 group">
                  <div className="relative mx-auto">
                    <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
                    <div className="relative inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-600 group-hover:from-emerald-200 group-hover:to-teal-200 transition-all duration-300">
                      <feature.icon className="h-8 w-8" />
                    </div>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-emerald-700 transition-colors">{feature.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Categories Preview */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Shop by Category</h3>
              <div className="grid grid-cols-7 gap-3">
                {categories.map((category, index) => (
                  <div key={index} className="text-center space-y-2">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 hover:bg-emerald-100 transition-colors">
                      <category.icon className={`h-5 w-5 ${category.color}`} />
                    </div>
                    <p className="text-xs text-gray-600">{category.name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 py-6 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">35+</div>
                <div className="text-sm text-gray-600">Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">15</div>
                <div className="text-sm text-gray-600">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">100%</div>
                <div className="text-sm text-gray-600">Eco-Friendly</div>
              </div>
            </div>
          </div>

          {/* Right Side - Authentication Form */}
          <div className="flex justify-center">
            <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 backdrop-blur-md relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/50"></div>
              <div className="relative">
                <CardHeader className="space-y-4 text-center pb-8 pt-8">
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 flex items-center justify-center text-white font-black text-2xl shadow-lg">
                    EF
                  </div>
                  <CardTitle className="text-3xl font-black text-gray-900">
                    Welcome to EcoFinds
                  </CardTitle>
                  <CardDescription className="text-lg text-gray-600 font-medium">
                    Sign in to your account or create a new one to get started
                  </CardDescription>
                </CardHeader>
                <CardContent>
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="login">Sign In</TabsTrigger>
                    <TabsTrigger value="register">Sign Up</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login" className="space-y-4">
                    <form onSubmit={(e) => { e.preventDefault(); handleSubmit("login"); }} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-email">Email</Label>
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="login-password">Password</Label>
                        <Input
                          id="login-password"
                          type="password"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                      {error && (
                        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                          {error}
                        </div>
                      )}
                      <Button 
                        type="submit" 
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                        disabled={isLoading}
                      >
                        {isLoading ? "Signing in..." : "Sign In"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="register" className="space-y-4">
                    <form onSubmit={(e) => { e.preventDefault(); handleSubmit("register"); }} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="register-username">Username</Label>
                        <Input
                          id="register-username"
                          type="text"
                          placeholder="Choose a username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-email">Email</Label>
                        <Input
                          id="register-email"
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-password">Password</Label>
                        <Input
                          id="register-password"
                          type="password"
                          placeholder="Create a password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                      {error && (
                        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                          {error}
                        </div>
                      )}
                      <Button 
                        type="submit" 
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                        disabled={isLoading}
                      >
                        {isLoading ? "Creating account..." : "Create Account"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>

                <div className="mt-6">
                  <Separator className="my-4" />
                  <div className="text-center text-sm text-gray-600">
                    By continuing, you agree to our{" "}
                    <a href="#" className="text-emerald-600 hover:underline">Terms of Service</a>{" "}
                    and{" "}
                    <a href="#" className="text-emerald-600 hover:underline">Privacy Policy</a>
                  </div>
                </div>
                </CardContent>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 py-8 text-center text-sm text-gray-600 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <p>Sustainably crafted with ♻️ — EcoFinds Marketplace</p>
        </div>
      </footer>
    </div>
  );
}
