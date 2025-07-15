import React from 'react';
import { Widget, WidgetType } from './widget-types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ColorPicker } from '@/components/color-picker';
import { EyedropperColorPicker } from '@/components/eyedropper-color-picker';
import { InteractiveButton } from '@/components/interactive-button';
import { CSSOutput } from '@/components/css-output';
import { SavedDesigns } from '@/components/saved-designs';

interface WidgetFactoryProps {
  widget: Widget;
  buttonState?: any;
  onButtonStateChange?: (updates: any) => void;
  generateCSS?: () => string;
}

export function WidgetFactory({ widget, buttonState, onButtonStateChange, generateCSS }: WidgetFactoryProps) {
  const renderWidget = (type: WidgetType) => {
    switch (type) {
      case 'text-controls':
        return (
          <div className="space-y-3">
            <div>
              <Label htmlFor="button-text">Button Text</Label>
              <Input
                id="button-text"
                value={buttonState?.text || ''}
                onChange={(e) => onButtonStateChange?.({ text: e.target.value })}
                placeholder="Enter button text"
              />
            </div>
          </div>
        );

      case 'typography-controls':
        return (
          <div className="space-y-4">
            <div>
              <Label>Font Size: {buttonState?.fontSize || 16}px</Label>
              <Slider
                value={[buttonState?.fontSize || 16]}
                onValueChange={(value) => onButtonStateChange?.({ fontSize: value[0] })}
                max={32}
                min={12}
                step={1}
              />
            </div>
            <div>
              <Label>Font Weight: {buttonState?.fontWeight || 400}</Label>
              <Slider
                value={[buttonState?.fontWeight || 400]}
                onValueChange={(value) => onButtonStateChange?.({ fontWeight: value[0] })}
                max={900}
                min={100}
                step={100}
              />
            </div>
          </div>
        );

      case 'border-gradient':
        return (
          <div className="space-y-4">
            <div>
              <Label>Start Color</Label>
              <ColorPicker
                value={buttonState?.borderStartColor || '#000000'}
                onChange={(color) => onButtonStateChange?.({ borderStartColor: color })}
              />
            </div>
            <div>
              <Label>End Color</Label>
              <ColorPicker
                value={buttonState?.borderEndColor || '#000000'}
                onChange={(color) => onButtonStateChange?.({ borderEndColor: color })}
              />
            </div>
            <div>
              <Label>Direction</Label>
              <Select
                value={buttonState?.borderDirection || 'to right'}
                onValueChange={(value) => onButtonStateChange?.({ borderDirection: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="to right">Left to Right</SelectItem>
                  <SelectItem value="to left">Right to Left</SelectItem>
                  <SelectItem value="to bottom">Top to Bottom</SelectItem>
                  <SelectItem value="to top">Bottom to Top</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'text-gradient':
        return (
          <div className="space-y-4">
            <div>
              <Label>Start Color</Label>
              <ColorPicker
                value={buttonState?.textStartColor || '#000000'}
                onChange={(color) => onButtonStateChange?.({ textStartColor: color })}
              />
            </div>
            <div>
              <Label>End Color</Label>
              <ColorPicker
                value={buttonState?.textEndColor || '#000000'}
                onChange={(color) => onButtonStateChange?.({ textEndColor: color })}
              />
            </div>
            <div>
              <Label>Direction</Label>
              <Select
                value={buttonState?.textDirection || 'to right'}
                onValueChange={(value) => onButtonStateChange?.({ textDirection: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="to right">Left to Right</SelectItem>
                  <SelectItem value="to left">Right to Left</SelectItem>
                  <SelectItem value="to bottom">Top to Bottom</SelectItem>
                  <SelectItem value="to top">Bottom to Top</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'background-gradient':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Transparent Background</Label>
              <Switch
                checked={buttonState?.transparentBackground || false}
                onCheckedChange={(checked) => onButtonStateChange?.({ transparentBackground: checked })}
              />
            </div>
            {!buttonState?.transparentBackground && (
              <>
                <div>
                  <Label>Start Color</Label>
                  <ColorPicker
                    value={buttonState?.backgroundStartColor || '#000000'}
                    onChange={(color) => onButtonStateChange?.({ backgroundStartColor: color })}
                  />
                </div>
                <div>
                  <Label>End Color</Label>
                  <ColorPicker
                    value={buttonState?.backgroundEndColor || '#000000'}
                    onChange={(color) => onButtonStateChange?.({ backgroundEndColor: color })}
                  />
                </div>
                <div>
                  <Label>Direction</Label>
                  <Select
                    value={buttonState?.backgroundDirection || 'to right'}
                    onValueChange={(value) => onButtonStateChange?.({ backgroundDirection: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="to right">Left to Right</SelectItem>
                      <SelectItem value="to left">Right to Left</SelectItem>
                      <SelectItem value="to bottom">Top to Bottom</SelectItem>
                      <SelectItem value="to top">Bottom to Top</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
        );

      case 'sizing-controls':
        return (
          <div className="space-y-4">
            <div>
              <Label>Width: {buttonState?.width || 200}px</Label>
              <Slider
                value={[buttonState?.width || 200]}
                onValueChange={(value) => onButtonStateChange?.({ width: value[0] })}
                max={400}
                min={100}
                step={10}
              />
            </div>
            <div>
              <Label>Height: {buttonState?.height || 50}px</Label>
              <Slider
                value={[buttonState?.height || 50]}
                onValueChange={(value) => onButtonStateChange?.({ height: value[0] })}
                max={100}
                min={30}
                step={5}
              />
            </div>
            <div>
              <Label>Padding X: {buttonState?.paddingX || 24}px</Label>
              <Slider
                value={[buttonState?.paddingX || 24]}
                onValueChange={(value) => onButtonStateChange?.({ paddingX: value[0] })}
                max={50}
                min={0}
                step={2}
              />
            </div>
            <div>
              <Label>Padding Y: {buttonState?.paddingY || 12}px</Label>
              <Slider
                value={[buttonState?.paddingY || 12]}
                onValueChange={(value) => onButtonStateChange?.({ paddingY: value[0] })}
                max={30}
                min={0}
                step={2}
              />
            </div>
            <div>
              <Label>Border Radius: {buttonState?.borderRadius || 8}px</Label>
              <Slider
                value={[buttonState?.borderRadius || 8]}
                onValueChange={(value) => onButtonStateChange?.({ borderRadius: value[0] })}
                max={50}
                min={0}
                step={1}
              />
            </div>
          </div>
        );

      case 'border-style':
        return (
          <div className="space-y-4">
            <div>
              <Label>Border Width: {buttonState?.borderWidth || 2}px</Label>
              <Slider
                value={[buttonState?.borderWidth || 2]}
                onValueChange={(value) => onButtonStateChange?.({ borderWidth: value[0] })}
                max={10}
                min={0}
                step={1}
              />
            </div>
            <div>
              <Label>Border Style</Label>
              <Select
                value={buttonState?.borderStyle || 'solid'}
                onValueChange={(value) => onButtonStateChange?.({ borderStyle: value })}
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
                  <SelectItem value="inset">Inset</SelectItem>
                  <SelectItem value="outset">Outset</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'text-shadow':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Enable Text Shadow</Label>
              <Switch
                checked={buttonState?.enableTextShadow || false}
                onCheckedChange={(checked) => onButtonStateChange?.({ enableTextShadow: checked })}
              />
            </div>
            {buttonState?.enableTextShadow && (
              <>
                <div>
                  <Label>Shadow Color</Label>
                  <ColorPicker
                    value={buttonState?.textShadowColor || '#000000'}
                    onChange={(color) => onButtonStateChange?.({ textShadowColor: color })}
                  />
                </div>
                <div>
                  <Label>X Offset: {buttonState?.textShadowX || 0}px</Label>
                  <Slider
                    value={[buttonState?.textShadowX || 0]}
                    onValueChange={(value) => onButtonStateChange?.({ textShadowX: value[0] })}
                    max={20}
                    min={-20}
                    step={1}
                  />
                </div>
                <div>
                  <Label>Y Offset: {buttonState?.textShadowY || 0}px</Label>
                  <Slider
                    value={[buttonState?.textShadowY || 0]}
                    onValueChange={(value) => onButtonStateChange?.({ textShadowY: value[0] })}
                    max={20}
                    min={-20}
                    step={1}
                  />
                </div>
                <div>
                  <Label>Blur: {buttonState?.textShadowBlur || 0}px</Label>
                  <Slider
                    value={[buttonState?.textShadowBlur || 0]}
                    onValueChange={(value) => onButtonStateChange?.({ textShadowBlur: value[0] })}
                    max={20}
                    min={0}
                    step={1}
                  />
                </div>
              </>
            )}
          </div>
        );

      case 'box-shadow':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Enable Box Shadow</Label>
              <Switch
                checked={buttonState?.enableBoxShadow || false}
                onCheckedChange={(checked) => onButtonStateChange?.({ enableBoxShadow: checked })}
              />
            </div>
            {buttonState?.enableBoxShadow && (
              <>
                <div>
                  <Label>Shadow Color</Label>
                  <ColorPicker
                    value={buttonState?.boxShadowColor || '#000000'}
                    onChange={(color) => onButtonStateChange?.({ boxShadowColor: color })}
                  />
                </div>
                <div>
                  <Label>X Offset: {buttonState?.boxShadowX || 0}px</Label>
                  <Slider
                    value={[buttonState?.boxShadowX || 0]}
                    onValueChange={(value) => onButtonStateChange?.({ boxShadowX: value[0] })}
                    max={20}
                    min={-20}
                    step={1}
                  />
                </div>
                <div>
                  <Label>Y Offset: {buttonState?.boxShadowY || 0}px</Label>
                  <Slider
                    value={[buttonState?.boxShadowY || 0]}
                    onValueChange={(value) => onButtonStateChange?.({ boxShadowY: value[0] })}
                    max={20}
                    min={-20}
                    step={1}
                  />
                </div>
                <div>
                  <Label>Blur: {buttonState?.boxShadowBlur || 0}px</Label>
                  <Slider
                    value={[buttonState?.boxShadowBlur || 0]}
                    onValueChange={(value) => onButtonStateChange?.({ boxShadowBlur: value[0] })}
                    max={20}
                    min={0}
                    step={1}
                  />
                </div>
                <div>
                  <Label>Spread: {buttonState?.boxShadowSpread || 0}px</Label>
                  <Slider
                    value={[buttonState?.boxShadowSpread || 0]}
                    onValueChange={(value) => onButtonStateChange?.({ boxShadowSpread: value[0] })}
                    max={20}
                    min={-20}
                    step={1}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Inset Shadow</Label>
                  <Switch
                    checked={buttonState?.boxShadowInset || false}
                    onCheckedChange={(checked) => onButtonStateChange?.({ boxShadowInset: checked })}
                  />
                </div>
              </>
            )}
          </div>
        );

      case 'effects-3d':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Enable 3D Effects</Label>
              <Switch
                checked={buttonState?.enable3D || false}
                onCheckedChange={(checked) => onButtonStateChange?.({ enable3D: checked })}
              />
            </div>
            {buttonState?.enable3D && (
              <div>
                <Label>Shadow Intensity: {buttonState?.shadowIntensity || 0.5}</Label>
                <Slider
                  value={[buttonState?.shadowIntensity || 0.5]}
                  onValueChange={(value) => onButtonStateChange?.({ shadowIntensity: value[0] })}
                  max={1}
                  min={0}
                  step={0.1}
                />
              </div>
            )}
          </div>
        );

      case 'preview-background':
        return (
          <div className="space-y-4">
            <div>
              <Label>Preview Background</Label>
              <EyedropperColorPicker
                value={buttonState?.previewBackground || '#f0f0f0'}
                onChange={(color) => onButtonStateChange?.({ previewBackground: color })}
              />
            </div>
          </div>
        );

      case 'live-preview':
        return (
          <div className="space-y-4">
            <div 
              className="flex items-center justify-center min-h-32 rounded-lg border-2 border-dashed border-gray-300 transition-colors"
              style={{ backgroundColor: buttonState?.previewBackground || '#f0f0f0' }}
            >
              <InteractiveButton {...buttonState} />
            </div>
          </div>
        );

      case 'css-output':
        return (
          <div className="space-y-4">
            <CSSOutput css={generateCSS?.() || ''} />
          </div>
        );

      case 'saved-designs':
        return (
          <div className="space-y-4">
            <SavedDesigns
              currentDesign={buttonState}
              onLoadDesign={(design) => onButtonStateChange?.(design)}
            />
          </div>
        );

      case 'quick-presets':
      case 'modern-styles':
      case 'brick-styles':
      case 'button-styles':
        return (
          <div className="space-y-4">
            <div className="text-center text-gray-500">
              <p className="text-sm">Widget placeholder for {widget.title}</p>
              <p className="text-xs">This will contain the actual preset buttons</p>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <div className="text-center text-gray-500">
              <p className="text-sm">Unknown widget type: {type}</p>
            </div>
          </div>
        );
    }
  };

  return renderWidget(widget.type);
}