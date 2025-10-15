import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client for browser usage
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client for server-side operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          auth_uid: string | null
          name: string | null
          email: string | null
          phone: string | null
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          auth_uid?: string | null
          name?: string | null
          email?: string | null
          phone?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          auth_uid?: string | null
          name?: string | null
          email?: string | null
          phone?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          cover_image_url: string | null
          start_datetime: string | null
          end_datetime: string | null
          seats_total: number
          seats_available: number
          price_cents: number
          currency: string
          template_id: string | null
          is_active: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          cover_image_url?: string | null
          start_datetime?: string | null
          end_datetime?: string | null
          seats_total?: number
          seats_available?: number
          price_cents?: number
          currency?: string
          template_id?: string | null
          is_active?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          cover_image_url?: string | null
          start_datetime?: string | null
          end_datetime?: string | null
          seats_total?: number
          seats_available?: number
          price_cents?: number
          currency?: string
          template_id?: string | null
          is_active?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      registrations: {
        Row: {
          id: string
          event_id: string
          user_id: string | null
          name: string | null
          email: string | null
          phone: string | null
          roll_no: string | null
          tickets: number
          ticket_details: any | null
          status: 'pending' | 'payment_initiated' | 'paid' | 'failed' | 'refunded'
          metadata: any | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          user_id?: string | null
          name?: string | null
          email?: string | null
          phone?: string | null
          roll_no?: string | null
          tickets?: number
          ticket_details?: any | null
          status?: 'pending' | 'payment_initiated' | 'paid' | 'failed' | 'refunded'
          metadata?: any | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string | null
          name?: string | null
          email?: string | null
          phone?: string | null
          roll_no?: string | null
          tickets?: number
          ticket_details?: any | null
          status?: 'pending' | 'payment_initiated' | 'paid' | 'failed' | 'refunded'
          metadata?: any | null
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          registration_id: string
          provider: string | null
          provider_order_id: string | null
          provider_payment_id: string | null
          amount_cents: number | null
          currency: string | null
          status: 'initiated' | 'succeeded' | 'failed' | 'refunded'
          raw_event: any | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          registration_id: string
          provider?: string | null
          provider_order_id?: string | null
          provider_payment_id?: string | null
          amount_cents?: number | null
          currency?: string | null
          status?: 'initiated' | 'succeeded' | 'failed' | 'refunded'
          raw_event?: any | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          registration_id?: string
          provider?: string | null
          provider_order_id?: string | null
          provider_payment_id?: string | null
          amount_cents?: number | null
          currency?: string | null
          status?: 'initiated' | 'succeeded' | 'failed' | 'refunded'
          raw_event?: any | null
          created_at?: string
          updated_at?: string
        }
      }
      exports: {
        Row: {
          id: string
          event_id: string | null
          file_url: string | null
          generated_at: string
          generated_by: string | null
        }
        Insert: {
          id?: string
          event_id?: string | null
          file_url?: string | null
          generated_at?: string
          generated_by?: string | null
        }
        Update: {
          id?: string
          event_id?: string | null
          file_url?: string | null
          generated_at?: string
          generated_by?: string | null
        }
      }
      ,career_opportunities: {
        Row: {
          id: string
          title: string
          description: string | null
          google_form_url: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          google_form_url: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          google_form_url?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
