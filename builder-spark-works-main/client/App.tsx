import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link, Outlet, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Cart from "./pages/Cart";
import Purchases from "./pages/Purchases";
import ProductDetail from "./pages/ProductDetail";
import Dashboard from "./pages/Dashboard";
import AuthLanding from "./pages/AuthLanding";
import ProtectedRoute from "./components/ProtectedRoute";
import type { User, AuthResponse } from "@shared/api";

const queryClient = new QueryClient();

function Layout() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("ecofinds_user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("ecofinds_token");
      if (token) {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("ecofinds_user");
      localStorage.removeItem("ecofinds_token");
      setUser(null);
      window.location.href = "/auth";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-40 right-1/3 w-64 h-64 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      <header className="sticky top-0 z-40 backdrop-blur-xl supports-[backdrop-filter]:bg-white/10 border-b border-white/20 bg-gradient-to-r from-white/10 to-white/5 shadow-2xl shadow-purple-500/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/home" className="flex items-center gap-4 group relative">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-3xl blur-lg opacity-60 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-2xl blur opacity-80 group-hover:opacity-100 transition-all duration-300"></div>
              <div className="relative inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-white font-black text-2xl shadow-2xl group-hover:scale-105 transition-all duration-300 group-hover:rotate-3">
                EF
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-4xl tracking-tight bg-gradient-to-r from-pink-400 via-purple-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent group-hover:animate-pulse">
                EcoFinds
              </span>
              <span className="text-xs font-bold text-cyan-300 -mt-1 tracking-widest group-hover:text-pink-300 transition-colors duration-300">
                NEXT-GEN MARKETPLACE
              </span>
            </div>
          </Link>
          <nav className="flex items-center gap-8 text-sm">
            <Link to="/home" className="relative text-white/80 hover:text-white font-bold transition-all duration-300 group px-4 py-2 rounded-xl">
              <span className="relative z-10 flex items-center gap-2">
                <span className="text-lg">🏠</span>
                <span>Home</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 blur-sm"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/30 to-purple-500/30 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            </Link>
            <Link
              to="/cart"
              className="relative text-white/80 hover:text-white font-bold transition-all duration-300 group px-4 py-2 rounded-xl"
            >
              <span className="relative z-10 flex items-center gap-2">
                <span className="text-lg">🛒</span>
                <span>Cart</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 blur-sm"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            </Link>
            <Link
              to="/purchases"
              className="relative text-white/80 hover:text-white font-bold transition-all duration-300 group px-4 py-2 rounded-xl"
            >
              <span className="relative z-10 flex items-center gap-2">
                <span className="text-lg">📦</span>
                <span>Purchases</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 blur-sm"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/30 to-teal-500/30 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            </Link>
            <Link
              to="/dashboard"
              className="relative text-white/80 hover:text-white font-bold transition-all duration-300 group px-4 py-2 rounded-xl"
            >
              <span className="relative z-10 flex items-center gap-2">
                <span className="text-lg">📊</span>
                <span>Dashboard</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 blur-sm"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/30 to-orange-500/30 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            </Link>
            {user && (
              <div className="flex items-center gap-6 pl-6 border-l border-white/20">
                <div className="flex items-center gap-3 group">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur opacity-60 group-hover:opacity-100 transition-all duration-300"></div>
                    <div className="relative h-10 w-10 rounded-full bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-all duration-300">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <span className="text-white/90 font-bold group-hover:text-white transition-colors duration-300">Hello, {user.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="relative px-6 py-3 text-sm bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 text-white rounded-xl hover:from-red-600 hover:via-pink-600 hover:to-purple-600 transition-all duration-300 font-bold shadow-2xl hover:shadow-red-500/25 hover:scale-105 active:scale-95"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <span>🚪</span>
                    <span>Logout</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-400 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                </button>
              </div>
            )}
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4">
        <Outlet />
      </main>
      <footer className="border-t border-white/20 mt-20 py-16 text-center bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10"></div>
        <div className="relative max-w-4xl mx-auto px-6">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-2xl blur opacity-60 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="relative h-12 w-12 rounded-2xl bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 flex items-center justify-center text-white font-black text-xl shadow-2xl group-hover:scale-110 transition-all duration-300">
                EF
              </div>
            </div>
            <span className="font-black text-3xl tracking-tight bg-gradient-to-r from-pink-400 via-purple-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent group-hover:animate-pulse">
              EcoFinds
            </span>
          </div>
          <p className="text-white/90 font-bold text-lg mb-3 flex items-center justify-center gap-2">
            <span className="text-2xl">♻️</span>
            <span>Sustainably crafted with love</span>
          </p>
          <p className="text-white/70 text-sm mb-6">Making the world greener, one purchase at a time</p>
          <div className="flex items-center justify-center gap-8 text-white/60">
            <div className="flex items-center gap-2">
              <span className="text-lg">🚀</span>
              <span className="text-sm font-medium">Next-Gen Shopping</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🌍</span>
              <span className="text-sm font-medium">Eco-Friendly</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">⚡</span>
              <span className="text-sm font-medium">Lightning Fast</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const userData = localStorage.getItem("ecofinds_user");
        const token = localStorage.getItem("ecofinds_token");
        
        if (userData && token) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        localStorage.removeItem("ecofinds_user");
        localStorage.removeItem("ecofinds_token");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleAuth = (authResponse: AuthResponse) => {
    setUser(authResponse.user);
    localStorage.setItem("ecofinds_user", JSON.stringify(authResponse.user));
    localStorage.setItem("ecofinds_token", authResponse.token);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-white">
        <div className="text-center space-y-4">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-2xl animate-pulse">
            EF
          </div>
          <p className="text-emerald-600 font-medium text-lg">Loading EcoFinds...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/auth" 
              element={<AuthLanding onAuth={handleAuth} />} 
            />
            <Route element={<Layout />}>
              <Route 
                path="home"
                element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                } 
              />
              <Route 
                index 
                element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="cart" 
                element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="purchases" 
                element={
                  <ProtectedRoute>
                    <Purchases />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="product/:id" 
                element={
                  <ProtectedRoute>
                    <ProductDetail />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              {/* Redirect root to home if authenticated, auth if not */}
              <Route path="/" element={<Navigate to={user ? "/home" : "/auth"} replace />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
