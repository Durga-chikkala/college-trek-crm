
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Building2, 
  Calendar, 
  Users, 
  BarChart3, 
  Search, 
  HelpCircle, 
  Settings,
  LogOut,
  ChevronDown,
  Plus,
  UserPlus,
  CalendarPlus,
  Building,
  DollarSign,
  BookOpen,
  TrendingUp,
  Activity
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CollegeForm } from "@/components/colleges/CollegeForm";
import { ContactForm } from "@/components/contacts/ContactForm";
import { MeetingForm } from "@/components/meetings/MeetingForm";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Colleges", href: "/colleges", icon: Building2 },
  { name: "Pricing Models", href: "/pricing", icon: DollarSign },
  { name: "Course Management", href: "/courses", icon: BookOpen },
  { name: "Sales Deals", href: "/sales", icon: TrendingUp },
  { name: "Meetings", href: "/meetings", icon: Calendar },
  { name: "Contacts", href: "/contacts", icon: Users },
  { name: "Search", href: "/search", icon: Search },
  { name: "Audit Logs", href: "/audit", icon: Activity },
];

const bottomNavigation = [
  { name: "User Guide", href: "/guide", icon: HelpCircle },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state, setOpenMobile } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showCollegeForm, setShowCollegeForm] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showMeetingForm, setShowMeetingForm] = useState(false);

  const isActive = (path: string) => location.pathname === path;
  const getNavClasses = (path: string) =>
    isActive(path)
      ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 border-r-2 border-blue-600 font-medium"
      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900";

  const userInitials = user?.user_metadata?.first_name && user?.user_metadata?.last_name
    ? `${user.user_metadata.first_name[0]}${user.user_metadata.last_name[0]}`
    : user?.email?.[0]?.toUpperCase() || "U";

  const handleNavigation = (href: string) => {
    navigate(href);
    // Close mobile sidebar after navigation
    setOpenMobile(false);
  };

  return (
    <>
      <Sidebar className="border-r border-slate-200 flex-shrink-0">
        <SidebarHeader className="border-b border-slate-200 p-3 lg:p-4">
          <div className="flex items-center gap-2 lg:gap-3">
            <div className="w-7 h-7 lg:w-8 lg:h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Building2 className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <h2 className="font-semibold text-slate-900 truncate text-sm lg:text-base">College Sales</h2>
                <p className="text-xs text-slate-500 truncate">CRM Platform</p>
              </div>
            )}
          </div>
        </SidebarHeader>

        <SidebarContent className="flex-1 p-2 overflow-y-auto">
          {!collapsed && (
            <div className="mb-4">
              <Button
                onClick={() => setShowQuickActions(!showQuickActions)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs lg:text-sm"
                size="sm"
              >
                <Plus className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Quick Actions</span>
                <span className="sm:hidden">Actions</span>
                <ChevronDown className={`w-3 h-3 lg:w-4 lg:h-4 ml-auto transition-transform ${showQuickActions ? 'rotate-180' : ''}`} />
              </Button>
              {showQuickActions && (
                <div className="mt-2 space-y-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start text-slate-600 hover:bg-blue-50 hover:text-blue-700 text-xs lg:text-sm"
                    onClick={() => setShowCollegeForm(true)}
                  >
                    <Building className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                    Add College
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start text-slate-600 hover:bg-green-50 hover:text-green-700 text-xs lg:text-sm"
                    onClick={() => setShowMeetingForm(true)}
                  >
                    <CalendarPlus className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                    Log Meeting
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start text-slate-600 hover:bg-purple-50 hover:text-purple-700 text-xs lg:text-sm"
                    onClick={() => setShowContactForm(true)}
                  >
                    <UserPlus className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                    Add Contact
                  </Button>
                </div>
              )}
            </div>
          )}

          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2">
              Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigation.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild>
                      <button
                        onClick={() => handleNavigation(item.href)}
                        className={`flex items-center gap-2 lg:gap-3 px-2 lg:px-3 py-2 rounded-lg transition-all duration-200 w-full text-left text-xs lg:text-sm ${getNavClasses(item.href)}`}
                      >
                        <item.icon className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
                        {!collapsed && <span className="truncate">{item.name}</span>}
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="mt-auto">
            <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2">
              Support
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {bottomNavigation.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild>
                      <button
                        onClick={() => handleNavigation(item.href)}
                        className={`flex items-center gap-2 lg:gap-3 px-2 lg:px-3 py-2 rounded-lg transition-all duration-200 w-full text-left text-xs lg:text-sm ${getNavClasses(item.href)}`}
                      >
                        <item.icon className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
                        {!collapsed && <span className="truncate">{item.name}</span>}
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-slate-200 p-2 lg:p-3">
          <div className="flex items-center gap-2 lg:gap-3">
            <Avatar className="w-7 h-7 lg:w-8 lg:h-8 flex-shrink-0">
              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-xs lg:text-sm">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs lg:text-sm font-medium text-slate-900 truncate">
                  {user?.user_metadata?.first_name || user?.email}
                </p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="text-slate-500 hover:text-red-600 hover:bg-red-50 flex-shrink-0 p-1 lg:p-2"
            >
              <LogOut className="w-3 h-3 lg:w-4 lg:h-4" />
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>

      {/* Quick Action Forms */}
      <CollegeForm open={showCollegeForm} onOpenChange={setShowCollegeForm} />
      <ContactForm open={showContactForm} onOpenChange={setShowContactForm} />
      <MeetingForm open={showMeetingForm} onOpenChange={setShowMeetingForm} />
    </>
  );
}
