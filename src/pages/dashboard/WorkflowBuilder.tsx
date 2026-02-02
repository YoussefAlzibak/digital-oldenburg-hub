import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, Play, Pause } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import WorkflowActionBuilder, { WorkflowAction } from "@/components/WorkflowActionBuilder";

export default function WorkflowBuilderPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const automationId = searchParams.get("id");
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [triggerType, setTriggerType] = useState("newsletter_signup");
  const [isActive, setIsActive] = useState(false);
  const [actions, setActions] = useState<WorkflowAction[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (automationId) {
      loadAutomation();
    }
  }, [automationId]);

  const loadAutomation = async () => {
    if (!automationId) return;
    
    setLoading(true);
    try {
      const { data: automation, error: automationError } = await supabase
        .from("email_automations")
        .select("*")
        .eq("id", automationId)
        .single();

      if (automationError) throw automationError;

      setName(automation.name);
      setDescription(automation.description || "");
      setTriggerType(automation.trigger_type);
      setIsActive(automation.is_active);

      // Load workflow actions
      const { data: workflowActions, error: actionsError } = await supabase
        .from("workflow_actions")
        .select("*")
        .eq("automation_id", automationId)
        .order("step_number");

      if (actionsError) throw actionsError;

      // Convert to WorkflowAction format
      const convertedActions: WorkflowAction[] = (workflowActions || []).map(wa => ({
        id: wa.id,
        action_type: wa.action_type as WorkflowAction['action_type'],
        step_number: wa.step_number,
        delay_minutes: wa.delay_minutes || undefined,
        subject: wa.subject || undefined,
        html_content: wa.html_content || undefined,
        condition_field: wa.condition_field || undefined,
        condition_operator: wa.condition_operator || undefined,
        condition_value: wa.condition_value || undefined,
        branch_type: wa.branch_type as 'if' | 'else' | undefined,
        is_active: wa.is_active ?? true,
        if_actions: [],
        else_actions: []
      }));

      setActions(convertedActions);

    } catch (error) {
      console.error("Error loading automation:", error);
      toast({
        title: "Fehler",
        description: "Automatisierung konnte nicht geladen werden.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast({
        title: "Fehler",
        description: "Bitte geben Sie einen Namen ein.",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      let currentAutomationId = automationId;

      if (automationId) {
        const { error } = await supabase
          .from("email_automations")
          .update({
            name,
            description,
            trigger_type: triggerType,
            is_active: isActive,
            updated_at: new Date().toISOString()
          })
          .eq("id", automationId);

        if (error) throw error;

        await supabase
          .from("workflow_actions")
          .delete()
          .eq("automation_id", automationId);

      } else {
        const { data, error } = await supabase
          .from("email_automations")
          .insert({
            name,
            description,
            trigger_type: triggerType,
            is_active: isActive
          })
          .select()
          .single();

        if (error) throw error;
        currentAutomationId = data.id;
      }

      // Save workflow actions recursively
      if (currentAutomationId && actions.length > 0) {
        await saveActionsRecursive(actions, currentAutomationId, null, 1);
      }

      toast({
        title: "Gespeichert",
        description: "Workflow wurde erfolgreich gespeichert."
      });

      navigate("/admin/automations");

    } catch (error) {
      console.error("Error saving automation:", error);
      toast({
        title: "Fehler",
        description: "Workflow konnte nicht gespeichert werden.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const saveActionsRecursive = async (
    actionsToSave: WorkflowAction[],
    autoId: string,
    parentId: string | null,
    startStep: number
  ): Promise<number> => {
    let stepNumber = startStep;

    for (const action of actionsToSave) {
      const { data, error } = await supabase
        .from("workflow_actions")
        .insert({
          automation_id: autoId,
          parent_action_id: parentId,
          action_type: action.action_type,
          step_number: stepNumber,
          delay_minutes: action.delay_minutes,
          subject: action.subject,
          html_content: action.html_content,
          condition_field: action.condition_field,
          condition_operator: action.condition_operator,
          condition_value: action.condition_value,
          branch_type: action.branch_type,
          is_active: action.is_active ?? true
        })
        .select()
        .single();

      if (error) throw error;

      stepNumber++;

      // Save if_actions with branch_type 'if'
      if (action.if_actions && action.if_actions.length > 0) {
        const ifActionsWithBranch = action.if_actions.map(a => ({ ...a, branch_type: 'if' as const }));
        stepNumber = await saveActionsRecursive(ifActionsWithBranch, autoId, data.id, stepNumber);
      }

      // Save else_actions with branch_type 'else'
      if (action.else_actions && action.else_actions.length > 0) {
        const elseActionsWithBranch = action.else_actions.map(a => ({ ...a, branch_type: 'else' as const }));
        stepNumber = await saveActionsRecursive(elseActionsWithBranch, autoId, data.id, stepNumber);
      }
    }

    return stepNumber;
  };

  const handleActionsChange = (newActions: WorkflowAction[]) => {
    setActions(newActions);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/automations")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {automationId ? "Workflow bearbeiten" : "Neuer Workflow"}
            </h1>
            <p className="text-muted-foreground">
              Erstellen Sie komplexe Automatisierungen mit Bedingungen und Verzweigungen
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 mr-4">
            {isActive ? (
              <Play className="h-4 w-4 text-green-500" />
            ) : (
              <Pause className="h-4 w-4 text-muted-foreground" />
            )}
            <Label htmlFor="active-toggle">Aktiv</Label>
            <Switch
              id="active-toggle"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Speichern..." : "Speichern"}
          </Button>
        </div>
      </div>

      {/* Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle>Workflow-Einstellungen</CardTitle>
          <CardDescription>Grundlegende Konfiguration der Automatisierung</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="z.B. Lead Nurturing Workflow"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trigger">Auslöser</Label>
              <Select value={triggerType} onValueChange={setTriggerType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newsletter_signup">Newsletter-Anmeldung</SelectItem>
                  <SelectItem value="contact_form">Kontaktformular</SelectItem>
                  <SelectItem value="appointment_booked">Termin gebucht</SelectItem>
                  <SelectItem value="appointment_completed">Termin abgeschlossen</SelectItem>
                  <SelectItem value="tag_added">Tag hinzugefügt</SelectItem>
                  <SelectItem value="tag_removed">Tag entfernt</SelectItem>
                  <SelectItem value="scheduled">Zeitgesteuert</SelectItem>
                  <SelectItem value="manual">Manuell</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Beschreibung</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Beschreiben Sie den Zweck dieser Automatisierung..."
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Workflow Builder */}
      <Card>
        <CardHeader>
          <CardTitle>Workflow-Aktionen</CardTitle>
          <CardDescription>
            Definieren Sie die Schritte, Bedingungen und Verzweigungen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WorkflowActionBuilder
            actions={actions}
            onChange={handleActionsChange}
          />
        </CardContent>
      </Card>
    </div>
  );
}
