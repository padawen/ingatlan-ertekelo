-- Create leads table for educational email series subscriptions
CREATE TABLE IF NOT EXISTS leads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    source TEXT DEFAULT 'email-series-subscription', -- source of the lead
    status TEXT DEFAULT 'subscribed' CHECK (status IN ('subscribed', 'unsubscribed')),
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    unsubscribed_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}' -- additional information about the lead
);

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create policies for leads table
-- Only authenticated users (admin) can read leads
CREATE POLICY "Allow authenticated users to read leads" ON leads
    FOR SELECT TO authenticated USING (true);

-- Anyone can insert leads (public subscription)
CREATE POLICY "Allow anyone to insert leads" ON leads
    FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Only authenticated users can update leads
CREATE POLICY "Allow authenticated users to update leads" ON leads
    FOR UPDATE TO authenticated USING (true);

-- Only authenticated users can delete leads
CREATE POLICY "Allow authenticated users to delete leads" ON leads
    FOR DELETE TO authenticated USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_subscribed_at ON leads(subscribed_at DESC); 