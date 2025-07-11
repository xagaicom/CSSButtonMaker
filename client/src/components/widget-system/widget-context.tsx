import React, { createContext, useContext, useState, useCallback } from 'react';
import { Widget, ColumnLayout, LayoutConfiguration, DEFAULT_LAYOUT } from './widget-types';

interface WidgetContextType {
  currentLayout: LayoutConfiguration;
  widgets: {
    left: Widget[];
    center: Widget[];
    right: Widget[];
  };
  isAdminMode: boolean;
  draggedWidget: Widget | null;
  
  // Layout management
  setCurrentLayout: (layout: LayoutConfiguration) => void;
  saveLayout: (name: string, description: string) => void;
  loadLayout: (layoutId: string) => void;
  resetToDefault: () => void;
  
  // Widget management
  updateWidget: (widgetId: string, updates: Partial<Widget>) => void;
  moveWidget: (sourceColumn: 'left' | 'center' | 'right', sourceIndex: number, destColumn: 'left' | 'center' | 'right', destIndex: number) => void;
  toggleWidget: (widgetId: string) => void;
  collapseWidget: (widgetId: string) => void;
  addWidgetToColumn: (widgetType: string, column: 'left' | 'center' | 'right', order: number) => void;
  
  // Column management
  updateColumnWidths: (leftWidth: number, centerWidth: number, rightWidth: number) => void;
  
  // Admin mode
  toggleAdminMode: () => void;
  setDraggedWidget: (widget: Widget | null) => void;
}

const WidgetContext = createContext<WidgetContextType | undefined>(undefined);

export function useWidgets() {
  const context = useContext(WidgetContext);
  if (!context) {
    throw new Error('useWidgets must be used within a WidgetProvider');
  }
  return context;
}

interface WidgetProviderProps {
  children: React.ReactNode;
}

export function WidgetProvider({ children }: WidgetProviderProps) {
  const [currentLayout, setCurrentLayoutState] = useState<LayoutConfiguration>(DEFAULT_LAYOUT);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [draggedWidget, setDraggedWidget] = useState<Widget | null>(null);
  const [savedLayouts, setSavedLayouts] = useState<LayoutConfiguration[]>([DEFAULT_LAYOUT]);

  // Get widgets organized by columns
  const widgets = {
    left: currentLayout.columns.left,
    center: currentLayout.columns.center,
    right: currentLayout.columns.right
  };

  const setCurrentLayout = useCallback((layout: LayoutConfiguration) => {
    setCurrentLayoutState(layout);
    // Save to localStorage
    localStorage.setItem('cssButtonMaker_currentLayout', JSON.stringify(layout));
  }, []);

  const saveLayout = useCallback((name: string, description: string) => {
    const newLayout: LayoutConfiguration = {
      ...currentLayout,
      id: `layout_${Date.now()}`,
      name,
      description,
      updatedAt: new Date()
    };
    
    const updatedLayouts = [...savedLayouts, newLayout];
    setSavedLayouts(updatedLayouts);
    localStorage.setItem('cssButtonMaker_savedLayouts', JSON.stringify(updatedLayouts));
  }, [currentLayout, savedLayouts]);

  const loadLayout = useCallback((layoutId: string) => {
    const layout = savedLayouts.find(l => l.id === layoutId);
    if (layout) {
      setCurrentLayout(layout);
    }
  }, [savedLayouts, setCurrentLayout]);

  const resetToDefault = useCallback(() => {
    setCurrentLayout(DEFAULT_LAYOUT);
  }, [setCurrentLayout]);

  const updateWidget = useCallback((widgetId: string, updates: Partial<Widget>) => {
    const updatedLayout = { ...currentLayout };
    
    // Find and update the widget in the appropriate column
    Object.keys(updatedLayout.columns).forEach(columnKey => {
      const column = columnKey as keyof ColumnLayout;
      const widgetIndex = updatedLayout.columns[column].findIndex(w => w.id === widgetId);
      if (widgetIndex !== -1) {
        updatedLayout.columns[column][widgetIndex] = {
          ...updatedLayout.columns[column][widgetIndex],
          ...updates
        };
      }
    });
    
    updatedLayout.updatedAt = new Date();
    setCurrentLayout(updatedLayout);
  }, [currentLayout, setCurrentLayout]);

  const moveWidget = useCallback((sourceColumn: 'left' | 'center' | 'right', sourceIndex: number, destColumn: 'left' | 'center' | 'right', destIndex: number) => {
    try {
      const updatedLayout = { ...currentLayout };
      
      // Ensure columns exist and have arrays
      if (!updatedLayout.columns[sourceColumn] || !Array.isArray(updatedLayout.columns[sourceColumn])) {
        console.error(`Source column ${sourceColumn} does not exist or is not an array`);
        return;
      }
      
      if (!updatedLayout.columns[destColumn] || !Array.isArray(updatedLayout.columns[destColumn])) {
        console.error(`Destination column ${destColumn} does not exist or is not an array`);
        return;
      }
      
      // Check if source index is valid
      if (sourceIndex < 0 || sourceIndex >= updatedLayout.columns[sourceColumn].length) {
        console.error(`Source index ${sourceIndex} is out of bounds for column ${sourceColumn}`);
        return;
      }
      
      // Remove widget from source column
      const [widgetToMove] = updatedLayout.columns[sourceColumn].splice(sourceIndex, 1);
      
      if (widgetToMove) {
        // Update widget's column and order
        widgetToMove.column = destColumn;
        widgetToMove.order = destIndex;
        
        // Ensure destination index is valid
        const adjustedDestIndex = Math.min(destIndex, updatedLayout.columns[destColumn].length);
        
        // Insert into destination column at the specified index
        updatedLayout.columns[destColumn].splice(adjustedDestIndex, 0, widgetToMove);
        
        // Reorder widgets in both columns
        updatedLayout.columns[sourceColumn].forEach((widget, index) => {
          widget.order = index;
        });
        updatedLayout.columns[destColumn].forEach((widget, index) => {
          widget.order = index;
        });
        
        updatedLayout.updatedAt = new Date();
        setCurrentLayout(updatedLayout);
      }
    } catch (error) {
      console.error('Error in moveWidget:', error);
    }
  }, [currentLayout, setCurrentLayout]);

  const toggleWidget = useCallback((widgetId: string) => {
    const allWidgets = [...widgets.left, ...widgets.center, ...widgets.right];
    const widget = allWidgets.find(w => w.id === widgetId);
    if (widget) {
      updateWidget(widgetId, { enabled: !widget.enabled });
    }
  }, [widgets, updateWidget]);

  const collapseWidget = useCallback((widgetId: string) => {
    const allWidgets = [...widgets.left, ...widgets.center, ...widgets.right];
    const widget = allWidgets.find(w => w.id === widgetId);
    if (widget) {
      updateWidget(widgetId, { collapsed: !widget.collapsed });
    }
  }, [widgets, updateWidget]);

  const updateColumnWidths = useCallback((leftWidth: number, centerWidth: number, rightWidth: number) => {
    const updatedLayout = {
      ...currentLayout,
      leftWidth,
      centerWidth,
      rightWidth,
      updatedAt: new Date()
    };
    setCurrentLayout(updatedLayout);
  }, [currentLayout, setCurrentLayout]);

  const toggleAdminMode = useCallback(() => {
    setIsAdminMode(prev => !prev);
    setDraggedWidget(null); // Clear any dragged widget when toggling
  }, []);

  const addWidgetToColumn = useCallback((widgetType: string, column: 'left' | 'center' | 'right', order: number) => {
    try {
      const allWidgets = [...widgets.left, ...widgets.center, ...widgets.right];
      const existingWidget = allWidgets.find(w => w.type === widgetType);
      
      if (existingWidget) {
        // Find the widget's current position
        let sourceColumn: 'left' | 'center' | 'right' = 'left';
        let sourceIndex = -1;
        
        if (widgets.left.includes(existingWidget)) {
          sourceColumn = 'left';
          sourceIndex = widgets.left.indexOf(existingWidget);
        } else if (widgets.center.includes(existingWidget)) {
          sourceColumn = 'center';
          sourceIndex = widgets.center.indexOf(existingWidget);
        } else if (widgets.right.includes(existingWidget)) {
          sourceColumn = 'right';
          sourceIndex = widgets.right.indexOf(existingWidget);
        }
        
        if (sourceIndex !== -1) {
          moveWidget(sourceColumn, sourceIndex, column, order);
        }
      } else {
        // Create new widget
        const newWidget: Widget = {
          id: `${widgetType}-${Date.now()}`,
          type: widgetType as any,
          title: widgetType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
          description: `${widgetType} widget`,
          column,
          order,
          enabled: true,
          collapsed: false,
          visible: true
        };
        
        const updatedLayout = { ...currentLayout };
        
        // Ensure column exists and is an array
        if (!updatedLayout.columns[column] || !Array.isArray(updatedLayout.columns[column])) {
          console.error(`Column ${column} does not exist or is not an array`);
          return;
        }
        
        // Ensure order is valid
        const adjustedOrder = Math.min(order, updatedLayout.columns[column].length);
        updatedLayout.columns[column].splice(adjustedOrder, 0, newWidget);
        
        // Reorder widgets in the target column
        updatedLayout.columns[column].forEach((widget, index) => {
          widget.order = index;
        });
        
        updatedLayout.updatedAt = new Date();
        setCurrentLayout(updatedLayout);
      }
    } catch (error) {
      console.error('Error in addWidgetToColumn:', error);
    }
  }, [widgets, currentLayout, setCurrentLayout, moveWidget]);

  // Load saved layouts on initialization
  React.useEffect(() => {
    const savedLayoutsData = localStorage.getItem('cssButtonMaker_savedLayouts');
    if (savedLayoutsData) {
      try {
        const layouts = JSON.parse(savedLayoutsData);
        setSavedLayouts(layouts);
      } catch (error) {
        console.error('Failed to load saved layouts:', error);
      }
    }

    const currentLayoutData = localStorage.getItem('cssButtonMaker_currentLayout');
    if (currentLayoutData) {
      try {
        const layout = JSON.parse(currentLayoutData);
        setCurrentLayoutState(layout);
      } catch (error) {
        console.error('Failed to load current layout:', error);
      }
    }
  }, []);

  const value: WidgetContextType = {
    currentLayout,
    widgets,
    isAdminMode,
    draggedWidget,
    
    setCurrentLayout,
    saveLayout,
    loadLayout,
    resetToDefault,
    
    updateWidget,
    moveWidget,
    toggleWidget,
    collapseWidget,
    addWidgetToColumn,
    
    updateColumnWidths,
    
    toggleAdminMode,
    setDraggedWidget
  };

  return (
    <WidgetContext.Provider value={value}>
      {children}
    </WidgetContext.Provider>
  );
}