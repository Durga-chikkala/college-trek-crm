
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuditLogs } from '@/hooks/useAuditLogs';
import { format } from 'date-fns';
import { 
  History, 
  User, 
  Calendar,
  Filter,
  Search
} from 'lucide-react';

interface AuditLogViewerProps {
  tableFilter?: string;
  recordId?: string;
}

export const AuditLogViewer = ({ tableFilter, recordId }: AuditLogViewerProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const { data: auditLogs = [], isLoading } = useAuditLogs(tableFilter, recordId);

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = searchTerm === '' || 
      log.table_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.profiles?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (log.profiles?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    
    return matchesSearch && matchesAction;
  });

  const getActionColor = (action: string) => {
    switch (action) {
      case 'INSERT': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'UPDATE': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'DELETE': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
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
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            <CardTitle>Audit Log</CardTitle>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="INSERT">Create</SelectItem>
                <SelectItem value="UPDATE">Update</SelectItem>
                <SelectItem value="DELETE">Delete</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredLogs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No audit logs found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getActionColor(log.action)}>
                      {log.action}
                    </Badge>
                    <span className="font-medium text-sm">{log.table_name}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      {log.profiles ? `${log.profiles.first_name} ${log.profiles.last_name}` : 'Unknown User'}
                    </div>
                    <span className="text-xs text-muted-foreground">•</span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(log.changed_at), 'MMM dd, yyyy HH:mm')}
                    </div>
                  </div>
                  
                  {log.action === 'UPDATE' && log.old_values && log.new_values && (
                    <div className="text-xs space-y-1">
                      <p className="font-medium text-muted-foreground">Changes:</p>
                      {Object.keys(log.new_values).map((key) => {
                        const oldValue = (log.old_values as any)?.[key];
                        const newValue = (log.new_values as any)?.[key];
                        
                        if (oldValue !== newValue && key !== 'updated_at') {
                          return (
                            <div key={key} className="flex items-center gap-2 text-xs">
                              <span className="font-medium">{key}:</span>
                              <span className="px-1 bg-red-100 text-red-800 rounded dark:bg-red-900 dark:text-red-200">
                                {oldValue?.toString() || 'null'}
                              </span>
                              <span>→</span>
                              <span className="px-1 bg-green-100 text-green-800 rounded dark:bg-green-900 dark:text-green-200">
                                {newValue?.toString() || 'null'}
                              </span>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  )}
                  
                  {log.action === 'INSERT' && log.new_values && (
                    <div className="text-xs">
                      <p className="font-medium text-muted-foreground mb-1">Created record:</p>
                      <div className="text-muted-foreground">
                        Record ID: {log.record_id}
                      </div>
                    </div>
                  )}
                  
                  {log.action === 'DELETE' && log.old_values && (
                    <div className="text-xs">
                      <p className="font-medium text-muted-foreground mb-1">Deleted record:</p>
                      <div className="text-muted-foreground">
                        Record ID: {log.record_id}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
