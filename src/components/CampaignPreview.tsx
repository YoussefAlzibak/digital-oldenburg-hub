import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Monitor, 
  Smartphone, 
  Tablet,
  Mail,
  Send,
  Code
} from 'lucide-react';

interface CampaignPreviewProps {
  subject: string;
  htmlContent: string;
  isOpen: boolean;
  onClose: () => void;
  onSendTest?: (email: string) => void;
}

export default function CampaignPreview({ 
  subject, 
  htmlContent, 
  isOpen, 
  onClose,
  onSendTest 
}: CampaignPreviewProps) {
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showCode, setShowCode] = useState(false);

  const getPreviewWidth = () => {
    switch (viewMode) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      default: return '100%';
    }
  };

  const getPreviewIcon = () => {
    switch (viewMode) {
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'tablet': return <Tablet className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            👁️ E-Mail Vorschau
          </DialogTitle>
          <DialogDescription>
            Überprüfen Sie, wie Ihre E-Mail auf verschiedenen Geräten aussieht
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-col min-h-0 space-y-4">
          {/* Subject Preview */}
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline">Betreff</Badge>
              <span className="font-medium">{subject || 'Kein Betreff'}</span>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center justify-between">
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
              <TabsList>
                <TabsTrigger value="desktop" className="flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  Desktop
                </TabsTrigger>
                <TabsTrigger value="tablet" className="flex items-center gap-2">
                  <Tablet className="h-4 w-4" />
                  Tablet
                </TabsTrigger>
                <TabsTrigger value="mobile" className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  Mobile
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex gap-2">
              <Button 
                variant={showCode ? "default" : "outline"} 
                size="sm"
                onClick={() => setShowCode(!showCode)}
              >
                <Code className="h-4 w-4 mr-1" />
                {showCode ? 'Vorschau' : 'HTML Code'}
              </Button>
            </div>
          </div>

          {/* Preview Frame */}
          <div className="flex-1 min-h-0 border rounded-lg bg-white dark:bg-muted overflow-hidden">
            <div 
              className="h-full overflow-auto mx-auto transition-all duration-300"
              style={{ maxWidth: getPreviewWidth() }}
            >
              {showCode ? (
                <pre className="p-4 text-xs font-mono bg-slate-900 text-slate-100 overflow-auto h-full">
                  <code>{htmlContent}</code>
                </pre>
              ) : (
                <iframe
                  srcDoc={htmlContent || '<p style="padding: 20px; color: #666;">Kein Inhalt zum Anzeigen</p>'}
                  className="w-full h-full min-h-[500px] border-0"
                  title="E-Mail Vorschau"
                  sandbox="allow-same-origin"
                />
              )}
            </div>
          </div>

          {/* Device Info */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            {getPreviewIcon()}
            <span>
              {viewMode === 'desktop' && 'Desktop-Ansicht (Vollbild)'}
              {viewMode === 'tablet' && 'Tablet-Ansicht (768px)'}
              {viewMode === 'mobile' && 'Mobile-Ansicht (375px)'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Schließen
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
