
import { AppLayout } from "@/components/layout/AppLayout";
import { Users } from "lucide-react";

const Contacts = () => {
  return (
    <AppLayout>
      <div className="p-8">
        <div className="space-y-2 mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Contacts</h1>
          <p className="text-slate-600">Manage your college contacts and relationships</p>
        </div>
        
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No contacts added</h3>
          <p className="text-slate-500">Start by adding your first college contact</p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Contacts;
