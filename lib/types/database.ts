/**
 * Database Types
 * TypeScript types for Supabase database tables
 */

export interface Worker {
  id: string // UUID - references auth.users(id)
  name: string
  phone: string | null
  company: string
  qr_code_hash: string
  created_at: string
  updated_at: string
}

export interface Site {
  id: string
  name: string
  address: string | null
  auto_signout_time: string // TIME format
  created_at: string
}

export interface SiteAdmin {
  site_id: string
  admin_id: string
  role: string
}

export interface SignIn {
  id: string
  worker_id: string
  site_id: string
  signed_in_at: string
  signed_out_at: string | null
  signed_out_method: 'auto' | 'manual' | 'admin' | null
  quiz_completed: boolean
  quiz_score: number | null
  created_at: string
}

export interface QuizQuestion {
  id: string
  site_id: string | null
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_answer: 'A' | 'B' | 'C' | 'D'
  explanation: string | null
  created_at: string
}

export interface QuizResponse {
  id: string
  sign_in_id: string
  question_id: string
  selected_answer: 'A' | 'B' | 'C' | 'D'
  is_correct: boolean
  created_at: string
}
