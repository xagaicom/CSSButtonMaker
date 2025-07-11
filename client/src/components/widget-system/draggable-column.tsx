import React, { useState } from 'react';
import { Widget } from './widget-types';
import { useWidgets } from './widget-context';
import { WidgetWrapper } from './widget-wrapper';

interface DraggableColumnProps {
  column: 'left' | 'center' | 'right';
  widgets: Widget[];
  width: number;
  children?: React.ReactNode;
  renderWidget: (widget: Widget) => React.ReactNode;
}

export function DraggableColumn({ column, widgets, width, children, renderWidget }: DraggableColumnProps) {
  const { isAdminMode, moveWidget, draggedWidget, setDraggedWidget } = useWidgets();
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragStart = (widget: Widget) => {
    setDraggedWidget(widget);
  };

  const handleDragEnd = () => {
    setDraggedWidget(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedWidget && draggedWidget.column !== column) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (draggedWidget && draggedWidget.column !== column) {
      // Move widget to the end of the target column
      const targetOrder = widgets.length;
      moveWidget(draggedWidget.id, column, targetOrder);
    }
  };

  const sortedWidgets = [...widgets].sort((a, b) => a.order - b.order);

  return (
    <div
      className={`
        space-y-6 transition-all duration-200 
        ${isAdminMode ? 'min-h-screen' : ''}
        ${isDragOver && isAdminMode ? 'bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg p-4' : ''}
      `}
      style={{ width: `${width}%` }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Admin Mode Column Header */}
      {isAdminMode && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900 capitalize">{column} Column</h3>
            <div className="text-sm text-gray-500">
              {sortedWidgets.filter(w => w.enabled).length} / {sortedWidgets.length} widgets
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Width: {width}% | Drop widgets here
          </div>
        </div>
      )}

      {/* Drop Zone Indicator */}
      {isAdminMode && isDragOver && (
        <div className="bg-blue-100 border-2 border-dashed border-blue-300 rounded-lg p-8 text-center">
          <div className="text-blue-600 font-medium">Drop widget here</div>
          <div className="text-blue-500 text-sm mt-1">
            Widget will be added to the {column} column
          </div>
        </div>
      )}

      {/* Widgets */}
      {sortedWidgets.map((widget) => (
        <WidgetWrapper
          key={widget.id}
          widget={widget}
          isDragging={draggedWidget?.id === widget.id}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {renderWidget(widget)}
        </WidgetWrapper>
      ))}

      {/* Custom children (for non-widget content) */}
      {children}

      {/* Empty state for admin mode */}
      {isAdminMode && sortedWidgets.length === 0 && !isDragOver && (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <div className="text-gray-500 font-medium">No widgets in this column</div>
          <div className="text-gray-400 text-sm mt-1">
            Drag widgets here to add them
          </div>
        </div>
      )}
    </div>
  );
}