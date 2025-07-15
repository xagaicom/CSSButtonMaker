import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Settings, 
  Save, 
  RefreshCw, 
  Download, 
  Upload, 
  Layout,
  Grid,
  Columns,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Trash2
} from 'lucide-react';
import { useWidgets } from './widget-context';
import { useToast } from '@/hooks/use-toast';
import { useAdmin } from '@/hooks/useAdmin';
import { useAuth } from '@/hooks/useAuth';

export function AdminInterface() {
  const { 
    currentLayout, 
    widgets, 
    isAdminMode, 
    toggleAdminMode,
    updateColumnWidths,
    saveLayout,
    resetToDefault,
    updateWidget,
    toggleWidget,
    collapseWidget
  } = useWidgets();
  
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const { isAdmin, canAccessAdmin, isLoading } = useAdmin();
  const [layoutName, setLayoutName] = useState('');
  const [layoutDescription, setLayoutDescription] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const handleSaveLayout = () => {
    if (!layoutName.trim()) {
      toast({
        title: "Layout name required",
        description: "Please enter a name for your layout",
        variant: "destructive",
      });
      return;
    }

    saveLayout(layoutName, layoutDescription);
    setLayoutName('');
    setLayoutDescription('');
    setShowSaveDialog(false);
    
    toast({
      title: "Layout saved",
      description: `Layout "${layoutName}" has been saved successfully`,
    });
  };

  const handleColumnWidthChange = (column: 'left' | 'center' | 'right', value: number) => {
    const newWidths = { ...currentLayout.columnWidths };
    newWidths[column] = value;
    
    // Ensure total doesn't exceed 100%
    const total = Object.values(newWidths).reduce((sum, width) => sum + width, 0);
    if (total <= 100) {
      updateColumnWidths(newWidths);
    }
  };

  const getWidgetsByColumn = (column: 'left' | 'center' | 'right') => {
    return widgets.filter(w => w.column === column).sort((a, b) => a.order - b.order);
  };

  const exportLayout = () => {
    const dataStr = JSON.stringify(currentLayout, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `${currentLayout.name.replace(/\s+/g, '_')}_layout.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Show admin button only for authenticated admin users
  if (!isAdminMode) {
    if (!isAuthenticated) {
      return null; // Hide admin button for non-authenticated users
    }

    if (isLoading) {
      return (
        <div className="fixed top-4 right-4 z-50">
          <Button
            variant="outline"
            size="sm"
            disabled
            className="shadow-lg backdrop-blur-sm bg-white/90"
          >
            <Settings className="h-4 w-4 mr-2" />
            Loading...
          </Button>
        </div>
      );
    }

    if (!canAccessAdmin) {
      return null; // Hide admin button for non-admin users
    }

    return (
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={toggleAdminMode}
          variant="outline"
          size="sm"
          className="shadow-lg backdrop-blur-sm bg-white/90"
        >
          <Settings className="h-4 w-4 mr-2" />
          Admin Mode
        </Button>
      </div>
    );
  }

  // Admin panel is open - show only if user is admin
  if (!canAccessAdmin) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-2 rounded-lg text-sm">
          Admin access required
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50 w-80">
      <Card className="shadow-lg backdrop-blur-sm bg-white/95">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Admin Panel</CardTitle>
            <Button
              onClick={toggleAdminMode}
              variant="ghost"
              size="sm"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="layout" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="layout">Layout</TabsTrigger>
              <TabsTrigger value="widgets">Widgets</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Layout Tab */}
            <TabsContent value="layout" className="space-y-4">
              <div className="space-y-3">
                <Label className="text-sm font-medium">Column Widths (%)</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Left</span>
                    <span className="text-sm font-mono">{currentLayout.columnWidths.left}%</span>
                  </div>
                  <Slider
                    value={[currentLayout.columnWidths.left]}
                    onValueChange={(value) => handleColumnWidthChange('left', value[0])}
                    max={60}
                    min={20}
                    step={5}
                    className="w-full"
                  />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Center</span>
                    <span className="text-sm font-mono">{currentLayout.columnWidths.center}%</span>
                  </div>
                  <Slider
                    value={[currentLayout.columnWidths.center]}
                    onValueChange={(value) => handleColumnWidthChange('center', value[0])}
                    max={60}
                    min={20}
                    step={5}
                    className="w-full"
                  />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Right</span>
                    <span className="text-sm font-mono">{currentLayout.columnWidths.right}%</span>
                  </div>
                  <Slider
                    value={[currentLayout.columnWidths.right]}
                    onValueChange={(value) => handleColumnWidthChange('right', value[0])}
                    max={60}
                    min={20}
                    step={5}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="flex-1">
                      <Save className="h-4 w-4 mr-2" />
                      Save Layout
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Save Current Layout</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="layout-name">Layout Name</Label>
                        <Input
                          id="layout-name"
                          value={layoutName}
                          onChange={(e) => setLayoutName(e.target.value)}
                          placeholder="Enter layout name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="layout-description">Description</Label>
                        <Textarea
                          id="layout-description"
                          value={layoutDescription}
                          onChange={(e) => setLayoutDescription(e.target.value)}
                          placeholder="Optional description"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button onClick={handleSaveLayout} className="flex-1">
                          Save
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setShowSaveDialog(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  onClick={resetToDefault}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={exportLayout}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  disabled
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
              </div>
            </TabsContent>

            {/* Widgets Tab */}
            <TabsContent value="widgets" className="space-y-4">
              <div className="space-y-3">
                {['left', 'center', 'right'].map(column => (
                  <div key={column} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium capitalize">{column} Column</h4>
                      <Badge variant="outline" className="text-xs">
                        {getWidgetsByColumn(column as any).length} widgets
                      </Badge>
                    </div>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {getWidgetsByColumn(column as any).map(widget => (
                        <div 
                          key={widget.id}
                          className="flex items-center justify-between p-2 rounded border text-sm"
                        >
                          <span className={`flex-1 ${!widget.enabled ? 'text-gray-400' : ''}`}>
                            {widget.title}
                          </span>
                          <div className="flex items-center space-x-1">
                            <Button
                              onClick={() => toggleWidget(widget.id)}
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                            >
                              {widget.enabled ? 
                                <Eye className="h-3 w-3" /> : 
                                <EyeOff className="h-3 w-3" />
                              }
                            </Button>
                            <Button
                              onClick={() => collapseWidget(widget.id)}
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                            >
                              {widget.collapsed ? 
                                <ChevronDown className="h-3 w-3" /> : 
                                <ChevronUp className="h-3 w-3" />
                              }
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Layout Name</Label>
                  <span className="text-sm font-medium">{currentLayout.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Total Widgets</Label>
                  <span className="text-sm font-medium">{widgets.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Active Widgets</Label>
                  <span className="text-sm font-medium">{widgets.filter(w => w.enabled).length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Last Updated</Label>
                  <span className="text-sm font-medium">
                    {new Date(currentLayout.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}