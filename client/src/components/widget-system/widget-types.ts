export type WidgetType = 
  | 'button-styles'
  | 'live-preview' 
  | 'css-output'
  | 'text-controls'
  | 'typography-controls'
  | 'border-gradient'
  | 'text-gradient'
  | 'background-gradient'
  | 'sizing-controls'
  | 'border-style'
  | 'text-shadow'
  | 'box-shadow'
  | 'effects-3d'
  | 'preview-background'
  | 'saved-designs'
  | 'quick-presets'
  | 'modern-styles'
  | 'brick-styles';

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  description: string;
  column: 'left' | 'center' | 'right';
  order: number;
  enabled: boolean;
  collapsed: boolean;
  visible?: boolean;
  width?: string;
  height?: string;
  customProps?: Record<string, any>;
}

export interface ColumnLayout {
  left: Widget[];
  center: Widget[];
  right: Widget[];
}

export interface LayoutConfiguration {
  id: string;
  name: string;
  description: string;
  columns: ColumnLayout;
  columnWidths: {
    left: number;
    center: number;
    right: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export const DEFAULT_WIDGETS: Widget[] = [
  // Left Column - Button Styles
  {
    id: 'quick-presets',
    type: 'quick-presets',
    title: 'Quick Presets',
    description: 'Pre-designed button styles for quick selection',
    column: 'left',
    order: 1,
    enabled: true,
    collapsed: false
  },
  {
    id: 'brick-styles',
    type: 'brick-styles', 
    title: '3D Brick Styles',
    description: 'Realistic 3D brick button effects',
    column: 'left',
    order: 2,
    enabled: true,
    collapsed: false
  },
  {
    id: 'modern-styles',
    type: 'modern-styles',
    title: 'Modern Styles',
    description: 'Contemporary button designs',
    column: 'left',
    order: 3,
    enabled: true,
    collapsed: false
  },
  {
    id: 'button-styles',
    type: 'button-styles',
    title: 'Button Style Library', 
    description: 'Comprehensive collection of button styles from markodenic.com',
    column: 'left',
    order: 4,
    enabled: true,
    collapsed: false
  },

  // Center Column - Preview and Output
  {
    id: 'live-preview',
    type: 'live-preview',
    title: 'Live Preview',
    description: 'Interactive button preview with real-time updates',
    column: 'center',
    order: 1,
    enabled: true,
    collapsed: false
  },
  {
    id: 'preview-background',
    type: 'preview-background',
    title: 'Preview Background',
    description: 'Eyedropper color picker for preview background',
    column: 'center', 
    order: 2,
    enabled: true,
    collapsed: false
  },
  {
    id: 'css-output',
    type: 'css-output',
    title: 'Generated CSS Code',
    description: 'Copy and download the generated CSS',
    column: 'center',
    order: 3,
    enabled: true,
    collapsed: false
  },

  // Right Column - Controls
  {
    id: 'text-controls',
    type: 'text-controls',
    title: 'Button Text',
    description: 'Edit button text content',
    column: 'right',
    order: 1,
    enabled: true,
    collapsed: false
  },
  {
    id: 'typography-controls',
    type: 'typography-controls',
    title: 'Typography',
    description: 'Font size and weight controls',
    column: 'right',
    order: 2,
    enabled: true,
    collapsed: false
  },
  {
    id: 'border-gradient',
    type: 'border-gradient',
    title: 'Border Gradient',
    description: 'Border colors and gradient direction',
    column: 'right',
    order: 3,
    enabled: true,
    collapsed: false
  },
  {
    id: 'text-gradient',
    type: 'text-gradient',
    title: 'Text Gradient',
    description: 'Text colors and gradient effects',
    column: 'right',
    order: 4,
    enabled: true,
    collapsed: false
  },
  {
    id: 'background-gradient',
    type: 'background-gradient',
    title: 'Background Gradient',
    description: 'Background colors and transparency',
    column: 'right',
    order: 5,
    enabled: true,
    collapsed: false
  },
  {
    id: 'sizing-controls',
    type: 'sizing-controls',
    title: 'Size & Spacing',
    description: 'Padding, border radius, and dimensions',
    column: 'right',
    order: 6,
    enabled: true,
    collapsed: false
  },
  {
    id: 'border-style',
    type: 'border-style',
    title: 'Border Style',
    description: 'Border width and style options',
    column: 'right',
    order: 7,
    enabled: true,
    collapsed: false
  },
  {
    id: 'text-shadow',
    type: 'text-shadow',
    title: 'Text Shadow',
    description: 'Text shadow effects and positioning',
    column: 'right',
    order: 8,
    enabled: true,
    collapsed: false
  },
  {
    id: 'box-shadow',
    type: 'box-shadow',
    title: 'Box Shadow',
    description: 'Box shadow effects and positioning',
    column: 'right',
    order: 9,
    enabled: true,
    collapsed: false
  },
  {
    id: 'effects-3d',
    type: 'effects-3d',
    title: '3D Effects',
    description: '3D transformations and shadow intensity',
    column: 'right',
    order: 10,
    enabled: true,
    collapsed: false
  },
  {
    id: 'saved-designs',
    type: 'saved-designs',
    title: 'Saved Designs',
    description: 'Save, load, and manage button designs',
    column: 'right',
    order: 11,
    enabled: true,
    collapsed: false
  }
];

export const DEFAULT_LAYOUT: LayoutConfiguration = {
  id: 'default',
  name: 'Default Layout',
  description: 'Standard three-column layout for CSS Button Maker',
  columns: {
    left: DEFAULT_WIDGETS.filter(w => w.column === 'left'),
    center: DEFAULT_WIDGETS.filter(w => w.column === 'center'),
    right: DEFAULT_WIDGETS.filter(w => w.column === 'right')
  },
  columnWidths: {
    left: 30,
    center: 40, 
    right: 30
  },
  createdAt: new Date(),
  updatedAt: new Date()
};