-- Erweitere trigger_config für Termin-Erinnerungen mit konfigurierbaren Zeiten
UPDATE email_automations 
SET trigger_config = '{
  "send_confirmation": true,
  "send_reminder": true,
  "reminder_times": [
    {"minutes_before": 1440, "label": "1 Tag vorher", "enabled": true},
    {"minutes_before": 60, "label": "1 Stunde vorher", "enabled": true}
  ]
}'::jsonb
WHERE id = 'b408dbcf-cbc8-48db-b581-9d181819d482';

-- Füge zusätzlichen Erinnerungs-Schritt hinzu (1 Stunde vorher)
INSERT INTO email_automation_steps (
  automation_id, 
  step_number, 
  template_id, 
  delay_minutes, 
  subject, 
  html_content,
  text_content,
  is_active
)
VALUES (
  'b408dbcf-cbc8-48db-b581-9d181819d482',
  3,
  '28ec126c-948f-4a95-a4f0-7335910c61b2',
  -60,
  'In 1 Stunde: Ihr Termin bei Unicum Tech',
  '<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 8px 25px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; padding: 30px; text-align: center; }
        .urgent-box { background: #fef2f2; border: 2px solid #dc2626; padding: 25px; margin: 20px; border-radius: 12px; text-align: center; }
        .time-display { font-size: 32px; font-weight: bold; color: #dc2626; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⚡ Ihr Termin beginnt in 1 Stunde!</h1>
        </div>
        <div style="padding: 30px;">
            <p>Hallo {{first_name}},</p>
            <p>Ihr Beratungstermin beginnt in Kürze:</p>
            
            <div class="urgent-box">
                <div class="time-display">🕐 {{appointment_time}} Uhr</div>
                <p style="margin-top: 15px;"><strong>Service:</strong> {{service_type}}</p>
            </div>
            
            <p>📱 <strong>Kontakt:</strong> 0170666809</p>
            
            <p>Wir freuen uns auf Sie!</p>
            <p>Ihr Unicum Tech Team</p>
        </div>
    </div>
</body>
</html>',
  'Ihr Termin beginnt in 1 Stunde!

Hallo {{first_name}},

Ihr Beratungstermin beginnt um {{appointment_time}} Uhr.

Service: {{service_type}}

Kontakt: 0170666809

Wir freuen uns auf Sie!
Unicum Tech Team',
  true
);