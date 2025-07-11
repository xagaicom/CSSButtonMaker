import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return hex;
  
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  
  return `rgb(${r}, ${g}, ${b})`;
}

export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  const { toast } = useToast();
  const rgbValue = hexToRgb(value);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${text} copied to clipboard`,
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      <div className="relative">
        <div 
          className="h-10 w-full rounded-lg border border-gray-300 cursor-pointer p-1 bg-white relative overflow-hidden"
          onClick={() => document.getElementById(`color-${label}`)?.click()}
        >
          <div 
            className="w-full h-full rounded"
            style={{ backgroundColor: value }}
          />
          <input
            id={`color-${label}`}
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>
      <div className="flex items-center justify-between bg-gray-50 p-2 rounded text-xs">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">HEX:</span>
            <span className="font-mono">{value}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0"
              onClick={() => copyToClipboard(value)}
            >
              <Copy className="w-3 h-3" />
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">RGB:</span>
            <span className="font-mono">{rgbValue}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0"
              onClick={() => copyToClipboard(rgbValue)}
            >
              <Copy className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
