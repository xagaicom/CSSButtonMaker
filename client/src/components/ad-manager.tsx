import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { AdSpace, InsertAdSpace } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2, Edit2, Plus, Eye, EyeOff } from "lucide-react";

const AD_LOCATIONS = [
  { value: "header", label: "Header Banner" },
  { value: "left-sidebar", label: "Left Sidebar" },
  { value: "right-sidebar", label: "Right Sidebar" },
  { value: "css-output", label: "CSS Output Area" },
  { value: "modal", label: "Modal/Popup" },
];

const AD_TYPES = [
  { value: "banner", label: "Banner" },
  { value: "rectangle", label: "Rectangle" },
  { value: "square", label: "Square" },
  { value: "leaderboard", label: "Leaderboard" },
  { value: "interstitial", label: "Interstitial" },
];

const AD_SIZES = [
  { value: "728x90", label: "728x90 (Leaderboard)" },
  { value: "300x250", label: "300x250 (Medium Rectangle)" },
  { value: "320x50", label: "320x50 (Mobile Banner)" },
  { value: "250x250", label: "250x250 (Square)" },
  { value: "970x250", label: "970x250 (Billboard)" },
  { value: "160x600", label: "160x600 (Wide Skyscraper)" },
];

interface AdFormData {
  name: string;
  location: string;
  adType: string;
  adSize: string;
  adCode: string;
  priority: number;
  isActive: boolean;
}

export function AdManager() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<AdSpace | null>(null);
  const [formData, setFormData] = useState<AdFormData>({
    name: "",
    location: "",
    adType: "",
    adSize: "",
    adCode: "",
    priority: 0,
    isActive: true,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: adSpaces = [], isLoading } = useQuery({
    queryKey: ["/api/admin/ad-spaces"],
    retry: false,
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertAdSpace) => apiRequest("POST", "/api/admin/ad-spaces", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/ad-spaces"] });
      queryClient.invalidateQueries({ queryKey: ["/api/ad-spaces"] });
      setIsCreateDialogOpen(false);
      resetForm();
      toast({
        title: "Success",
        description: "Ad space created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create ad space",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsertAdSpace> }) => 
      apiRequest("PUT", `/api/admin/ad-spaces/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/ad-spaces"] });
      queryClient.invalidateQueries({ queryKey: ["/api/ad-spaces"] });
      setEditingAd(null);
      resetForm();
      toast({
        title: "Success",
        description: "Ad space updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update ad space",
        variant: "destructive",
      });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (id: number) => apiRequest("PUT", `/api/admin/ad-spaces/${id}/toggle`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/ad-spaces"] });
      queryClient.invalidateQueries({ queryKey: ["/api/ad-spaces"] });
      toast({
        title: "Success",
        description: "Ad space status updated",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update ad space status",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/ad-spaces/${id}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/ad-spaces"] });
      queryClient.invalidateQueries({ queryKey: ["/api/ad-spaces"] });
      toast({
        title: "Success",
        description: "Ad space deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete ad space",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      location: "",
      adType: "",
      adSize: "",
      adCode: "",
      priority: 0,
      isActive: true,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.location || !formData.adType || !formData.adSize || !formData.adCode) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (editingAd) {
      updateMutation.mutate({ id: editingAd.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (ad: AdSpace) => {
    setEditingAd(ad);
    setFormData({
      name: ad.name,
      location: ad.location,
      adType: ad.adType,
      adSize: ad.adSize,
      adCode: ad.adCode,
      priority: ad.priority,
      isActive: ad.isActive,
    });
    setIsCreateDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsCreateDialogOpen(false);
    setEditingAd(null);
    resetForm();
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Ad Space Management</h2>
          <p className="text-gray-600">Manage Google AdSense placements throughout the application</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Ad Space
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingAd ? "Edit Ad Space" : "Create New Ad Space"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Ad Space Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Header Banner Ad"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Select value={formData.location} onValueChange={(value) => setFormData({ ...formData, location: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {AD_LOCATIONS.map((location) => (
                        <SelectItem key={location.value} value={location.value}>
                          {location.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="adType">Ad Type</Label>
                  <Select value={formData.adType} onValueChange={(value) => setFormData({ ...formData, adType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ad type" />
                    </SelectTrigger>
                    <SelectContent>
                      {AD_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="adSize">Ad Size</Label>
                  <Select value={formData.adSize} onValueChange={(value) => setFormData({ ...formData, adSize: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ad size" />
                    </SelectTrigger>
                    <SelectContent>
                      {AD_SIZES.map((size) => (
                        <SelectItem key={size.value} value={size.value}>
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Input
                    id="priority"
                    type="number"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>
              </div>

              <div>
                <Label htmlFor="adCode">Google AdSense Code</Label>
                <Textarea
                  id="adCode"
                  value={formData.adCode}
                  onChange={(e) => setFormData({ ...formData, adCode: e.target.value })}
                  placeholder="Paste your Google AdSense code here..."
                  rows={6}
                  required
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingAd ? "Update" : "Create"} Ad Space
                </Button>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {adSpaces.map((ad: AdSpace) => (
          <Card key={ad.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-lg">{ad.name}</CardTitle>
                  <Badge variant={ad.isActive ? "default" : "secondary"}>
                    {ad.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <Badge variant="outline">
                    {AD_LOCATIONS.find(l => l.value === ad.location)?.label}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleMutation.mutate(ad.id)}
                    disabled={toggleMutation.isPending}
                  >
                    {ad.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(ad)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteMutation.mutate(ad.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="font-medium text-gray-700">Type & Size</div>
                  <div className="text-gray-600">{ad.adType} ({ad.adSize})</div>
                </div>
                <div>
                  <div className="font-medium text-gray-700">Priority</div>
                  <div className="text-gray-600">{ad.priority}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-700">Created</div>
                  <div className="text-gray-600">
                    {new Date(ad.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              {ad.adCode && (
                <div className="mt-3 p-3 bg-gray-50 rounded text-xs font-mono text-gray-600 truncate">
                  {ad.adCode.substring(0, 100)}...
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {adSpaces.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center">
              <div className="text-gray-500">
                <div className="text-lg font-medium mb-2">No ad spaces configured</div>
                <div className="text-sm">Create your first ad space to start monetizing your application</div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}