import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import api, { endpoints } from '@/lib/api';
import flowerSchoolLogo from '@/assets/flower-school-logo.png';

export function SignInForm() {
  const [email, setEmail] = useState(() => localStorage.getItem('signin_email') || '');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Save email to localStorage whenever it changes
  useEffect(() => {
    if (email) {
      localStorage.setItem('signin_email', email);
    }
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear any previous toasts (optional, if your toast system supports it)
    // toast.dismiss && toast.dismiss();

    // Validate form data
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    if (!email.includes('@')) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post(endpoints.login, { email, password });

      if (!response.data.sessionToken) {
        toast({
          title: "Error",
          description: "No session token received from server.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Store session token
      localStorage.setItem('sessionToken', response.data.sessionToken);

      // Store user data in localStorage
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('userId', response.data.user.id);
        localStorage.setItem('userEmail', response.data.user.email);
        localStorage.setItem('userFirstName', response.data.user.firstname);
        localStorage.setItem('userLastName', response.data.user.lastname);
        localStorage.setItem('userPhone', response.data.user.phone);
        localStorage.setItem('userType', response.data.user.usertype);

        // Check if user is admin
        const isAdmin = response.data.user.usertype === 'admin';
        if (isAdmin) {
          localStorage.setItem('isAdmin', 'true');
        } else {
          localStorage.removeItem('isAdmin');
        }

        // Create welcome message with user's name
        const userName = `${response.data.user.firstname} ${response.data.user.lastname}`;

        toast({
          title: "Success!",
          description: `Welcome back, ${userName}! You've successfully signed in.`,
        });

        // Remove the saved email from localStorage after successful login
        localStorage.removeItem('signin_email');

        // Determine redirect path
        const isAdminFlag = localStorage.getItem('isAdmin') === 'true';

        // Small delay to ensure all data is stored
        await new Promise(resolve => setTimeout(resolve, 100));

        navigate(isAdminFlag ? '/admin' : '/');
      } else {
        // Fallback: Get user info from separate API call if not included in login response
        const userResponse = await api.get('/auth/user');
        localStorage.setItem('user', JSON.stringify(userResponse.data));
        localStorage.setItem('userId', userResponse.data.id);
        localStorage.setItem('userEmail', userResponse.data.email);
        localStorage.setItem('userFirstName', userResponse.data.firstname);
        localStorage.setItem('userLastName', userResponse.data.lastname);
        localStorage.setItem('userPhone', userResponse.data.phone || '');
        localStorage.setItem('userType', userResponse.data.usertype);

        const isAdmin = userResponse.data.usertype === 'admin';
        if (isAdmin) {
          localStorage.setItem('isAdmin', 'true');
        } else {
          localStorage.removeItem('isAdmin');
        }

        const userName = `${userResponse.data.firstname} ${userResponse.data.lastname}`;
        toast({
          title: "Success!",
          description: `Welcome back, ${userName}! You've successfully signed in.`,
        });

        // Remove the saved email from localStorage after successful login
        localStorage.removeItem('signin_email');

        // Determine redirect path
        const isAdminFlag = localStorage.getItem('isAdmin') === 'true';

        // Small delay to ensure all data is stored
        await new Promise(resolve => setTimeout(resolve, 100));

        navigate(isAdminFlag ? '/admin' : '/');
      }

    } catch (error: any) {
      // Always show an error toast for any error
      let errorMessage = "Failed to connect to server.";
      // Prefer server error message if available
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        }
      } else if (error.response?.status === 401) {
        errorMessage = "Invalid email or password.";
      } else if (error.code === 'ERR_NETWORK') {
        errorMessage = "Cannot connect to server. Please check if the backend is running on http://localhost:5000";
      } else if (error.response?.status === 404) {
        errorMessage = "Authentication endpoint not found. Please check backend configuration.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      // Do not navigate on error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 w-full max-w-sm mx-auto">
      <div className="space-y-3 text-center">
        {/* Logo */}
        <div className="flex justify-center">
          <img
            src={flowerSchoolLogo}
            alt="Flower School Logo"
            className="h-20 w-auto object-contain"
          />
        </div>

        {/* Welcome Text */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter your credentials to sign in
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="Enter your email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            placeholder="Enter your password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
          onClick={() => console.log('Button clicked - about to submit form')}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
      <div className="text-center space-y-2">
        <Button
          variant="link"
          className="text-sm text-primary"
          onClick={() => window.open("https://flowerschoolbengaluru.com/forgot-password", "_blank")}
        >
          Forgot your password?
        </Button>
        <div className="text-sm text-gray-500">
          Don't have an account?{" "}
          <Button
            variant="link"
            className="text-primary"
            onClick={() => window.open("https://flowerschoolbengaluru.com/signup", "_blank")}
          >
            Sign up
          </Button>
        </div>
      </div>
    </div>
  );
}
