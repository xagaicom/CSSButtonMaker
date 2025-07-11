import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { AppSetting, InsertAppSetting } from "@shared/schema";

export function AppSettingsManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newSetting, setNewSetting] = useState<InsertAppSetting>({
    key: "",
    value: "",
    description: "",
  });

  // Fetch all app settings
  const { data: settings = [], isLoading } = useQuery({
    queryKey: ["/api/app-settings"],
    retry: false,
  });

  // Create/update setting mutation
  const saveMutation = useMutation({
    mutationFn: (data: InsertAppSetting) => apiRequest("POST", "/api/admin/app-settings", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/app-settings"] });
      setNewSetting({ key: "", value: "", description: "" });
      toast({
        title: "Success",
        description: "App setting saved successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save app setting",
        variant: "destructive",
      });
    },
  });

  // Delete setting mutation
  const deleteMutation = useMutation({
    mutationFn: (key: string) => apiRequest("DELETE", `/api/admin/app-settings/${key}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/app-settings"] });
      toast({
        title: "Success",
        description: "App setting deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete app setting",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    if (!newSetting.key || !newSetting.value) {
      toast({
        title: "Error",
        description: "Key and value are required",
        variant: "destructive",
      });
      return;
    }
    saveMutation.mutate(newSetting);
  };

  const handleEdit = (setting: AppSetting) => {
    setNewSetting({
      key: setting.key,
      value: setting.value || "",
      description: setting.description || "",
    });
  };

  if (isLoading) {
    return <div className="p-6">Loading app settings...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🔧 App Settings Manager
          </CardTitle>
          <CardDescription>
            Manage application settings like logo, name, and other configurations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="key">Setting Key</Label>
              <Input
                id="key"
                value={newSetting.key}
                onChange={(e) => setNewSetting({ ...newSetting, key: e.target.value })}
                placeholder="e.g., app_logo_url"
              />
            </div>
            <div>
              <Label htmlFor="value">Setting Value</Label>
              <Input
                id="value"
                value={newSetting.value}
                onChange={(e) => setNewSetting({ ...newSetting, value: e.target.value })}
                placeholder="e.g., https://example.com/logo.png"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newSetting.description}
                onChange={(e) => setNewSetting({ ...newSetting, description: e.target.value })}
                placeholder="Description of this setting"
              />
            </div>
          </div>
          <Button onClick={handleSave} disabled={saveMutation.isPending}>
            {saveMutation.isPending ? "Saving..." : "Save Setting"}
          </Button>
        </CardContent>
      </Card>

      {/* Current Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Current Settings</CardTitle>
          <CardDescription>
            Manage existing application settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {settings.map((setting: AppSetting) => (
              <div key={setting.key} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{setting.key}</h3>
                    <p className="text-sm text-gray-600 mb-2">{setting.description}</p>
                    <div className="bg-gray-50 p-2 rounded text-sm font-mono break-all">
                      {setting.value}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(setting)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteMutation.mutate(setting.key)}
                      disabled={deleteMutation.isPending}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Settings for Logo */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Logo Update</CardTitle>
          <CardDescription>
            Update the app logo quickly
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="logoUrl">Logo URL</Label>
            <Input
              id="logoUrl"
              placeholder="https://example.com/logo.png"
              onBlur={(e) => {
                if (e.target.value) {
                  saveMutation.mutate({
                    key: "app_logo_url",
                    value: e.target.value,
                    description: "URL for the application logo displayed in the header",
                  });
                }
              }}
            />
          </div>
          <div>
            <Label htmlFor="appName">App Name</Label>
            <Input
              id="appName"
              placeholder="CSS Button Maker"
              onBlur={(e) => {
                if (e.target.value) {
                  saveMutation.mutate({
                    key: "app_name",
                    value: e.target.value,
                    description: "The name of the application displayed in the header",
                  });
                }
              }}
            />
          </div>
          <div>
            <Label htmlFor="appTagline">App Tagline</Label>
            <Textarea
              id="appTagline"
              placeholder="Create beautiful CSS buttons with live preview and code generation"
              onBlur={(e) => {
                if (e.target.value) {
                  saveMutation.mutate({
                    key: "app_tagline",
                    value: e.target.value,
                    description: "The tagline displayed under the app name",
                  });
                }
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}