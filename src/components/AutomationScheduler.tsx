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
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Zap, 
  Calendar as CalendarIcon, 
  Clock, 
  Mail, 
  Plus, 
  Edit, 
  Trash2, 
  Play, 
  Pause,
  Settings,
  Users
} from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('09:00');
  
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
        const stepData = steps.map(step => ({
          ...step,
          automation_id: automation.id
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
        const stepData = steps.map(step => ({
          ...step,
          automation_id: newAutomation.id
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
    { value: 'newsletter_signup', label: 'Newsletter Anmeldung', description: 'Wird ausgelöst bei Newsletter-Anmeldungen' },
    { value: 'contact_form', label: 'Kontaktformular', description: 'Wird ausgelöst bei Kontaktformular-Übermittlungen' },
    { value: 'appointment_booked', label: 'Termin gebucht', description: 'Wird ausgelöst bei Terminbuchungen' },
    { value: 'date_based', label: 'Datumsbasiert', description: 'Wird zu einem bestimmten Datum/Zeit ausgelöst' },
    { value: 'user_action', label: 'Benutzeraktion', description: 'Wird bei bestimmten Benutzeraktionen ausgelöst' }
  ];

  const delayOptions = [
    { value: 0, label: 'Sofort' },
    { value: 15, label: '15 Minuten' },
    { value: 60, label: '1 Stunde' },
    { value: 240, label: '4 Stunden' },
    { value: 1440, label: '1 Tag' },
    { value: 2880, label: '2 Tage' },
    { value: 4320, label: '3 Tage' },
    { value: 10080, label: '1 Woche' },
    { value: 43200, label: '1 Monat' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            {automation ? 'Automatisierung bearbeiten' : 'Neue Automatisierung erstellen'}
          </DialogTitle>
          <DialogDescription>
            Erstellen Sie E-Mail Automatisierungen mit mehreren Schritten und Zeitverzögerungen
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Grundeinstellungen</CardTitle>
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
                <Label htmlFor="trigger-type">Auslöser Typ *</Label>
                <Select value={formData.trigger_type} onValueChange={(value) => setFormData({...formData, trigger_type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {triggerTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        <div>
                          <div>{type.label}</div>
                          <div className="text-xs text-muted-foreground">{type.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                        <Calendar
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
            </CardContent>
          </Card>

          {/* Automation Steps */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Automatisierungsschritte</CardTitle>
                <CardDescription>
                  Definieren Sie die E-Mail-Schritte und deren Zeitverzögerungen
                </CardDescription>
              </div>
              <Button onClick={addStep} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Schritt hinzufügen
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