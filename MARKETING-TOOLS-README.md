
# Email Marketing System - Benutzerhandbuch

## Übersicht

Das Email Marketing System von Unicum Tec bietet umfassende Tools zur Verwaltung von E-Mail-Kampagnen, Abonnenten, Automatisierungen und Newsletter-Anmeldungen. Diese Dokumentation erklärt detailliert, wie Sie alle verfügbaren Marketing-Tools nutzen können.

## Inhaltsverzeichnis

1. [Dashboard Übersicht](#dashboard-übersicht)
2. [Abonnenten-Verwaltung](#abonnenten-verwaltung)
3. [E-Mail Marketing](#e-mail-marketing)
4. [Automatisierungen](#automatisierungen)
5. [Templates](#templates)
6. [SMTP-Einstellungen](#smtp-einstellungen)
7. [Newsletter-Anmeldung](#newsletter-anmeldung)
8. [Technische Details](#technische-details)

---

## Dashboard Übersicht

Das Marketing-Dashboard erreichen Sie unter `/admin` nach der Anmeldung. Hier finden Sie:

- **Übersicht**: Zentrale Statistiken und KPIs
- **Abonnenten**: Verwaltung aller E-Mail-Abonnenten
- **E-Mail Marketing**: Kampagnen und Templates
- **Kalender**: Terminverwaltung
- **Einstellungen**: SMTP und weitere Konfigurationen

---

## Abonnenten-Verwaltung

### Zugriff
Navigieren Sie zu **Dashboard → Abonnenten** (`/admin/subscribers`)

### Funktionen

#### 1. Neue Abonnenten hinzufügen
```
Klicken Sie auf "Neuer Abonnent"
Felder:
- E-Mail-Adresse* (Pflichtfeld)
- Vorname
- Nachname  
- Unternehmen
- Telefon
- Tags (für Segmentierung)
- Status (aktiv/inaktiv/abgemeldet)
- Quelle (Website, Import, etc.)
```

#### 2. Abonnenten importieren
```
1. Klicken Sie auf "CSV Import"
2. Laden Sie eine CSV-Datei mit folgenden Spalten hoch:
   - email (Pflicht)
   - first_name
   - last_name
   - company
   - phone
   - tags (kommagetrennt)
3. Mapping der Spalten bestätigen
4. Import starten
```

#### 3. Abonnenten-Listen verwalten
```
- Erstellen Sie thematische Listen (z.B. "Newsletter", "Kunden", "Interessenten")
- Weisen Sie Abonnenten zu Listen zu
- Nutzen Sie Listen für gezielte Kampagnen
```

#### 4. Segmentierung
```
Filtern Sie Abonnenten nach:
- Status (aktiv, inaktiv, abgemeldet)
- Quelle (Website, Import, Veranstaltung)
- Tags (Interessen, Kategorien)
- Anmeldedatum
- Letzte Aktivität
```

---

## E-Mail Marketing

### Zugriff
Navigieren Sie zu **Dashboard → E-Mail Marketing** (`/admin/email-marketing`)

### 1. Kampagnen erstellen

#### Neue Kampagne
```
1. Klicken Sie auf "Neue Kampagne"
2. Kampagnen-Details:
   - Name der Kampagne
   - Betreff der E-Mail
   - Zielgruppe auswählen (Listen/Segmente)
   
3. E-Mail gestalten:
   - Template auswählen ODER
   - HTML-Editor verwenden
   - Personalisierung einfügen ({{first_name}}, {{company}})
   
4. Versandoptionen:
   - Sofort senden
   - Zeitplan festlegen
   - A/B-Test konfigurieren
```

#### Personalisierung
```
Verfügbare Platzhalter:
- {{first_name}} - Vorname des Empfängers
- {{last_name}} - Nachname
- {{full_name}} - Vollständiger Name
- {{email}} - E-Mail-Adresse
- {{company}} - Unternehmen

Beispiel:
"Hallo {{first_name}}, vielen Dank für Ihr Interesse an {{company}}!"
```

### 2. Templates verwalten

#### Template-Typen
```
- Newsletter: Regelmäßige Updates und News
- Promotion: Angebote und Verkaufs-E-Mails  
- Welcome: Begrüßungs-E-Mails für neue Abonnenten
- Automation: E-Mails für automatisierte Serien
- Transactional: Bestätigungen, Rechnungen, etc.
```

#### Template erstellen
```
1. Gehen Sie zu "Templates" → "Neues Template"
2. Template-Informationen:
   - Name des Templates
   - Typ auswählen
   - Beschreibung
   
3. Design:
   - HTML-Code eingeben ODER
   - Drag & Drop Editor nutzen
   - Vorschau testen
   
4. Speichern und aktivieren
```

### 3. Kampagnen-Analytics

#### Verfügbare Metriken
```
- Versendete E-Mails: Anzahl erfolgreich zugestellter E-Mails
- Öffnungsrate: Prozentsatz der geöffneten E-Mails
- Klickrate: Prozentsatz der Klicks auf Links
- Abmeldungen: Anzahl der Abmeldungen
- Bounces: Nicht zustellbare E-Mails
- Conversions: Definierte Zielaktionen
```

#### Reports erstellen
```
1. Kampagne auswählen
2. "Analytics" öffnen  
3. Zeitraum festlegen
4. Metriken anzeigen:
   - Übersichtsgrafiken
   - Detailberichte
   - Exportfunktion (CSV, PDF)
```

---

## Automatisierungen

### Zugriff
**Dashboard → E-Mail Marketing → Automatisierungen**

### 1. Automatisierungstypen

#### Newsletter-Anmeldung (Welcome Series)
```
Trigger: Neue Newsletter-Anmeldung
Schritte:
1. Sofort: Willkommens-E-Mail
2. Nach 1 Tag: Unternehmensprofil
3. Nach 3 Tagen: Service-Übersicht
4. Nach 1 Woche: Kundenbewertungen
5. Nach 2 Wochen: Beratungsangebot
```

#### Kontaktformular-Follow-up
```
Trigger: Kontaktformular ausgefüllt
Schritte:
1. Sofort: Eingangsbestätigung
2. Nach 2 Stunden: Detaillierte Informationen
3. Nach 1 Tag: Terminvorschlag
4. Nach 3 Tagen: Follow-up bei keine Antwort
```

#### Terminbuchung-Serie
```
Trigger: Termin gebucht
Schritte:
1. Sofort: Terminbestätigung
2. 1 Tag vorher: Erinnerung mit Details
3. Nach Termin: Nachfassung und nächste Schritte
4. Nach 1 Woche: Feedback-Anfrage
```

#### Datumsbasierte Automatisierung
```
Trigger: Bestimmtes Datum/Zeit
Verwendung:
- Saisonale Kampagnen
- Jubiläums-E-Mails
- Regelmäßige Newsletter
- Erinnerungen
```

### 2. Automatisierung erstellen

#### Schritt-für-Schritt Anleitung
```
1. "Neue Automatisierung" klicken
2. Grundeinstellungen:
   - Name der Automatisierung
   - Beschreibung
   - Trigger-Typ auswählen
   - Aktivierungsstatus

3. Trigger konfigurieren:
   - Bei Newsletter-Anmeldung: Keine weitere Konfiguration
   - Bei Datumsbasiert: Datum und Uhrzeit festlegen
   - Bei Benutzeraktion: Spezifische Aktion definieren

4. E-Mail-Schritte hinzufügen:
   - Schritt 1: Sofortige E-Mail (Verzögerung: 0)
   - Schritt 2+: Verzögerung festlegen
   - Für jeden Schritt:
     * Template auswählen (optional)
     * E-Mail-Betreff eingeben
     * HTML-Inhalt erstellen
     * Aktivierungsstatus setzen

5. Verzögerungsoptionen:
   - Sofort
   - 15 Minuten, 1 Stunde, 4 Stunden
   - 1 Tag, 2 Tage, 3 Tage
   - 1 Woche, 1 Monat
```

#### Erweiterte Konfiguration
```
Trigger-Konfiguration für datumsbasierte Automatisierungen:
- Wiederkehrend: Täglich, wöchentlich, monatlich
- Zielgruppe: Alle Abonnenten oder spezifische Segmente
- Zeitzone beachten
- Ausschlussregeln definieren
```

### 3. Automatisierungs-Management

#### Monitoring und Optimierung
```
- Performance überwachen (Öffnungs- und Klickraten pro Schritt)
- A/B-Tests für einzelne Schritte
- Automatisierungen pausieren/aktivieren
- Schritte hinzufügen, bearbeiten oder entfernen
- Fehlerprotokoll einsehen
```

---

## Templates

### Template-Struktur

#### HTML-Template Grundgerüst
```html
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{subject}}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px;">
            <h1>Unicum Tec</h1>
        </div>
        
        <!-- Content -->
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px;">
            <h2>Hallo {{first_name}}!</h2>
            <p>Ihr personalisierter Inhalt hier...</p>
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #666;">
            <p>Unicum Tec | Ihre Digital-Agentur in Oldenburg</p>
            <a href="{{unsubscribe_url}}">Abmelden</a>
        </div>
    </div>
</body>
</html>
```

#### Template-Variablen
```
Verfügbare Platzhalter:
- {{subject}} - E-Mail Betreff
- {{first_name}}, {{last_name}}, {{full_name}} - Namen
- {{email}} - E-Mail-Adresse
- {{company}} - Unternehmen
- {{unsubscribe_url}} - Abmelde-Link
- {{company_name}} - Firmenname (Standard: "Unicum Tech")
```

---

## SMTP-Einstellungen

### Zugriff
**Dashboard → E-Mail-Einstellungen** (`/admin/email-settings`)

### Konfiguration

#### SMTP-Server einrichten
```
Erforderliche Informationen:
- Host: SMTP-Server Adresse (z.B. smtp.gmail.com)
- Port: 587 (STARTTLS) oder 465 (SSL)
- Sicherheit: TLS/SSL aktivieren
- Benutzername: Ihre E-Mail-Adresse
- Passwort: App-spezifisches Passwort
- Absender-E-Mail: Von welcher Adresse E-Mails gesendet werden
- Absender-Name: Angezeigter Name (z.B. "Unicum Tec")
```

#### Beliebte SMTP-Anbieter

**Gmail:**
```
Host: smtp.gmail.com
Port: 587
Sicherheit: STARTTLS
Hinweis: App-Passwort erforderlich (nicht normales Gmail-Passwort)
```

**Outlook/Hotmail:**
```
Host: smtp-mail.outlook.com  
Port: 587
Sicherheit: STARTTLS
```

**Professional E-Mail Services:**
```
- Amazon SES
- SendGrid  
- Mailgun
- Postmark
```

#### Verbindung testen
```
1. SMTP-Daten eingeben
2. "Verbindung testen" klicken
3. Test-E-Mail wird an eigene Adresse gesendet
4. Bei Erfolg: Konfiguration speichern
5. Bei Fehler: Einstellungen überprüfen
```

---

## Newsletter-Anmeldung

### Frontend-Integration

#### Automatische Anmeldung (Website)
Die Newsletter-Anmeldung ist bereits in die Website integriert unter der `NewsletterSignup` Komponente.

#### Anmeldeprozess
```
1. Besucher gibt E-Mail und Vorname ein
2. System prüft auf Duplikate
3. Neuer Abonnent wird erstellt mit:
   - Status: "aktiv"
   - Quelle: "website_newsletter" 
4. Willkommens-E-Mail wird sofort gesendet
5. Newsletter-Automatisierung wird gestartet
6. Bestätigungsseite wird angezeigt
```

#### Anpassung der Anmeldung
```
Datei: src/components/NewsletterSignup.tsx

Anpassbare Elemente:
- Formular-Design
- Pflichtfelder
- Erfolgsmeldung
- Validierungsregeln
- Weiterleitungs-URL
```

### Abmelde-Funktionalität
```
Jede E-Mail enthält automatisch:
- Abmelde-Link im Footer
- One-Click Unsubscribe
- Status wird auf "unsubscribed" gesetzt
- Keine weiteren E-Mails werden gesendet
```

---

## Technische Details

### Systemarchitektur

#### Backend (Supabase)
```
Datenbank-Tabellen:
- email_subscribers: Alle Abonnenten-Daten
- email_lists: Thematische Listen
- email_list_subscribers: Zuordnung Abonnent ↔ Liste
- email_campaigns: Kampagnen-Daten
- email_templates: E-Mail-Vorlagen
- email_automations: Automatisierungs-Regeln
- email_automation_steps: Einzelne Automatisierungs-Schritte
- email_queue: Warteschlange für E-Mail-Versand
- email_events: Tracking-Daten (Öffnungen, Klicks)
- smtp_settings: SMTP-Konfiguration
```

#### Edge Functions (Serverless)
```
- send-marketing-email: Kampagnen-Versand
- process-email-queue: Warteschlangen-Verarbeitung  
- send-smtp-email: SMTP-E-Mail-Versand
- trigger-newsletter-automation: Newsletter-Automatisierung
- trigger-contact-automation: Kontakt-Automatisierung
- trigger-appointment-automation: Termin-Automatisierung
- trigger-date-automation: Datumsbasierte Automatisierung
- send-newsletter-welcome: Willkommens-E-Mail
```

### E-Mail-Versand-Pipeline

#### 1. Kampagne erstellen
```
Benutzer erstellt Kampagne → 
Daten in email_campaigns gespeichert
```

#### 2. Empfänger ermitteln
```
System ermittelt Zielgruppe →
E-Mails in email_queue eingereiht
```

#### 3. Warteschlange verarbeiten
```
process-email-queue Function:
- Holt E-Mails aus Warteschlange
- Personalisiert Inhalte
- Ruft send-smtp-email auf
- Aktualisiert Status und Statistiken
```

#### 4. Tracking und Analytics
```
- Versand-Events werden protokolliert
- Öffnungen und Klicks getrackt
- Bounce-Handling
- Statistiken in Real-time aktualisiert
```

### Automatisierungs-Engine

#### Trigger-System
```
1. Event tritt ein (Newsletter-Anmeldung, etc.)
2. System prüft aktive Automatisierungen
3. Automatisierungs-Schritte werden in email_queue eingereiht
4. Verzögerungen werden über scheduled_at gesteuert
5. Cron-Job verarbeitet fällige E-Mails
```

#### Retry-Mechanismus
```
- Fehlgeschlagene E-Mails werden bis zu 3x wiederholt
- Exponentieller Backoff (2^retry_count Minuten)
- Permanente Fehler werden markiert
- Admin-Benachrichtigung bei kritischen Fehlern
```

### Sicherheit und Compliance

#### Datenschutz
```
- DSGVO-konforme Abmeldung (One-Click)
- Daten-Anonymisierung bei Abmeldung
- Einwilligungs-Tracking
- Recht auf Datenauskunft
- Recht auf Datenlöschung
```

#### Sicherheitsmaßnahmen
```
- Row Level Security (RLS) in Supabase
- Admin-Berechtigung erforderlich für Konfiguration
- SMTP-Passwörter verschlüsselt gespeichert
- Rate-Limiting für E-Mail-Versand
- Input-Validierung und SQL-Injection-Schutz
```

### Performance und Skalierung

#### Optimierungen
```
- Batch-Verarbeitung von E-Mails (10er Gruppen)
- Asynchrone Warteschlangen-Verarbeitung
- Caching von Templates und Einstellungen
- Database-Indizierung für Performance
```

#### Monitoring
```
- E-Mail-Versand-Logs in Edge Functions
- Fehler-Tracking und Alerting
- Performance-Metriken
- Queue-Status-Überwachung
```

---

## Fehlerbehebung

### Häufige Probleme

#### E-Mails werden nicht versendet
```
1. SMTP-Einstellungen überprüfen
2. Verbindungstest durchführen
3. E-Mail-Queue prüfen (Status "pending"?)
4. Edge Function Logs einsehen
5. SMTP-Provider Limits prüfen
```

#### Automatisierungen funktionieren nicht
```
1. Automatisierung ist aktiviert?
2. Trigger-Konfiguration korrekt?
3. E-Mail-Schritte sind aktiv?
4. Templates sind verfügbar?
5. Zielgruppe hat aktive Abonnenten?
```

#### Hohe Bounce-Rate
```
1. E-Mail-Listen bereinigen
2. Double-Opt-In implementieren
3. Spam-Score prüfen
4. Absender-Reputation überwachen
5. Inhalte optimieren
```

### Support und Logs

#### Log-Zugriff
```
Supabase Dashboard → Functions → [Function Name] → Logs
Hier finden Sie detaillierte Informationen über:
- Erfolgreiche Versendungen
- Fehlermeldungen
- Performance-Daten
- Debug-Informationen
```

#### Kontakt für technische Unterstützung
```
E-Mail: support@unicumtec.de
Telefon: +49 (0) XXX XXX XXX
Verfügbarkeit: Mo-Fr 9:00-18:00 Uhr
```

---

## Best Practices

### E-Mail-Design
```
1. Mobile-first Ansatz (60%+ öffnen auf Mobilgeräten)
2. Klare, prägnante Betreffzeilen
3. Personalisierung nutzen, aber nicht übertreiben  
4. Call-to-Action prominent platzieren
5. Abmelde-Link immer sichtbar
6. Marken-konsistentes Design
```

### Segmentierung
```
1. Verhalten-basiert (Öffnungen, Klicks, Käufe)
2. Demografisch (Alter, Standort, Branche)
3. Lifecycle-Stage (Neukunde, Bestandskunde, Inaktiv)
4. Interessen und Präferenzen
5. Engagement-Level (Aktiv, Passiv, Risiko-Abmeldung)
```

### A/B Testing
```
Testbare Elemente:
- Betreffzeilen
- Absender-Namen
- E-Mail-Inhalte
- Call-to-Action Buttons
- Versandzeitpunkte
- Bildauswahl

Vorgehen:
1. Hypothese aufstellen
2. Test-Gruppen definieren (min. 100 Empfänger pro Gruppe)
3. Nur eine Variable testen
4. Ausreichend lange Testdauer
5. Statistische Signifikanz prüfen
```

### Zustellbarkeit optimieren
```
1. Authentifizierung einrichten (SPF, DKIM, DMARC)
2. IP-Reputation aufbauen
3. Engagement-Rate hoch halten
4. Bounces minimieren
5. Spam-Beschwerden vermeiden
6. Versandfrequenz anpassen
7. Relevanten Content erstellen
```

---

## Rechtliche Hinweise

### DSGVO-Compliance
```
Erforderliche Maßnahmen:
- Einwilligung vor Anmeldung einholen
- Zweck der Datenverarbeitung kommunizieren  
- Einfache Abmeldung ermöglichen
- Daten auf Anfrage löschen
- Verarbeitungsverzeichnis führen
- Datenschutzerklärung aktuell halten
```

### CAN-SPAM Act (USA)
```
Bei US-Empfängern beachten:
- Wahre Absenderinformationen
- Ehrliche Betreffzeilen
- Kommerzieller Inhalt kennzeichnen
- Physische Adresse im Footer
- Abmelde-Option respektieren (10 Tage)
```

---

*Diese Dokumentation wird regelmäßig aktualisiert. Letzte Aktualisierung: [Aktuelles Datum]*

*Bei Fragen oder Anregungen wenden Sie sich an: documentation@unicumtec.de*
