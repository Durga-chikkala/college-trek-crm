import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Plus, UserPlus, CalendarPlus } from "lucide-react";
import { CollegeForm } from "@/components/colleges/CollegeForm";
import { ContactForm } from "@/components/contacts/ContactForm";
import { MeetingForm } from "@/components/meetings/MeetingForm";
import { useAuth } from "@/hooks/useAuth";

export default function Dashboard() {
  const { loading } = useAuth();
  const [showCollegeForm, setShowCollegeForm] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showMeetingForm, setShowMeetingForm] = useState(false);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading dashboard...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-600 mt-1">Welcome back! Here's your CRM overview.</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setShowCollegeForm(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add College
            </Button>
            <Button onClick={() => setShowContactForm(true)} variant="outline">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Contact
            </Button>
            <Button onClick={() => setShowMeetingForm(true)} variant="outline">
              <CalendarPlus className="w-4 h-4 mr-2" />
              Schedule Meeting
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-slate-800">Total Colleges</h3>
            <p className="text-2xl font-bold text-blue-600 mt-2">125</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-slate-800">Total Contacts</h3>
            <p className="text-2xl font-bold text-green-600 mt-2">340</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-slate-800">Upcoming Meetings</h3>
            <p className="text-2xl font-bold text-purple-600 mt-2">15</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-slate-800">Opportunities</h3>
            <p className="text-2xl font-bold text-orange-600 mt-2">$500,000</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-slate-800 mb-3">Sales Performance</h3>
            {/* Placeholder for Sales Performance Chart */}
            <div className="h-48 bg-slate-100 rounded"></div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-slate-800 mb-3">Lead Sources</h3>
            {/* Placeholder for Lead Sources Chart */}
            <div className="h-48 bg-slate-100 rounded"></div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-slate-800 mb-3">Recent Activity</h3>
          <ul className="space-y-2">
            <li className="text-slate-700">New contact added: John Doe from ABC College</li>
            <li className="text-slate-700">Meeting scheduled with Jane Smith</li>
            <li className="text-slate-700">College profile updated for XYZ University</li>
          </ul>
        </div>

        {/* Forms */}
        <CollegeForm open={showCollegeForm} onOpenChange={setShowCollegeForm} />
        <ContactForm open={showContactForm} onOpenChange={setShowContactForm} />
        <MeetingForm open={showMeetingForm} onOpenChange={setShowMeetingForm} />
      </div>
    </AppLayout>
  );
}
