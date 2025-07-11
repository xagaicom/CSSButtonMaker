import { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Pipette, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImprovedColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

// Color utility functions
const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h: number, s: number, l: number = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      default: h = 0;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
};

const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
  h /= 360;
  s /= 100;
  l /= 100;
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
};

const isValidHex = (hex: string): boolean => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
};

const isValidRgb = (rgb: string): boolean => {
  return /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/.test(rgb);
};

const parseRgb = (rgb: string): { r: number; g: number; b: number } | null => {
  const match = rgb.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/);
  if (!match) return null;
  return {
    r: parseInt(match[1]),
    g: parseInt(match[2]),
    b: parseInt(match[3])
  };
};

// Extend the Window interface to include EyeDropper
declare global {
  interface Window {
    EyeDropper?: {
      new(): {
        open(): Promise<{ sRGBHex: string }>;
      };
    };
  }
}

export function ImprovedColorPicker({ value, onChange, label }: ImprovedColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [colorInput, setColorInput] = useState(value);
  const [supportsEyeDropper, setSupportsEyeDropper] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hueCanvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    setSupportsEyeDropper('EyeDropper' in window);
  }, []);

  useEffect(() => {
    setColorInput(value);
  }, [value]);

  const { r, g, b } = hexToRgb(value);
  const { h, s, l } = rgbToHsl(r, g, b);

  const handleColorInput = useCallback((inputValue: string) => {
    setColorInput(inputValue);
    
    // Try to parse as hex
    if (isValidHex(inputValue)) {
      onChange(inputValue);
      return;
    }
    
    // Try to parse as RGB
    if (isValidRgb(inputValue)) {
      const parsed = parseRgb(inputValue);
      if (parsed) {
        const hex = rgbToHex(parsed.r, parsed.g, parsed.b);
        onChange(hex);
        return;
      }
    }
    
    // Try to parse as hex without #
    if (/^[A-Fa-f0-9]{6}$/.test(inputValue)) {
      const hex = '#' + inputValue;
      onChange(hex);
      return;
    }
  }, [onChange]);

  const handleRgbChange = useCallback((component: 'r' | 'g' | 'b', newValue: number) => {
    const current = hexToRgb(value);
    const updated = { ...current, [component]: newValue };
    const hex = rgbToHex(updated.r, updated.g, updated.b);
    onChange(hex);
  }, [value, onChange]);

  const handleHueChange = useCallback((newHue: number) => {
    const { r: newR, g: newG, b: newB } = hslToRgb(newHue, s, l);
    const hex = rgbToHex(newR, newG, newB);
    onChange(hex);
  }, [s, l, onChange]);

  const handleSaturationChange = useCallback((newSaturation: number) => {
    const { r: newR, g: newG, b: newB } = hslToRgb(h, newSaturation, l);
    const hex = rgbToHex(newR, newG, newB);
    onChange(hex);
  }, [h, l, onChange]);

  const handleLightnessChange = useCallback((newLightness: number) => {
    const { r: newR, g: newG, b: newB } = hslToRgb(h, s, newLightness);
    const hex = rgbToHex(newR, newG, newB);
    onChange(hex);
  }, [h, s, onChange]);

  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    const saturation = x * 100;
    const lightness = (1 - y) * 100;

    const { r: newR, g: newG, b: newB } = hslToRgb(h, saturation, lightness);
    const hex = rgbToHex(newR, newG, newB);
    onChange(hex);
  }, [h, onChange]);

  const handleHueCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = hueCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const hue = x * 360;

    handleHueChange(hue);
  }, [handleHueChange]);

  const startEyeDropper = useCallback(async () => {
    if (supportsEyeDropper && window.EyeDropper) {
      try {
        const eyeDropper = new window.EyeDropper();
        const result = await eyeDropper.open();
        onChange(result.sRGBHex);
        setColorInput(result.sRGBHex);
        toast({
          title: "Color picked successfully",
          description: `Selected: ${result.sRGBHex}`,
        });
      } catch (err) {
        console.log('Eye dropper cancelled');
      }
    } else {
      toast({
        title: "Eye dropper not supported",
        description: "Your browser doesn't support the eye dropper feature",
        variant: "destructive"
      });
    }
  }, [supportsEyeDropper, onChange, toast]);

  // Draw the color picker canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Create gradient (saturation left-right, lightness top-bottom)
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const saturation = (x / width) * 100;
        const lightness = ((height - y) / height) * 100;
        
        const { r, g, b } = hslToRgb(h, saturation, lightness);
        
        const index = (y * width + x) * 4;
        data[index] = r;
        data[index + 1] = g;
        data[index + 2] = b;
        data[index + 3] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }, [h]);

  // Draw the hue canvas
  useEffect(() => {
    const canvas = hueCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    for (let i = 0; i <= 360; i += 30) {
      gradient.addColorStop(i / 360, `hsl(${i}, 100%, 50%)`);
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }, []);

  const presetColors = [
    '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff',
    '#800000', '#808000', '#008000', '#800080', '#008080', '#000080', '#808080', '#c0c0c0'
  ];

  return (
    <div className="space-y-2">
      {label && <Label className="text-sm font-medium text-gray-700">{label}</Label>}
      
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full h-12 p-2 justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div 
                className="w-8 h-8 rounded border-2 border-gray-200 shadow-sm"
                style={{ backgroundColor: value }}
              />
              <div className="text-left">
                <div className="font-mono text-sm font-medium">{value.toUpperCase()}</div>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-80 p-4" align="start">
          <div className="space-y-4">
            {/* HEX Color Input */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">HEX Color Code</Label>
              <div className="flex space-x-2">
                <Input
                  value={colorInput}
                  onChange={(e) => setColorInput(e.target.value)}
                  onBlur={() => handleColorInput(colorInput)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleColorInput(colorInput);
                    }
                  }}
                  placeholder="#000000"
                  className="font-mono text-sm"
                />
                {supportsEyeDropper && (
                  <Button
                    onClick={startEyeDropper}
                    variant="outline"
                    size="sm"
                    className="px-3"
                  >
                    <Pipette className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <div className="text-xs text-gray-500">
                Paste your color code here or pick from the palette below
              </div>
            </div>

            {/* Color Picker Canvas */}
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium">Saturation & Lightness</Label>
                <canvas
                  ref={canvasRef}
                  width={280}
                  height={160}
                  onClick={handleCanvasClick}
                  className="w-full h-40 border border-gray-300 rounded cursor-crosshair mt-2"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Hue</Label>
                <canvas
                  ref={hueCanvasRef}
                  width={280}
                  height={20}
                  onClick={handleHueCanvasClick}
                  className="w-full h-5 border border-gray-300 rounded cursor-crosshair mt-2"
                />
              </div>
            </div>

            {/* RGB Sliders */}
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium text-red-600">Red</Label>
                  <span className="text-sm font-mono">{r}</span>
                </div>
                <Slider
                  value={[r]}
                  onValueChange={(value) => handleRgbChange('r', value[0])}
                  max={255}
                  step={1}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium text-green-600">Green</Label>
                  <span className="text-sm font-mono">{g}</span>
                </div>
                <Slider
                  value={[g]}
                  onValueChange={(value) => handleRgbChange('g', value[0])}
                  max={255}
                  step={1}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium text-blue-600">Blue</Label>
                  <span className="text-sm font-mono">{b}</span>
                </div>
                <Slider
                  value={[b]}
                  onValueChange={(value) => handleRgbChange('b', value[0])}
                  max={255}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>

            {/* Hue, Saturation, Lightness Sliders */}
            <div className="space-y-3 pt-2 border-t">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Hue</Label>
                  <span className="text-sm font-mono">{Math.round(h)}°</span>
                </div>
                <Slider
                  value={[h]}
                  onValueChange={(value) => handleHueChange(value[0])}
                  max={360}
                  step={1}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Saturation</Label>
                  <span className="text-sm font-mono">{Math.round(s)}%</span>
                </div>
                <Slider
                  value={[s]}
                  onValueChange={(value) => handleSaturationChange(value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Lightness</Label>
                  <span className="text-sm font-mono">{Math.round(l)}%</span>
                </div>
                <Slider
                  value={[l]}
                  onValueChange={(value) => handleLightnessChange(value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>

            {/* Color Presets */}
            <div className="pt-2 border-t">
              <Label className="text-sm font-medium mb-2 block">Quick Colors</Label>
              <div className="grid grid-cols-8 gap-2">
                {presetColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      onChange(color);
                      setColorInput(color);
                    }}
                    className="w-8 h-8 rounded border-2 border-gray-200 hover:border-gray-400 transition-colors"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}