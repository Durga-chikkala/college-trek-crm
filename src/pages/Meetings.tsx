
import { AppLayout } from "@/components/layout/AppLayout";
import { Calendar } from "lucide-react";

const Meetings = () => {
  return (
    <AppLayout>
      <div className="p-8">
        <div className="space-y-2 mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Meetings</h1>
          <p className="text-slate-600">Track your college visits and follow-ups</p>
        </div>
        
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No meetings logged</h3>
          <p className="text-slate-500">Start by logging your first college meeting</p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Meetings;
