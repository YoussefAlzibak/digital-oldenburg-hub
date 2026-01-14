-- ==========================================
-- Phase 1 & 2: Google Calendar Integration
-- ==========================================

-- 1. OAuth Tokens Tabelle für sichere Token-Speicherung
CREATE TABLE public.google_oauth_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_type TEXT DEFAULT 'Bearer',
  expires_at TIMESTAMP WITH TIME ZONE,
  scope TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- RLS für OAuth Tokens (nur Admins können Tokens sehen/bearbeiten)
ALTER TABLE public.google_oauth_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage oauth tokens"
ON public.google_oauth_tokens
FOR ALL
USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- 2. Appointments-Tabelle erweitern für Google Calendar Sync
ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS google_event_id TEXT,
ADD COLUMN IF NOT EXISTS google_calendar_synced BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS last_synced_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS sync_conflict BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS sync_error TEXT;

-- 3. Synchronisations-Log für Monitoring
CREATE TABLE public.google_calendar_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE,
  sync_type TEXT NOT NULL CHECK (sync_type IN ('push', 'pull', 'webhook')),
  status TEXT NOT NULL CHECK (status IN ('success', 'error', 'pending')),
  google_event_id TEXT,
  error_message TEXT,
  sync_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS für Sync Log
ALTER TABLE public.google_calendar_sync_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view sync logs"
ON public.google_calendar_sync_log
FOR SELECT
USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "System can insert sync logs"
ON public.google_calendar_sync_log
FOR INSERT
WITH CHECK (true);

-- 4. Index für Performance
CREATE INDEX IF NOT EXISTS idx_appointments_google_event_id 
ON public.appointments(google_event_id) 
WHERE google_event_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_sync_log_appointment 
ON public.google_calendar_sync_log(appointment_id);

CREATE INDEX IF NOT EXISTS idx_sync_log_created 
ON public.google_calendar_sync_log(created_at DESC);

-- 5. Trigger für updated_at auf OAuth Tokens
CREATE TRIGGER update_google_oauth_tokens_updated_at
BEFORE UPDATE ON public.google_oauth_tokens
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();