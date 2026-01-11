-- Update alle Automatisierungsschritte: "Digital Masters" zu "Unicum Tech" und Telefonnummer hinzufügen
UPDATE email_automation_steps 
SET html_content = REPLACE(
  REPLACE(html_content, 'Digital Masters', 'Unicum Tech'),
  'XXX', '0170666809'
)
WHERE html_content LIKE '%Digital Masters%' OR html_content LIKE '%XXX%';

-- Update alle Templates: "Digital Masters" zu "Unicum Tech" und Telefonnummer hinzufügen  
UPDATE email_templates
SET html_content = REPLACE(
  REPLACE(html_content, 'Digital Masters', 'Unicum Tech'),
  'XXX', '0170666809'
)
WHERE html_content LIKE '%Digital Masters%' OR html_content LIKE '%XXX%';

-- Verknüpfe Automatisierungsschritte mit passenden Templates
-- Newsletter Willkommen (Schritt 1) -> Welcome Email Template
UPDATE email_automation_steps 
SET template_id = '283f266d-c5cc-4411-9671-b55749e1335a'
WHERE id = '26ac8178-a465-4784-bfe5-f7cf39205221';

-- Newsletter Follow-Up (Schritt 2) -> Follow-Up E-Mail
UPDATE email_automation_steps 
SET template_id = '495f1f40-d55b-4da2-8980-c9a1a89d9aff'
WHERE id = 'b74eedb7-f432-47ab-91dd-6c7f66e7ee7b';

-- Newsletter Angebot (Schritt 3) -> Promotional Campaign Template
UPDATE email_automation_steps 
SET template_id = '0fae0ab4-0bda-44c1-aced-8ade7b43c502'
WHERE id = '59336420-d47d-41ac-9e2a-4fe5442b7f31';

-- Kontaktformular Bestätigung -> Kontaktformular Bestätigung Template
UPDATE email_automation_steps 
SET template_id = 'f1ed7b61-7974-4720-a389-b57dcdd36655'
WHERE id = 'd8efb063-501b-45cf-9786-9d7880caf3e9';

-- Terminbestätigung (Schritt 1) -> Terminbestätigung Template
UPDATE email_automation_steps 
SET template_id = '4ed959fe-7981-4b63-8102-24c3aa0d1884'
WHERE id = '98732588-0e2f-4e75-bb55-afa664b7328c';

-- Termin-Erinnerung (Schritt 2) -> Termin-Erinnerung Template
UPDATE email_automation_steps 
SET template_id = '28ec126c-948f-4a95-a4f0-7335910c61b2'
WHERE id = 'baae6cea-4bf2-4aac-b501-72a4ef950016';