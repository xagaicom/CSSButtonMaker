import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Save, Trash2, Download, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { ButtonDesign, InsertButtonDesign } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";

interface SavedDesignsProps {
  currentDesign: any;
  onLoadDesign: (design: any) => void;
}

export function SavedDesigns({ currentDesign, onLoadDesign }: SavedDesignsProps) {
  const [saveName, setSaveName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  const { data: designs = [], isLoading } = useQuery({
    queryKey: ["/api/designs"],
    select: (data: ButtonDesign[]) => data,
    enabled: isAuthenticated,
  });

  const saveDesignMutation = useMutation({
    mutationFn: async (designData: InsertButtonDesign) => {
      const response = await fetch("/api/designs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(designData),
      });
      if (!response.ok) throw new Error("Failed to save design");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/designs"] });
      setIsDialogOpen(false);
      setSaveName("");
      toast({
        title: "Design Saved!",
        description: "Your button design has been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Save Failed",
        description: "Failed to save the design. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteDesignMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/designs/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete design");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/designs"] });
      toast({
        title: "Design Deleted",
        description: "The design has been removed from your saved designs.",
      });
    },
    onError: () => {
      toast({
        title: "Delete Failed",
        description: "Failed to delete the design. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSaveDesign = () => {
    if (!saveName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a name for your design.",
        variant: "destructive",
      });
      return;
    }

    const designData: InsertButtonDesign = {
      name: saveName.trim(),
      text: currentDesign.text,
      fontSize: currentDesign.fontSize,
      fontWeight: currentDesign.fontWeight,
      borderStartColor: currentDesign.borderStartColor,
      borderEndColor: currentDesign.borderEndColor,
      borderDirection: currentDesign.borderDirection,
      textStartColor: currentDesign.textStartColor,
      textEndColor: currentDesign.textEndColor,
      textDirection: currentDesign.textDirection,
      backgroundStartColor: currentDesign.backgroundStartColor,
      backgroundEndColor: currentDesign.backgroundEndColor,
      backgroundDirection: currentDesign.backgroundDirection,
      paddingX: currentDesign.paddingX,
      paddingY: currentDesign.paddingY,
      borderRadius: currentDesign.borderRadius,
      borderWidth: currentDesign.borderWidth,
      enable3D: currentDesign.enable3D,
      shadowIntensity: currentDesign.shadowIntensity,
      width: currentDesign.width,
      height: currentDesign.height,
      transparentBackground: currentDesign.transparentBackground,
      enableTextShadow: currentDesign.enableTextShadow || false,
      textShadowColor: currentDesign.textShadowColor || "#000000",
      textShadowX: currentDesign.textShadowX || 0,
      textShadowY: currentDesign.textShadowY || 0,
      textShadowBlur: currentDesign.textShadowBlur || 0,
      enableBoxShadow: currentDesign.enableBoxShadow || false,
      boxShadowColor: currentDesign.boxShadowColor || "#000000",
      boxShadowX: currentDesign.boxShadowX || 0,
      boxShadowY: currentDesign.boxShadowY || 0,
      boxShadowBlur: currentDesign.boxShadowBlur || 0,
      boxShadowSpread: currentDesign.boxShadowSpread || 0,
      boxShadowInset: currentDesign.boxShadowInset || false,
      borderStyle: currentDesign.borderStyle || "solid",
    };

    saveDesignMutation.mutate(designData);
  };

  const handleLoadDesign = (design: ButtonDesign) => {
    onLoadDesign({
      text: design.text,
      fontSize: design.fontSize,
      fontWeight: design.fontWeight,
      borderStartColor: design.borderStartColor,
      borderEndColor: design.borderEndColor,
      borderDirection: design.borderDirection,
      textStartColor: design.textStartColor,
      textEndColor: design.textEndColor,
      textDirection: design.textDirection,
      backgroundStartColor: design.backgroundStartColor,
      backgroundEndColor: design.backgroundEndColor,
      backgroundDirection: design.backgroundDirection,
      paddingX: design.paddingX,
      paddingY: design.paddingY,
      borderRadius: design.borderRadius,
      borderWidth: design.borderWidth,
      enable3D: design.enable3D,
      shadowIntensity: design.shadowIntensity,
      width: design.width,
      height: design.height,
      transparentBackground: design.transparentBackground,
    });

    toast({
      title: "Design Loaded",
      description: `"${design.name}" has been loaded into the editor.`,
    });
  };

  const handleCopyDesign = (design: ButtonDesign) => {
    const copyName = `${design.name} (Copy)`;
    
    const designData: InsertButtonDesign = {
      name: copyName,
      text: design.text,
      fontSize: design.fontSize,
      fontWeight: design.fontWeight,
      borderStartColor: design.borderStartColor,
      borderEndColor: design.borderEndColor,
      borderDirection: design.borderDirection,
      textStartColor: design.textStartColor,
      textEndColor: design.textEndColor,
      textDirection: design.textDirection,
      backgroundStartColor: design.backgroundStartColor,
      backgroundEndColor: design.backgroundEndColor,
      backgroundDirection: design.backgroundDirection,
      paddingX: design.paddingX,
      paddingY: design.paddingY,
      borderRadius: design.borderRadius,
      borderWidth: design.borderWidth,
      enable3D: design.enable3D,
      shadowIntensity: design.shadowIntensity,
      width: design.width,
      height: design.height,
      transparentBackground: design.transparentBackground,
    };

    saveDesignMutation.mutate(designData);
    
    toast({
      title: "Design Copied",
      description: `Created a copy: "${copyName}"`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Saved Designs</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                size="sm" 
                className="flex items-center space-x-2"
                onClick={() => {
                  if (!isAuthenticated) {
                    toast({
                      title: "Login Required",
                      description: "Please log in to save your designs.",
                      variant: "destructive",
                    });
                    setTimeout(() => {
                      window.location.href = "/api/login";
                    }, 1000);
                    return;
                  }
                }}
              >
                <Save className="w-4 h-4" />
                <span>Save Current</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save Design</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="design-name">Design Name</Label>
                  <Input
                    id="design-name"
                    value={saveName}
                    onChange={(e) => setSaveName(e.target.value)}
                    placeholder="Enter a name for your design"
                    className="mt-2"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveDesign} disabled={saveDesignMutation.isPending}>
                    {saveDesignMutation.isPending ? "Saving..." : "Save Design"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4 text-gray-500">Loading designs...</div>
        ) : designs.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No saved designs yet. Create and save your first design!
          </div>
        ) : (
          <div className="space-y-3">
            {designs.map((design) => (
              <div
                key={design.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{design.name}</h3>
                  <p className="text-sm text-gray-500">
                    {design.text} • {new Date(design.createdAt!).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleLoadDesign(design)}
                    className="flex items-center space-x-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>Load</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyDesign(design)}
                    disabled={saveDesignMutation.isPending}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteDesignMutation.mutate(design.id)}
                    disabled={deleteDesignMutation.isPending}
                    className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}