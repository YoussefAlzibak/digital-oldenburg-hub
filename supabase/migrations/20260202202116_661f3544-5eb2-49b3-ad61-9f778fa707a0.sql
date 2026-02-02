-- Erstelle fehlende Tags für die Workflows
INSERT INTO public.available_tags (name, color, description)
VALUES 
  ('unsubscribed', '#ef4444', 'Vom Newsletter abgemeldet'),
  ('appointment-booked', '#10b981', 'Hat einen Termin gebucht'),
  ('review-requested', '#f59e0b', 'Bewertungsanfrage gesendet')
ON CONFLICT (name) DO NOTHING;