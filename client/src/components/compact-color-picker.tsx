import { useState, useCallback, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

interface CompactColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

export function CompactColorPicker({ value, onChange, label }: CompactColorPickerProps) {
  const [colorMode, setColorMode] = useState<'RGB' | 'HSL' | 'HEX'>('RGB');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hueCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // Parse current color to RGB
  const parseColor = useCallback((color: string) => {
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      const r = parseInt(hex.slice(0, 2), 16) || 0;
      const g = parseInt(hex.slice(2, 4), 16) || 0;
      const b = parseInt(hex.slice(4, 6), 16) || 0;
      return { r, g, b };
    }
    return { r: 255, g: 255, b: 255 };
  }, []);

  const rgbToHex = (r: number, g: number, b: number) => {
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const hslToRgb = (h: number, s: number, l: number) => {
    s /= 100;
    l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c/2;
    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }

    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255)
    };
  };

  const { r, g, b } = parseColor(value);
  const { h, s, l } = rgbToHsl(r, g, b);

  const handleRgbChange = (component: 'r' | 'g' | 'b', newValue: number) => {
    const newColor = { r, g, b };
    newColor[component] = newValue;
    onChange(rgbToHex(newColor.r, newColor.g, newColor.b));
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const saturation = (x / canvas.width) * 100;
    const lightness = 100 - (y / canvas.height) * 100;
    
    const { r, g, b } = hslToRgb(h, saturation, lightness);
    onChange(rgbToHex(r, g, b));
  };

  const handleHueCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = hueCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const hue = (x / canvas.width) * 360;
    
    const { r, g, b } = hslToRgb(hue, s, l);
    onChange(rgbToHex(r, g, b));
  };

  return (
    <div className="space-y-3">
      {label && <h3 className="text-sm font-semibold text-gray-900">{label}</h3>}
      
      {/* Main Color Picker Area */}
      <div className="space-y-3">
        {/* Color Saturation/Lightness Picker */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={280}
            height={150}
            onClick={handleCanvasClick}
            className="w-full h-32 rounded-lg border-2 border-gray-300 cursor-crosshair"
            style={{
              background: `linear-gradient(to right, white, hsl(${h}, 100%, 50%)), 
                          linear-gradient(to top, black, transparent)`
            }}
          />
          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded px-2 py-1 text-xs font-medium">
            {value.toUpperCase()}
          </div>
        </div>

        {/* Hue Picker */}
        <canvas
          ref={hueCanvasRef}
          width={280}
          height={20}
          onClick={handleHueCanvasClick}
          className="w-full h-5 rounded border border-gray-300 cursor-crosshair"
          style={{
            background: `linear-gradient(to right, 
              hsl(0, 100%, 50%) 0%,
              hsl(60, 100%, 50%) 17%,
              hsl(120, 100%, 50%) 33%,
              hsl(180, 100%, 50%) 50%,
              hsl(240, 100%, 50%) 67%,
              hsl(300, 100%, 50%) 83%,
              hsl(360, 100%, 50%) 100%
            )`
          }}
        />
      </div>

      {/* Color Mode Selector and Hex Input */}
      <div className="flex items-center space-x-2">
        <Select value={colorMode} onValueChange={(mode: 'RGB' | 'HSL' | 'HEX') => setColorMode(mode)}>
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="RGB">RGB</SelectItem>
            <SelectItem value="HSL">HSL</SelectItem>
            <SelectItem value="HEX">HEX</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="font-mono text-sm"
          placeholder="#000000"
        />
      </div>

      {/* RGB Sliders */}
      {colorMode === 'RGB' && (
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-red-600">Red</span>
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
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-600">Green</span>
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
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-600">Blue</span>
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
      )}
    </div>
  );
}