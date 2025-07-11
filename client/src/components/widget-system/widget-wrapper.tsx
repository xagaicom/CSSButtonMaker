import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  GripVertical, 
  ChevronDown, 
  ChevronUp, 
  Eye, 
  EyeOff, 
  Settings,
  X
} from 'lucide-react';
import { Widget } from './widget-types';
import { useWidgets } from './widget-context';

interface WidgetWrapperProps {
  widget: Widget;
  children: React.ReactNode;
  isDragging?: boolean;
  onDragStart?: (widget: Widget) => void;
  onDragEnd?: () => void;
}

export function WidgetWrapper({ 
  widget, 
  children, 
  isDragging = false,
  onDragStart,
  onDragEnd
}: WidgetWrapperProps) {
  const { isAdminMode, updateWidget, toggleWidget, collapseWidget } = useWidgets();

  const handleDragStart = (e: React.DragEvent) => {
    if (onDragStart) {
      onDragStart(widget);
    }
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', widget.id);
  };

  const handleDragEnd = () => {
    if (onDragEnd) {
      onDragEnd();
    }
  };

  if (!widget.enabled && !isAdminMode) {
    return null;
  }

  return (
    <Card 
      className={`
        relative transition-all duration-200 
        ${isDragging ? 'opacity-50 rotate-2 scale-95' : ''}
        ${isAdminMode ? 'ring-2 ring-blue-200 hover:ring-blue-300' : ''}
        ${!widget.enabled ? 'opacity-50' : ''}
      `}
      draggable={isAdminMode}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {/* Admin Mode Header */}
      {isAdminMode && (
        <div className="absolute -top-2 -right-2 z-10 flex items-center space-x-1">
          <Badge variant="secondary" className="text-xs">
            {widget.column}
          </Badge>
          <Button
            size="sm"
            variant="outline"
            onClick={() => toggleWidget(widget.id)}
            className="h-6 w-6 p-0"
          >
            {widget.enabled ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
          </Button>
        </div>
      )}

      {/* Widget Header */}
      <CardHeader className={`pb-3 ${widget.collapsed ? 'pb-2' : ''}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isAdminMode && (
              <GripVertical className="h-4 w-4 text-gray-400 cursor-grab" />
            )}
            <CardTitle className="text-sm font-medium">
              {widget.title}
            </CardTitle>
          </div>
          <div className="flex items-center space-x-1">
            {isAdminMode && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => collapseWidget(widget.id)}
                className="h-6 w-6 p-0"
              >
                {widget.collapsed ? 
                  <ChevronDown className="h-3 w-3" /> : 
                  <ChevronUp className="h-3 w-3" />
                }
              </Button>
            )}
            {!isAdminMode && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => collapseWidget(widget.id)}
                className="h-6 w-6 p-0"
              >
                {widget.collapsed ? 
                  <ChevronDown className="h-3 w-3" /> : 
                  <ChevronUp className="h-3 w-3" />
                }
              </Button>
            )}
          </div>
        </div>
        {isAdminMode && widget.description && (
          <p className="text-xs text-gray-500 mt-1">{widget.description}</p>
        )}
      </CardHeader>

      {/* Widget Content */}
      {!widget.collapsed && (
        <CardContent className="pt-0">
          {children}
        </CardContent>
      )}

      {/* Drag Overlay */}
      {isAdminMode && (
        <div className="absolute inset-0 bg-blue-50 bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 pointer-events-none rounded-lg" />
      )}
    </Card>
  );
}