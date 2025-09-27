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
      appointments: {
        Row: {
          client_confirmed: boolean | null
          consultant_confirmed: boolean | null
          consultant_notes: string | null
          contact_request_id: string | null
          created_at: string
          duration_minutes: number
          id: string
          meeting_link: string | null
          meeting_type: string
          scheduled_date: string
          scheduled_time: string
          status: string
          updated_at: string
        }
        Insert: {
          client_confirmed?: boolean | null
          consultant_confirmed?: boolean | null
          consultant_notes?: string | null
          contact_request_id?: string | null
          created_at?: string
          duration_minutes?: number
          id?: string
          meeting_link?: string | null
          meeting_type?: string
          scheduled_date: string
          scheduled_time: string
          status?: string
          updated_at?: string
        }
        Update: {
          client_confirmed?: boolean | null
          consultant_confirmed?: boolean | null
          consultant_notes?: string | null
          contact_request_id?: string | null
          created_at?: string
          duration_minutes?: number
          id?: string
          meeting_link?: string | null
          meeting_type?: string
          scheduled_date?: string
          scheduled_time?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_contact_request_id_fkey"
            columns: ["contact_request_id"]
            isOneToOne: false
            referencedRelation: "contact_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      automated_tasks: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          max_retries: number
          processed_at: string | null
          retry_count: number
          scheduled_for: string
          status: string
          task_data: Json
          task_type: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          max_retries?: number
          processed_at?: string | null
          retry_count?: number
          scheduled_for?: string
          status?: string
          task_data: Json
          task_type: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          max_retries?: number
          processed_at?: string | null
          retry_count?: number
          scheduled_for?: string
          status?: string
          task_data?: Json
          task_type?: string
        }
        Relationships: []
      }
      contact_requests: {
        Row: {
          budget_range: string | null
          company: string | null
          created_at: string
          email: string
          id: string
          message: string | null
          name: string
          phone: string | null
          preferred_date: string | null
          preferred_time: string | null
          service_type: string
          status: string
          updated_at: string
        }
        Insert: {
          budget_range?: string | null
          company?: string | null
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name: string
          phone?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          service_type: string
          status?: string
          updated_at?: string
        }
        Update: {
          budget_range?: string | null
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          phone?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          service_type?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      customer_review_emails: {
        Row: {
          created_at: string
          customer_email: string
          id: string
          review_id: string
        }
        Insert: {
          created_at?: string
          customer_email: string
          id?: string
          review_id: string
        }
        Update: {
          created_at?: string
          customer_email?: string
          id?: string
          review_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_review_emails_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "customer_reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_review_emails_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "public_customer_reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_reviews: {
        Row: {
          company: string | null
          created_at: string
          customer_email: string | null
          customer_name: string
          id: string
          is_approved: boolean
          is_featured: boolean
          is_public: boolean
          rating: number
          review_date: string
          review_text: string
          service_type: string
          updated_at: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name: string
          id?: string
          is_approved?: boolean
          is_featured?: boolean
          is_public?: boolean
          rating: number
          review_date?: string
          review_text: string
          service_type: string
          updated_at?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name?: string
          id?: string
          is_approved?: boolean
          is_featured?: boolean
          is_public?: boolean
          rating?: number
          review_date?: string
          review_text?: string
          service_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      email_automation_steps: {
        Row: {
          automation_id: string
          created_at: string
          delay_minutes: number | null
          html_content: string
          id: string
          is_active: boolean
          step_number: number
          subject: string
          template_id: string | null
          text_content: string | null
        }
        Insert: {
          automation_id: string
          created_at?: string
          delay_minutes?: number | null
          html_content: string
          id?: string
          is_active?: boolean
          step_number: number
          subject: string
          template_id?: string | null
          text_content?: string | null
        }
        Update: {
          automation_id?: string
          created_at?: string
          delay_minutes?: number | null
          html_content?: string
          id?: string
          is_active?: boolean
          step_number?: number
          subject?: string
          template_id?: string | null
          text_content?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_automation_steps_automation_id_fkey"
            columns: ["automation_id"]
            isOneToOne: false
            referencedRelation: "email_automations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_automation_steps_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      email_automations: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          trigger_config: Json | null
          trigger_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          trigger_config?: Json | null
          trigger_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          trigger_config?: Json | null
          trigger_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      email_campaigns: {
        Row: {
          bounced_count: number | null
          clicked_count: number | null
          created_at: string
          delivered_count: number | null
          html_content: string
          id: string
          list_id: string | null
          name: string
          opened_count: number | null
          scheduled_at: string | null
          sent_at: string | null
          status: string
          subject: string
          template_id: string | null
          text_content: string | null
          total_recipients: number | null
          unsubscribed_count: number | null
          updated_at: string
        }
        Insert: {
          bounced_count?: number | null
          clicked_count?: number | null
          created_at?: string
          delivered_count?: number | null
          html_content: string
          id?: string
          list_id?: string | null
          name: string
          opened_count?: number | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string
          subject: string
          template_id?: string | null
          text_content?: string | null
          total_recipients?: number | null
          unsubscribed_count?: number | null
          updated_at?: string
        }
        Update: {
          bounced_count?: number | null
          clicked_count?: number | null
          created_at?: string
          delivered_count?: number | null
          html_content?: string
          id?: string
          list_id?: string | null
          name?: string
          opened_count?: number | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string
          subject?: string
          template_id?: string | null
          text_content?: string | null
          total_recipients?: number | null
          unsubscribed_count?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_campaigns_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "email_lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_campaigns_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      email_events: {
        Row: {
          automation_id: string | null
          campaign_id: string | null
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          subscriber_id: string
        }
        Insert: {
          automation_id?: string | null
          campaign_id?: string | null
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          subscriber_id: string
        }
        Update: {
          automation_id?: string | null
          campaign_id?: string | null
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          subscriber_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_events_automation_id_fkey"
            columns: ["automation_id"]
            isOneToOne: false
            referencedRelation: "email_automations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_events_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "email_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_events_subscriber_id_fkey"
            columns: ["subscriber_id"]
            isOneToOne: false
            referencedRelation: "email_subscribers"
            referencedColumns: ["id"]
          },
        ]
      }
      email_list_subscribers: {
        Row: {
          id: string
          list_id: string
          subscribed_at: string
          subscriber_id: string
        }
        Insert: {
          id?: string
          list_id: string
          subscribed_at?: string
          subscriber_id: string
        }
        Update: {
          id?: string
          list_id?: string
          subscribed_at?: string
          subscriber_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_list_subscribers_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "email_lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_list_subscribers_subscriber_id_fkey"
            columns: ["subscriber_id"]
            isOneToOne: false
            referencedRelation: "email_subscribers"
            referencedColumns: ["id"]
          },
        ]
      }
      email_lists: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      email_queue: {
        Row: {
          automation_id: string | null
          automation_step_id: string | null
          campaign_id: string | null
          created_at: string
          error_message: string | null
          html_content: string
          id: string
          retry_count: number | null
          scheduled_at: string
          sent_at: string | null
          status: string
          subject: string
          subscriber_id: string
          text_content: string | null
        }
        Insert: {
          automation_id?: string | null
          automation_step_id?: string | null
          campaign_id?: string | null
          created_at?: string
          error_message?: string | null
          html_content: string
          id?: string
          retry_count?: number | null
          scheduled_at?: string
          sent_at?: string | null
          status?: string
          subject: string
          subscriber_id: string
          text_content?: string | null
        }
        Update: {
          automation_id?: string | null
          automation_step_id?: string | null
          campaign_id?: string | null
          created_at?: string
          error_message?: string | null
          html_content?: string
          id?: string
          retry_count?: number | null
          scheduled_at?: string
          sent_at?: string | null
          status?: string
          subject?: string
          subscriber_id?: string
          text_content?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_queue_automation_id_fkey"
            columns: ["automation_id"]
            isOneToOne: false
            referencedRelation: "email_automations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_queue_automation_step_id_fkey"
            columns: ["automation_step_id"]
            isOneToOne: false
            referencedRelation: "email_automation_steps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_queue_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "email_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_queue_subscriber_id_fkey"
            columns: ["subscriber_id"]
            isOneToOne: false
            referencedRelation: "email_subscribers"
            referencedColumns: ["id"]
          },
        ]
      }
      email_subscribers: {
        Row: {
          company: string | null
          created_at: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          source: string | null
          status: string
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          source?: string | null
          status?: string
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          source?: string | null
          status?: string
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          created_at: string
          html_content: string
          id: string
          is_active: boolean
          name: string
          subject: string
          template_type: string
          text_content: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          html_content: string
          id?: string
          is_active?: boolean
          name: string
          subject: string
          template_type?: string
          text_content?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          html_content?: string
          id?: string
          is_active?: boolean
          name?: string
          subject?: string
          template_type?: string
          text_content?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      google_calendar_settings: {
        Row: {
          auto_sync: boolean
          buffer_minutes: number
          calendar_id: string
          client_id: string
          client_secret: string
          created_at: string
          id: string
          is_active: boolean
          updated_at: string
          working_days: string[]
          working_hours_end: string
          working_hours_start: string
        }
        Insert: {
          auto_sync?: boolean
          buffer_minutes?: number
          calendar_id?: string
          client_id: string
          client_secret: string
          created_at?: string
          id?: string
          is_active?: boolean
          updated_at?: string
          working_days?: string[]
          working_hours_end?: string
          working_hours_start?: string
        }
        Update: {
          auto_sync?: boolean
          buffer_minutes?: number
          calendar_id?: string
          client_id?: string
          client_secret?: string
          created_at?: string
          id?: string
          is_active?: boolean
          updated_at?: string
          working_days?: string[]
          working_hours_end?: string
          working_hours_start?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          is_admin: boolean
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          is_admin?: boolean
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          is_admin?: boolean
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      renewal_reminders: {
        Row: {
          appointment_id: string
          created_at: string
          error_message: string | null
          id: string
          reminder_date: string
          renewal_setting_id: string | null
          sent_at: string | null
          status: string
        }
        Insert: {
          appointment_id: string
          created_at?: string
          error_message?: string | null
          id?: string
          reminder_date: string
          renewal_setting_id?: string | null
          sent_at?: string | null
          status?: string
        }
        Update: {
          appointment_id?: string
          created_at?: string
          error_message?: string | null
          id?: string
          reminder_date?: string
          renewal_setting_id?: string | null
          sent_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "renewal_reminders_renewal_setting_id_fkey"
            columns: ["renewal_setting_id"]
            isOneToOne: false
            referencedRelation: "renewal_settings"
            referencedColumns: ["id"]
          },
        ]
      }
      renewal_settings: {
        Row: {
          advance_notice_days: number
          appointment_id: string
          created_at: string
          frequency: string
          id: string
          is_active: boolean
          max_renewals: number
          next_renewal_date: string | null
          renewal_type: string
          renewals_count: number
          updated_at: string
        }
        Insert: {
          advance_notice_days?: number
          appointment_id: string
          created_at?: string
          frequency: string
          id?: string
          is_active?: boolean
          max_renewals?: number
          next_renewal_date?: string | null
          renewal_type: string
          renewals_count?: number
          updated_at?: string
        }
        Update: {
          advance_notice_days?: number
          appointment_id?: string
          created_at?: string
          frequency?: string
          id?: string
          is_active?: boolean
          max_renewals?: number
          next_renewal_date?: string | null
          renewal_type?: string
          renewals_count?: number
          updated_at?: string
        }
        Relationships: []
      }
      smtp_settings: {
        Row: {
          created_at: string
          from_email: string
          from_name: string
          host: string
          id: string
          is_active: boolean
          port: number
          secure: boolean
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          from_email: string
          from_name?: string
          host: string
          id?: string
          is_active?: boolean
          port?: number
          secure?: boolean
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          from_email?: string
          from_name?: string
          host?: string
          id?: string
          is_active?: boolean
          port?: number
          secure?: boolean
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      public_customer_reviews: {
        Row: {
          company: string | null
          created_at: string | null
          customer_name: string | null
          id: string | null
          is_approved: boolean | null
          is_featured: boolean | null
          is_public: boolean | null
          rating: number | null
          review_date: string | null
          review_text: string | null
          service_type: string | null
          updated_at: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          customer_name?: string | null
          id?: string | null
          is_approved?: boolean | null
          is_featured?: boolean | null
          is_public?: boolean | null
          rating?: number | null
          review_date?: string | null
          review_text?: string | null
          service_type?: string | null
          updated_at?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string | null
          customer_name?: string | null
          id?: string | null
          is_approved?: boolean | null
          is_featured?: boolean | null
          is_public?: boolean | null
          rating?: number | null
          review_date?: string | null
          review_text?: string | null
          service_type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_google_calendar_settings: {
        Args: Record<PropertyKey, never>
        Returns: {
          auto_sync: boolean
          buffer_minutes: number
          calendar_id: string
          client_id: string
          client_secret: string
          created_at: string
          id: string
          is_active: boolean
          updated_at: string
          working_days: string[]
          working_hours_end: string
          working_hours_start: string
        }[]
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      process_renewal_tasks: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      save_google_calendar_settings: {
        Args: {
          p_auto_sync: boolean
          p_buffer_minutes: number
          p_calendar_id: string
          p_client_id: string
          p_client_secret: string
          p_working_days: string[]
          p_working_hours_end: string
          p_working_hours_start: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
