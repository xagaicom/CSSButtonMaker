import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Copy, Search, User, Calendar, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { GradientButton } from "@/components/gradient-button";
import { CSSOutput } from "@/components/css-output";
import type { ButtonDesign } from "@shared/schema";
// CSS Logo placeholder - using CSS icon instead

export default function ButtonGallery() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDesign, setSelectedDesign] = useState<ButtonDesign | null>(null);
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to view the gallery.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 1000);
      return;
    }
  }, [isAuthenticated, authLoading, toast]);

  const { data: designs = [], isLoading: designsLoading } = useQuery({
    queryKey: ["/api/gallery"],
    select: (data) => data as ButtonDesign[],
  });

  const filteredDesigns = designs.filter(design =>
    design.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopyCode = (design: ButtonDesign) => {
    const css = generateCSS(design);
    navigator.clipboard.writeText(css);
    toast({
      title: "CSS Copied!",
      description: "The CSS code has been copied to your clipboard.",
    });
  };

  const generateCSS = (design: ButtonDesign) => {
    const borderGradient = `linear-gradient(${design.borderDirection}, ${design.borderStartColor}, ${design.borderEndColor})`;
    const textGradient = `linear-gradient(${design.textDirection}, ${design.textStartColor}, ${design.textEndColor})`;
    const backgroundGradient = design.transparentBackground 
      ? 'transparent' 
      : `linear-gradient(${design.backgroundDirection}, ${design.backgroundStartColor}, ${design.backgroundEndColor})`;

    let boxShadow = '';
    if (design.enableBoxShadow) {
      const insetPrefix = design.boxShadowInset ? 'inset ' : '';
      boxShadow = `${insetPrefix}${design.boxShadowX || 0}px ${design.boxShadowY || 0}px ${design.boxShadowBlur || 0}px ${design.boxShadowSpread || 0}px ${design.boxShadowColor || '#000000'}`;
    }

    let textShadow = '';
    if (design.enableTextShadow) {
      textShadow = `${design.textShadowX || 0}px ${design.textShadowY || 0}px ${design.textShadowBlur || 0}px ${design.textShadowColor || '#000000'}`;
    }

    return `.button {
  font-size: ${design.fontSize}px;
  font-weight: ${design.fontWeight};
  padding: ${design.paddingY}px ${design.paddingX}px;
  border-radius: ${design.borderRadius}px;
  border: ${design.borderWidth}px ${design.borderStyle || 'solid'} transparent;
  background: ${backgroundGradient};
  background-clip: padding-box;
  background-image: ${borderGradient};
  background-origin: border-box;
  color: transparent;
  background-clip: text;
  -webkit-background-clip: text;
  background-image: ${textGradient};
  width: ${design.width}px;
  height: ${design.height}px;
  cursor: pointer;
  transition: all 0.3s ease;${boxShadow ? `\n  box-shadow: ${boxShadow};` : ''}${textShadow ? `\n  text-shadow: ${textShadow};` : ''}${design.enable3D ? `\n  transform: perspective(1000px);` : ''}
}

.button:hover {
  transform: ${design.enable3D ? 'perspective(1000px) rotateX(5deg) scale(1.05)' : 'scale(1.05)'};
}`;
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Unknown';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (designsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading button gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-48 h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                CSS
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Button Gallery</h1>
                <p className="text-sm text-gray-600 mt-1">Browse and copy CSS from the latest 100 button designs</p>
              </div>
            </div>
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/'}
            >
              Back to Designer
            </Button>
          </div>
          
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search designs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {filteredDesigns.length === 0 ? (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No designs found</h3>
            <p className="text-gray-600">
              {searchTerm ? "Try adjusting your search terms." : "No button designs have been created yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDesigns.map((design) => (
              <Card key={design.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium truncate">{design.name}</CardTitle>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopyCode(design)}
                      className="h-8 w-8 p-0"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 space-x-2">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(design.createdAt)}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 rounded-lg p-6 flex items-center justify-center mb-3">
                    <GradientButton
                      text={design.text}
                      fontSize={Math.min(design.fontSize, 14)}
                      fontWeight={design.fontWeight}
                      borderStartColor={design.borderStartColor}
                      borderEndColor={design.borderEndColor}
                      borderDirection={design.borderDirection}
                      textStartColor={design.textStartColor}
                      textEndColor={design.textEndColor}
                      textDirection={design.textDirection}
                      backgroundStartColor={design.backgroundStartColor}
                      backgroundEndColor={design.backgroundEndColor}
                      backgroundDirection={design.backgroundDirection}
                      paddingX={Math.min(design.paddingX, 20)}
                      paddingY={Math.min(design.paddingY, 12)}
                      borderRadius={design.borderRadius}
                      borderWidth={design.borderWidth}
                      enable3D={false}
                      shadowIntensity={design.shadowIntensity}
                      width={Math.min(design.width, 120)}
                      height={Math.min(design.height, 40)}
                      transparentBackground={design.transparentBackground}
                      enableTextShadow={design.enableTextShadow || false}
                      textShadowColor={design.textShadowColor || "#000000"}
                      textShadowX={design.textShadowX || 0}
                      textShadowY={design.textShadowY || 0}
                      textShadowBlur={design.textShadowBlur || 0}
                      enableBoxShadow={design.enableBoxShadow || false}
                      boxShadowColor={design.boxShadowColor || "#000000"}
                      boxShadowX={design.boxShadowX || 0}
                      boxShadowY={design.boxShadowY || 0}
                      boxShadowBlur={design.boxShadowBlur || 0}
                      boxShadowSpread={design.boxShadowSpread || 0}
                      boxShadowInset={design.boxShadowInset || false}
                      borderStyle={design.borderStyle || "solid"}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedDesign(design)}
                      className="text-xs"
                    >
                      View CSS
                    </Button>
                    <div className="flex space-x-1">
                      {design.enable3D && <Badge variant="secondary" className="text-xs">3D</Badge>}
                      {design.transparentBackground && <Badge variant="secondary" className="text-xs">Transparent</Badge>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* CSS Modal */}
      {selectedDesign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{selectedDesign.name} - CSS Code</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedDesign(null)}
                >
                  ✕
                </Button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto">
              <CSSOutput css={generateCSS(selectedDesign)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}