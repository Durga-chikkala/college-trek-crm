
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Building2 } from "lucide-react";
import { useColleges } from "@/hooks/useColleges";
import { CollegeForm } from "@/components/colleges/CollegeForm";

export default function Colleges() {
  const [search, setSearch] = useState("");
  const [showCollegeForm, setShowCollegeForm] = useState(false);
  const { data: colleges, isLoading: loading, error } = useColleges();

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading colleges...</p>
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
          <h1 className="text-3xl font-bold text-slate-900">Colleges</h1>
          <Button onClick={() => setShowCollegeForm(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add College
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <Label htmlFor="search">Search Colleges:</Label>
            <Input
              type="text"
              id="search"
              placeholder="Enter college name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {/* Add more filters here if needed */}
        </div>

        {/* Colleges Grid */}
        <div className="overflow-x-auto">
          <Table>
            <TableCaption>A list of your colleges.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">Icon</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>City</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {colleges?.map((college) => (
                <TableRow key={college.id}>
                  <TableCell>
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-blue-600" />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{college.name}</TableCell>
                  <TableCell>{college.city || 'N/A'}</TableCell>
                  <TableCell>{college.state || 'N/A'}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      college.status === 'closed_won' ? 'bg-green-100 text-green-800' :
                      college.status === 'negotiation' ? 'bg-yellow-100 text-yellow-800' :
                      college.status === 'lost' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {college.status.replace('_', ' ')}
                    </span>
                  </TableCell>
                  <TableCell>{college.email || 'N/A'}</TableCell>
                  <TableCell>{college.phone || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* College Form Modal */}
        <CollegeForm open={showCollegeForm} onOpenChange={setShowCollegeForm} />
      </div>
    </AppLayout>
  );
}
