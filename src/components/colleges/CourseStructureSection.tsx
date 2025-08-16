
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCourseTopics, useCreateCourseTopic, useUpdateCourseTopic, useDeleteCourseTopic } from '@/hooks/useCourseTopics';
import { TopicCard } from './TopicCard';
import { useToast } from '@/hooks/use-toast';
import { 
  BookOpen, 
  Plus, 
  Upload,
  FileText,
  Sparkles,
  Zap,
  Target,
  TrendingUp
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
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('manual');
  const [newTopic, setNewTopic] = useState({
    title: '',
    description: '',
    is_manual: true,
    readme_content: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreateTopic = async () => {
    if (!newTopic.title.trim()) {
      toast({
        title: "Error",
        description: "Topic title is required",
        variant: "destructive"
      });
      return;
    }

    const topicData = {
      course_id: courseId,
      title: newTopic.title,
      description: newTopic.description || null,
      is_manual: activeTab === 'manual',
      readme_content: activeTab === 'manual' ? null : newTopic.readme_content,
      order_index: topics.length
    };

    await createTopicMutation.mutateAsync(topicData);
    setNewTopic({ title: '', description: '', is_manual: true, readme_content: '' });
    setIsDialogOpen(false);
    setActiveTab('manual');
  };

  const handleUpdateTopic = async (topicId: string, updates: any) => {
    await updateTopicMutation.mutateAsync({ id: topicId, ...updates });
    setEditingTopic(null);
  };

  const handleDeleteTopic = async (topicId: string) => {
    if (confirm('Are you sure you want to delete this topic? This action cannot be undone.')) {
      await deleteTopicMutation.mutateAsync(topicId);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith('.md')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const lines = content.split('\n');
        const title = lines[0]?.replace(/^#\s*/, '') || file.name.replace('.md', '');
        
        setNewTopic({
          title,
          description: `Imported from ${file.name}`,
          is_manual: false,
          readme_content: content
        });
        setActiveTab('readme');
      };
      reader.readAsText(file);
    } else {
      toast({
        title: "Error",
        description: "Please upload a valid .md file",
        variant: "destructive"
      });
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
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            Course Structure
          </h3>
          <p className="text-muted-foreground">
            <span className="font-medium text-primary">{courseName}</span> - Build your curriculum with topics and content
          </p>
        </div>
        
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".md"
            onChange={handleFileUpload}
            className="hidden"
          />
          
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="border-primary/20 hover:bg-primary/5"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import .md File
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                <Plus className="h-4 w-4 mr-2" />
                Add Topic
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Create New Topic
                </DialogTitle>
              </DialogHeader>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="manual" className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Quick Manual
                  </TabsTrigger>
                  <TabsTrigger value="readme" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Markdown Content
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="manual" className="space-y-4 mt-6">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Topic Title *
                      </Label>
                      <Input
                        value={newTopic.title}
                        onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
                        placeholder="e.g., Introduction to React Hooks"
                        className="text-base"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={newTopic.description}
                        onChange={(e) => setNewTopic({ ...newTopic, description: e.target.value })}
                        placeholder="Brief overview of what this topic covers..."
                        rows={3}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="readme" className="space-y-4 mt-6">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Topic Title *
                      </Label>
                      <Input
                        value={newTopic.title}
                        onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
                        placeholder="e.g., Advanced React Patterns"
                        className="text-base"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={newTopic.description}
                        onChange={(e) => setNewTopic({ ...newTopic, description: e.target.value })}
                        placeholder="Brief overview of this markdown-based topic..."
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Markdown Content
                      </Label>
                      <Textarea
                        value={newTopic.readme_content}
                        onChange={(e) => setNewTopic({ ...newTopic, readme_content: e.target.value })}
                        placeholder="# Topic Title&#10;&#10;## Learning Objectives&#10;- Master advanced React patterns&#10;- Understand compound components&#10;- Implement render props&#10;&#10;## Overview&#10;In this topic, we'll explore advanced React patterns that will help you build more flexible and reusable components.&#10;&#10;## Content&#10;### 1. Compound Components&#10;Compound components are..."
                        rows={12}
                        className="font-mono text-sm"
                      />
                      <p className="text-xs text-muted-foreground">
                        Tip: Use markdown syntax for formatting. You can upload .md files using the import button above.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateTopic} 
                  disabled={createTopicMutation.isPending}
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                >
                  {createTopicMutation.isPending ? (
                    <>Creating...</>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-1" />
                      Create Topic
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      {topics.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Topics</p>
                  <p className="text-2xl font-bold text-foreground">{topics.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Manual Topics</p>
                  <p className="text-2xl font-bold text-foreground">
                    {topics.filter(t => t.is_manual).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">README Topics</p>
                  <p className="text-2xl font-bold text-foreground">
                    {topics.filter(t => !t.is_manual).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Topics List */}
      <div className="space-y-4">
        {topics.length === 0 ? (
          <Card className="border-dashed border-2 border-muted-foreground/20">
            <CardContent className="p-12 text-center">
              <div className="mx-auto w-24 h-24 bg-muted/30 rounded-full flex items-center justify-center mb-6">
                <BookOpen className="h-12 w-12 text-muted-foreground/50" />
              </div>
              <h3 className="text-xl font-semibold text-muted-foreground mb-3">No topics yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Start building your course structure by adding topics. You can create manual topics or import markdown files.
              </p>
              <div className="flex justify-center gap-3">
                <Button 
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Topic
                </Button>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-primary/20 hover:bg-primary/5"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import .md File
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {topics.map((topic, index) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                index={index}
                onUpdate={handleUpdateTopic}
                onDelete={handleDeleteTopic}
                isEditing={editingTopic === topic.id}
                setEditing={setEditingTopic}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
