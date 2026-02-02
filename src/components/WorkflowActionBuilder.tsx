import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Plus, 
  Trash2, 
  Mail, 
  Tag, 
  GitBranch, 
  Clock,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  X
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

export type ActionType = 'email' | 'condition' | 'add_tag' | 'remove_tag' | 'delay';

export interface WorkflowAction {
  id?: string;
  action_type: ActionType;
  step_number: number;
  parent_action_id?: string | null;
  branch_type?: 'if' | 'else' | null;
  // Condition fields
  condition_field?: string;
  condition_operator?: string;
  condition_value?: string;
  // Email fields
  subject?: string;
  html_content?: string;
  text_content?: string;
  delay_minutes?: number;
  // Tag fields
  action_config?: {
    tag_name?: string;
    tags?: string[];
  };
  is_active?: boolean;
  // Nested actions for conditions
  if_actions?: WorkflowAction[];
  else_actions?: WorkflowAction[];
}

interface AvailableTag {
  id: string;
  name: string;
  color: string;
  description: string | null;
}

interface WorkflowActionBuilderProps {
  actions: WorkflowAction[];
  onChange: (actions: WorkflowAction[]) => void;
  templates?: { id: string; name: string; subject: string; html_content?: string }[];
}

export default function WorkflowActionBuilder({ actions, onChange, templates = [] }: WorkflowActionBuilderProps) {
  const [availableTags, setAvailableTags] = useState<AvailableTag[]>([]);
  const [expandedConditions, setExpandedConditions] = useState<Set<number>>(new Set([0]));

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      const { data, error } = await supabase
        .from('available_tags')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setAvailableTags(data || []);
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  };

  const addAction = (type: ActionType, parentIndex?: number, branchType?: 'if' | 'else') => {
    const newAction: WorkflowAction = {
      action_type: type,
      step_number: actions.length + 1,
      is_active: true,
      delay_minutes: type === 'delay' ? 1440 : 0,
      action_config: type === 'add_tag' || type === 'remove_tag' ? { tags: [] } : {},
      if_actions: type === 'condition' ? [] : undefined,
      else_actions: type === 'condition' ? [] : undefined
    };

    if (parentIndex !== undefined && branchType) {
      // Adding to a condition branch
      const updatedActions = [...actions];
      const parentAction = updatedActions[parentIndex];
      if (parentAction.action_type === 'condition') {
        if (branchType === 'if') {
          parentAction.if_actions = [...(parentAction.if_actions || []), newAction];
        } else {
          parentAction.else_actions = [...(parentAction.else_actions || []), newAction];
        }
      }
      onChange(updatedActions);
    } else {
      onChange([...actions, newAction]);
    }
  };

  const updateAction = (index: number, updates: Partial<WorkflowAction>) => {
    const updatedActions = actions.map((action, i) => 
      i === index ? { ...action, ...updates } : action
    );
    onChange(updatedActions);
  };

  const removeAction = (index: number) => {
    const updatedActions = actions.filter((_, i) => i !== index);
    // Renumber steps
    updatedActions.forEach((action, i) => {
      action.step_number = i + 1;
    });
    onChange(updatedActions);
  };

  const updateBranchAction = (
    parentIndex: number, 
    branchType: 'if' | 'else', 
    actionIndex: number, 
    updates: Partial<WorkflowAction>
  ) => {
    const updatedActions = [...actions];
    const parentAction = updatedActions[parentIndex];
    
    if (branchType === 'if' && parentAction.if_actions) {
      parentAction.if_actions = parentAction.if_actions.map((a, i) =>
        i === actionIndex ? { ...a, ...updates } : a
      );
    } else if (branchType === 'else' && parentAction.else_actions) {
      parentAction.else_actions = parentAction.else_actions.map((a, i) =>
        i === actionIndex ? { ...a, ...updates } : a
      );
    }
    
    onChange(updatedActions);
  };

  const removeBranchAction = (parentIndex: number, branchType: 'if' | 'else', actionIndex: number) => {
    const updatedActions = [...actions];
    const parentAction = updatedActions[parentIndex];
    
    if (branchType === 'if' && parentAction.if_actions) {
      parentAction.if_actions = parentAction.if_actions.filter((_, i) => i !== actionIndex);
    } else if (branchType === 'else' && parentAction.else_actions) {
      parentAction.else_actions = parentAction.else_actions.filter((_, i) => i !== actionIndex);
    }
    
    onChange(updatedActions);
  };

  const toggleConditionExpanded = (index: number) => {
    const newExpanded = new Set(expandedConditions);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedConditions(newExpanded);
  };

  const getActionIcon = (type: ActionType) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'condition': return <GitBranch className="h-4 w-4" />;
      case 'add_tag': return <Tag className="h-4 w-4 text-green-500" />;
      case 'remove_tag': return <Tag className="h-4 w-4 text-red-500" />;
      case 'delay': return <Clock className="h-4 w-4" />;
    }
  };

  const getActionLabel = (type: ActionType) => {
    switch (type) {
      case 'email': return 'E-Mail senden';
      case 'condition': return 'Wenn/Dann (If/Else)';
      case 'add_tag': return 'Tag hinzufügen';
      case 'remove_tag': return 'Tag entfernen';
      case 'delay': return 'Verzögerung';
    }
  };

  const conditionFields = [
    { value: 'tags', label: 'Tags' },
    { value: 'source', label: 'Quelle (Source)' },
    { value: 'email_domain', label: 'E-Mail Domain' },
    { value: 'company', label: 'Firma' }
  ];

  const conditionOperators = [
    { value: 'contains', label: 'enthält' },
    { value: 'not_contains', label: 'enthält nicht' },
    { value: 'equals', label: 'ist gleich' },
    { value: 'not_equals', label: 'ist nicht gleich' },
    { value: 'is_empty', label: 'ist leer' },
    { value: 'is_not_empty', label: 'ist nicht leer' }
  ];

  const delayOptions = [
    { value: 15, label: '15 Minuten' },
    { value: 60, label: '1 Stunde' },
    { value: 240, label: '4 Stunden' },
    { value: 1440, label: '1 Tag' },
    { value: 2880, label: '2 Tage' },
    { value: 4320, label: '3 Tage' },
    { value: 10080, label: '1 Woche' }
  ];

  const renderActionCard = (
    action: WorkflowAction, 
    index: number, 
    parentIndex?: number, 
    branchType?: 'if' | 'else'
  ) => {
    const isNested = parentIndex !== undefined;
    const isConditionExpanded = expandedConditions.has(index);

    return (
      <Card 
        key={`${parentIndex ?? ''}-${branchType ?? ''}-${index}`} 
        className={cn(
          "border-2 transition-all",
          action.action_type === 'condition' && "border-purple-500/30 bg-purple-500/5",
          action.action_type === 'add_tag' && "border-green-500/30",
          action.action_type === 'remove_tag' && "border-red-500/30",
          isNested && "ml-6 border-dashed"
        )}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {action.action_type === 'condition' && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => toggleConditionExpanded(index)}
                >
                  {isConditionExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              )}
              <Badge variant="outline" className="flex items-center gap-1">
                {getActionIcon(action.action_type)}
                {getActionLabel(action.action_type)}
              </Badge>
              {!isNested && <span className="text-xs text-muted-foreground">Schritt {action.step_number}</span>}
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={action.is_active !== false}
                onCheckedChange={(checked) => {
                  if (isNested && parentIndex !== undefined && branchType) {
                    updateBranchAction(parentIndex, branchType, index, { is_active: checked });
                  } else {
                    updateAction(index, { is_active: checked });
                  }
                }}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (isNested && parentIndex !== undefined && branchType) {
                    removeBranchAction(parentIndex, branchType, index);
                  } else {
                    removeAction(index);
                  }
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Email Action */}
          {action.action_type === 'email' && (
            <>
              <div>
                <Label>E-Mail Betreff</Label>
                <Input
                  value={action.subject || ''}
                  onChange={(e) => {
                    if (isNested && parentIndex !== undefined && branchType) {
                      updateBranchAction(parentIndex, branchType, index, { subject: e.target.value });
                    } else {
                      updateAction(index, { subject: e.target.value });
                    }
                  }}
                  placeholder="Betreff eingeben..."
                />
              </div>
              <div>
                <Label>HTML Inhalt</Label>
                <Textarea
                  value={action.html_content || ''}
                  onChange={(e) => {
                    if (isNested && parentIndex !== undefined && branchType) {
                      updateBranchAction(parentIndex, branchType, index, { html_content: e.target.value });
                    } else {
                      updateAction(index, { html_content: e.target.value });
                    }
                  }}
                  placeholder="E-Mail Inhalt..."
                  className="min-h-[100px]"
                />
              </div>
            </>
          )}

          {/* Condition Action */}
          {action.action_type === 'condition' && (
            <>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label>Feld</Label>
                  <Select
                    value={action.condition_field || ''}
                    onValueChange={(value) => updateAction(index, { condition_field: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Wählen..." />
                    </SelectTrigger>
                    <SelectContent>
                      {conditionFields.map(field => (
                        <SelectItem key={field.value} value={field.value}>
                          {field.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Operator</Label>
                  <Select
                    value={action.condition_operator || ''}
                    onValueChange={(value) => updateAction(index, { condition_operator: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Wählen..." />
                    </SelectTrigger>
                    <SelectContent>
                      {conditionOperators.map(op => (
                        <SelectItem key={op.value} value={op.value}>
                          {op.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Wert</Label>
                  {action.condition_field === 'tags' ? (
                    <Select
                      value={action.condition_value || ''}
                      onValueChange={(value) => updateAction(index, { condition_value: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tag wählen..." />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTags.map(tag => (
                          <SelectItem key={tag.id} value={tag.name}>
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: tag.color }}
                              />
                              {tag.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      value={action.condition_value || ''}
                      onChange={(e) => updateAction(index, { condition_value: e.target.value })}
                      placeholder="Wert..."
                      disabled={action.condition_operator === 'is_empty' || action.condition_operator === 'is_not_empty'}
                    />
                  )}
                </div>
              </div>

              {isConditionExpanded && (
                <div className="space-y-4 mt-4">
                  {/* IF Branch */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-500">✓ WENN wahr</Badge>
                      <span className="text-xs text-muted-foreground">
                        Diese Aktionen werden ausgeführt, wenn die Bedingung erfüllt ist
                      </span>
                    </div>
                    <div className="pl-4 border-l-2 border-green-500/30 space-y-2">
                      {(action.if_actions || []).map((ifAction, ifIndex) => 
                        renderActionCard(ifAction, ifIndex, index, 'if')
                      )}
                      <div className="flex gap-2 flex-wrap">
                        <Button size="sm" variant="outline" onClick={() => addAction('email', index, 'if')}>
                          <Mail className="h-3 w-3 mr-1" /> E-Mail
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => addAction('add_tag', index, 'if')}>
                          <Tag className="h-3 w-3 mr-1" /> Tag +
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => addAction('delay', index, 'if')}>
                          <Clock className="h-3 w-3 mr-1" /> Delay
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* ELSE Branch */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive">✗ SONST</Badge>
                      <span className="text-xs text-muted-foreground">
                        Diese Aktionen werden ausgeführt, wenn die Bedingung nicht erfüllt ist
                      </span>
                    </div>
                    <div className="pl-4 border-l-2 border-red-500/30 space-y-2">
                      {(action.else_actions || []).map((elseAction, elseIndex) => 
                        renderActionCard(elseAction, elseIndex, index, 'else')
                      )}
                      <div className="flex gap-2 flex-wrap">
                        <Button size="sm" variant="outline" onClick={() => addAction('email', index, 'else')}>
                          <Mail className="h-3 w-3 mr-1" /> E-Mail
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => addAction('add_tag', index, 'else')}>
                          <Tag className="h-3 w-3 mr-1" /> Tag +
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => addAction('delay', index, 'else')}>
                          <Clock className="h-3 w-3 mr-1" /> Delay
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Add/Remove Tag Action */}
          {(action.action_type === 'add_tag' || action.action_type === 'remove_tag') && (
            <div>
              <Label>{action.action_type === 'add_tag' ? 'Tags hinzufügen' : 'Tags entfernen'}</Label>
              <Select
                value=""
                onValueChange={(value) => {
                  const currentTags = action.action_config?.tags || [];
                  if (!currentTags.includes(value)) {
                    const newConfig = { ...action.action_config, tags: [...currentTags, value] };
                    if (isNested && parentIndex !== undefined && branchType) {
                      updateBranchAction(parentIndex, branchType, index, { action_config: newConfig });
                    } else {
                      updateAction(index, { action_config: newConfig });
                    }
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tag auswählen..." />
                </SelectTrigger>
                <SelectContent>
                  {availableTags
                    .filter(tag => !(action.action_config?.tags || []).includes(tag.name))
                    .map(tag => (
                      <SelectItem key={tag.id} value={tag.name}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: tag.color }}
                          />
                          {tag.name}
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              
              {/* Selected Tags */}
              <div className="flex flex-wrap gap-2 mt-2">
                {(action.action_config?.tags || []).map(tagName => {
                  const tagInfo = availableTags.find(t => t.name === tagName);
                  return (
                    <Badge 
                      key={tagName} 
                      variant="secondary"
                      className="flex items-center gap-1"
                      style={{ 
                        backgroundColor: tagInfo ? `${tagInfo.color}20` : undefined,
                        borderColor: tagInfo?.color
                      }}
                    >
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: tagInfo?.color || '#888' }}
                      />
                      {tagName}
                      <button
                        onClick={() => {
                          const newTags = (action.action_config?.tags || []).filter(t => t !== tagName);
                          const newConfig = { ...action.action_config, tags: newTags };
                          if (isNested && parentIndex !== undefined && branchType) {
                            updateBranchAction(parentIndex, branchType, index, { action_config: newConfig });
                          } else {
                            updateAction(index, { action_config: newConfig });
                          }
                        }}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}

          {/* Delay Action */}
          {action.action_type === 'delay' && (
            <div>
              <Label>Wartezeit</Label>
              <Select
                value={action.delay_minutes?.toString() || '1440'}
                onValueChange={(value) => {
                  if (isNested && parentIndex !== undefined && branchType) {
                    updateBranchAction(parentIndex, branchType, index, { delay_minutes: parseInt(value) });
                  } else {
                    updateAction(index, { delay_minutes: parseInt(value) });
                  }
                }}
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
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      {/* Action Flow */}
      <div className="space-y-3">
        {actions.map((action, index) => (
          <div key={index}>
            {index > 0 && (
              <div className="flex justify-center py-2">
                <ArrowRight className="h-5 w-5 text-muted-foreground rotate-90" />
              </div>
            )}
            {renderActionCard(action, index)}
          </div>
        ))}
      </div>

      {/* Add Action Buttons */}
      <div className="flex flex-wrap gap-2 pt-4 border-t">
        <Button onClick={() => addAction('email')} variant="outline" size="sm">
          <Mail className="h-4 w-4 mr-2" />
          E-Mail senden
        </Button>
        <Button onClick={() => addAction('condition')} variant="outline" size="sm" className="border-purple-500/50">
          <GitBranch className="h-4 w-4 mr-2" />
          If/Else Bedingung
        </Button>
        <Button onClick={() => addAction('add_tag')} variant="outline" size="sm" className="border-green-500/50">
          <Tag className="h-4 w-4 mr-2" />
          Tag hinzufügen
        </Button>
        <Button onClick={() => addAction('remove_tag')} variant="outline" size="sm" className="border-red-500/50">
          <Tag className="h-4 w-4 mr-2" />
          Tag entfernen
        </Button>
        <Button onClick={() => addAction('delay')} variant="outline" size="sm">
          <Clock className="h-4 w-4 mr-2" />
          Verzögerung
        </Button>
      </div>

      {actions.length === 0 && (
        <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
          <GitBranch className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>Fügen Sie Aktionen hinzu, um Ihren Workflow zu erstellen</p>
          <p className="text-sm mt-1">Nutzen Sie If/Else für bedingte Logik!</p>
        </div>
      )}
    </div>
  );
}
