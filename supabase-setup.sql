-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    location TEXT NOT NULL,
    price INTEGER NOT NULL,
    "dhLink" TEXT NOT NULL,
    hash TEXT UNIQUE NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create form_responses table
CREATE TABLE IF NOT EXISTS form_responses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    "formType" TEXT NOT NULL CHECK ("formType" IN ('igenyfelmeres', 'mutatas', 'ertekeles')),
    "propertyHash" TEXT REFERENCES properties(hash) ON DELETE SET NULL,
    answers JSONB NOT NULL,
    "submittedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_responses ENABLE ROW LEVEL SECURITY;

-- Create policies for properties table
-- Only authenticated users can read properties
CREATE POLICY "Allow authenticated users to read properties" ON properties
    FOR SELECT TO authenticated USING (true);

-- Only authenticated users can insert properties
CREATE POLICY "Allow authenticated users to insert properties" ON properties
    FOR INSERT TO authenticated WITH CHECK (true);

-- Only authenticated users can update properties
CREATE POLICY "Allow authenticated users to update properties" ON properties
    FOR UPDATE TO authenticated USING (true);

-- Only authenticated users can delete properties
CREATE POLICY "Allow authenticated users to delete properties" ON properties
    FOR DELETE TO authenticated USING (true);

-- Create policies for form_responses table
-- Only authenticated users can read form responses
CREATE POLICY "Allow authenticated users to read form responses" ON form_responses
    FOR SELECT TO authenticated USING (true);

-- Anyone can insert form responses (public forms)
CREATE POLICY "Allow anyone to insert form responses" ON form_responses
    FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Only authenticated users can update form responses
CREATE POLICY "Allow authenticated users to update form responses" ON form_responses
    FOR UPDATE TO authenticated USING (true);

-- Only authenticated users can delete form responses
CREATE POLICY "Allow authenticated users to delete form responses" ON form_responses
    FOR DELETE TO authenticated USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_properties_hash ON properties(hash);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties("createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_form_responses_property_hash ON form_responses("propertyHash");
CREATE INDEX IF NOT EXISTS idx_form_responses_form_type ON form_responses("formType");
CREATE INDEX IF NOT EXISTS idx_form_responses_submitted_at ON form_responses("submittedAt" DESC); 