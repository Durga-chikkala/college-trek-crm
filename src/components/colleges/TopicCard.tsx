
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Edit, 
  Trash2, 
  FileText, 
  Code, 
  GripVertical,
  Save,
  X,
  Eye,
  EyeOff
} from 'lucide-react';

interface TopicCardProps {
  topic: any;
  index: number;
  onUpdate: (id: string, updates: any) => void;
  onDelete: (id: string) => void;
  isEditing: boolean;
  setEditing: (id: string | null) => void;
}

export const TopicCard = ({ topic, index, onUpdate, onDelete, isEditing, setEditing }: TopicCardProps) => {
  const [editData, setEditData] = useState({
    title: topic.title,
    description: topic.description || '',
    is_manual: topic.is_manual,
    readme_content: topic.readme_content || ''
  });
  const [showPreview, setShowPreview] = useState(false);

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
    <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-200 group">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <GripVertical className="h-4 w-4 cursor-grab active:cursor-grabbing" />
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-semibold">
              {index + 1}
            </div>
          </div>
          
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Topic Title</Label>
                  <Input
                    value={editData.title}
                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                    className="font-medium"
                    placeholder="Enter topic title"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Description</Label>
                  <Textarea
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    placeholder="Brief description of the topic"
                    rows={2}
                  />
                </div>

                <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                  <Switch
                    checked={editData.is_manual}
                    onCheckedChange={(checked) => setEditData({ ...editData, is_manual: checked })}
                  />
                  <div className="flex-1">
                    <Label className="text-sm font-medium">Content Type</Label>
                    <p className="text-xs text-muted-foreground">
                      {editData.is_manual ? 'Manual topic (custom content)' : 'README-based (Markdown file)'}
                    </p>
                  </div>
                </div>

                {!editData.is_manual && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Markdown Content</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPreview(!showPreview)}
                        className="text-xs"
                      >
                        {showPreview ? (
                          <>
                            <EyeOff className="h-3 w-3 mr-1" />
                            Edit
                          </>
                        ) : (
                          <>
                            <Eye className="h-3 w-3 mr-1" />
                            Preview
                          </>
                        )}
                      </Button>
                    </div>
                    
                    {showPreview ? (
                      <div className="bg-muted/50 rounded-md p-4 border">
                        <pre className="text-sm text-foreground whitespace-pre-wrap font-mono">
                          {editData.readme_content || 'No content yet...'}
                        </pre>
                      </div>
                    ) : (
                      <Textarea
                        value={editData.readme_content}
                        onChange={(e) => setEditData({ ...editData, readme_content: e.target.value })}
                        placeholder="# Topic Title&#10;&#10;## Overview&#10;Brief overview of the topic...&#10;&#10;## Learning Objectives&#10;- Objective 1&#10;- Objective 2&#10;&#10;## Content&#10;Detailed content here..."
                        rows={8}
                        className="font-mono text-sm"
                      />
                    )}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button size="sm" onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                    <Save className="h-3 w-3 mr-1" />
                    Save Changes
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancel}>
                    <X className="h-3 w-3 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-foreground text-lg">{topic.title}</h4>
                      <Badge variant={topic.is_manual ? "secondary" : "outline"} className="text-xs">
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
                      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                        {topic.description}
                      </p>
                    )}
                  </div>
                </div>

                {!topic.is_manual && topic.readme_content && (
                  <div className="bg-gradient-to-r from-muted/30 to-muted/50 rounded-lg p-4 border-l-4 border-primary/30">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Content Preview
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {topic.readme_content.length} chars
                      </Badge>
                    </div>
                    <div className="max-h-32 overflow-hidden">
                      <pre className="text-xs text-foreground whitespace-pre-wrap font-mono leading-relaxed">
                        {topic.readme_content.substring(0, 300)}
                        {topic.readme_content.length > 300 && (
                          <span className="text-muted-foreground">...</span>
                        )}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {!isEditing && (
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditing(topic.id)}
                className="hover:bg-blue-50 hover:text-blue-600"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive hover:bg-red-50"
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
