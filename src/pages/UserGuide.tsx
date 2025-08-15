
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Building2, 
  Users, 
  Calendar, 
  BarChart3,
  Search,
  Plus,
  Filter,
  Edit,
  Trash2,
  FileText,
  Video,
  BookOpen,
  Lightbulb,
  CheckCircle,
  ArrowRight,
  Clock,
  Target,
  Zap
} from "lucide-react";

const guides = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'Learn the basics of using College Trek CRM',
    icon: BookOpen,
    sections: [
      {
        title: 'Welcome to College Trek CRM',
        content: 'College Trek CRM is designed to help you manage your college relationships, track meetings, and organize contacts efficiently. This guide will walk you through all the essential features.',
      },
      {
        title: 'Dashboard Overview',
        content: 'Your dashboard provides a quick overview of your colleges, contacts, meetings, and performance metrics. Use the quick action buttons to add new records or navigate to specific sections.',
      },
      {
        title: 'Navigation',
        content: 'Use the sidebar to navigate between different sections: Dashboard, Colleges, Meetings, Contacts, and Search. The sidebar can be collapsed for more screen space.',
      },
    ],
  },
  {
    id: 'colleges',
    title: 'Managing Colleges',
    description: 'Add, edit, and organize your college prospects',
    icon: Building2,
    sections: [
      {
        title: 'Adding a New College',
        content: 'Click the "Add College" button and fill in the college details including name, location, contact information, and status. This helps you track your relationship with each institution.',
      },
      {
        title: 'College Status Management',
        content: 'Use status labels to track your progress: Prospect (initial interest), Negotiation (active discussions), Closed Won (successful partnership), or Lost (opportunity ended).',
      },
      {
        title: 'Filtering and Search',
        content: 'Use the search bar and filters to quickly find colleges by name, location, or status. Switch between grid and table views based on your preference.',
      },
    ],
  },
  {
    id: 'meetings',
    title: 'Meeting Management',
    description: 'Schedule, track, and follow up on meetings',
    icon: Calendar,
    sections: [
      {
        title: 'Scheduling Meetings',
        content: 'Schedule meetings with colleges by clicking "Schedule Meeting". Add agenda items, location details, and set reminders to stay organized.',
      },
      {
        title: 'Meeting Outcomes',
        content: 'After meetings, record outcomes: Interested, Follow-up Required, or Not Interested. This helps track the effectiveness of your meetings.',
      },
      {
        title: 'Calendar View',
        content: 'Use the calendar view to see all your meetings at a glance. Click on any date to see meetings scheduled for that day.',
      },
    ],
  },
  {
    id: 'contacts',
    title: 'Contact Management',
    description: 'Organize and maintain your professional network',
    icon: Users,
    sections: [
      {
        title: 'Adding Contacts',
        content: 'Add contacts associated with colleges including their name, designation, contact information, and notes about your interactions.',
      },
      {
        title: 'Contact Organization',
        content: 'Keep contacts organized by college affiliation and role. Use tags and notes to remember important details about each contact.',
      },
      {
        title: 'Follow-up Tracking',
        content: 'Set follow-up dates and track your communication history with each contact to maintain strong professional relationships.',
      },
    ],
  },
];

const quickTips = [
  {
    icon: Zap,
    title: 'Quick Actions',
    tip: 'Use the quick action buttons in the sidebar for faster access to common tasks.',
  },
  {
    icon: Search,
    title: 'Global Search',
    tip: 'Use the search page to find information across all colleges, contacts, and meetings.',
  },
  {
    icon: Filter,
    title: 'Smart Filters',
    tip: 'Combine multiple filters to narrow down your results and find exactly what you need.',
  },
  {
    icon: Target,
    title: 'Status Tracking',
    tip: 'Keep college statuses updated to track your pipeline and identify opportunities.',
  },
];

const faqs = [
  {
    question: 'How do I change a college status?',
    answer: 'Click on the college card or row, then use the edit button to update the status field. Choose from Prospect, Negotiation, Closed Won, or Lost.',
  },
  {
    question: 'Can I export my data?',
    answer: 'Yes, go to Settings > Data Management to export your colleges, contacts, and meetings data in CSV format.',
  },
  {
    question: 'How do I set up meeting reminders?',
    answer: 'When creating or editing a meeting, enable notifications in your browser and check the reminder settings in your profile.',
  },
  {
    question: 'Can I assign colleges to team members?',
    answer: 'Yes, use the "Assigned Rep" field when adding or editing colleges to assign them to specific team members.',
  },
];

export default function UserGuide() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeGuide, setActiveGuide] = useState('getting-started');

  const filteredGuides = guides.filter(guide => 
    guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guide.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guide.sections.some(section => 
      section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <AppLayout>
      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 bg-slate-50 min-h-screen">
        {/* Header */}
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">User Guide</h1>
          <p className="text-slate-600 mt-1">Learn how to make the most of College Trek CRM</p>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search guides and topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="guides" className="space-y-4">
          <div className="overflow-x-auto">
            <TabsList className="grid w-full grid-cols-3 min-w-max">
              <TabsTrigger value="guides" className="text-xs sm:text-sm">
                <BookOpen className="w-4 h-4 mr-1 sm:mr-2" />
                <span>Guides</span>
              </TabsTrigger>
              <TabsTrigger value="tips" className="text-xs sm:text-sm">
                <Lightbulb className="w-4 h-4 mr-1 sm:mr-2" />
                <span>Tips</span>
              </TabsTrigger>
              <TabsTrigger value="faq" className="text-xs sm:text-sm">
                <FileText className="w-4 h-4 mr-1 sm:mr-2" />
                <span>FAQ</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="guides" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-4">
              {/* Guide Navigation */}
              <div className="lg:col-span-1 space-y-2">
                <h3 className="font-semibold text-slate-900 mb-3">Topics</h3>
                {filteredGuides.map((guide) => {
                  const Icon = guide.icon;
                  return (
                    <Button
                      key={guide.id}
                      variant={activeGuide === guide.id ? "default" : "ghost"}
                      className="w-full justify-start text-left"
                      onClick={() => setActiveGuide(guide.id)}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      <span className="truncate">{guide.title}</span>
                    </Button>
                  );
                })}
              </div>

              {/* Guide Content */}
              <div className="lg:col-span-3">
                {filteredGuides.find(g => g.id === activeGuide) && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        {React.createElement(filteredGuides.find(g => g.id === activeGuide)!.icon, {
                          className: "w-5 h-5 text-blue-600"
                        })}
                        <CardTitle>{filteredGuides.find(g => g.id === activeGuide)!.title}</CardTitle>
                      </div>
                      <CardDescription>
                        {filteredGuides.find(g => g.id === activeGuide)!.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {filteredGuides.find(g => g.id === activeGuide)!.sections.map((section, index) => (
                        <div key={index} className="space-y-2">
                          <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            {section.title}
                          </h4>
                          <p className="text-slate-700 leading-relaxed pl-6">
                            {section.content}
                          </p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tips" className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {quickTips.map((tip, index) => {
                const Icon = tip.icon;
                return (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-1">{tip.title}</h4>
                          <p className="text-sm text-slate-600">{tip.tip}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Video Tutorials</CardTitle>
                <CardDescription>Watch these helpful video guides to get started quickly</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Video className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium">Getting Started with College Trek CRM</div>
                      <div className="text-sm text-slate-600">5:30 minutes</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Watch <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Video className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium">Managing Colleges and Contacts</div>
                      <div className="text-sm text-slate-600">8:45 minutes</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Watch <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Video className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium">Advanced Features and Tips</div>
                      <div className="text-sm text-slate-600">12:20 minutes</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Watch <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faq" className="space-y-4">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-slate-900 mb-2">{faq.question}</h4>
                    <p className="text-slate-700">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Still Need Help?</CardTitle>
                <CardDescription>Can't find what you're looking for? We're here to help!</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Video className="w-4 h-4 mr-2" />
                  Schedule a Demo
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Knowledge Base
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
