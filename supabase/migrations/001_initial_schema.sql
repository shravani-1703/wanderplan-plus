/*
  # Travel Planner Application - Initial Schema

  ## Overview
  This migration sets up the complete database schema for a comprehensive travel planning platform
  with AI-powered itinerary generation, community features, safety features, and offline support.

  ## New Tables Created

  ### 1. `profiles`
  User profile information linked to Supabase Auth
  - `id` (uuid, primary key) - Links to auth.users
  - `email` (text) - User email
  - `full_name` (text) - User's full name
  - `phone` (text) - Phone number for verification
  - `is_verified` (boolean) - Verification status
  - `trust_score` (integer) - User trust rating (0-100)
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `trips`
  Main trip records
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to profiles)
  - `destination` (text) - Destination name
  - `trip_type` (text) - solo/family/friends/stranger
  - `start_date` (date) - Trip start date
  - `end_date` (date) - Trip end date
  - `num_travelers` (integer) - Number of travelers
  - `status` (text) - planned/ongoing/completed
  - `is_public` (boolean) - Public visibility in community
  - `privacy_level` (text) - public/anonymized/invite-only
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. `accommodations`
  Hotel/homestay details for trips
  - `id` (uuid, primary key)
  - `trip_id` (uuid, foreign key to trips)
  - `name` (text) - Accommodation name
  - `address` (text) - Full address
  - `latitude` (numeric) - GPS coordinates
  - `longitude` (numeric) - GPS coordinates
  - `check_in_date` (date)
  - `check_out_date` (date)
  - `num_nights` (integer)

  ### 4. `pois` (Points of Interest)
  Available attractions and places
  - `id` (uuid, primary key)
  - `name` (text) - POI name
  - `destination` (text) - City/region
  - `category` (text) - historical/adventure/nature/food/culture
  - `latitude` (numeric) - GPS coordinates
  - `longitude` (numeric) - GPS coordinates
  - `rating` (numeric) - Average rating
  - `review_count` (integer) - Number of reviews
  - `typical_duration` (integer) - Typical visit duration in minutes
  - `opening_time` (time) - Opening time
  - `closing_time` (time) - Closing time
  - `image_url` (text) - Image URL
  - `description` (text) - Description
  - `effort_score` (integer) - Effort required (1-10)
  - `created_at` (timestamptz)

  ### 5. `itinerary_days`
  Day-by-day itinerary structure
  - `id` (uuid, primary key)
  - `trip_id` (uuid, foreign key to trips)
  - `day_number` (integer) - Day 1, 2, 3, etc.
  - `date` (date) - Actual date
  - `total_distance_km` (numeric) - Total distance for the day
  - `total_duration_minutes` (integer) - Total time including buffers
  - `effort_budget_used` (integer) - Effort score used
  - `is_finalized` (boolean) - Whether itinerary is locked
  - `created_at` (timestamptz)

  ### 6. `itinerary_activities`
  Individual activities/POI visits in the itinerary
  - `id` (uuid, primary key)
  - `itinerary_day_id` (uuid, foreign key to itinerary_days)
  - `poi_id` (uuid, foreign key to pois)
  - `sequence_order` (integer) - Order in the day (1, 2, 3...)
  - `start_time` (time) - Scheduled start time
  - `end_time` (time) - Scheduled end time
  - `duration_minutes` (integer) - Planned duration
  - `travel_time_from_previous` (integer) - Travel time in minutes
  - `travel_mode` (text) - walk/drive/transit
  - `buffer_minutes` (integer) - Buffer time (meals, breaks)
  - `is_plan_b` (boolean) - Is this a backup option
  - `status` (text) - pending/completed/skipped/missed
  - `created_at` (timestamptz)

  ### 7. `plan_b_alternatives`
  Backup POIs for each main POI
  - `id` (uuid, primary key)
  - `itinerary_activity_id` (uuid, foreign key to itinerary_activities)
  - `alternative_poi_id` (uuid, foreign key to pois)
  - `reason` (text) - Why this is a good alternative
  - `priority` (integer) - 1 = best alternative
  - `created_at` (timestamptz)

  ### 8. `trip_participants`
  Users participating in a trip
  - `id` (uuid, primary key)
  - `trip_id` (uuid, foreign key to trips)
  - `user_id` (uuid, foreign key to profiles)
  - `role` (text) - owner/participant/requested
  - `status` (text) - accepted/pending/rejected
  - `joined_at` (timestamptz)

  ### 9. `community_posts`
  Public trip posts in community feed
  - `id` (uuid, primary key)
  - `trip_id` (uuid, foreign key to trips)
  - `user_id` (uuid, foreign key to profiles)
  - `title` (text) - Post title
  - `description` (text) - Post description
  - `tags` (text[]) - Array of tags
  - `upvotes` (integer) - Number of upvotes
  - `view_count` (integer) - Number of views
  - `is_active` (boolean) - Whether accepting join requests
  - `max_participants` (integer) - Max group size
  - `created_at` (timestamptz)

  ### 10. `community_comments`
  Comments on community posts
  - `id` (uuid, primary key)
  - `post_id` (uuid, foreign key to community_posts)
  - `user_id` (uuid, foreign key to profiles)
  - `comment` (text) - Comment text
  - `created_at` (timestamptz)

  ### 11. `emergency_contacts`
  Emergency contacts for users
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to profiles)
  - `name` (text) - Contact name
  - `phone` (text) - Contact phone
  - `relationship` (text) - Relationship to user
  - `priority` (integer) - 1 = primary contact
  - `created_at` (timestamptz)

  ### 12. `safety_alerts`
  Safety alerts and SOS triggers
  - `id` (uuid, primary key)
  - `trip_id` (uuid, foreign key to trips)
  - `user_id` (uuid, foreign key to profiles)
  - `alert_type` (text) - sos/silent/geofence
  - `latitude` (numeric) - Location when triggered
  - `longitude` (numeric) - Location when triggered
  - `message` (text) - Alert message
  - `status` (text) - active/resolved
  - `created_at` (timestamptz)
  - `resolved_at` (timestamptz)

  ### 13. `offline_data`
  Cached data for offline access
  - `id` (uuid, primary key)
  - `trip_id` (uuid, foreign key to trips)
  - `user_id` (uuid, foreign key to profiles)
  - `data_type` (text) - map_tiles/poi_data/tickets/routes
  - `data_url` (text) - URL to cached data
  - `file_size_mb` (numeric) - File size
  - `downloaded_at` (timestamptz)

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Users can only access their own data
  - Community posts are readable by all authenticated users
  - Trip participants can access shared trip data
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. PROFILES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  phone text,
  is_verified boolean DEFAULT false,
  trust_score integer DEFAULT 50,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- =====================================================
-- 2. TRIPS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS trips (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  destination text NOT NULL,
  trip_type text NOT NULL CHECK (trip_type IN ('solo', 'family', 'friends', 'stranger')),
  start_date date NOT NULL,
  end_date date NOT NULL,
  num_travelers integer DEFAULT 1,
  status text DEFAULT 'planned' CHECK (status IN ('planned', 'ongoing', 'completed')),
  is_public boolean DEFAULT false,
  privacy_level text DEFAULT 'public' CHECK (privacy_level IN ('public', 'anonymized', 'invite-only')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own trips"
  ON trips FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id
    OR id IN (
      SELECT trip_id FROM trip_participants
      WHERE user_id = auth.uid() AND status = 'accepted'
    )
  );

CREATE POLICY "Users can create trips"
  ON trips FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trips"
  ON trips FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own trips"
  ON trips FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- =====================================================
-- 3. ACCOMMODATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS accommodations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  name text NOT NULL,
  address text,
  latitude numeric(10, 7),
  longitude numeric(10, 7),
  check_in_date date NOT NULL,
  check_out_date date NOT NULL,
  num_nights integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE accommodations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view accommodations for their trips"
  ON accommodations FOR SELECT
  TO authenticated
  USING (
    trip_id IN (
      SELECT id FROM trips WHERE user_id = auth.uid()
      UNION
      SELECT trip_id FROM trip_participants WHERE user_id = auth.uid() AND status = 'accepted'
    )
  );

CREATE POLICY "Users can manage accommodations for their trips"
  ON accommodations FOR ALL
  TO authenticated
  USING (
    trip_id IN (SELECT id FROM trips WHERE user_id = auth.uid())
  )
  WITH CHECK (
    trip_id IN (SELECT id FROM trips WHERE user_id = auth.uid())
  );

-- =====================================================
-- 4. POIS (Points of Interest) TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS pois (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  destination text NOT NULL,
  category text NOT NULL CHECK (category IN ('historical', 'adventure', 'nature', 'food', 'culture')),
  latitude numeric(10, 7),
  longitude numeric(10, 7),
  rating numeric(2, 1) DEFAULT 0,
  review_count integer DEFAULT 0,
  typical_duration integer DEFAULT 120,
  opening_time time,
  closing_time time,
  image_url text,
  description text,
  effort_score integer DEFAULT 5 CHECK (effort_score >= 1 AND effort_score <= 10),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE pois ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view POIs"
  ON pois FOR SELECT
  TO authenticated
  USING (true);

-- =====================================================
-- 5. ITINERARY_DAYS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS itinerary_days (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  day_number integer NOT NULL,
  date date NOT NULL,
  total_distance_km numeric(6, 2) DEFAULT 0,
  total_duration_minutes integer DEFAULT 0,
  effort_budget_used integer DEFAULT 0,
  is_finalized boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(trip_id, day_number)
);

ALTER TABLE itinerary_days ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view itinerary days for their trips"
  ON itinerary_days FOR SELECT
  TO authenticated
  USING (
    trip_id IN (
      SELECT id FROM trips WHERE user_id = auth.uid()
      UNION
      SELECT trip_id FROM trip_participants WHERE user_id = auth.uid() AND status = 'accepted'
    )
  );

CREATE POLICY "Users can manage itinerary days for their trips"
  ON itinerary_days FOR ALL
  TO authenticated
  USING (
    trip_id IN (SELECT id FROM trips WHERE user_id = auth.uid())
  )
  WITH CHECK (
    trip_id IN (SELECT id FROM trips WHERE user_id = auth.uid())
  );

-- =====================================================
-- 6. ITINERARY_ACTIVITIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS itinerary_activities (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  itinerary_day_id uuid NOT NULL REFERENCES itinerary_days(id) ON DELETE CASCADE,
  poi_id uuid NOT NULL REFERENCES pois(id),
  sequence_order integer NOT NULL,
  start_time time,
  end_time time,
  duration_minutes integer NOT NULL,
  travel_time_from_previous integer DEFAULT 0,
  travel_mode text DEFAULT 'walk' CHECK (travel_mode IN ('walk', 'drive', 'transit')),
  buffer_minutes integer DEFAULT 30,
  is_plan_b boolean DEFAULT false,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'skipped', 'missed')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE itinerary_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view activities for their itineraries"
  ON itinerary_activities FOR SELECT
  TO authenticated
  USING (
    itinerary_day_id IN (
      SELECT id FROM itinerary_days WHERE trip_id IN (
        SELECT id FROM trips WHERE user_id = auth.uid()
        UNION
        SELECT trip_id FROM trip_participants WHERE user_id = auth.uid() AND status = 'accepted'
      )
    )
  );

CREATE POLICY "Users can manage activities for their itineraries"
  ON itinerary_activities FOR ALL
  TO authenticated
  USING (
    itinerary_day_id IN (
      SELECT id FROM itinerary_days WHERE trip_id IN (
        SELECT id FROM trips WHERE user_id = auth.uid()
      )
    )
  )
  WITH CHECK (
    itinerary_day_id IN (
      SELECT id FROM itinerary_days WHERE trip_id IN (
        SELECT id FROM trips WHERE user_id = auth.uid()
      )
    )
  );

-- =====================================================
-- 7. PLAN_B_ALTERNATIVES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS plan_b_alternatives (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  itinerary_activity_id uuid NOT NULL REFERENCES itinerary_activities(id) ON DELETE CASCADE,
  alternative_poi_id uuid NOT NULL REFERENCES pois(id),
  reason text,
  priority integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE plan_b_alternatives ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view plan B alternatives for their activities"
  ON plan_b_alternatives FOR SELECT
  TO authenticated
  USING (
    itinerary_activity_id IN (
      SELECT ia.id FROM itinerary_activities ia
      JOIN itinerary_days id ON ia.itinerary_day_id = id.id
      WHERE id.trip_id IN (
        SELECT id FROM trips WHERE user_id = auth.uid()
        UNION
        SELECT trip_id FROM trip_participants WHERE user_id = auth.uid() AND status = 'accepted'
      )
    )
  );

CREATE POLICY "Users can manage plan B alternatives for their activities"
  ON plan_b_alternatives FOR ALL
  TO authenticated
  USING (
    itinerary_activity_id IN (
      SELECT ia.id FROM itinerary_activities ia
      JOIN itinerary_days id ON ia.itinerary_day_id = id.id
      WHERE id.trip_id IN (SELECT id FROM trips WHERE user_id = auth.uid())
    )
  )
  WITH CHECK (
    itinerary_activity_id IN (
      SELECT ia.id FROM itinerary_activities ia
      JOIN itinerary_days id ON ia.itinerary_day_id = id.id
      WHERE id.trip_id IN (SELECT id FROM trips WHERE user_id = auth.uid())
    )
  );

-- =====================================================
-- 8. TRIP_PARTICIPANTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS trip_participants (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role text DEFAULT 'participant' CHECK (role IN ('owner', 'participant', 'requested')),
  status text DEFAULT 'pending' CHECK (status IN ('accepted', 'pending', 'rejected')),
  joined_at timestamptz DEFAULT now(),
  UNIQUE(trip_id, user_id)
);

ALTER TABLE trip_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view participants for accessible trips"
  ON trip_participants FOR SELECT
  TO authenticated
  USING (
    trip_id IN (
      SELECT id FROM trips WHERE user_id = auth.uid()
      UNION
      SELECT trip_id FROM trip_participants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Trip owners can manage participants"
  ON trip_participants FOR ALL
  TO authenticated
  USING (
    trip_id IN (SELECT id FROM trips WHERE user_id = auth.uid())
  )
  WITH CHECK (
    trip_id IN (SELECT id FROM trips WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can request to join trips"
  ON trip_participants FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id AND role = 'requested');

-- =====================================================
-- 9. COMMUNITY_POSTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS community_posts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  tags text[] DEFAULT '{}',
  upvotes integer DEFAULT 0,
  view_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  max_participants integer,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view community posts"
  ON community_posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create posts for their trips"
  ON community_posts FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND trip_id IN (SELECT id FROM trips WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update their own posts"
  ON community_posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts"
  ON community_posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- =====================================================
-- 10. COMMUNITY_COMMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS community_comments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id uuid NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  comment text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view comments"
  ON community_comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create comments"
  ON community_comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON community_comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON community_comments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- =====================================================
-- 11. EMERGENCY_CONTACTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS emergency_contacts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text NOT NULL,
  relationship text,
  priority integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own emergency contacts"
  ON emergency_contacts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own emergency contacts"
  ON emergency_contacts FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- 12. SAFETY_ALERTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS safety_alerts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  alert_type text NOT NULL CHECK (alert_type IN ('sos', 'silent', 'geofence')),
  latitude numeric(10, 7),
  longitude numeric(10, 7),
  message text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'resolved')),
  created_at timestamptz DEFAULT now(),
  resolved_at timestamptz
);

ALTER TABLE safety_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view alerts for their trips"
  ON safety_alerts FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id
    OR trip_id IN (
      SELECT trip_id FROM trip_participants
      WHERE user_id = auth.uid() AND status = 'accepted'
    )
  );

CREATE POLICY "Users can create alerts for their trips"
  ON safety_alerts FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND trip_id IN (
      SELECT id FROM trips WHERE user_id = auth.uid()
      UNION
      SELECT trip_id FROM trip_participants WHERE user_id = auth.uid() AND status = 'accepted'
    )
  );

CREATE POLICY "Users can update their own alerts"
  ON safety_alerts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- 13. OFFLINE_DATA TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS offline_data (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  data_type text NOT NULL CHECK (data_type IN ('map_tiles', 'poi_data', 'tickets', 'routes')),
  data_url text,
  file_size_mb numeric(8, 2),
  downloaded_at timestamptz DEFAULT now()
);

ALTER TABLE offline_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view offline data for their trips"
  ON offline_data FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage offline data for their trips"
  ON offline_data FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_destination ON trips(destination);
CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status);
CREATE INDEX IF NOT EXISTS idx_pois_destination ON pois(destination);
CREATE INDEX IF NOT EXISTS idx_pois_category ON pois(category);
CREATE INDEX IF NOT EXISTS idx_itinerary_days_trip_id ON itinerary_days(trip_id);
CREATE INDEX IF NOT EXISTS idx_itinerary_activities_day_id ON itinerary_activities(itinerary_day_id);
CREATE INDEX IF NOT EXISTS idx_trip_participants_trip_id ON trip_participants(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_participants_user_id ON trip_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_safety_alerts_trip_id ON safety_alerts(trip_id);
