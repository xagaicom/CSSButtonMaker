import React from 'react';
import { Widget } from './widget-types';

// Import all the widget components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ColorPicker } from "@/components/color-picker";
import { CompactColorPicker } from "@/components/compact-color-picker";
import { EyedropperColorPicker } from "@/components/eyedropper-color-picker";
import { CSSOutput } from "@/components/css-output";
import { SavedDesigns } from "@/components/saved-designs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, ChevronUp } from "lucide-react";

interface WidgetRendererProps {
  widget: Widget;
  buttonState: any;
  setButtonState: (state: any) => void;
  generateCSS: () => string;
  onLoadDesign: (design: any) => void;
}

export function WidgetRenderer({ widget, buttonState, setButtonState, generateCSS, onLoadDesign }: WidgetRendererProps) {
  if (!widget.enabled) return null;

  const renderWidgetContent = () => {
    switch (widget.type) {
      case 'quick-presets':
        return <QuickPresetsWidget buttonState={buttonState} setButtonState={setButtonState} />;
      
      case 'brick-styles':
        return <BrickStylesWidget buttonState={buttonState} setButtonState={setButtonState} />;
      
      case 'modern-styles':
        return <ModernStylesWidget buttonState={buttonState} setButtonState={setButtonState} />;
      
      case 'button-styles':
        return <ButtonStylesWidget buttonState={buttonState} setButtonState={setButtonState} />;
      
      case 'text-controls':
        return <TextControlsWidget buttonState={buttonState} setButtonState={setButtonState} />;
      
      case 'typography-controls':
        return <TypographyWidget buttonState={buttonState} setButtonState={setButtonState} />;
      
      case 'border-gradient':
        return <BorderGradientWidget buttonState={buttonState} setButtonState={setButtonState} />;
      
      case 'text-gradient':
        return <TextGradientWidget buttonState={buttonState} setButtonState={setButtonState} />;
      
      case 'background-gradient':
        return <BackgroundGradientWidget buttonState={buttonState} setButtonState={setButtonState} />;
      
      case 'sizing-controls':
        return <SizingControlsWidget buttonState={buttonState} setButtonState={setButtonState} />;
      
      case 'border-style':
        return <BorderStyleWidget buttonState={buttonState} setButtonState={setButtonState} />;
      
      case 'text-shadow':
        return <TextShadowWidget buttonState={buttonState} setButtonState={setButtonState} />;
      
      case 'box-shadow':
        return <BoxShadowWidget buttonState={buttonState} setButtonState={setButtonState} />;
      
      case 'effects-3d':
        return <Effects3DWidget buttonState={buttonState} setButtonState={setButtonState} />;
      
      case 'preview-background':
        return <PreviewBackgroundWidget buttonState={buttonState} setButtonState={setButtonState} />;
      
      case 'css-output':
        return <CSSOutput css={generateCSS()} />;
      
      case 'saved-designs':
        return <SavedDesigns currentDesign={buttonState} onLoadDesign={onLoadDesign} />;
      
      case 'live-preview':
        return null; // Handled separately in the main component
      
      default:
        return <div className="p-4 text-center text-gray-500">Widget type "{widget.type}" not implemented</div>;
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">{widget.title}</CardTitle>
        {widget.description && (
          <p className="text-xs text-gray-500">{widget.description}</p>
        )}
      </CardHeader>
      {!widget.collapsed && (
        <CardContent className="pt-0">
          {renderWidgetContent()}
        </CardContent>
      )}
    </Card>
  );
}

// Widget Components
function QuickPresetsWidget({ buttonState, setButtonState }: any) {
  const presets = [
    {
      name: "Ocean Blue",
      config: {
        borderStartColor: "#3b82f6",
        borderEndColor: "#1e40af",
        textStartColor: "#ffffff",
        textEndColor: "#f1f5f9",
        backgroundStartColor: "#2563eb",
        backgroundEndColor: "#1d4ed8",
      }
    },
    {
      name: "Sunset Orange",
      config: {
        borderStartColor: "#f59e0b",
        borderEndColor: "#ea580c",
        textStartColor: "#ffffff",
        textEndColor: "#fef3c7",
        backgroundStartColor: "#f97316",
        backgroundEndColor: "#ea580c",
      }
    },
    {
      name: "Forest Green",
      config: {
        borderStartColor: "#10b981",
        borderEndColor: "#047857",
        textStartColor: "#ffffff",
        textEndColor: "#d1fae5",
        backgroundStartColor: "#059669",
        backgroundEndColor: "#047857",
      }
    },
  ];

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Quick Presets</Label>
      <div className="grid grid-cols-1 gap-2">
        {presets.map((preset) => (
          <Button
            key={preset.name}
            variant="outline"
            size="sm"
            onClick={() => setButtonState({ ...buttonState, ...preset.config })}
            className="text-left justify-start h-8"
          >
            {preset.name}
          </Button>
        ))}
      </div>
    </div>
  );
}

function TextControlsWidget({ buttonState, setButtonState }: any) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="button-text" className="text-sm font-medium">Button Text</Label>
        <Input
          id="button-text"
          value={buttonState.text}
          onChange={(e) => setButtonState({ ...buttonState, text: e.target.value })}
          placeholder="Enter button text"
          className="mt-1"
        />
      </div>
    </div>
  );
}

function TypographyWidget({ buttonState, setButtonState }: any) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Font Size: {buttonState.fontSize}px</Label>
        <Slider
          value={[buttonState.fontSize]}
          onValueChange={([value]) => setButtonState({ ...buttonState, fontSize: value })}
          min={12}
          max={48}
          step={1}
          className="mt-2"
        />
      </div>
      <div>
        <Label className="text-sm font-medium">Font Weight: {buttonState.fontWeight}</Label>
        <Slider
          value={[buttonState.fontWeight]}
          onValueChange={([value]) => setButtonState({ ...buttonState, fontWeight: value })}
          min={100}
          max={900}
          step={100}
          className="mt-2"
        />
      </div>
    </div>
  );
}

function BorderGradientWidget({ buttonState, setButtonState }: any) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Start Color</Label>
        <CompactColorPicker
          value={buttonState.borderStartColor}
          onChange={(color) => setButtonState({ ...buttonState, borderStartColor: color })}
        />
      </div>
      <div>
        <Label className="text-sm font-medium">End Color</Label>
        <CompactColorPicker
          value={buttonState.borderEndColor}
          onChange={(color) => setButtonState({ ...buttonState, borderEndColor: color })}
        />
      </div>
      <div>
        <Label className="text-sm font-medium">Direction</Label>
        <Select
          value={buttonState.borderDirection}
          onValueChange={(value) => setButtonState({ ...buttonState, borderDirection: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="to right">Left to Right</SelectItem>
            <SelectItem value="to bottom">Top to Bottom</SelectItem>
            <SelectItem value="to bottom right">Diagonal ↘</SelectItem>
            <SelectItem value="to bottom left">Diagonal ↙</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function TextGradientWidget({ buttonState, setButtonState }: any) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Start Color</Label>
        <CompactColorPicker
          value={buttonState.textStartColor}
          onChange={(color) => setButtonState({ ...buttonState, textStartColor: color })}
        />
      </div>
      <div>
        <Label className="text-sm font-medium">End Color</Label>
        <CompactColorPicker
          value={buttonState.textEndColor}
          onChange={(color) => setButtonState({ ...buttonState, textEndColor: color })}
        />
      </div>
      <div>
        <Label className="text-sm font-medium">Direction</Label>
        <Select
          value={buttonState.textDirection}
          onValueChange={(value) => setButtonState({ ...buttonState, textDirection: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="to right">Left to Right</SelectItem>
            <SelectItem value="to bottom">Top to Bottom</SelectItem>
            <SelectItem value="to bottom right">Diagonal ↘</SelectItem>
            <SelectItem value="to bottom left">Diagonal ↙</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function BackgroundGradientWidget({ buttonState, setButtonState }: any) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Start Color</Label>
        <CompactColorPicker
          value={buttonState.backgroundStartColor}
          onChange={(color) => setButtonState({ ...buttonState, backgroundStartColor: color })}
        />
      </div>
      <div>
        <Label className="text-sm font-medium">End Color</Label>
        <CompactColorPicker
          value={buttonState.backgroundEndColor}
          onChange={(color) => setButtonState({ ...buttonState, backgroundEndColor: color })}
        />
      </div>
      <div>
        <Label className="text-sm font-medium">Direction</Label>
        <Select
          value={buttonState.backgroundDirection}
          onValueChange={(value) => setButtonState({ ...buttonState, backgroundDirection: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="to right">Left to Right</SelectItem>
            <SelectItem value="to bottom">Top to Bottom</SelectItem>
            <SelectItem value="to bottom right">Diagonal ↘</SelectItem>
            <SelectItem value="to bottom left">Diagonal ↙</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          checked={buttonState.transparentBackground}
          onCheckedChange={(checked) => setButtonState({ ...buttonState, transparentBackground: checked })}
        />
        <Label className="text-sm">Transparent Background</Label>
      </div>
    </div>
  );
}

function SizingControlsWidget({ buttonState, setButtonState }: any) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Padding X: {buttonState.paddingX}px</Label>
        <Slider
          value={[buttonState.paddingX]}
          onValueChange={([value]) => setButtonState({ ...buttonState, paddingX: value })}
          min={4}
          max={48}
          step={2}
          className="mt-2"
        />
      </div>
      <div>
        <Label className="text-sm font-medium">Padding Y: {buttonState.paddingY}px</Label>
        <Slider
          value={[buttonState.paddingY]}
          onValueChange={([value]) => setButtonState({ ...buttonState, paddingY: value })}
          min={4}
          max={32}
          step={2}
          className="mt-2"
        />
      </div>
      <div>
        <Label className="text-sm font-medium">Border Radius: {buttonState.borderRadius}px</Label>
        <Slider
          value={[buttonState.borderRadius]}
          onValueChange={([value]) => setButtonState({ ...buttonState, borderRadius: value })}
          min={0}
          max={50}
          step={1}
          className="mt-2"
        />
      </div>
      <div>
        <Label className="text-sm font-medium">Width: {buttonState.width}px</Label>
        <Slider
          value={[buttonState.width]}
          onValueChange={([value]) => setButtonState({ ...buttonState, width: value })}
          min={100}
          max={400}
          step={10}
          className="mt-2"
        />
      </div>
      <div>
        <Label className="text-sm font-medium">Height: {buttonState.height}px</Label>
        <Slider
          value={[buttonState.height]}
          onValueChange={([value]) => setButtonState({ ...buttonState, height: value })}
          min={40}
          max={120}
          step={5}
          className="mt-2"
        />
      </div>
    </div>
  );
}

function BorderStyleWidget({ buttonState, setButtonState }: any) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Border Width: {buttonState.borderWidth}px</Label>
        <Slider
          value={[buttonState.borderWidth]}
          onValueChange={([value]) => setButtonState({ ...buttonState, borderWidth: value })}
          min={0}
          max={8}
          step={1}
          className="mt-2"
        />
      </div>
      <div>
        <Label className="text-sm font-medium">Border Style</Label>
        <Select
          value={buttonState.borderStyle}
          onValueChange={(value) => setButtonState({ ...buttonState, borderStyle: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="solid">Solid</SelectItem>
            <SelectItem value="dashed">Dashed</SelectItem>
            <SelectItem value="dotted">Dotted</SelectItem>
            <SelectItem value="double">Double</SelectItem>
            <SelectItem value="groove">Groove</SelectItem>
            <SelectItem value="ridge">Ridge</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function TextShadowWidget({ buttonState, setButtonState }: any) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch
          checked={buttonState.enableTextShadow}
          onCheckedChange={(checked) => setButtonState({ ...buttonState, enableTextShadow: checked })}
        />
        <Label className="text-sm">Enable Text Shadow</Label>
      </div>
      {buttonState.enableTextShadow && (
        <>
          <div>
            <Label className="text-sm font-medium">Shadow Color</Label>
            <CompactColorPicker
              value={buttonState.textShadowColor}
              onChange={(color) => setButtonState({ ...buttonState, textShadowColor: color })}
            />
          </div>
          <div>
            <Label className="text-sm font-medium">X Offset: {buttonState.textShadowX}px</Label>
            <Slider
              value={[buttonState.textShadowX]}
              onValueChange={([value]) => setButtonState({ ...buttonState, textShadowX: value })}
              min={-10}
              max={10}
              step={1}
              className="mt-2"
            />
          </div>
          <div>
            <Label className="text-sm font-medium">Y Offset: {buttonState.textShadowY}px</Label>
            <Slider
              value={[buttonState.textShadowY]}
              onValueChange={([value]) => setButtonState({ ...buttonState, textShadowY: value })}
              min={-10}
              max={10}
              step={1}
              className="mt-2"
            />
          </div>
          <div>
            <Label className="text-sm font-medium">Blur: {buttonState.textShadowBlur}px</Label>
            <Slider
              value={[buttonState.textShadowBlur]}
              onValueChange={([value]) => setButtonState({ ...buttonState, textShadowBlur: value })}
              min={0}
              max={20}
              step={1}
              className="mt-2"
            />
          </div>
        </>
      )}
    </div>
  );
}

function BoxShadowWidget({ buttonState, setButtonState }: any) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch
          checked={buttonState.enableBoxShadow}
          onCheckedChange={(checked) => setButtonState({ ...buttonState, enableBoxShadow: checked })}
        />
        <Label className="text-sm">Enable Box Shadow</Label>
      </div>
      {buttonState.enableBoxShadow && (
        <>
          <div>
            <Label className="text-sm font-medium">Shadow Color</Label>
            <CompactColorPicker
              value={buttonState.boxShadowColor}
              onChange={(color) => setButtonState({ ...buttonState, boxShadowColor: color })}
            />
          </div>
          <div>
            <Label className="text-sm font-medium">X Offset: {buttonState.boxShadowX}px</Label>
            <Slider
              value={[buttonState.boxShadowX]}
              onValueChange={([value]) => setButtonState({ ...buttonState, boxShadowX: value })}
              min={-20}
              max={20}
              step={1}
              className="mt-2"
            />
          </div>
          <div>
            <Label className="text-sm font-medium">Y Offset: {buttonState.boxShadowY}px</Label>
            <Slider
              value={[buttonState.boxShadowY]}
              onValueChange={([value]) => setButtonState({ ...buttonState, boxShadowY: value })}
              min={-20}
              max={20}
              step={1}
              className="mt-2"
            />
          </div>
          <div>
            <Label className="text-sm font-medium">Blur: {buttonState.boxShadowBlur}px</Label>
            <Slider
              value={[buttonState.boxShadowBlur]}
              onValueChange={([value]) => setButtonState({ ...buttonState, boxShadowBlur: value })}
              min={0}
              max={50}
              step={1}
              className="mt-2"
            />
          </div>
          <div>
            <Label className="text-sm font-medium">Spread: {buttonState.boxShadowSpread}px</Label>
            <Slider
              value={[buttonState.boxShadowSpread]}
              onValueChange={([value]) => setButtonState({ ...buttonState, boxShadowSpread: value })}
              min={-20}
              max={20}
              step={1}
              className="mt-2"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={buttonState.boxShadowInset}
              onCheckedChange={(checked) => setButtonState({ ...buttonState, boxShadowInset: checked })}
            />
            <Label className="text-sm">Inset Shadow</Label>
          </div>
        </>
      )}
    </div>
  );
}

function Effects3DWidget({ buttonState, setButtonState }: any) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch
          checked={buttonState.enable3D}
          onCheckedChange={(checked) => setButtonState({ ...buttonState, enable3D: checked })}
        />
        <Label className="text-sm">Enable 3D Effects</Label>
      </div>
      {buttonState.enable3D && (
        <div>
          <Label className="text-sm font-medium">Shadow Intensity: {buttonState.shadowIntensity}</Label>
          <Slider
            value={[buttonState.shadowIntensity]}
            onValueChange={([value]) => setButtonState({ ...buttonState, shadowIntensity: value })}
            min={0}
            max={100}
            step={5}
            className="mt-2"
          />
        </div>
      )}
    </div>
  );
}

function PreviewBackgroundWidget({ buttonState, setButtonState }: any) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Preview Background</Label>
        <EyedropperColorPicker
          value={buttonState.previewBackground}
          onChange={(color) => setButtonState({ ...buttonState, previewBackground: color })}
          label="Background Color"
        />
      </div>
    </div>
  );
}

function BrickStylesWidget({ buttonState, setButtonState }: any) {
  const brickPresets = [
    {
      name: "3D Red Brick",
      config: {
        borderStartColor: "#dc2626",
        borderEndColor: "#991b1b",
        textStartColor: "#ffffff",
        textEndColor: "#f8fafc",
        backgroundStartColor: "#dc2626",
        backgroundEndColor: "#b91c1c",
        enable3D: true,
        shadowIntensity: 40,
        borderRadius: 4,
      }
    },
    {
      name: "3D Blue Brick", 
      config: {
        borderStartColor: "#2563eb",
        borderEndColor: "#1d4ed8",
        textStartColor: "#ffffff",
        textEndColor: "#f1f5f9",
        backgroundStartColor: "#3b82f6",
        backgroundEndColor: "#2563eb",
        enable3D: true,
        shadowIntensity: 40,
        borderRadius: 4,
      }
    },
    {
      name: "3D Green Brick",
      config: {
        borderStartColor: "#059669",
        borderEndColor: "#047857",
        textStartColor: "#ffffff", 
        textEndColor: "#d1fae5",
        backgroundStartColor: "#10b981",
        backgroundEndColor: "#059669",
        enable3D: true,
        shadowIntensity: 40,
        borderRadius: 4,
      }
    }
  ];

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">3D Brick Styles</Label>
      <div className="grid grid-cols-1 gap-2">
        {brickPresets.map((preset) => (
          <Button
            key={preset.name}
            variant="outline"
            size="sm"
            onClick={() => setButtonState({ ...buttonState, ...preset.config })}
            className="text-left justify-start h-8"
          >
            {preset.name}
          </Button>
        ))}
      </div>
    </div>
  );
}

function ModernStylesWidget({ buttonState, setButtonState }: any) {
  const modernPresets = [
    {
      name: "Neon Glow",
      config: {
        borderStartColor: "#06b6d4",
        borderEndColor: "#0891b2",
        textStartColor: "#ffffff",
        textEndColor: "#cffafe",
        backgroundStartColor: "#0891b2",
        backgroundEndColor: "#0e7490",
        enableBoxShadow: true,
        boxShadowColor: "#06b6d4",
        boxShadowBlur: 20,
        borderRadius: 8,
      }
    },
    {
      name: "Minimal Clean",
      config: {
        borderStartColor: "#f3f4f6",
        borderEndColor: "#e5e7eb",
        textStartColor: "#374151",
        textEndColor: "#1f2937",
        backgroundStartColor: "#ffffff",
        backgroundEndColor: "#f9fafb",
        borderRadius: 6,
        borderWidth: 1,
      }
    },
    {
      name: "Retro Wave",
      config: {
        borderStartColor: "#ec4899",
        borderEndColor: "#be185d",
        textStartColor: "#fdf2f8",
        textEndColor: "#ffffff",
        backgroundStartColor: "#d946ef",
        backgroundEndColor: "#a21caf",
        borderRadius: 12,
      }
    }
  ];

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Modern Styles</Label>
      <div className="grid grid-cols-1 gap-2">
        {modernPresets.map((preset) => (
          <Button
            key={preset.name}
            variant="outline"
            size="sm"
            onClick={() => setButtonState({ ...buttonState, ...preset.config })}
            className="text-left justify-start h-8"
          >
            {preset.name}
          </Button>
        ))}
      </div>
    </div>
  );
}

function ButtonStylesWidget({ buttonState, setButtonState }: any) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Button Style Library</Label>
        <p className="text-xs text-gray-500 mt-1">
          Comprehensive collection of button styles from markodenic.com
        </p>
      </div>
      <div className="text-center text-sm text-gray-500">
        Coming soon: 50+ button styles across 15 categories
      </div>
    </div>
  );
}