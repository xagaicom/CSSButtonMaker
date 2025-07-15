import { useState, useCallback, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Pipette, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EyedropperColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

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

export function EyedropperColorPicker({ value, onChange, label }: EyedropperColorPickerProps) {
  const [isPickingColor, setIsPickingColor] = useState(false);
  const [supportsEyeDropper, setSupportsEyeDropper] = useState(false);
  const [colorMode, setColorMode] = useState<'RGB' | 'HSL' | 'HEX'>('RGB');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hueCanvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if the browser supports the EyeDropper API
    setSupportsEyeDropper('EyeDropper' in window);
  }, []);

  const startColorPicking = useCallback(async () => {
    if (supportsEyeDropper && window.EyeDropper) {
      try {
        const eyeDropper = new window.EyeDropper();
        const result = await eyeDropper.open();
        onChange(result.sRGBHex);
        toast({
          title: "Color picked!",
          description: `Selected color: ${result.sRGBHex}`,
        });
      } catch (err) {
        // User cancelled the operation
        console.log('Color picking cancelled');
      }
    } else {
      // Fallback: Use screen capture method
      startScreenCapture();
    }
  }, [supportsEyeDropper, onChange, toast]);

  const startScreenCapture = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          mediaSource: 'screen',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });

      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      video.onloadedmetadata = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        ctx?.drawImage(video, 0, 0);
        
        // Stop the stream
        stream.getTracks().forEach(track => track.stop());
        
        // Create a temporary canvas for color picking
        const tempCanvas = canvasRef.current;
        if (tempCanvas) {
          const tempCtx = tempCanvas.getContext('2d');
          tempCanvas.width = canvas.width;
          tempCanvas.height = canvas.height;
          tempCtx?.drawImage(canvas, 0, 0);
          
          setIsPickingColor(true);
          
          toast({
            title: "Click to pick color",
            description: "Click anywhere on the captured screen to pick a color",
          });
        }
      };
    } catch (err) {
      toast({
        title: "Screen capture not supported",
        description: "Your browser doesn't support screen capture. Try using the manual color input.",
        variant: "destructive"
      });
    }
  }, [toast]);

  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !isPickingColor) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) * (canvas.width / rect.width));
    const y = Math.floor((event.clientY - rect.top) * (canvas.height / rect.height));

    const ctx = canvas.getContext('2d');
    if (ctx) {
      const imageData = ctx.getImageData(x, y, 1, 1);
      const [r, g, b] = imageData.data;
      
      const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      onChange(hex);
      setIsPickingColor(false);
      
      toast({
        title: "Color picked!",
        description: `Selected color: ${hex}`,
      });
    }
  }, [isPickingColor, onChange, toast]);

  const copyColorToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast({
        title: "Copied!",
        description: `Color ${value} copied to clipboard`,
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Could not copy color to clipboard",
        variant: "destructive"
      });
    }
  }, [value, toast]);

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

  const handleRgbChange = (component: 'r' | 'g' | 'b', newValue: number) => {
    const newColor = { r, g, b };
    newColor[component] = newValue;
    onChange(rgbToHex(newColor.r, newColor.g, newColor.b));
  };

  const handleColorPickerCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
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

  const { r, g, b } = parseColor(value);
  const { h, s, l } = rgbToHsl(r, g, b);

  return (
    <div className="space-y-4">
      {label && <h3 className="text-sm font-semibold text-gray-900">{label}</h3>}
      
      {/* Color Display and Eyedropper */}
      <div className="space-y-3">
        {/* Color Preview and Eyedropper */}
        <div className="flex items-center space-x-3">
          <div 
            className="w-16 h-16 rounded-lg border-2 border-gray-300 shadow-sm"
            style={{ backgroundColor: value }}
          />
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="font-mono text-sm"
                placeholder="#000000"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={copyColorToClipboard}
                className="px-3"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              RGB({r}, {g}, {b})
            </div>
          </div>
        </div>

        {/* Eyedropper Button */}
        <Button
          onClick={startColorPicking}
          className="w-full"
          variant="outline"
          disabled={isPickingColor}
        >
          <Pipette className="w-4 h-4 mr-2" />
          {supportsEyeDropper 
            ? 'Pick Color from Screen' 
            : 'Capture Screen & Pick Color'
          }
        </Button>
      </div>

      {/* Main Color Picker Area */}
      <div className="space-y-3">
        {/* Color Saturation/Lightness Picker */}
        <div className="relative">
          <canvas
            width={280}
            height={150}
            onClick={handleColorPickerCanvasClick}
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

      {/* Color Mode Selector */}
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

      {/* Screen Capture Canvas (hidden unless picking) */}
      {isPickingColor && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg max-w-4xl max-h-4xl overflow-auto">
            <div className="mb-4 text-center">
              <h3 className="text-lg font-semibold">Click to pick a color</h3>
              <p className="text-sm text-gray-600">Click anywhere on the image to select that color</p>
              <Button
                onClick={() => setIsPickingColor(false)}
                variant="outline"
                size="sm"
                className="mt-2"
              >
                Cancel
              </Button>
            </div>
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              className="max-w-full max-h-96 cursor-crosshair border rounded"
            />
          </div>
        </div>
      )}

      {/* Quick Color Swatches */}
      <div className="grid grid-cols-8 gap-2">
        {[
          '#000000', '#ffffff', '#ff0000', '#00ff00', 
          '#0000ff', '#ffff00', '#ff00ff', '#00ffff',
          '#808080', '#800000', '#008000', '#000080',
          '#808000', '#800080', '#008080', '#c0c0c0'
        ].map((color) => (
          <button
            key={color}
            onClick={() => onChange(color)}
            className="w-8 h-8 rounded border-2 border-gray-300 hover:border-gray-400 transition-colors"
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
    </div>
  );
}