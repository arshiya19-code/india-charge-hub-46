
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/sonner';
import { MapPin } from 'lucide-react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      navigate('/');
    } catch (error) {
      console.error('Authentication error:', error);
      toast.error(isLogin ? 'Login failed' : 'Signup failed');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto py-8 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex bg-primary h-12 w-12 rounded-lg items-center justify-center mb-4">
          <MapPin size={28} className="text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-heading font-bold">India Charge Hub</h1>
        <p className="text-muted-foreground mt-2">Find and access EV charging stations across India</p>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <Tabs
            value={isLogin ? 'login' : 'signup'}
            onValueChange={(value) => setIsLogin(value === 'login')}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Log In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {isLogin && (
                    <Link to="/auth/forgot-password" className="text-xs text-primary hover:underline">
                      Forgot Password?
                    </Link>
                  )}
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <span>Loading...</span>
                ) : isLogin ? (
                  'Log In'
                ) : (
                  'Create Account'
                )}
              </Button>
              
              <div className="text-center text-sm text-muted-foreground mt-4">
                By continuing, you agree to our{' '}
                <Link to="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </div>
            </form>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="text-center mt-4">
        <Button variant="link" asChild>
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default AuthPage;
