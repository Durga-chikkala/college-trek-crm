
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Database, 
  HelpCircle,
  Save,
  Upload,
  Moon,
  Sun,
  Globe,
  Mail,
  Phone,
  Key,
  Download,
  Trash2,
  Lock
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Profile settings
  const [profileData, setProfileData] = useState({
    firstName: user?.user_metadata?.first_name || '',
    lastName: user?.user_metadata?.last_name || '',
    email: user?.email || '',
    phone: '',
    title: '',
    bio: '',
    timezone: 'UTC',
    language: 'en',
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    meetingReminders: true,
    weeklyReports: false,
    marketingEmails: false,
    soundEnabled: true,
  });

  // Appearance settings
  const [appearance, setAppearance] = useState({
    theme: 'light',
    compactMode: false,
    showAvatars: true,
    sidebarCollapsed: false,
  });

  // Security settings
  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    sessionTimeout: '30',
    loginNotifications: true,
  });

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Notifications updated",
        description: "Your notification preferences have been saved.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAppearance = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Apply theme changes
      document.documentElement.classList.toggle('dark', appearance.theme === 'dark');
      toast({
        title: "Appearance updated",
        description: "Your appearance preferences have been saved.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = () => {
    toast({
      title: "Password Change",
      description: "Password change functionality would be implemented here.",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Data Export",
      description: "Your data export has been initiated. You'll receive an email when ready.",
    });
  };

  const userInitials = profileData.firstName && profileData.lastName
    ? `${profileData.firstName[0]}${profileData.lastName[0]}`
    : user?.email?.[0]?.toUpperCase() || "U";

  return (
    <AppLayout>
      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 bg-slate-50 min-h-screen">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-600 mt-1">Manage your account and application preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-4">
          <div className="overflow-x-auto">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6 min-w-max bg-white border">
              <TabsTrigger value="profile" className="text-xs sm:text-sm data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                <User className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="text-xs sm:text-sm data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
                <Bell className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="text-xs sm:text-sm data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700">
                <Palette className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Appearance</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="text-xs sm:text-sm data-[state=active]:bg-red-50 data-[state=active]:text-red-700">
                <Shield className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Security</span>
              </TabsTrigger>
              <TabsTrigger value="data" className="text-xs sm:text-sm data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700">
                <Database className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Data</span>
              </TabsTrigger>
              <TabsTrigger value="help" className="text-xs sm:text-sm data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">
                <HelpCircle className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Help</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="profile" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-4">
                <Card className="border-blue-200 shadow-sm">
                  <CardHeader className="bg-blue-50">
                    <CardTitle className="text-blue-900">Personal Information</CardTitle>
                    <CardDescription className="text-blue-700">Update your personal details and contact information.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName" className="text-slate-700">First Name</Label>
                        <Input
                          id="firstName"
                          value={profileData.firstName}
                          onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                          className="border-slate-300 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="text-slate-700">Last Name</Label>
                        <Input
                          id="lastName"
                          value={profileData.lastName}
                          onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                          className="border-slate-300 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-slate-700">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        className="border-slate-300 focus:border-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone" className="text-slate-700">Phone</Label>
                        <Input
                          id="phone"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                          className="border-slate-300 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="title" className="text-slate-700">Job Title</Label>
                        <Input
                          id="title"
                          value={profileData.title}
                          onChange={(e) => setProfileData({...profileData, title: e.target.value})}
                          className="border-slate-300 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="bio" className="text-slate-700">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profileData.bio}
                        onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                        className="border-slate-300 focus:border-blue-500"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="timezone" className="text-slate-700">Timezone</Label>
                        <Select value={profileData.timezone} onValueChange={(value) => setProfileData({...profileData, timezone: value})}>
                          <SelectTrigger className="border-slate-300">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="UTC">UTC</SelectItem>
                            <SelectItem value="EST">Eastern Time</SelectItem>
                            <SelectItem value="PST">Pacific Time</SelectItem>
                            <SelectItem value="GMT">GMT</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="language" className="text-slate-700">Language</Label>
                        <Select value={profileData.language} onValueChange={(value) => setProfileData({...profileData, language: value})}>
                          <SelectTrigger className="border-slate-300">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button onClick={handleSaveProfile} disabled={loading} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                      <Save className="w-4 h-4 mr-2" />
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Card className="border-blue-200">
                  <CardHeader className="bg-blue-50">
                    <CardTitle className="text-blue-900">Profile Picture</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-4 pt-6">
                    <Avatar className="w-20 h-20 mx-auto">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm" className="w-full border-blue-300 text-blue-700 hover:bg-blue-50">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload New Photo
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-green-200">
                  <CardHeader className="bg-green-50">
                    <CardTitle className="text-green-900">Account Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 pt-6">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Plan</span>
                      <Badge className="bg-green-100 text-green-800 border-green-300">Professional</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Status</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Active</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card className="border-green-200">
              <CardHeader className="bg-green-50">
                <CardTitle className="text-green-900">Notification Preferences</CardTitle>
                <CardDescription className="text-green-700">Choose how you want to be notified about important updates.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-slate-700">Email Notifications</Label>
                      <p className="text-sm text-slate-500">Receive email notifications for important updates</p>
                    </div>
                    <Switch
                      checked={notifications.emailNotifications}
                      onCheckedChange={(checked) => setNotifications({...notifications, emailNotifications: checked})}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-slate-700">Push Notifications</Label>
                      <p className="text-sm text-slate-500">Receive push notifications in your browser</p>
                    </div>
                    <Switch
                      checked={notifications.pushNotifications}
                      onCheckedChange={(checked) => setNotifications({...notifications, pushNotifications: checked})}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-slate-700">Meeting Reminders</Label>
                      <p className="text-sm text-slate-500">Get reminded about upcoming meetings</p>
                    </div>
                    <Switch
                      checked={notifications.meetingReminders}
                      onCheckedChange={(checked) => setNotifications({...notifications, meetingReminders: checked})}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-slate-700">Sound Notifications</Label>
                      <p className="text-sm text-slate-500">Play sound for notifications</p>
                    </div>
                    <Switch
                      checked={notifications.soundEnabled}
                      onCheckedChange={(checked) => setNotifications({...notifications, soundEnabled: checked})}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-slate-700">Weekly Reports</Label>
                      <p className="text-sm text-slate-500">Receive weekly activity summaries</p>
                    </div>
                    <Switch
                      checked={notifications.weeklyReports}
                      onCheckedChange={(checked) => setNotifications({...notifications, weeklyReports: checked})}
                    />
                  </div>
                </div>
                
                <Button onClick={handleSaveNotifications} disabled={loading} className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Preferences'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4">
            <Card className="border-purple-200">
              <CardHeader className="bg-purple-50">
                <CardTitle className="text-purple-900">Appearance Settings</CardTitle>
                <CardDescription className="text-purple-700">Customize how the application looks and feels.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-slate-700">Theme</Label>
                    <div className="flex gap-2">
                      <Button
                        variant={appearance.theme === 'light' ? 'default' : 'outline'}
                        onClick={() => setAppearance({...appearance, theme: 'light'})}
                        className={`flex-1 ${appearance.theme === 'light' ? 'bg-purple-600 hover:bg-purple-700' : 'border-purple-300 text-purple-700 hover:bg-purple-50'}`}
                      >
                        <Sun className="w-4 h-4 mr-2" />
                        Light
                      </Button>
                      <Button
                        variant={appearance.theme === 'dark' ? 'default' : 'outline'}
                        onClick={() => setAppearance({...appearance, theme: 'dark'})}
                        className={`flex-1 ${appearance.theme === 'dark' ? 'bg-purple-600 hover:bg-purple-700' : 'border-purple-300 text-purple-700 hover:bg-purple-50'}`}
                      >
                        <Moon className="w-4 h-4 mr-2" />
                        Dark
                      </Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-slate-700">Compact Mode</Label>
                      <p className="text-sm text-slate-500">Use smaller spacing and elements</p>
                    </div>
                    <Switch
                      checked={appearance.compactMode}
                      onCheckedChange={(checked) => setAppearance({...appearance, compactMode: checked})}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-slate-700">Show Avatars</Label>
                      <p className="text-sm text-slate-500">Display profile pictures throughout the app</p>
                    </div>
                    <Switch
                      checked={appearance.showAvatars}
                      onCheckedChange={(checked) => setAppearance({...appearance, showAvatars: checked})}
                    />
                  </div>
                </div>
                
                <Button onClick={handleSaveAppearance} disabled={loading} className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700">
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Appearance'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card className="border-red-200">
              <CardHeader className="bg-red-50">
                <CardTitle className="text-red-900">Security Settings</CardTitle>
                <CardDescription className="text-red-700">Manage your account security and privacy.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start border-red-300 text-red-700 hover:bg-red-50" onClick={handleChangePassword}>
                    <Key className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                  <div className="flex items-center justify-between p-3 border border-red-200 rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-slate-700">Two-Factor Authentication</Label>
                      <p className="text-sm text-slate-500">Add an extra layer of security</p>
                    </div>
                    <Switch
                      checked={security.twoFactorEnabled}
                      onCheckedChange={(checked) => setSecurity({...security, twoFactorEnabled: checked})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700">Session Timeout (minutes)</Label>
                    <Select value={security.sessionTimeout} onValueChange={(value) => setSecurity({...security, sessionTimeout: value})}>
                      <SelectTrigger className="border-red-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="outline" className="w-full justify-start border-red-300 text-red-700 hover:bg-red-50">
                    <Lock className="h-4 w-4 mr-2" />
                    View Login History
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            <Card className="border-orange-200">
              <CardHeader className="bg-orange-50">
                <CardTitle className="text-orange-900">Data Management</CardTitle>
                <CardDescription className="text-orange-700">Export, import, and manage your data.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start border-orange-300 text-orange-700 hover:bg-orange-50" onClick={handleExportData}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-orange-300 text-orange-700 hover:bg-orange-50">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Data
                  </Button>
                  <Separator />
                  <Button variant="outline" className="w-full justify-start border-red-300 text-red-600 hover:bg-red-50">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="help" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-indigo-200">
                <CardHeader className="bg-indigo-50">
                  <CardTitle className="text-indigo-900">Support</CardTitle>
                  <CardDescription className="text-indigo-700">Get help with using the application.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pt-6">
                  <Button variant="outline" className="w-full justify-start border-indigo-300 text-indigo-700 hover:bg-indigo-50">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    User Guide
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-indigo-300 text-indigo-700 hover:bg-indigo-50">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Support
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-indigo-300 text-indigo-700 hover:bg-indigo-50">
                    <Globe className="w-4 h-4 mr-2" />
                    Knowledge Base
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-indigo-200">
                <CardHeader className="bg-indigo-50">
                  <CardTitle className="text-indigo-900">About</CardTitle>
                  <CardDescription className="text-indigo-700">Information about the application.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 pt-6">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Version</span>
                    <span className="text-sm font-medium text-slate-900">1.0.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Last Updated</span>
                    <span className="text-sm font-medium text-slate-900">Today</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">License</span>
                    <span className="text-sm font-medium text-slate-900">MIT</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
