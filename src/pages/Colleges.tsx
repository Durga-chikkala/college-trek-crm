
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { CollegeManagement } from '@/components/colleges/CollegeManagement';

const Colleges = () => {
  return (
    <AppLayout>
      <div className="min-h-screen bg-slate-50">
        <CollegeManagement />
      </div>
    </AppLayout>
  );
};

export default Colleges;
