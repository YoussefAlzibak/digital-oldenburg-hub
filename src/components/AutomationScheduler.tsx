import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar as CalendarUI } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Zap, 
  Calendar as CalendarIcon, 
  Clock, 
  Mail, 
  Plus, 
  Trash2, 
  Settings,
  Users,
  GitBranch
} from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AppointmentReminderConfig from './AppointmentReminderConfig';
import WorkflowActionBuilder, { WorkflowAction } from './WorkflowActionBuilder';

interface EmailAutomation {
  id: string;
  name: string;
  description?: string;
  trigger_type: string;
  trigger_config?: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface AutomationStep {
  id: string;
  automation_id: string;
  step_number: number;
  template_id?: string;
  delay_minutes: number;
  subject: string;
  html_content: string;
  text_content?: string;
  is_active: boolean;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  template_type: string;
}

interface AutomationSchedulerProps {
  automation?: EmailAutomation | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export default function AutomationScheduler({ automation, isOpen, onClose, onSave }: AutomationSchedulerProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    trigger_type: 'newsletter_signup',
    trigger_config: {},
    is_active: true
  });
  const [steps, setSteps] = useState<Partial<AutomationStep>[]>([]);
  const [workflowActions, setWorkflowActions] = useState<WorkflowAction[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [editorMode, setEditorMode] = useState<'simple' | 'advanced'>('simple');
  
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      loadTemplates();
      if (automation) {
        loadAutomationData();
      } else {
        resetForm();
      }
    }
  }, [automation, isOpen]);

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('id, name, subject, template_type')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setTemplates(data || []);
    } catch (error: any) {
      console.error('Error loading templates:', error);
    }
  };

  const loadAutomationData = async () => {
    if (!automation) return;

    try {
      // Load automation data
      setFormData({
        name: automation.name,
        description: automation.description || '',
        trigger_type: automation.trigger_type,
        trigger_config: automation.trigger_config || {},
        is_active: automation.is_active
      });

      // Load automation steps
      const { data: stepsData, error } = await supabase
        .from('email_automation_steps')
        .select('*')
        .eq('automation_id', automation.id)
        .order('step_number');

      if (error) throw error;
      setSteps(stepsData || []);
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: "Automatisierung konnte nicht geladen werden.",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      trigger_type: 'newsletter_signup',
      trigger_config: {},
      is_active: true
    });
    setSteps([{
      step_number: 1,
      delay_minutes: 0,
      subject: '',
      html_content: '',
      text_content: '',
      is_active: true
    }]);
    setWorkflowActions([]);
    setEditorMode('simple');
    setSelectedDate(undefined);
    setSelectedTime('09:00');
  };

  const addStep = () => {
    const newStep: Partial<AutomationStep> = {
      step_number: steps.length + 1,
      delay_minutes: 1440, // 24 hours default
      subject: '',
      html_content: '',
      text_content: '',
      is_active: true
    };
    setSteps([...steps, newStep]);
  };

  const updateStep = (index: number, field: keyof AutomationStep, value: any) => {
    const updatedSteps = [...steps];
    updatedSteps[index] = { ...updatedSteps[index], [field]: value };
    setSteps(updatedSteps);
  };

  const removeStep = (index: number) => {
    if (steps.length <= 1) {
      toast({
        title: "Hinweis",
        description: "Eine Automatisierung muss mindestens einen Schritt haben.",
        variant: "destructive"
      });
      return;
    }
    
    const updatedSteps = steps.filter((_, i) => i !== index);
    // Renumber steps
    updatedSteps.forEach((step, i) => {
      step.step_number = i + 1;
    });
    setSteps(updatedSteps);
  };

  const loadTemplate = (stepIndex: number, templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      updateStep(stepIndex, 'template_id', templateId);
      updateStep(stepIndex, 'subject', template.subject);
      
      // Load full template content
      loadFullTemplate(templateId, stepIndex);
    }
  };

  const loadFullTemplate = async (templateId: string, stepIndex: number) => {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('html_content, text_content')
        .eq('id', templateId)
        .single();

      if (error) throw error;
      if (data) {
        updateStep(stepIndex, 'html_content', data.html_content);
        updateStep(stepIndex, 'text_content', data.text_content || '');
      }
    } catch (error: any) {
      console.error('Error loading template content:', error);
    }
  };

  const handleSave = async () => {
    if (!formData.name) {
      toast({
        title: "Fehler",
        description: "Bitte geben Sie einen Namen für die Automatisierung ein.",
        variant: "destructive"
      });
      return;
    }

    if (steps.length === 0 || !steps[0].subject) {
      toast({
        title: "Fehler",
        description: "Bitte fügen Sie mindestens einen Automatisierungsschritt hinzu.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Prepare trigger config based on type
      let triggerConfig = { ...formData.trigger_config };
      
      if (formData.trigger_type === 'date_based' && selectedDate) {
        triggerConfig = {
          scheduled_date: format(selectedDate, 'yyyy-MM-dd'),
          scheduled_time: selectedTime,
          ...triggerConfig
        };
      }

      if (automation) {
        // Update existing automation
        const { error: automationError } = await supabase
          .from('email_automations')
          .update({
            name: formData.name,
            description: formData.description,
            trigger_type: formData.trigger_type,
            trigger_config: triggerConfig,
            is_active: formData.is_active
          })
          .eq('id', automation.id);

        if (automationError) throw automationError;

        // Delete existing steps
        const { error: deleteError } = await supabase
          .from('email_automation_steps')
          .delete()
          .eq('automation_id', automation.id);

        if (deleteError) throw deleteError;

        // Insert updated steps
        const stepData = steps
          .filter(step => step.subject && step.html_content && step.step_number) // Only include valid steps
          .map(step => ({
            automation_id: automation.id,
            step_number: step.step_number!,
            template_id: step.template_id || null,
            delay_minutes: step.delay_minutes || 0,
            subject: step.subject!,
            html_content: step.html_content!,
            text_content: step.text_content || '',
            is_active: step.is_active !== false
          }));

        const { error: stepsError } = await supabase
          .from('email_automation_steps')
          .insert(stepData);

        if (stepsError) throw stepsError;
      } else {
        // Create new automation
        const { data: newAutomation, error: automationError } = await supabase
          .from('email_automations')
          .insert([{
            name: formData.name,
            description: formData.description,
            trigger_type: formData.trigger_type,
            trigger_config: triggerConfig,
            is_active: formData.is_active
          }])
          .select()
          .single();

        if (automationError) throw automationError;

        // Insert steps
        const stepData = steps
          .filter(step => step.subject && step.html_content && step.step_number) // Only include valid steps
          .map(step => ({
            automation_id: newAutomation.id,
            step_number: step.step_number!,
            template_id: step.template_id || null,
            delay_minutes: step.delay_minutes || 0,
            subject: step.subject!,
            html_content: step.html_content!,
            text_content: step.text_content || '',
            is_active: step.is_active !== false
          }));

        const { error: stepsError } = await supabase
          .from('email_automation_steps')
          .insert(stepData);

        if (stepsError) throw stepsError;
      }

      toast({
        title: "Erfolg",
        description: `Automatisierung wurde ${automation ? 'aktualisiert' : 'erstellt'}.`,
      });

      onSave();
      onClose();
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerTypes = [
    { 
      value: 'newsletter_signup', 
      label: '📧 Newsletter Anmeldung', 
      description: 'Automatische Willkommens-Serie für neue Newsletter-Abonnenten',
      useCase: 'Perfekt für: Willkommens-E-Mails, Onboarding-Serien, erste Kontaktaufnahme',
      icon: Mail
    },
    { 
      value: 'contact_form', 
      label: '📝 Kontaktformular Eingang', 
      description: 'Sofortige Antwort und Follow-up nach Kontaktanfragen',
      useCase: 'Perfekt für: Bestätigungen, Terminvorschläge, zusätzliche Informationen',
      icon: Users
    },
    { 
      value: 'appointment_booked', 
      label: '📅 Termin gebucht', 
      description: 'Bestätigung und Vorbereitung vor wichtigen Terminen',
      useCase: 'Perfekt für: Terminbestätigungen, Erinnerungen, Vorbereitungsmaterial',
      icon: CalendarIcon
    },
    { 
      value: 'date_based', 
      label: '⏰ Zeitgesteuert', 
      description: 'Kampagnen zu bestimmten Terminen automatisch versenden',
      useCase: 'Perfekt für: Saisonale Angebote, Geburtstagsmails, Jahrestage',
      icon: Clock
    },
    { 
      value: 'user_action', 
      label: '🎯 Nutzer-Aktion', 
      description: 'Reaktion auf spezifische Aktivitäten Ihrer Kunden',
      useCase: 'Perfekt für: Download-Bestätigungen, Kauf-Follow-ups, Reaktivierung',
      icon: Zap
    }
  ];

  const delayOptions = [
    { value: 0, label: '⚡ Sofort senden', description: 'Direkter Versand ohne Verzögerung' },
    { value: 15, label: '⏱️ Nach 15 Minuten', description: 'Kurze Pause für Systemprozesse' },
    { value: 60, label: '🕐 Nach 1 Stunde', description: 'Schnelle Nachfassung' },
    { value: 240, label: '🕓 Nach 4 Stunden', description: 'Am selben Tag folgen' },
    { value: 1440, label: '📅 Nach 1 Tag', description: 'Am nächsten Tag senden' },
    { value: 2880, label: '📆 Nach 2 Tagen', description: 'Angemessene Pause zwischen E-Mails' },
    { value: 4320, label: '🗓️ Nach 3 Tagen', description: 'Ausreichend Bedenkzeit geben' },
    { value: 10080, label: '📋 Nach 1 Woche', description: 'Wöchentliche Nachfassung' },
    { value: 43200, label: '📊 Nach 1 Monat', description: 'Langfristige Kundenpflege' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            {automation ? '✏️ Automatisierung bearbeiten' : '🚀 Neue Automatisierung erstellen'}
          </DialogTitle>
          <DialogDescription className="text-base">
            Sparen Sie Zeit mit intelligenten E-Mail-Automatisierungen. 
            Einmal einrichten, automatisch profitieren! 📈
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Settings */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                ⚙️ Grundeinstellungen
              </CardTitle>
              <CardDescription>
                Geben Sie Ihrer Automatisierung einen aussagekräftigen Namen und wählen Sie den passenden Auslöser.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="automation-name">Name *</Label>
                  <Input
                    id="automation-name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="z.B. Willkommens-Serie"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is-active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                  />
                  <Label htmlFor="is-active">Aktiviert</Label>
                </div>
              </div>

              <div>
                <Label htmlFor="automation-description">Beschreibung</Label>
                <Textarea
                  id="automation-description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Beschreibung der Automatisierung..."
                />
              </div>

                <div>
                  <Label htmlFor="trigger-type">Wann soll die Automatisierung starten? *</Label>
                  <Select value={formData.trigger_type} onValueChange={(value) => setFormData({...formData, trigger_type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Auslöser auswählen..." />
                    </SelectTrigger>
                    <SelectContent>
                      {triggerTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="space-y-1">
                            <div className="font-medium">{type.label}</div>
                            <div className="text-xs text-muted-foreground">{type.description}</div>
                            <div className="text-xs text-primary/70 italic">{type.useCase}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {/* Show selected trigger info */}
                  {formData.trigger_type && (
                    <div className="mt-2 p-3 bg-primary/5 rounded-md border border-primary/20">
                      <div className="flex items-start gap-2">
                        <div className="text-sm">
                          <div className="font-medium text-primary">
                            {triggerTypes.find(t => t.value === formData.trigger_type)?.label}
                          </div>
                          <div className="text-muted-foreground text-xs mt-1">
                            {triggerTypes.find(t => t.value === formData.trigger_type)?.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

              {/* Date-based trigger settings */}
              {formData.trigger_type === 'date_based' && (
                <div className="grid grid-cols-2 gap-4 p-4 border rounded-md bg-muted/50">
                  <div>
                    <Label>Datum auswählen</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !selectedDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, 'PPP', { locale: de }) : 'Datum auswählen'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarUI
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label htmlFor="scheduled-time">Uhrzeit</Label>
                    <Input
                      id="scheduled-time"
                      type="time"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Appointment reminder settings */}
              {formData.trigger_type === 'appointment_booked' && (
                <AppointmentReminderConfig
                  triggerConfig={formData.trigger_config}
                  onChange={(config) => setFormData({...formData, trigger_config: config})}
                />
              )}
            </CardContent>
          </Card>

          {/* Editor Mode Selection */}
          <Card className="border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <GitBranch className="h-5 w-5 text-primary" />
                    Workflow-Editor
                  </CardTitle>
                  <CardDescription>
                    Wählen Sie zwischen einfachen E-Mail-Schritten oder dem erweiterten Workflow-Builder
                  </CardDescription>
                </div>
                <Tabs value={editorMode} onValueChange={(v) => setEditorMode(v as 'simple' | 'advanced')}>
                  <TabsList>
                    <TabsTrigger value="simple" className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      Einfach
                    </TabsTrigger>
                    <TabsTrigger value="advanced" className="flex items-center gap-1">
                      <GitBranch className="h-4 w-4" />
                      Erweitert (If/Else)
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
          </Card>

          {/* Simple Mode: Email Steps */}
          {editorMode === 'simple' && (
          <Card className="border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  📧 E-Mail Schritte
                </CardTitle>
                <CardDescription>
                  Erstellen Sie eine Folge von E-Mails mit perfektem Timing. 
                  Jeder Schritt baut auf den vorherigen auf! 🎯
                </CardDescription>
              </div>
              <Button onClick={addStep} size="sm" className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                ➕ Weiteren Schritt hinzufügen
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {steps.map((step, index) => (
                <Card key={index} className="border-2">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Badge variant="outline">Schritt {step.step_number}</Badge>
                      {index > 0 && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {delayOptions.find(d => d.value === step.delay_minutes)?.label || `${step.delay_minutes} Min`}
                        </div>
                      )}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={step.is_active !== false}
                        onCheckedChange={(checked) => updateStep(index, 'is_active', checked)}
                      />
                      {steps.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeStep(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Delay settings for steps after the first */}
                    {index > 0 && (
                      <div>
                        <Label>Verzögerung nach vorherigem Schritt</Label>
                        <Select 
                          value={step.delay_minutes?.toString()} 
                          onValueChange={(value) => updateStep(index, 'delay_minutes', parseInt(value))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {delayOptions.map(option => (
                              <SelectItem key={option.value} value={option.value.toString()}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Template auswählen (optional)</Label>
                        <Select 
                          value={step.template_id || ''} 
                          onValueChange={(value) => loadTemplate(index, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Template auswählen..." />
                          </SelectTrigger>
                          <SelectContent>
                            {templates.map(template => (
                              <SelectItem key={template.id} value={template.id}>
                                <div>
                                  <div>{template.name}</div>
                                  <div className="text-xs text-muted-foreground">{template.template_type}</div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor={`subject-${index}`}>E-Mail Betreff *</Label>
                        <Input
                          id={`subject-${index}`}
                          value={step.subject || ''}
                          onChange={(e) => updateStep(index, 'subject', e.target.value)}
                          placeholder="E-Mail Betreff"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor={`html-content-${index}`}>HTML Inhalt *</Label>
                      <Textarea
                        id={`html-content-${index}`}
                        value={step.html_content || ''}
                        onChange={(e) => updateStep(index, 'html_content', e.target.value)}
                        placeholder="HTML E-Mail Inhalt..."
                        className="min-h-[100px]"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
          )}

          {/* Advanced Mode: Workflow Builder with If/Else */}
          {editorMode === 'advanced' && (
          <Card className="border-purple-500/20">
            <CardHeader>
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <GitBranch className="h-5 w-5 text-purple-500" />
                  🔀 Erweiterter Workflow-Builder
                </CardTitle>
                <CardDescription>
                  Nutzen Sie If/Else-Bedingungen, Tags und komplexe Logik für Ihre Automatisierung
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <WorkflowActionBuilder
                actions={workflowActions}
                onChange={setWorkflowActions}
                templates={templates.map(t => ({ id: t.id, name: t.name, subject: t.subject }))}
              />
            </CardContent>
          </Card>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Abbrechen
            </Button>
            <Button onClick={handleSave} disabled={isSubmitting}>
              {isSubmitting ? 'Speichere...' : (automation ? 'Aktualisieren' : 'Erstellen')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}