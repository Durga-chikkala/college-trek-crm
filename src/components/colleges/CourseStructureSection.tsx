
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCourseTopics, useCreateCourseTopic, useUpdateCourseTopic, useDeleteCourseTopic } from '@/hooks/useCourseTopics';
import { 
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  FileText, 
  Code, 
  GripVertical,
  Save,
  X
} from 'lucide-react';

interface CourseStructureSectionProps {
  courseId: string;
  courseName: string;
}

export const CourseStructureSection = ({ courseId, courseName }: CourseStructureSectionProps) => {
  const { data: topics = [], isLoading } = useCourseTopics(courseId);
  const createTopicMutation = useCreateCourseTopic();
  const updateTopicMutation = useUpdateCourseTopic();
  const deleteTopicMutation = useDeleteCourseTopic();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<any>(null);
  const [newTopic, setNewTopic] = useState({
    title: '',
    description: '',
    is_manual: true,
    readme_content: ''
  });

  const handleCreateTopic = async () => {
    if (!newTopic.title.trim()) return;

    const topicData = {
      course_id: courseId,
      title: newTopic.title,
      description: newTopic.description || null,
      is_manual: newTopic.is_manual,
      readme_content: newTopic.is_manual ? null : newTopic.readme_content,
      order_index: topics.length
    };

    await createTopicMutation.mutateAsync(topicData);
    setNewTopic({ title: '', description: '', is_manual: true, readme_content: '' });
    setIsDialogOpen(false);
  };

  const handleUpdateTopic = async (topicId: string, updates: any) => {
    await updateTopicMutation.mutateAsync({ id: topicId, ...updates });
    setEditingTopic(null);
  };

  const handleDeleteTopic = async (topicId: string) => {
    if (confirm('Are you sure you want to delete this topic?')) {
      await deleteTopicMutation.mutateAsync(topicId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-semibold text-foreground">Course Structure</h3>
          <p className="text-muted-foreground">{courseName} - Manage topics and curriculum</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
              <Plus className="h-4 w-4 mr-2" />
              Add Topic
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Topic</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Topic Title *</Label>
                <Input
                  value={newTopic.title}
                  onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
                  placeholder="Enter topic title"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={newTopic.description}
                  onChange={(e) => setNewTopic({ ...newTopic, description: e.target.value })}
                  placeholder="Brief description of the topic"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={newTopic.is_manual}
                  onCheckedChange={(checked) => setNewTopic({ ...newTopic, is_manual: checked })}
                />
                <Label>Manual Topic (uncheck for README-based)</Label>
              </div>

              {!newTopic.is_manual && (
                <div className="space-y-2">
                  <Label>README Content</Label>
                  <Textarea
                    value={newTopic.readme_content}
                    onChange={(e) => setNewTopic({ ...newTopic, readme_content: e.target.value })}
                    placeholder="Markdown content for the topic"
                    rows={8}
                    className="font-mono text-sm"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTopic} disabled={createTopicMutation.isPending}>
                {createTopicMutation.isPending ? 'Creating...' : 'Create Topic'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Topics List */}
      <div className="space-y-4">
        {topics.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-8 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">No topics yet</h3>
              <p className="text-muted-foreground">Start building your course structure by adding topics</p>
            </CardContent>
          </Card>
        ) : (
          topics.map((topic, index) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              index={index}
              onUpdate={handleUpdateTopic}
              onDelete={handleDeleteTopic}
              isEditing={editingTopic === topic.id}
              setEditing={setEditingTopic}
            />
          ))
        )}
      </div>
    </div>
  );
};

interface TopicCardProps {
  topic: any;
  index: number;
  onUpdate: (id: string, updates: any) => void;
  onDelete: (id: string) => void;
  isEditing: boolean;
  setEditing: (id: string | null) => void;
}

const TopicCard = ({ topic, index, onUpdate, onDelete, isEditing, setEditing }: TopicCardProps) => {
  const [editData, setEditData] = useState({
    title: topic.title,
    description: topic.description || '',
    is_manual: topic.is_manual,
    readme_content: topic.readme_content || ''
  });

  const handleSave = () => {
    onUpdate(topic.id, editData);
  };

  const handleCancel = () => {
    setEditData({
      title: topic.title,
      description: topic.description || '',
      is_manual: topic.is_manual,
      readme_content: topic.readme_content || ''
    });
    setEditing(null);
  };

  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <GripVertical className="h-4 w-4" />
            <span className="text-sm font-mono">{String(index + 1).padStart(2, '0')}</span>
          </div>
          
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <Input
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  className="font-medium"
                />
                
                <Textarea
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  placeholder="Topic description"
                  rows={2}
                />

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={editData.is_manual}
                    onCheckedChange={(checked) => setEditData({ ...editData, is_manual: checked })}
                  />
                  <Label>Manual Topic</Label>
                </div>

                {!editData.is_manual && (
                  <Textarea
                    value={editData.readme_content}
                    onChange={(e) => setEditData({ ...editData, readme_content: e.target.value })}
                    placeholder="README content (Markdown)"
                    rows={6}
                    className="font-mono text-sm"
                  />
                )}

                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSave}>
                    <Save className="h-3 w-3 mr-1" />
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancel}>
                    <X className="h-3 w-3 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium text-foreground">{topic.title}</h4>
                  <Badge variant="outline" className="text-xs">
                    {topic.is_manual ? (
                      <>
                        <FileText className="h-3 w-3 mr-1" />
                        Manual
                      </>
                    ) : (
                      <>
                        <Code className="h-3 w-3 mr-1" />
                        README
                      </>
                    )}
                  </Badge>
                </div>
                
                {topic.description && (
                  <p className="text-sm text-muted-foreground mb-3">{topic.description}</p>
                )}

                {!topic.is_manual && topic.readme_content && (
                  <div className="bg-muted/50 rounded-md p-3 mt-3">
                    <p className="text-xs text-muted-foreground mb-2">README Preview:</p>
                    <pre className="text-xs text-foreground whitespace-pre-wrap">
                      {topic.readme_content.substring(0, 200)}
                      {topic.readme_content.length > 200 ? '...' : ''}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>

          {!isEditing && (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditing(topic.id)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => onDelete(topic.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
