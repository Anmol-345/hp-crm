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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      athletes: {
        Row: {
          bib_no: number | null
          created_at: string | null
          full_name: string
          gender: Database["public"]["Enums"]["gender_t"] | null
          id: string
          notes: string | null
          unit_id: string | null
        }
        Insert: {
          bib_no?: number | null
          created_at?: string | null
          full_name: string
          gender?: Database["public"]["Enums"]["gender_t"] | null
          id?: string
          notes?: string | null
          unit_id?: string | null
        }
        Update: {
          bib_no?: number | null
          created_at?: string | null
          full_name?: string
          gender?: Database["public"]["Enums"]["gender_t"] | null
          id?: string
          notes?: string | null
          unit_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "athletes_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      cash_cards: {
        Row: {
          amount_inr: number
          athlete_id: string | null
          event_no: number | null
          id: string
          position: Database["public"]["Enums"]["position_t"]
          remark: string | null
          serial_no: number
          signature_path: string | null
          signed: boolean | null
          signed_at: string | null
        }
        Insert: {
          amount_inr: number
          athlete_id?: string | null
          event_no?: number | null
          id?: string
          position: Database["public"]["Enums"]["position_t"]
          remark?: string | null
          serial_no: number
          signature_path?: string | null
          signed?: boolean | null
          signed_at?: string | null
        }
        Update: {
          amount_inr?: number
          athlete_id?: string | null
          event_no?: number | null
          id?: string
          position?: Database["public"]["Enums"]["position_t"]
          remark?: string | null
          serial_no?: number
          signature_path?: string | null
          signed?: boolean | null
          signed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cash_cards_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cash_cards_event_no_fkey"
            columns: ["event_no"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["event_no"]
          },
        ]
      }
      events: {
        Row: {
          age_max: number | null
          age_min: number | null
          category: string
          created_at: string | null
          event_date: string | null
          event_no: number
          gender: Database["public"]["Enums"]["gender_t"] | null
          is_spouse: boolean | null
          meet_record: string | null
          metric: Database["public"]["Enums"]["metric_t"]
          name: string
          participants_count: number | null
          scheduled_time: string | null
        }
        Insert: {
          age_max?: number | null
          age_min?: number | null
          category: string
          created_at?: string | null
          event_date?: string | null
          event_no: number
          gender?: Database["public"]["Enums"]["gender_t"] | null
          is_spouse?: boolean | null
          meet_record?: string | null
          metric?: Database["public"]["Enums"]["metric_t"]
          name: string
          participants_count?: number | null
          scheduled_time?: string | null
        }
        Update: {
          age_max?: number | null
          age_min?: number | null
          category?: string
          created_at?: string | null
          event_date?: string | null
          event_no?: number
          gender?: Database["public"]["Enums"]["gender_t"] | null
          is_spouse?: boolean | null
          meet_record?: string | null
          metric?: Database["public"]["Enums"]["metric_t"]
          name?: string
          participants_count?: number | null
          scheduled_time?: string | null
        }
        Relationships: []
      }
      heat_entries: {
        Row: {
          athlete_id: string | null
          bib_no: number | null
          created_at: string | null
          heat_id: string | null
          id: string
          needs_verification: boolean | null
          performance: number | null
          rank_remark: string | null
        }
        Insert: {
          athlete_id?: string | null
          bib_no?: number | null
          created_at?: string | null
          heat_id?: string | null
          id?: string
          needs_verification?: boolean | null
          performance?: number | null
          rank_remark?: string | null
        }
        Update: {
          athlete_id?: string | null
          bib_no?: number | null
          created_at?: string | null
          heat_id?: string | null
          id?: string
          needs_verification?: boolean | null
          performance?: number | null
          rank_remark?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "heat_entries_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "heat_entries_heat_id_fkey"
            columns: ["heat_id"]
            isOneToOne: false
            referencedRelation: "heats"
            referencedColumns: ["id"]
          },
        ]
      }
      heats: {
        Row: {
          event_no: number | null
          heat_no: number
          id: string
          time_recorded: string | null
        }
        Insert: {
          event_no?: number | null
          heat_no: number
          id?: string
          time_recorded?: string | null
        }
        Update: {
          event_no?: number | null
          heat_no?: number
          id?: string
          time_recorded?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "heats_event_no_fkey"
            columns: ["event_no"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["event_no"]
          },
        ]
      }
      prize_scale: {
        Row: {
          amount_inr: number
          position: Database["public"]["Enums"]["position_t"]
        }
        Insert: {
          amount_inr: number
          position: Database["public"]["Enums"]["position_t"]
        }
        Update: {
          amount_inr?: number
          position?: Database["public"]["Enums"]["position_t"]
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["role_t"]
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["role_t"]
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["role_t"]
        }
        Relationships: []
      }
      results: {
        Row: {
          athlete_id: string | null
          event_no: number | null
          id: string
          performance: number | null
          position: number | null
          result_date: string | null
        }
        Insert: {
          athlete_id?: string | null
          event_no?: number | null
          id?: string
          performance?: number | null
          position?: number | null
          result_date?: string | null
        }
        Update: {
          athlete_id?: string | null
          event_no?: number | null
          id?: string
          performance?: number | null
          position?: number | null
          result_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "results_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "results_event_no_fkey"
            columns: ["event_no"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["event_no"]
          },
        ]
      }
      units: {
        Row: {
          id: string
          kind: string | null
          name: string
        }
        Insert: {
          id?: string
          kind?: string | null
          name: string
        }
        Update: {
          id?: string
          kind?: string | null
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      medal_table: {
        Row: {
          bronze: number | null
          gold: number | null
          silver: number | null
          total_medals: number | null
          total_points: number | null
          unit: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      current_role: {
        Args: never
        Returns: Database["public"]["Enums"]["role_t"]
      }
      publish_results: { Args: { p_event_no: number }; Returns: undefined }
    }
    Enums: {
      gender_t: "male" | "female" | "girl" | "boy"
      metric_t: "time_sec" | "distance_m"
      position_t: "winner" | "runner_up" | "first_runner_up"
      role_t: "admin" | "official" | "viewer"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      gender_t: ["male", "female", "girl", "boy"],
      metric_t: ["time_sec", "distance_m"],
      position_t: ["winner", "runner_up", "first_runner_up"],
      role_t: ["admin", "official", "viewer"],
    },
  },
} as const
