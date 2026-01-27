CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  headline TEXT,
  bio TEXT,
  skills JSONB DEFAULT '[]',
  location TEXT,
  portfolio_url TEXT,
  linkedin_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  role TEXT NOT NULL,
  location TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  position INT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  institution TEXT NOT NULL,
  degree TEXT,
  field_of_study TEXT,
  start_date DATE,
  graduation_date DATE,
  position INT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own profiles"
ON profiles
FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Users manage own experience"
ON experience
FOR ALL
USING (
  auth.uid() = (
    SELECT user_id FROM profiles WHERE profiles.id = experience.profile_id
  )
);

CREATE POLICY "Users manage own education"
ON education
FOR ALL
USING (
  auth.uid() = (
    SELECT user_id FROM profiles WHERE profiles.id = education.profile_id
  )
);
