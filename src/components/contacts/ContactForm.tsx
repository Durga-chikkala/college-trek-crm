
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateContact, useUpdateContact } from "@/hooks/useContacts";
import { useColleges } from "@/hooks/useColleges";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

interface ContactFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact?: Tables<'contacts'> & { college_name?: string };
}

type ContactFormData = {
  name: string;
  college_id: string;
  designation?: string;
  phone?: string;
  email?: string;
  linkedin?: string;
  notes?: string;
  is_primary?: boolean;
};

export const ContactForm = ({ open, onOpenChange, contact }: ContactFormProps) => {
  const { register, handleSubmit, reset, setValue, watch } = useForm<ContactFormData>({
    defaultValues: contact ? {
      name: contact.name,
      college_id: contact.college_id,
      designation: contact.designation || '',
      phone: contact.phone || '',
      email: contact.email || '',
      linkedin: contact.linkedin || '',
      notes: contact.notes || '',
      is_primary: contact.is_primary || false
    } : {
      is_primary: false
    }
  });

  const createContact = useCreateContact();
  const updateContact = useUpdateContact();
  const { data: colleges = [] } = useColleges();
  const collegeId = watch('college_id');
  const isPrimary = watch('is_primary');

  const onSubmit = async (data: ContactFormData) => {
    if (contact) {
      await updateContact.mutateAsync({ id: contact.id, ...data });
    } else {
      await createContact.mutateAsync(data as TablesInsert<'contacts'>);
    }
    reset();
    onOpenChange(false);
  };

  const isLoading = createContact.isPending || updateContact.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {contact ? "Edit Contact" : "Add New Contact"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Contact Name *</Label>
              <Input
                id="name"
                {...register("name", { required: true })}
                placeholder="Enter contact name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="college_id">College *</Label>
              <Select value={collegeId} onValueChange={(value) => setValue('college_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select college" />
                </SelectTrigger>
                <SelectContent>
                  {colleges.map((college) => (
                    <SelectItem key={college.id} value={college.id}>
                      {college.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="designation">Designation</Label>
              <Input
                id="designation"
                {...register("designation")}
                placeholder="e.g., Principal, Dean"
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="contact@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                {...register("linkedin")}
                placeholder="LinkedIn profile URL"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...register("notes")}
              placeholder="Additional notes about the contact"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_primary"
              checked={isPrimary}
              onCheckedChange={(checked) => setValue('is_primary', checked as boolean)}
            />
            <Label htmlFor="is_primary">Primary Contact</Label>
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
              {isLoading ? (contact ? "Updating..." : "Adding...") : (contact ? "Update Contact" : "Add Contact")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
