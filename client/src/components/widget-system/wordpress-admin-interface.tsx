import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Settings, 
  Save, 
  RotateCcw, 
  Download, 
  Upload,
  Eye,
  EyeOff,
  GripVertical,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  LogOut,
  ExternalLink,
  Layout,
  Palette,
  Type,
  Square,
  Mouse,
  Sparkles,
  Sliders,
  Zap,
  Circle
} from 'lucide-react';
import { useWidgets } from './widget-context';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const AVAILABLE_WIDGETS = [
  { 
    id: 'quick-presets', 
    title: 'Quick Presets', 
    description: 'Pre-designed button styles for instant use',
    icon: Sparkles,
    category: 'Design'
  },
  { 
    id: 'button-text', 
    title: 'Button Text', 
    description: 'Edit button text and content',
    icon: Type,
    category: 'Content'
  },
  { 
    id: 'typography', 
    title: 'Typography', 
    description: 'Font size, weight, and styling',
    icon: Type,
    category: 'Style'
  },
  { 
    id: 'border-gradient', 
    title: 'Border Gradient', 
    description: 'Border color gradients and effects',
    icon: Square,
    category: 'Style'
  },
  { 
    id: 'text-gradient', 
    title: 'Text Gradient', 
    description: 'Text color gradients and effects',
    icon: Palette,
    category: 'Style'
  },
  { 
    id: 'background-gradient', 
    title: 'Background Gradient', 
    description: 'Background color gradients',
    icon: Palette,
    category: 'Style'
  },
  { 
    id: 'dimensions', 
    title: 'Dimensions', 
    description: 'Size, padding, and spacing controls',
    icon: Square,
    category: 'Layout'
  },
  { 
    id: 'border-style', 
    title: 'Border Style', 
    description: 'Border radius, width, and style',
    icon: Square,
    category: 'Style'
  },
  { 
    id: '3d-effects', 
    title: '3D Effects', 
    description: '3D transformations and shadows',
    icon: Zap,
    category: 'Effects'
  },
  { 
    id: 'text-shadow', 
    title: 'Text Shadow', 
    description: 'Text shadow effects and positioning',
    icon: Type,
    category: 'Effects'
  },
  { 
    id: 'box-shadow', 
    title: 'Box Shadow', 
    description: 'Box shadow effects and positioning',
    icon: Circle,
    category: 'Effects'
  },
  { 
    id: 'live-preview', 
    title: 'Live Preview', 
    description: 'Interactive button preview',
    icon: Eye,
    category: 'Preview'
  },
  { 
    id: 'preview-background', 
    title: 'Preview Background', 
    description: 'Background options for preview',
    icon: Layout,
    category: 'Preview'
  },
  { 
    id: 'css-output', 
    title: 'Generated CSS Code', 
    description: 'Copy and download CSS',
    icon: Download,
    category: 'Export'
  },
  { 
    id: 'saved-designs', 
    title: 'Saved Designs', 
    description: 'Save and load button designs',
    icon: Save,
    category: 'Library'
  }
];

const WIDGET_CATEGORIES = ['Design', 'Content', 'Style', 'Layout', 'Effects', 'Preview', 'Export', 'Library'];

export function WordPressAdminInterface() {
  const { 
    currentLayout, 
    widgets, 
    updateColumnWidths,
    saveLayout,
    resetToDefault,
    updateWidget,
    toggleWidget,
    moveWidget,
    addWidgetToColumn
  } = useWidgets();
  
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [layoutName, setLayoutName] = useState('');
  const [layoutDescription, setLayoutDescription] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Logout failed');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
      setLocation('/admin-login');
    },
  });

  const handleDragEnd = (result: any) => {
    const { source, destination } = result;
    
    if (!destination) return;
    
    try {
      if (source.droppableId === 'sidebar' && destination.droppableId !== 'sidebar') {
        // Adding widget from sidebar to column
        const widgetId = AVAILABLE_WIDGETS[source.index].id;
        const columnId = destination.droppableId as 'left' | 'center' | 'right';
        addWidgetToColumn(widgetId, columnId, destination.index);
      } else if (source.droppableId !== 'sidebar' && destination.droppableId !== 'sidebar') {
        // Moving widget between columns or within column
        const sourceColumn = source.droppableId as 'left' | 'center' | 'right';
        const destColumn = destination.droppableId as 'left' | 'center' | 'right';
        moveWidget(sourceColumn, source.index, destColumn, destination.index);
      }
    } catch (error) {
      console.error('Error during drag and drop:', error);
      toast({
        title: "Error",
        description: "Failed to move widget. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSaveLayout = () => {
    if (!layoutName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a layout name",
        variant: "destructive",
      });
      return;
    }
    
    saveLayout(layoutName, layoutDescription);
    setShowSaveDialog(false);
    setLayoutName('');
    setLayoutDescription('');
    toast({
      title: "Layout saved",
      description: `Layout "${layoutName}" has been saved successfully`,
    });
  };

  const filteredWidgets = activeCategory === 'All' 
    ? AVAILABLE_WIDGETS 
    : AVAILABLE_WIDGETS.filter(widget => widget.category === activeCategory);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-gray-50">
        {/* WordPress-style Admin Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Layout className="h-8 w-8 text-blue-600" />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Widget Layout Manager</h1>
                    <p className="text-sm text-gray-500">Customize your button designer layout</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setLocation('/')}
                  className="flex items-center space-x-2 border-gray-300 hover:border-gray-400"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>View Site</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                  className="flex items-center space-x-2 border-gray-300 hover:border-gray-400"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{logoutMutation.isPending ? 'Logging out...' : 'Logout'}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Modern Sidebar */}
          <div className={`${sidebarCollapsed ? 'w-16' : 'w-80'} bg-white shadow-sm border-r border-gray-200 transition-all duration-300 flex flex-col`}>
            {!sidebarCollapsed && (
              <>
                {/* Sidebar Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Widgets</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSidebarCollapsed(true)}
                      className="p-2 hover:bg-gray-100"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Drag widgets to arrange your layout</p>
                </div>

                {/* Category Tabs */}
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                  <div className="flex flex-wrap gap-1">
                    {['All', ...WIDGET_CATEGORIES].map((category) => (
                      <Button
                        key={category}
                        variant={activeCategory === category ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setActiveCategory(category)}
                        className={`text-xs px-3 py-1 h-auto ${
                          activeCategory === category 
                            ? 'bg-blue-600 text-white hover:bg-blue-700' 
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Widget List */}
                <div className="flex-1 overflow-y-auto">
                  <Droppable droppableId="sidebar">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="p-4 space-y-3"
                      >
                        {filteredWidgets.map((widget, index) => (
                          <Draggable key={widget.id} draggableId={widget.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`group p-4 bg-white rounded-lg border transition-all duration-200 cursor-move ${
                                  snapshot.isDragging
                                    ? 'border-blue-400 shadow-lg scale-105'
                                    : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                                }`}
                              >
                                <div className="flex items-start space-x-3">
                                  <div className="flex-shrink-0 p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                                    <widget.icon className="h-5 w-5 text-blue-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                      {widget.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                      {widget.description}
                                    </p>
                                    <div className="flex items-center mt-2">
                                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                        {widget.category}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex-shrink-0">
                                    <GripVertical className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>

                {/* Layout Controls */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                  <h3 className="text-base font-medium text-gray-900 mb-4">Layout Settings</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-3 block">Column Widths</Label>
                      <div className="space-y-4">
                        {[
                          { key: 'leftWidth', label: 'Left Column', value: currentLayout.leftWidth },
                          { key: 'centerWidth', label: 'Center Column', value: currentLayout.centerWidth },
                          { key: 'rightWidth', label: 'Right Column', value: currentLayout.rightWidth }
                        ].map(({ key, label, value }) => (
                          <div key={key} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">{label}</span>
                              <span className="text-sm font-medium text-gray-900 bg-white px-2 py-1 rounded border">
                                {value}%
                              </span>
                            </div>
                            <Slider
                              value={[value]}
                              onValueChange={(newValue) => {
                                const updates = {
                                  leftWidth: currentLayout.leftWidth,
                                  centerWidth: currentLayout.centerWidth,
                                  rightWidth: currentLayout.rightWidth,
                                  [key]: newValue[0]
                                };
                                updateColumnWidths(updates.leftWidth, updates.centerWidth, updates.rightWidth);
                              }}
                              max={key === 'centerWidth' ? 60 : 50}
                              min={key === 'centerWidth' ? 20 : 10}
                              step={5}
                              className="w-full"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <Button
                        onClick={() => setShowSaveDialog(true)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Layout
                      </Button>
                      <Button
                        variant="outline"
                        onClick={resetToDefault}
                        className="flex-1 border-gray-300 hover:bg-gray-50"
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {sidebarCollapsed && (
              <div className="p-4 border-b border-gray-200">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarCollapsed(false)}
                  className="p-2 hover:bg-gray-100 w-full"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-6 bg-gray-50">
            <div className="max-w-7xl mx-auto">
              {/* Layout Preview Header */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Layout Preview</h2>
                    <p className="text-sm text-gray-500">This represents your public site layout</p>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>Total: {currentLayout.leftWidth + currentLayout.centerWidth + currentLayout.rightWidth}%</span>
                  </div>
                </div>
                
                {/* Three Column Layout */}
                <div className="flex gap-4 min-h-[500px]">
                  {['left', 'center', 'right'].map((column) => (
                    <div
                      key={column}
                      style={{
                        width: `${currentLayout[`${column}Width` as keyof typeof currentLayout]}%`
                      }}
                    >
                      <Droppable droppableId={column}>
                        {(provided, snapshot) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={`h-full min-h-[500px] p-4 rounded-lg border-2 border-dashed transition-all duration-200 ${
                              snapshot.isDraggingOver
                                ? 'border-blue-400 bg-blue-50'
                                : 'border-gray-300 bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="font-medium text-gray-900 capitalize">
                                {column} Column ({currentLayout[`${column}Width` as keyof typeof currentLayout]}%)
                              </h3>
                              <div className="text-sm text-gray-500">
                                {widgets?.[column as keyof typeof widgets]?.length || 0} widgets
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              {(widgets?.[column as keyof typeof widgets] || []).map((widget, index) => (
                                <Draggable key={widget.id} draggableId={widget.id} index={index}>
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={`p-4 bg-white rounded-lg border transition-all duration-200 ${
                                        snapshot.isDragging
                                          ? 'border-blue-400 shadow-lg'
                                          : 'border-gray-200 hover:border-gray-300'
                                      }`}
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                          <span className="font-medium text-gray-900">{widget.title}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => toggleWidget(widget.id)}
                                            className="p-1 hover:bg-gray-100"
                                          >
                                            {widget.visible ? (
                                              <Eye className="h-4 w-4 text-gray-500" />
                                            ) : (
                                              <EyeOff className="h-4 w-4 text-gray-400" />
                                            )}
                                          </Button>
                                          <GripVertical className="h-4 w-4 text-gray-400" />
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                              
                              {(widgets?.[column as keyof typeof widgets]?.length || 0) === 0 && (
                                <div className="text-center py-8">
                                  <div className="text-gray-400 mb-2">
                                    <Plus className="h-8 w-8 mx-auto" />
                                  </div>
                                  <p className="text-sm text-gray-500">
                                    Drag widgets here
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </Droppable>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Layout Dialog */}
        {showSaveDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-96 max-w-full mx-4">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Save Layout</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="layout-name" className="text-sm font-medium text-gray-700">
                      Layout Name
                    </Label>
                    <Input
                      id="layout-name"
                      value={layoutName}
                      onChange={(e) => setLayoutName(e.target.value)}
                      placeholder="Enter layout name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="layout-description" className="text-sm font-medium text-gray-700">
                      Description (Optional)
                    </Label>
                    <Input
                      id="layout-description"
                      value={layoutDescription}
                      onChange={(e) => setLayoutDescription(e.target.value)}
                      placeholder="Enter layout description"
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowSaveDialog(false)}
                    className="border-gray-300 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSaveLayout}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Save Layout
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DragDropContext>
  );
}