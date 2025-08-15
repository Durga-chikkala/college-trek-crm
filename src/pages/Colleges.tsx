import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { College } from "@/types";
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
import { Plus } from "lucide-react";
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
                <TableHead className="w-[100px]">Logo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {colleges?.map((college) => (
                <TableRow key={college.id}>
                  <TableCell>
                    <img
                      src={college.logo_url}
                      alt={`${college.name} Logo`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </TableCell>
                  <TableCell>{college.name}</TableCell>
                  <TableCell>{college.location}</TableCell>
                  <TableCell>{college.description}</TableCell>
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
