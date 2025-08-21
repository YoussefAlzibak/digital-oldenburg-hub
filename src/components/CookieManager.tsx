import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Cookie, Settings, Shield, BarChart, Trash2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CookieSettings {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

interface CookieConsent {
  timestamp: string;
  settings: CookieSettings;
}

export default function CookieManager() {
  const [currentSettings, setCurrentSettings] = useState<CookieSettings>({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false
  });
  const [consentData, setConsentData] = useState<CookieConsent | null>(null);
  const [hasConsent, setHasConsent] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadCurrentSettings();
  }, []);

  const loadCurrentSettings = () => {
    const consent = localStorage.getItem('cookie-consent');
    if (consent) {
      try {
        const data: CookieConsent = JSON.parse(consent);
        setConsentData(data);
        setCurrentSettings(data.settings);
        setHasConsent(true);
      } catch (error) {
        console.error('Error parsing cookie consent:', error);
      }
    }
  };

  const updateSetting = (key: keyof CookieSettings, value: boolean) => {
    setCurrentSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    const newConsent: CookieConsent = {
      timestamp: new Date().toISOString(),
      settings: currentSettings
    };
    
    localStorage.setItem('cookie-consent', JSON.stringify(newConsent));
    setConsentData(newConsent);
    setHasConsent(true);
    
    toast({
      title: "Einstellungen gespeichert",
      description: "Ihre Cookie-Einstellungen wurden aktualisiert.",
    });
  };

  const resetSettings = () => {
    const defaultSettings: CookieSettings = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false
    };
    setCurrentSettings(defaultSettings);
    
    toast({
      title: "Einstellungen zurückgesetzt",
      description: "Cookie-Einstellungen wurden auf Standard zurückgesetzt.",
    });
  };

  const clearAllCookies = () => {
    localStorage.removeItem('cookie-consent');
    setConsentData(null);
    setHasConsent(false);
    resetSettings();
    
    toast({
      title: "Cookies gelöscht",
      description: "Alle Cookie-Einstellungen wurden entfernt.",
      variant: "destructive"
    });
  };

  const acceptAll = () => {
    const allAccepted: CookieSettings = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true
    };
    setCurrentSettings(allAccepted);
    
    const newConsent: CookieConsent = {
      timestamp: new Date().toISOString(),
      settings: allAccepted
    };
    
    localStorage.setItem('cookie-consent', JSON.stringify(newConsent));
    setConsentData(newConsent);
    setHasConsent(true);
    
    toast({
      title: "Alle Cookies akzeptiert",
      description: "Sie haben alle Cookie-Kategorien akzeptiert.",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('de-DE');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cookie className="h-5 w-5" />
            Cookie-Verwaltung
          </CardTitle>
          <CardDescription>
            Verwalten Sie Ihre Cookie-Einstellungen und Datenschutz-Präferenzen.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {hasConsent && consentData && (
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Aktuelle Einwilligung</h4>
              <p className="text-sm text-muted-foreground">
                Erteilt am: {formatDate(consentData.timestamp)}
              </p>
              <div className="flex gap-2 mt-2">
                {Object.entries(consentData.settings).map(([key, value]) => (
                  key !== 'necessary' && (
                    <Badge key={key} variant={value ? "default" : "outline"}>
                      {key === 'analytics' ? 'Analyse' : 
                       key === 'marketing' ? 'Marketing' : 
                       key === 'preferences' ? 'Präferenzen' : key}
                    </Badge>
                  )
                ))}
              </div>
            </div>
          )}

          {/* Cookie Categories */}
          <div className="space-y-4">
            {/* Necessary Cookies */}
            <div className="flex items-start justify-between p-4 border rounded-lg">
              <div className="flex-1 mr-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <h4 className="font-semibold">Notwendige Cookies</h4>
                  <Badge variant="secondary">Immer aktiv</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Erforderlich für die Grundfunktionen der Website. Diese können nicht deaktiviert werden.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Beispiele: Session-ID, Sicherheits-Tokens, Einstellungen
                </p>
              </div>
              <Switch checked={currentSettings.necessary} disabled />
            </div>

            {/* Analytics Cookies */}
            <div className="flex items-start justify-between p-4 border rounded-lg">
              <div className="flex-1 mr-4">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart className="h-4 w-4 text-blue-600" />
                  <h4 className="font-semibold">Analyse Cookies</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Helfen uns zu verstehen, wie Sie unsere Website nutzen und sie zu verbessern.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Beispiele: Google Analytics, Heatmaps, Besucherzähler
                </p>
              </div>
              <Switch 
                checked={currentSettings.analytics} 
                onCheckedChange={(checked) => updateSetting('analytics', checked)}
              />
            </div>

            {/* Marketing Cookies */}
            <div className="flex items-start justify-between p-4 border rounded-lg">
              <div className="flex-1 mr-4">
                <div className="flex items-center gap-2 mb-2">
                  <Cookie className="h-4 w-4 text-purple-600" />
                  <h4 className="font-semibold">Marketing Cookies</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Ermöglichen personalisierte Werbung und Tracking über verschiedene Websites.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Beispiele: Facebook Pixel, Google Ads, Retargeting
                </p>
              </div>
              <Switch 
                checked={currentSettings.marketing} 
                onCheckedChange={(checked) => updateSetting('marketing', checked)}
              />
            </div>

            {/* Preferences Cookies */}
            <div className="flex items-start justify-between p-4 border rounded-lg">
              <div className="flex-1 mr-4">
                <div className="flex items-center gap-2 mb-2">
                  <Settings className="h-4 w-4 text-orange-600" />
                  <h4 className="font-semibold">Präferenz Cookies</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Speichern Ihre persönlichen Einstellungen und Präferenzen.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Beispiele: Sprache, Theme, Layout-Einstellungen
                </p>
              </div>
              <Switch 
                checked={currentSettings.preferences} 
                onCheckedChange={(checked) => updateSetting('preferences', checked)}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 pt-4 border-t">
            <Button onClick={saveSettings} className="flex-1">
              <Settings className="h-4 w-4 mr-2" />
              Einstellungen speichern
            </Button>
            <Button variant="outline" onClick={acceptAll}>
              <Cookie className="h-4 w-4 mr-2" />
              Alle akzeptieren
            </Button>
            <Button variant="outline" onClick={resetSettings}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Zurücksetzen
            </Button>
            <Button variant="destructive" onClick={clearAllCookies}>
              <Trash2 className="h-4 w-4 mr-2" />
              Alle löschen
            </Button>
          </div>

          {/* Additional Info */}
          <div className="text-xs text-muted-foreground bg-muted p-4 rounded-lg">
            <p className="font-medium mb-2">Wichtige Informationen:</p>
            <ul className="space-y-1">
              <li>• Notwendige Cookies können nicht deaktiviert werden</li>
              <li>• Ihre Einstellungen werden lokal in Ihrem Browser gespeichert</li>
              <li>• Sie können Ihre Einstellungen jederzeit ändern</li>
              <li>• Bei Browser-Löschung müssen Sie erneut wählen</li>
            </ul>
            <div className="mt-3 pt-2 border-t border-muted-foreground/20">
              <p>
                Weitere Details in unserer{' '}
                <a href="#" className="underline hover:text-primary">Datenschutzerklärung</a> und{' '}
                <a href="#" className="underline hover:text-primary">Cookie-Richtlinie</a>.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}