export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      college_courses: {
        Row: {
          assigned_at: string
          college_id: string
          course_id: string
          id: string
          is_active: boolean | null
          pricing_model_id: string | null
        }
        Insert: {
          assigned_at?: string
          college_id: string
          course_id: string
          id?: string
          is_active?: boolean | null
          pricing_model_id?: string | null
        }
        Update: {
          assigned_at?: string
          college_id?: string
          course_id?: string
          id?: string
          is_active?: boolean | null
          pricing_model_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "college_courses_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "college_courses_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "college_courses_pricing_model_id_fkey"
            columns: ["pricing_model_id"]
            isOneToOne: false
            referencedRelation: "pricing_models"
            referencedColumns: ["id"]
          },
        ]
      }
      college_pricing_models: {
        Row: {
          assigned_at: string
          college_id: string
          id: string
          is_active: boolean | null
          pricing_model_id: string
        }
        Insert: {
          assigned_at?: string
          college_id: string
          id?: string
          is_active?: boolean | null
          pricing_model_id: string
        }
        Update: {
          assigned_at?: string
          college_id?: string
          id?: string
          is_active?: boolean | null
          pricing_model_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "college_pricing_models_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "college_pricing_models_pricing_model_id_fkey"
            columns: ["pricing_model_id"]
            isOneToOne: false
            referencedRelation: "pricing_models"
            referencedColumns: ["id"]
          },
        ]
      }
      college_tags: {
        Row: {
          college_id: string
          created_at: string
          id: string
          tag_id: string
        }
        Insert: {
          college_id: string
          created_at?: string
          id?: string
          tag_id: string
        }
        Update: {
          college_id?: string
          created_at?: string
          id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "college_tags_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "college_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      colleges: {
        Row: {
          address: string | null
          assigned_rep: string | null
          city: string | null
          created_at: string
          created_by: string
          email: string | null
          id: string
          name: string
          phone: string | null
          pin_code: string | null
          state: string | null
          status: Database["public"]["Enums"]["college_status"]
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          assigned_rep?: string | null
          city?: string | null
          created_at?: string
          created_by: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          pin_code?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["college_status"]
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          assigned_rep?: string | null
          city?: string | null
          created_at?: string
          created_by?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          pin_code?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["college_status"]
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      contacts: {
        Row: {
          college_id: string
          created_at: string
          created_by: string
          designation: string | null
          email: string | null
          id: string
          is_primary: boolean | null
          linkedin: string | null
          name: string
          notes: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          college_id: string
          created_at?: string
          created_by: string
          designation?: string | null
          email?: string | null
          id?: string
          is_primary?: boolean | null
          linkedin?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          college_id?: string
          created_at?: string
          created_by?: string
          designation?: string | null
          email?: string | null
          id?: string
          is_primary?: boolean | null
          linkedin?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contacts_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
        ]
      }
      course_topics: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          id: string
          is_manual: boolean
          order_index: number
          readme_content: string | null
          title: string
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_manual?: boolean
          order_index?: number
          readme_content?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_manual?: boolean
          order_index?: number
          readme_content?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_topics_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          base_price: number
          capacity: number
          category: string
          college_id: string | null
          created_at: string
          created_by: string
          description: string | null
          duration: string
          id: string
          max_price: number | null
          min_price: number | null
          name: string
          pricing_model_id: string | null
          updated_at: string
        }
        Insert: {
          base_price: number
          capacity?: number
          category?: string
          college_id?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          duration?: string
          id?: string
          max_price?: number | null
          min_price?: number | null
          name: string
          pricing_model_id?: string | null
          updated_at?: string
        }
        Update: {
          base_price?: number
          capacity?: number
          category?: string
          college_id?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          duration?: string
          id?: string
          max_price?: number | null
          min_price?: number | null
          name?: string
          pricing_model_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_pricing_model_id_fkey"
            columns: ["pricing_model_id"]
            isOneToOne: false
            referencedRelation: "pricing_models"
            referencedColumns: ["id"]
          },
        ]
      }
      files: {
        Row: {
          college_id: string | null
          created_at: string
          file_path: string
          file_size: number | null
          id: string
          meeting_id: string | null
          mime_type: string | null
          name: string
          uploaded_by: string
        }
        Insert: {
          college_id?: string | null
          created_at?: string
          file_path: string
          file_size?: number | null
          id?: string
          meeting_id?: string | null
          mime_type?: string | null
          name: string
          uploaded_by: string
        }
        Update: {
          college_id?: string | null
          created_at?: string
          file_path?: string
          file_size?: number | null
          id?: string
          meeting_id?: string | null
          mime_type?: string | null
          name?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "files_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "files_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
        ]
      }
      meeting_tags: {
        Row: {
          created_at: string
          id: string
          meeting_id: string
          tag_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          meeting_id: string
          tag_id: string
        }
        Update: {
          created_at?: string
          id?: string
          meeting_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meeting_tags_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meeting_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      meetings: {
        Row: {
          agenda: string | null
          college_id: string
          created_at: string
          created_by: string
          discussion_notes: string | null
          duration_minutes: number | null
          id: string
          latitude: number | null
          location: string | null
          longitude: number | null
          meeting_date: string
          next_follow_up_date: string | null
          outcome: Database["public"]["Enums"]["meeting_outcome"] | null
          title: string
          updated_at: string
        }
        Insert: {
          agenda?: string | null
          college_id: string
          created_at?: string
          created_by: string
          discussion_notes?: string | null
          duration_minutes?: number | null
          id?: string
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          meeting_date: string
          next_follow_up_date?: string | null
          outcome?: Database["public"]["Enums"]["meeting_outcome"] | null
          title: string
          updated_at?: string
        }
        Update: {
          agenda?: string | null
          college_id?: string
          created_at?: string
          created_by?: string
          discussion_notes?: string | null
          duration_minutes?: number | null
          id?: string
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          meeting_date?: string
          next_follow_up_date?: string | null
          outcome?: Database["public"]["Enums"]["meeting_outcome"] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meetings_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_models: {
        Row: {
          base_price: number
          conditions: Json | null
          created_at: string
          created_by: string
          description: string | null
          discount_percentage: number | null
          id: string
          is_active: boolean | null
          markup_percentage: number | null
          max_price: number | null
          min_price: number | null
          name: string
          pricing_type: string
          updated_at: string
        }
        Insert: {
          base_price: number
          conditions?: Json | null
          created_at?: string
          created_by: string
          description?: string | null
          discount_percentage?: number | null
          id?: string
          is_active?: boolean | null
          markup_percentage?: number | null
          max_price?: number | null
          min_price?: number | null
          name: string
          pricing_type?: string
          updated_at?: string
        }
        Update: {
          base_price?: number
          conditions?: Json | null
          created_at?: string
          created_by?: string
          description?: string | null
          discount_percentage?: number | null
          id?: string
          is_active?: boolean | null
          markup_percentage?: number | null
          max_price?: number | null
          min_price?: number | null
          name?: string
          pricing_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          color: string | null
          created_at: string
          id: string
          name: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "sales_executive"
      college_status: "prospect" | "negotiation" | "closed_won" | "lost"
      meeting_outcome: "interested" | "follow_up" | "not_interested"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "sales_executive"],
      college_status: ["prospect", "negotiation", "closed_won", "lost"],
      meeting_outcome: ["interested", "follow_up", "not_interested"],
    },
  },
} as const
