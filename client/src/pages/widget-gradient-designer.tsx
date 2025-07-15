import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/gradient-button";
import { InteractiveButton } from "@/components/interactive-button";
import { WidgetRenderer } from "@/components/widget-system/widget-renderer";
import { useWidgets } from "@/components/widget-system/widget-context";
import { RotateCcw, LogOut, User, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
// CSS Logo placeholder - using CSS icon instead

const getPreviewBackgroundStyle = (background: string) => {
  if (background.startsWith('#')) {
    return { backgroundColor: background };
  }
  
  const colorMap: { [key: string]: string } = {
    'black': '#000000',
    'white': '#ffffff',
    'blue': '#3b82f6',
    'green': '#10b981',
    'orange': '#f59e0b',
    'red': '#ef4444',
    'gray': '#6b7280',
    'carbon': '#374151',
    'linen': '#fef3c7',
    'metal': '#9ca3af'
  };
  
  return { backgroundColor: colorMap[background] || background || '#9ca3af' };
};

interface ButtonState {
  text: string;
  fontSize: number;
  fontWeight: number;
  borderStartColor: string;
  borderEndColor: string;
  borderDirection: string;
  textStartColor: string;
  textEndColor: string;
  textDirection: string;
  backgroundStartColor: string;
  backgroundEndColor: string;
  backgroundDirection: string;
  paddingX: number;
  paddingY: number;
  borderRadius: number;
  borderWidth: number;
  enable3D: boolean;
  shadowIntensity: number;
  width: number;
  height: number;
  transparentBackground: boolean;
  enableTextShadow: boolean;
  textShadowColor: string;
  textShadowX: number;
  textShadowY: number;
  textShadowBlur: number;
  enableBoxShadow: boolean;
  boxShadowColor: string;
  boxShadowX: number;
  boxShadowY: number;
  boxShadowBlur: number;
  boxShadowSpread: number;
  boxShadowInset: boolean;
  borderStyle: string;
  previewBackground: string;
}

const initialState: ButtonState = {
  text: "CSS Button",
  fontSize: 16,
  fontWeight: 500,
  borderStartColor: "#3b82f6",
  borderEndColor: "#1e40af",
  borderDirection: "to right",
  textStartColor: "#ffffff",
  textEndColor: "#f1f5f9",
  textDirection: "to right",
  backgroundStartColor: "#2563eb",
  backgroundEndColor: "#1d4ed8",
  backgroundDirection: "to right",
  paddingX: 24,
  paddingY: 12,
  borderRadius: 8,
  borderWidth: 2,
  enable3D: false,
  shadowIntensity: 20,
  width: 200,
  height: 50,
  transparentBackground: false,
  enableTextShadow: false,
  textShadowColor: "#000000",
  textShadowX: 1,
  textShadowY: 1,
  textShadowBlur: 2,
  enableBoxShadow: false,
  boxShadowColor: "#000000",
  boxShadowX: 0,
  boxShadowY: 4,
  boxShadowBlur: 12,
  boxShadowSpread: 0,
  boxShadowInset: false,
  borderStyle: "solid",
  previewBackground: "#9ca3af"
};

function WidgetGradientDesignerContent() {
  const [buttonState, setButtonState] = useState<ButtonState>(initialState);
  const { widgets, currentLayout, isAdminMode, toggleAdminMode } = useWidgets();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const generateCSS = useCallback(() => {
    let css = `
.gradient-button {
  font-size: ${buttonState.fontSize}px;
  font-weight: ${buttonState.fontWeight};
  padding: ${buttonState.paddingY}px ${buttonState.paddingX}px;
  border-radius: ${buttonState.borderRadius}px;
  border: ${buttonState.borderWidth}px ${buttonState.borderStyle} transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  width: ${buttonState.width}px;
  height: ${buttonState.height}px;
  display: inline-flex;
  align-items: center;
  justify-content: center;`;

    // Border gradient
    if (buttonState.borderWidth > 0) {
      css += `
  background: linear-gradient(${buttonState.backgroundDirection}, ${buttonState.backgroundStartColor}, ${buttonState.backgroundEndColor}) padding-box,
              linear-gradient(${buttonState.borderDirection}, ${buttonState.borderStartColor}, ${buttonState.borderEndColor}) border-box;`;
    } else {
      css += `
  background: linear-gradient(${buttonState.backgroundDirection}, ${buttonState.backgroundStartColor}, ${buttonState.backgroundEndColor});`;
    }

    // Text gradient
    css += `
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  background-image: linear-gradient(${buttonState.textDirection}, ${buttonState.textStartColor}, ${buttonState.textEndColor});`;

    // Text shadow
    if (buttonState.enableTextShadow) {
      css += `
  text-shadow: ${buttonState.textShadowX}px ${buttonState.textShadowY}px ${buttonState.textShadowBlur}px ${buttonState.textShadowColor};`;
    }

    // Box shadow
    if (buttonState.enableBoxShadow) {
      const inset = buttonState.boxShadowInset ? 'inset ' : '';
      css += `
  box-shadow: ${inset}${buttonState.boxShadowX}px ${buttonState.boxShadowY}px ${buttonState.boxShadowBlur}px ${buttonState.boxShadowSpread}px ${buttonState.boxShadowColor};`;
    }

    // 3D effects
    if (buttonState.enable3D) {
      const intensity = buttonState.shadowIntensity / 100;
      css += `
  transform: perspective(500px) rotateX(15deg);
  box-shadow: 0 ${Math.round(10 * intensity)}px ${Math.round(20 * intensity)}px rgba(0,0,0,${0.3 * intensity});`;
    }

    css += `
}`;

    return css;
  }, [buttonState]);

  const handleReset = () => {
    setButtonState(initialState);
    toast({
      title: "Reset Complete",
      description: "Button design has been reset to default settings.",
    });
  };

  const handleLoadDesign = (design: any) => {
    setButtonState({ ...buttonState, ...design });
    toast({
      title: "Design Loaded",
      description: "Button design has been loaded successfully.",
    });
  };

  const renderColumn = (columnWidgets: any[], columnKey: 'left' | 'center' | 'right') => {
    const sortedWidgets = [...columnWidgets].sort((a, b) => a.order - b.order);
    
    return (
      <div className="space-y-4">
        {sortedWidgets.map(widget => (
          <WidgetRenderer
            key={widget.id}
            widget={widget}
            buttonState={buttonState}
            setButtonState={setButtonState}
            generateCSS={generateCSS}
            onLoadDesign={handleLoadDesign}
          />
        ))}
      </div>
    );
  };

  // Check if live preview widget exists and get its column
  const livePreviewWidget = [...widgets.left, ...widgets.center, ...widgets.right].find(w => w.type === 'live-preview');
  const showLivePreview = livePreviewWidget?.enabled;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center text-white text-xs font-bold">CSS</div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">CSS Button Maker</h1>
                <p className="text-sm text-gray-500">Create beautiful gradient buttons with live preview</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="flex items-center space-x-2"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reset</span>
              </Button>
              
              {isAuthenticated && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleAdminMode}
                  className="flex items-center space-x-2"
                >
                  <Settings className="h-4 w-4" />
                  <span>{isAdminMode ? 'Exit Admin' : 'Admin Mode'}</span>
                </Button>
              )}
              
              <Link href="/gallery">
                <Button variant="outline" size="sm">Gallery</Button>
              </Link>
              
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700">{user?.email}</span>
                  </div>
                  <a href="/api/logout">
                    <Button variant="outline" size="sm">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </a>
                </div>
              ) : (
                <a href="/api/login">
                  <Button size="sm">Login</Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Left Column */}
          <div 
            className="order-1" 
            style={{ gridColumn: `span ${Math.round(currentLayout.columnWidths?.left || 30) / 100 * 12}` }}
          >
            {renderColumn(widgets.left, 'left')}
          </div>

          {/* Center Column */}
          <div 
            className="order-2" 
            style={{ gridColumn: `span ${Math.round(currentLayout.columnWidths?.center || 40) / 100 * 12}` }}
          >
            {/* Always show live preview if enabled */}
            {showLivePreview && (
              <div className="mb-8">
                <div 
                  className="p-8 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center"
                  style={getPreviewBackgroundStyle(buttonState.previewBackground)}
                >
                  <InteractiveButton
                    text={buttonState.text}
                    fontSize={buttonState.fontSize}
                    fontWeight={buttonState.fontWeight}
                    borderStartColor={buttonState.borderStartColor}
                    borderEndColor={buttonState.borderEndColor}
                    borderDirection={buttonState.borderDirection}
                    textStartColor={buttonState.textStartColor}
                    textEndColor={buttonState.textEndColor}
                    textDirection={buttonState.textDirection}
                    backgroundStartColor={buttonState.backgroundStartColor}
                    backgroundEndColor={buttonState.backgroundEndColor}
                    backgroundDirection={buttonState.backgroundDirection}
                    paddingX={buttonState.paddingX}
                    paddingY={buttonState.paddingY}
                    borderRadius={buttonState.borderRadius}
                    borderWidth={buttonState.borderWidth}
                    enable3D={buttonState.enable3D}
                    shadowIntensity={buttonState.shadowIntensity}
                    width={buttonState.width}
                    height={buttonState.height}
                    transparentBackground={buttonState.transparentBackground}
                    enableTextShadow={buttonState.enableTextShadow}
                    textShadowColor={buttonState.textShadowColor}
                    textShadowX={buttonState.textShadowX}
                    textShadowY={buttonState.textShadowY}
                    textShadowBlur={buttonState.textShadowBlur}
                    enableBoxShadow={buttonState.enableBoxShadow}
                    boxShadowColor={buttonState.boxShadowColor}
                    boxShadowX={buttonState.boxShadowX}
                    boxShadowY={buttonState.boxShadowY}
                    boxShadowBlur={buttonState.boxShadowBlur}
                    boxShadowSpread={buttonState.boxShadowSpread}
                    boxShadowInset={buttonState.boxShadowInset}
                    borderStyle={buttonState.borderStyle}
                  />
                </div>
              </div>
            )}
            
            {renderColumn(widgets.center.filter(w => w.type !== 'live-preview'), 'center')}
          </div>

          {/* Right Column */}
          <div 
            className="order-3" 
            style={{ gridColumn: `span ${Math.round(currentLayout.columnWidths?.right || 30) / 100 * 12}` }}
          >
            {renderColumn(widgets.right, 'right')}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WidgetGradientDesigner() {
  return <WidgetGradientDesignerContent />;
}