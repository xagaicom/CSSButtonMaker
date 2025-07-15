import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown, Pipette } from "lucide-react";

interface SimpleColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

export function SimpleColorPicker({ value, onChange, label }: SimpleColorPickerProps) {
  const [colorInput, setColorInput] = useState(value);
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [previewColor, setPreviewColor] = useState('#000000');
  const [isOpen, setIsOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Update colorInput when value changes
  useEffect(() => {
    setColorInput(value);
  }, [value]);

  const handleColorInput = useCallback((inputValue: string) => {
    const trimmed = inputValue.trim();
    
    // Handle hex colors (with or without #)
    if (trimmed.match(/^#?[0-9a-fA-F]{6}$/)) {
      const hexColor = trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
      onChange(hexColor);
      setIsOpen(false); // Close the popover
      return;
    }
    
    // Handle 3-digit hex colors
    if (trimmed.match(/^#?[0-9a-fA-F]{3}$/)) {
      const cleanHex = trimmed.replace('#', '');
      const expandedHex = `#${cleanHex[0]}${cleanHex[0]}${cleanHex[1]}${cleanHex[1]}${cleanHex[2]}${cleanHex[2]}`;
      onChange(expandedHex);
      setIsOpen(false); // Close the popover
      return;
    }
    
    // Handle RGB format
    const rgbMatch = trimmed.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1]);
      const g = parseInt(rgbMatch[2]);
      const b = parseInt(rgbMatch[3]);
      const hexColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      onChange(hexColor);
      setIsOpen(false); // Close the popover
      return;
    }
    
    // If invalid, revert to current value
    setColorInput(value);
  }, [onChange, value]);

  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const imageData = ctx.getImageData(x, y, 1, 1);
    const [r, g, b] = imageData.data;
    
    const hexColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    onChange(hexColor);
    setColorInput(hexColor);
    setIsOpen(false); // Close the popover after selecting color
  }, [onChange]);

  const handleCanvasMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    setMousePos({ x: event.clientX, y: event.clientY });
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const imageData = ctx.getImageData(x, y, 1, 1);
    const [r, g, b] = imageData.data;
    
    const hexColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    setPreviewColor(hexColor);
  }, []);

  const handleCanvasMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  const handleCanvasMouseLeave = useCallback(() => {
    setIsHovering(false);
  }, []);

  const drawColorPalette = useCallback((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Draw the color palette
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const hue = (x / width) * 360;
        const saturation = 100;
        const lightness = 100 - (y / height) * 100;
        
        ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }, []);

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
            {/* Color Palette */}
            <div className="space-y-2 relative">
              <Label className="text-sm font-medium">Pick a Color</Label>
              <canvas
                ref={(canvas) => {
                  if (canvas) {
                    canvas.width = 300;
                    canvas.height = 200;
                    drawColorPalette(canvas);
                    canvasRef.current = canvas;
                  }
                }}
                onClick={handleCanvasClick}
                onMouseMove={handleCanvasMouseMove}
                onMouseEnter={handleCanvasMouseEnter}
                onMouseLeave={handleCanvasMouseLeave}
                className="w-full h-48 border rounded"
                style={{ 
                  imageRendering: 'pixelated',
                  cursor: `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 3L15 3L15 9L12 12L8 8L5 11L3 9L3 3Z" fill="%23000000" stroke="%23ffffff" stroke-width="1"/>
                      <path d="M12 12L8 16L10 18L14 14L12 12Z" fill="%23000000" stroke="%23ffffff" stroke-width="1"/>
                      <circle cx="10" cy="6" r="1" fill="%23ffffff"/>
                    </svg>
                  `)}"}) 10 10, crosshair`
                }}
              />
              
              {/* Color Preview Window */}
              {isHovering && (
                <div 
                  className="fixed pointer-events-none z-50 bg-white border border-gray-300 rounded shadow-lg p-2"
                  style={{
                    left: mousePos.x + 10,
                    top: mousePos.y - 50,
                    transform: 'translate(0, -100%)'
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-6 h-6 border rounded"
                      style={{ backgroundColor: previewColor }}
                    />
                    <span className="text-xs font-mono">{previewColor}</span>
                  </div>
                </div>
              )}
            </div>

            {/* HEX Input */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">HEX Color Code</Label>
              <Input
                value={colorInput}
                onChange={(e) => {
                  setColorInput(e.target.value);
                  // Apply color immediately as user types if it's a valid hex
                  const trimmed = e.target.value.trim();
                  if (trimmed.match(/^#?[0-9a-fA-F]{6}$/)) {
                    const hexColor = trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
                    onChange(hexColor);
                  }
                }}
                onBlur={() => handleColorInput(colorInput)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleColorInput(colorInput);
                  }
                }}
                placeholder="#000000"
                className="font-mono text-sm"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}