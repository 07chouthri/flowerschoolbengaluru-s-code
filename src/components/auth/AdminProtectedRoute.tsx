import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function AdminProtectedRoute({ children }: ProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('sessionToken');
      const isAdminStored = localStorage.getItem('isAdmin') === 'true';

      if (!token || !isAdminStored) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get('/api/auth/user');
        const isAdmin = response.data.usertype === 'admin';
        setIsAdmin(isAdmin);
        localStorage.setItem('isAdmin', isAdmin ? 'true' : 'false');
        
        if (!isAdmin) {
          localStorage.removeItem('isAdmin');
          toast({
            title: "Access Denied",
            description: "You need admin privileges to access this page",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAdmin(false);
        localStorage.removeItem('isAdmin');
        // If there's a 401 or 403 error, redirect to signin
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem('sessionToken');
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
}