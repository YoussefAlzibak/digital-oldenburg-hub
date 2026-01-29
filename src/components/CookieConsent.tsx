import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Cookie, Settings, Shield, BarChart, X } from 'lucide-react';

interface CookieSettings {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<CookieSettings>({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true
    };
    setSettings(allAccepted);
    saveCookieSettings(allAccepted);
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false
    };
    setSettings(onlyNecessary);
    saveCookieSettings(onlyNecessary);
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleSaveSettings = () => {
    saveCookieSettings(settings);
    setShowBanner(false);
    setShowSettings(false);
  };

  const saveCookieSettings = (cookieSettings: CookieSettings) => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      timestamp: new Date().toISOString(),
      settings: cookieSettings
    }));
    
    // Cookie settings saved - integrate with analytics tools as needed
  };

  const updateSetting = (key: keyof CookieSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur-sm border-t shadow-lg">
        <div className="container mx-auto max-w-4xl">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Cookie className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">🍪 Wir verwenden Cookies</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Wir nutzen Cookies, um Ihnen die bestmögliche Nutzererfahrung zu bieten und unsere Website zu verbessern. 
                    Sie können Ihre Einstellungen jederzeit anpassen.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button onClick={handleAcceptAll}>
                      Alle akzeptieren
                    </Button>
                    <Button variant="outline" onClick={handleRejectAll}>
                      Nur notwendige
                    </Button>
                    <Button variant="ghost" onClick={() => setShowSettings(true)}>
                      <Settings className="h-4 w-4 mr-2" />
                      Einstellungen
                    </Button>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleRejectAll}
                  className="flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Cookie-Einstellungen
              </CardTitle>
              <CardDescription>
                Verwalten Sie Ihre Cookie-Präferenzen für eine personalisierte Erfahrung.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Necessary Cookies */}
              <div className="flex items-start justify-between p-4 border rounded-lg">
                <div className="flex-1 mr-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <h4 className="font-semibold">Notwendige Cookies</h4>
                    <Badge variant="secondary">Erforderlich</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Diese Cookies sind für die Grundfunktionen der Website erforderlich und können nicht deaktiviert werden.
                  </p>
                </div>
                <Switch 
                  checked={settings.necessary} 
                  disabled 
                />
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-start justify-between p-4 border rounded-lg">
                <div className="flex-1 mr-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart className="h-4 w-4 text-blue-600" />
                    <h4 className="font-semibold">Analyse Cookies</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Helfen uns zu verstehen, wie Besucher mit der Website interagieren, um die Benutzerfreundlichkeit zu verbessern.
                  </p>
                </div>
                <Switch 
                  checked={settings.analytics} 
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
                    Werden verwendet, um Ihnen relevante Werbung und Marketing-Inhalte anzuzeigen.
                  </p>
                </div>
                <Switch 
                  checked={settings.marketing} 
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
                    Speichern Ihre Einstellungen und Präferenzen für eine personalisierte Erfahrung.
                  </p>
                </div>
                <Switch 
                  checked={settings.preferences} 
                  onCheckedChange={(checked) => updateSetting('preferences', checked)}
                />
              </div>

              <div className="flex flex-wrap gap-2 pt-4 border-t">
                <Button onClick={handleSaveSettings} className="flex-1">
                  Einstellungen speichern
                </Button>
                <Button variant="outline" onClick={handleAcceptAll}>
                  Alle akzeptieren
                </Button>
                <Button variant="ghost" onClick={() => setShowSettings(false)}>
                  Abbrechen
                </Button>
              </div>

              <div className="text-xs text-muted-foreground">
                <p>
                  Weitere Informationen finden Sie in unserer{' '}
                  <a href="#" className="underline hover:text-primary">Datenschutzerklärung</a> und in den{' '}
                  <a href="#" className="underline hover:text-primary">Cookie-Richtlinien</a>.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}