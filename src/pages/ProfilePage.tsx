
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, User, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { currentUser, logout } = useAuth();
  const [name, setName] = useState(currentUser?.displayName || '');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // In a real app, this would update the user profile in Firebase
    setTimeout(() => {
      setSaving(false);
    }, 1000);
  };

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-12">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
          <User size={32} className="text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold">Sign in to view your profile</h2>
        <p className="text-muted-foreground text-center max-w-xs">
          Create an account or sign in to manage your profile and preferences
        </p>
        <div className="flex gap-4 mt-4">
          <Button asChild>
            <Link to="/auth">Sign In</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      <h1 className="text-2xl font-heading font-bold mb-4">Your Profile</h1>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src="" />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {currentUser.email?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="sm" className="mt-2">
                Change Photo
              </Button>
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-xl font-semibold">
                  {currentUser.displayName || 'EV User'}
                </h2>
                <p className="text-muted-foreground">{currentUser.email}</p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="flex items-center">
                  <Settings size={14} className="mr-1" /> Account Settings
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="flex items-center text-destructive hover:text-destructive"
                >
                  <LogOut size={14} className="mr-1" /> Sign Out
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="profile">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Profile Information</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={currentUser.email || ''}
                    disabled
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Display Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">App Preferences</h3>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="distance">Distance Unit</Label>
                  <select
                    id="distance"
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="km">Kilometers</option>
                    <option value="miles">Miles</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notifications">Notification Preferences</Label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="email_notifications"
                        className="mr-2"
                        defaultChecked
                      />
                      <label htmlFor="email_notifications">Email Notifications</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="push_notifications"
                        className="mr-2"
                        defaultChecked
                      />
                      <label htmlFor="push_notifications">Push Notifications</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="sms_notifications"
                        className="mr-2"
                      />
                      <label htmlFor="sms_notifications">SMS Notifications</label>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full">Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
