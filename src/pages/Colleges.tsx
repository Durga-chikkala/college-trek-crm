
import { AppLayout } from "@/components/layout/AppLayout";

const Colleges = () => {
  return (
    <AppLayout>
      <div className="p-8">
        <div className="space-y-2 mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Colleges</h1>
          <p className="text-slate-600">Manage your college prospects and deals</p>
        </div>
        
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No colleges yet</h3>
          <p className="text-slate-500">Start by adding your first college prospect</p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Colleges;
