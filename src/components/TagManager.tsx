import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tag, Plus, Trash2, Edit, Palette } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AvailableTag {
  id: string;
  name: string;
  color: string;
  description: string | null;
  created_at: string;
}

const colorOptions = [
  { value: '#3b82f6', label: 'Blau' },
  { value: '#22c55e', label: 'Grün' },
  { value: '#8b5cf6', label: 'Lila' },
  { value: '#f59e0b', label: 'Orange' },
  { value: '#ec4899', label: 'Pink' },
  { value: '#06b6d4', label: 'Cyan' },
  { value: '#14b8a6', label: 'Teal' },
  { value: '#6b7280', label: 'Grau' },
  { value: '#ef4444', label: 'Rot' },
  { value: '#84cc16', label: 'Lime' }
];

export default function TagManager() {
  const [tags, setTags] = useState<AvailableTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingTag, setEditingTag] = useState<AvailableTag | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    color: '#3b82f6',
    description: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('available_tags')
        .select('*')
        .order('name');

      if (error) throw error;
      setTags(data || []);
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (tag?: AvailableTag) => {
    if (tag) {
      setEditingTag(tag);
      setFormData({
        name: tag.name,
        color: tag.color,
        description: tag.description || ''
      });
    } else {
      setEditingTag(null);
      setFormData({
        name: '',
        color: '#3b82f6',
        description: ''
      });
    }
    setShowDialog(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Fehler",
        description: "Bitte geben Sie einen Tag-Namen ein.",
        variant: "destructive"
      });
      return;
    }

    try {
      if (editingTag) {
        const { error } = await supabase
          .from('available_tags')
          .update({
            name: formData.name.toLowerCase().replace(/\s+/g, '-'),
            color: formData.color,
            description: formData.description || null
          })
          .eq('id', editingTag.id);

        if (error) throw error;
        toast({ title: "Tag aktualisiert" });
      } else {
        const { error } = await supabase
          .from('available_tags')
          .insert({
            name: formData.name.toLowerCase().replace(/\s+/g, '-'),
            color: formData.color,
            description: formData.description || null
          });

        if (error) throw error;
        toast({ title: "Tag erstellt" });
      }

      setShowDialog(false);
      loadTags();
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tag wirklich löschen?')) return;

    try {
      const { error } = await supabase
        .from('available_tags')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Tag gelöscht" });
      loadTags();
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-primary" />
              Tag-Verwaltung
            </CardTitle>
            <CardDescription>
              Erstellen und verwalten Sie Tags für die Kontakt-Segmentierung
            </CardDescription>
          </div>
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Neuer Tag
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingTag ? 'Tag bearbeiten' : 'Neuer Tag'}
                </DialogTitle>
                <DialogDescription>
                  Tags helfen bei der Segmentierung Ihrer Kontakte
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="tag-name">Name</Label>
                  <Input
                    id="tag-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="z.B. vip-kunde"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Wird automatisch in Kleinbuchstaben konvertiert
                  </p>
                </div>
                <div>
                  <Label>Farbe</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {colorOptions.map(color => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, color: color.value })}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          formData.color === color.value ? 'ring-2 ring-offset-2 ring-primary' : ''
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.label}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="tag-description">Beschreibung (optional)</Label>
                  <Input
                    id="tag-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="z.B. Premium-Kunden mit Sonderkonditionen"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowDialog(false)}>
                    Abbrechen
                  </Button>
                  <Button onClick={handleSave}>
                    {editingTag ? 'Aktualisieren' : 'Erstellen'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Lade Tags...</div>
        ) : tags.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Tag className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Keine Tags vorhanden</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tag</TableHead>
                <TableHead>Beschreibung</TableHead>
                <TableHead className="w-[100px]">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tags.map(tag => (
                <TableRow key={tag.id}>
                  <TableCell>
                    <Badge
                      className="flex items-center gap-1 w-fit"
                      style={{
                        backgroundColor: `${tag.color}20`,
                        borderColor: tag.color,
                        color: tag.color
                      }}
                    >
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: tag.color }}
                      />
                      {tag.name}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {tag.description || '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(tag)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(tag.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
