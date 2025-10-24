import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import api, { endpoints } from '@/lib/api';

export function AuthButtons() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem('sessionToken');
    const isAdminStored = localStorage.getItem('isAdmin') === 'true';
    const storedUserName = localStorage.getItem('userName');
    setIsLoggedIn(!!token);
    setIsAdmin(isAdminStored);
    if (storedUserName) setUserName(storedUserName);
    
    // Check if user is admin
    const checkAdminStatus = async () => {
      if (token) {
        try {
            
          const response = await api.get('/api/auth/user');
          const isAdmin = response.data.usertype === 'admin';
          const name = response.data.firstname || response.data.email?.split('@')[0] || 'User';
          setIsAdmin(isAdmin);
          setUserName(name);
          localStorage.setItem('isAdmin', isAdmin ? 'true' : 'false');
          localStorage.setItem('userName', name);
        } catch (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
          setUserName('');
          localStorage.removeItem('isAdmin');
          localStorage.removeItem('userName');
        }
      }
    };
    
    if (token) {
      checkAdminStatus();
    }
  }, []);

  const handleLogout = async () => {
    try {
      await api.post(endpoints.logout);
      localStorage.removeItem('sessionToken');
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('userName');
      setIsLoggedIn(false);
      setIsAdmin(false);
      setUserName('');
      toast({
        title: "Success",
        description: "You've been logged out successfully",
      });
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isLoggedIn) {
    return (
      <div className="flex items-center gap-2 md:gap-4">
        <span className="text-sm font-medium hidden md:inline-flex">
          Welcome, {userName}
        </span>
        {isAdmin && (
          <Button 
            variant="ghost"
            size="sm"
            className="inline-flex"
            onClick={() => navigate('/admin')}
          >
            Admin
          </Button>
        )}
        <Button 
          variant="outline"
          size="sm"
          onClick={handleLogout}
        >
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 md:gap-4">
      <Button 
        variant="ghost"
        size="sm"
                    onClick={() => navigate('/signin')}

        // onClick={() => window.location.href = 'https://app.flowerschoolbengaluru.com/signup'}
      >
        Sign In
      </Button>
    </div>
  );
}