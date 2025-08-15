
export type CollegeStatus = 'prospect' | 'negotiation' | 'closed_won' | 'closed_lost';
export type MeetingOutcome = 'interested' | 'follow_up' | 'not_interested' | 'proposal_sent' | 'deal_closed';
export type AppRole = 'admin' | 'sales_executive';

export interface College {
  id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  pin_code?: string;
  website?: string;
  email?: string;
  phone?: string;
  status: CollegeStatus;
  assigned_rep?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: string;
  college_id: string;
  name: string;
  designation?: string;
  phone?: string;
  email?: string;
  linkedin?: string;
  notes?: string;
  is_primary?: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Meeting {
  id: string;
  college_id: string;
  title: string;
  meeting_date: string;
  agenda?: string;
  discussion_notes?: string;
  outcome?: MeetingOutcome;
  duration_minutes?: number;
  location?: string;
  latitude?: number;
  longitude?: number;
  next_follow_up_date?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  created_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}
