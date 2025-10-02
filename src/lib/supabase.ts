import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  is_verified: boolean;
  trust_score: number;
  created_at: string;
  updated_at: string;
};

export type Trip = {
  id: string;
  user_id: string;
  destination: string;
  trip_type: 'solo' | 'family' | 'friends' | 'stranger';
  start_date: string;
  end_date: string;
  num_travelers: number;
  status: 'planned' | 'ongoing' | 'completed';
  is_public: boolean;
  privacy_level: 'public' | 'anonymized' | 'invite-only';
  created_at: string;
  updated_at: string;
};

export type POI = {
  id: string;
  name: string;
  destination: string;
  category: 'historical' | 'adventure' | 'nature' | 'food' | 'culture';
  latitude: number;
  longitude: number;
  rating: number;
  review_count: number;
  typical_duration: number;
  opening_time?: string;
  closing_time?: string;
  image_url?: string;
  description?: string;
  effort_score: number;
  created_at: string;
};

export type ItineraryDay = {
  id: string;
  trip_id: string;
  day_number: number;
  date: string;
  total_distance_km: number;
  total_duration_minutes: number;
  effort_budget_used: number;
  is_finalized: boolean;
  created_at: string;
};

export type ItineraryActivity = {
  id: string;
  itinerary_day_id: string;
  poi_id: string;
  sequence_order: number;
  start_time?: string;
  end_time?: string;
  duration_minutes: number;
  travel_time_from_previous: number;
  travel_mode: 'walk' | 'drive' | 'transit';
  buffer_minutes: number;
  is_plan_b: boolean;
  status: 'pending' | 'completed' | 'skipped' | 'missed';
  created_at: string;
};

export type Accommodation = {
  id: string;
  trip_id: string;
  name: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  check_in_date: string;
  check_out_date: string;
  num_nights: number;
  created_at: string;
};

export type CommunityPost = {
  id: string;
  trip_id: string;
  user_id: string;
  title: string;
  description?: string;
  tags: string[];
  upvotes: number;
  view_count: number;
  is_active: boolean;
  max_participants?: number;
  created_at: string;
};

export type SafetyAlert = {
  id: string;
  trip_id: string;
  user_id: string;
  alert_type: 'sos' | 'silent' | 'geofence';
  latitude?: number;
  longitude?: number;
  message?: string;
  status: 'active' | 'resolved';
  created_at: string;
  resolved_at?: string;
};
