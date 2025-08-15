
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateCollege, useUpdateCollege } from "@/hooks/useColleges";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

interface CollegeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  college?: Tables<'colleges'>;
}

type CollegeFormData = {
  name: string;
  address?: string;
  city?: string;
  state?: string;
  pin_code?: string;
  website?: string;
  email?: string;
  phone?: string;
  status: "prospect" | "negotiation" | "closed_won" | "lost";
  assigned_rep?: string;
};

export const CollegeForm = ({ open, onOpenChange, college }: CollegeFormProps) => {
  const { register, handleSubmit, reset, setValue, watch } = useForm<CollegeFormData>({
    defaultValues: college ? {
      name: college.name,
      address: college.address || '',
      city: college.city || '',
      state: college.state || '',
      pin_code: college.pin_code || '',
      website: college.website || '',
      email: college.email || '',
      phone: college.phone || '',
      status: college.status,
      assigned_rep: college.assigned_rep || undefined
    } : {
      status: 'prospect' as const
    }
  });

  const createCollege = useCreateCollege();
  const updateCollege = useUpdateCollege();
  const status = watch('status');

  const onSubmit = async (data: CollegeFormData) => {
    if (college) {
      await updateCollege.mutateAsync({ id: college.id, ...data });
    } else {
      await createCollege.mutateAsync(data as TablesInsert<'colleges'>);
    }
    reset();
    onOpenChange(false);
  };

  const isLoading = createCollege.isPending || updateCollege.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {college ? "Edit College" : "Add New College"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">College Name *</Label>
              <Input
                id="name"
                {...register("name", { required: true })}
                placeholder="Enter college name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value) => setValue('status', value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="prospect">Prospect</SelectItem>
                  <SelectItem value="negotiation">Negotiation</SelectItem>
                  <SelectItem value="closed_won">Closed Won</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              {...register("address")}
              placeholder="Enter full address"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                {...register("city")}
                placeholder="City"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                {...register("state")}
                placeholder="State"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pin_code">PIN Code</Label>
              <Input
                id="pin_code"
                {...register("pin_code")}
                placeholder="PIN Code"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="contact@college.edu"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                {...register("phone")}
                placeholder="Phone number"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              {...register("website")}
              placeholder="https://college.edu"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (college ? "Updating..." : "Adding...") : (college ? "Update College" : "Add College")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
