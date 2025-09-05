-- MiraID Database Schema for Supabase
-- Run this SQL in your Supabase SQL editor to set up the database

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create custom types
CREATE TYPE subscription_status AS ENUM ('free', 'premium', 'canceled');
CREATE TYPE incident_type AS ENUM ('traffic_stop', 'questioning', 'search', 'arrest', 'other');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT NOT NULL,
    subscription_status subscription_status DEFAULT 'free',
    preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'es')),
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Incidents table
CREATE TABLE public.incidents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    location TEXT,
    incident_type incident_type NOT NULL,
    recording_url TEXT,
    summary TEXT,
    duration INTEGER, -- in seconds
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Legal guides table
CREATE TABLE public.legal_guides (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    state TEXT NOT NULL, -- US state abbreviation or 'general'
    incident_type incident_type NOT NULL,
    content_en TEXT NOT NULL, -- English content
    content_es TEXT, -- Spanish content
    script_en TEXT NOT NULL, -- English script
    script_es TEXT, -- Spanish script
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(state, incident_type)
);

-- Create indexes for better performance
CREATE INDEX idx_incidents_user_id ON public.incidents(user_id);
CREATE INDEX idx_incidents_timestamp ON public.incidents(timestamp DESC);
CREATE INDEX idx_legal_guides_state_type ON public.legal_guides(state, incident_type);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_guides ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users can only see and update their own profile
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Users can only see their own incidents
CREATE POLICY "Users can view own incidents" ON public.incidents
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own incidents" ON public.incidents
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own incidents" ON public.incidents
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own incidents" ON public.incidents
    FOR DELETE USING (auth.uid() = user_id);

-- Legal guides are publicly readable
CREATE POLICY "Legal guides are publicly readable" ON public.legal_guides
    FOR SELECT USING (true);

-- Create storage bucket for recordings
INSERT INTO storage.buckets (id, name, public) VALUES ('recordings', 'recordings', false);

-- Storage policies for recordings
CREATE POLICY "Users can upload their own recordings" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'recordings' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can view their own recordings" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'recordings' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete their own recordings" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'recordings' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email)
    VALUES (NEW.id, NEW.email);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_incidents_updated_at BEFORE UPDATE ON public.incidents
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_legal_guides_updated_at BEFORE UPDATE ON public.legal_guides
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample legal guides data
INSERT INTO public.legal_guides (state, incident_type, content_en, content_es, script_en, script_es) VALUES
('general', 'traffic_stop', 
 'During a traffic stop, you have the right to remain silent, the right to refuse searches of your vehicle without a warrant, and the right to ask if you are free to leave.',
 'Durante una parada de tráfico, tienes derecho a permanecer en silencio, derecho a rechazar búsquedas de tu vehículo sin una orden judicial, y derecho a preguntar si eres libre de irte.',
 '1. Keep your hands visible on the steering wheel\n2. Say: "I am exercising my right to remain silent"\n3. Say: "I do not consent to any searches"\n4. Ask: "Am I free to leave?"\n5. Do not argue or resist physically',
 '1. Mantén tus manos visibles en el volante\n2. Di: "Estoy ejerciendo mi derecho a permanecer en silencio"\n3. Di: "No consiento a ninguna búsqueda"\n4. Pregunta: "¿Soy libre de irme?"\n5. No discutas ni resistas físicamente'),

('general', 'questioning',
 'When questioned by police, you have the right to remain silent and the right to an attorney. You are not required to answer questions without a lawyer present.',
 'Cuando la policía te interrogue, tienes derecho a permanecer en silencio y derecho a un abogado. No estás obligado a responder preguntas sin un abogado presente.',
 '1. Say: "I am exercising my right to remain silent"\n2. Say: "I want to speak to a lawyer"\n3. Do not answer questions until your lawyer arrives\n4. Ask: "Am I under arrest or am I free to go?"\n5. Remain calm and polite',
 '1. Di: "Estoy ejerciendo mi derecho a permanecer en silencio"\n2. Di: "Quiero hablar con un abogado"\n3. No respondas preguntas hasta que llegue tu abogado\n4. Pregunta: "¿Estoy arrestado o soy libre de irme?"\n5. Mantente calmado y cortés'),

('general', 'search',
 'You have the right to refuse consent to searches of your person, belongings, or property unless police have a warrant or probable cause.',
 'Tienes derecho a rechazar el consentimiento a búsquedas de tu persona, pertenencias o propiedad a menos que la policía tenga una orden judicial o causa probable.',
 '1. Say clearly: "I do not consent to this search"\n2. Do not physically resist\n3. Ask: "Do you have a warrant?"\n4. State: "I am exercising my Fourth Amendment rights"\n5. Remember details for later',
 '1. Di claramente: "No consiento a esta búsqueda"\n2. No resistas físicamente\n3. Pregunta: "¿Tienes una orden judicial?"\n4. Declara: "Estoy ejerciendo mis derechos de la Cuarta Enmienda"\n5. Recuerda detalles para después');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
