import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import type { User } from "@shared/api";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-white">
        <div className="text-center space-y-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-lg animate-pulse">
            EF
          </div>
          <p className="text-emerald-600 font-medium">Loading EcoFinds...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}


