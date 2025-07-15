import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useLocation } from 'wouter';
import { Trash2, Plus, Code, Eye, DollarSign } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdManager } from "@/components/ad-manager";


interface CustomButton {
  id: number;
  name: string;
  cssCode: string;
  htmlCode: string;
  description?: string;
  createdAt: Date;
}

export default function AdminPanel() {
  const [, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newButton, setNewButton] = useState({
    cssCode: "",
    buttonText: "Click Me"
  });
  const [showPreview, setShowPreview] = useState<number | null>(null);

  // Check if admin is authenticated
  const { data: adminStatus, isLoading } = useQuery({
    queryKey: ['/api/admin/status'],
    retry: false,
  });

  useEffect(() => {
    if (adminStatus?.isAuthenticated) {
      setIsAuthenticated(true);
    }
  }, [adminStatus]);

  // Fetch custom buttons
  const { data: customButtons = [], isLoading: buttonsLoading } = useQuery({
    queryKey: ['/api/admin/custom-buttons'],
    enabled: isAuthenticated,
  });

  // Add new button mutation
  const addButtonMutation = useMutation({
    mutationFn: async (buttonData: Omit<CustomButton, 'id' | 'createdAt'>) => {
      const response = await apiRequest('POST', '/api/admin/custom-buttons', buttonData);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/custom-buttons'] });
      setNewButton({ cssCode: "", buttonText: "Click Me" });
      toast({
        title: "Success",
        description: "Custom button added successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add custom button",
        variant: "destructive",
      });
    },
  });

  // Delete button mutation
  const deleteButtonMutation = useMutation({
    mutationFn: async (buttonId: number) => {
      const response = await apiRequest('DELETE', `/api/admin/custom-buttons/${buttonId}`);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/custom-buttons'] });
      toast({
        title: "Success", 
        description: "Custom button deleted successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete custom button",
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Logout failed');
      }
      return response.json();
    },
    onSuccess: () => {
      setIsAuthenticated(false);
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
      setLocation('/admin-login');
    },
  });

  const handleAddButton = () => {
    if (!newButton.buttonText || !newButton.cssCode) {
      toast({
        title: "Error",
        description: "Please fill in button text and CSS code",
        variant: "destructive",
      });
      return;
    }
    
    // Extract the first CSS class name from the CSS code
    const cssClassMatch = newButton.cssCode.match(/\.([a-zA-Z_-][a-zA-Z0-9_-]*)/);
    const cssClassName = cssClassMatch ? cssClassMatch[1] : 'custom-btn';
    
    // Create button data with auto-generated name and HTML using the extracted class name
    const buttonData = {
      name: `${newButton.buttonText} Button`,
      cssCode: newButton.cssCode,
      htmlCode: `<button class="${cssClassName}">${newButton.buttonText}</button>`,
      description: `Custom button with text: ${newButton.buttonText}`
    };
    
    addButtonMutation.mutate(buttonData);
  };

  const handleDeleteButton = (buttonId: number) => {
    deleteButtonMutation.mutate(buttonId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p>You need to be logged in as an admin to access this panel.</p>
            <Button onClick={() => setLocation('/admin-login')}>
              Go to Admin Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
            <p className="text-gray-600">Manage custom CSS buttons for the CSS Button Maker</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          >
            {logoutMutation.isPending ? "Logging out..." : "Logout"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add New Button Form */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add New Custom Button
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="buttonText">Button Text *</Label>
                <Input
                  id="buttonText"
                  value={newButton.buttonText}
                  onChange={(e) => setNewButton({...newButton, buttonText: e.target.value})}
                  placeholder="Click Me"
                />
              </div>

              <div>
                <Label htmlFor="cssCode">CSS Code *</Label>
                <Textarea
                  id="cssCode"
                  value={newButton.cssCode}
                  onChange={(e) => setNewButton({...newButton, cssCode: e.target.value})}
                  placeholder="Only CSS code (no HTML)&#10;&#10;Example:&#10;.custom-btn {&#10;  background: linear-gradient(45deg, #ff6b6b, #ee5a52);&#10;  color: white;&#10;  border: none;&#10;  padding: 12px 24px;&#10;  border-radius: 8px;&#10;  cursor: pointer;&#10;  font-weight: 500;&#10;  transition: all 0.3s ease;&#10;}&#10;.custom-btn:hover {&#10;  transform: scale(1.05);&#10;}"
                  className="font-mono text-sm"
                  rows={8}
                />
              </div>

              <Button 
                onClick={handleAddButton}
                disabled={addButtonMutation.isPending}
                className="w-full"
              >
                {addButtonMutation.isPending ? "Adding..." : "Add Custom Button"}
              </Button>
            </CardContent>
          </Card>

          {/* Live Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 min-h-[200px] flex items-center justify-center">
                  {newButton.buttonText && newButton.cssCode ? (
                    <div 
                      className="flex items-center justify-center"
                      dangerouslySetInnerHTML={{
                        __html: `
                          <style>
                            ${newButton.cssCode.replace(/\.[\w-]+/g, '.custom-btn-preview')}
                          </style>
                          <button class="custom-btn-preview">${newButton.buttonText}</button>
                        `
                      }}
                    />
                  ) : (
                    <div className="text-center text-gray-500">
                      <Eye className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Enter button text and CSS to see preview</p>
                    </div>
                  )}
                </div>
                
                <div className="text-xs text-gray-600 space-y-1">
                  <p><strong>Instructions:</strong></p>
                  <p>• Only paste CSS code (no HTML)</p>
                  <p>• Use any class name (will be auto-converted)</p>
                  <p>• Include :hover and :active for effects</p>
                  <p>• System uses your button text automatically</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Custom Buttons List */}
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                Custom Buttons ({customButtons.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {buttonsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading buttons...</p>
                </div>
              ) : customButtons.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No custom buttons yet. Add your first one!
                </div>
              ) : (
                <div className="space-y-4">
                  {customButtons.map((button: CustomButton) => (
                    <div key={button.id} className="border rounded-lg p-4 bg-white">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{button.name}</h3>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowPreview(showPreview === button.id ? null : button.id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteButton(button.id)}
                            disabled={deleteButtonMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {button.description && (
                        <p className="text-sm text-gray-600 mb-2">{button.description}</p>
                      )}
                      
                      <p className="text-xs text-gray-500">
                        Created: {new Date(button.createdAt).toLocaleDateString()}
                      </p>

                      {showPreview === button.id && (
                        <div className="mt-4 p-4 bg-gray-50 rounded border">
                          <h4 className="font-medium mb-2">Preview:</h4>
                          <div 
                            className="mb-4 p-4 bg-white rounded border flex items-center justify-center min-h-[80px]"
                            dangerouslySetInnerHTML={{
                              __html: `
                                <style>${button.cssCode}</style>
                                ${button.htmlCode}
                              `
                            }}
                          />
                          <details className="text-sm">
                            <summary className="cursor-pointer font-medium">View Code</summary>
                            <div className="mt-2 space-y-2">
                              <div>
                                <strong>HTML:</strong>
                                <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                                  {button.htmlCode}
                                </pre>
                              </div>
                              <div>
                                <strong>CSS:</strong>
                                <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                                  {button.cssCode}
                                </pre>
                              </div>
                            </div>
                          </details>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Ad Management Tab */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <DollarSign className="w-6 h-6" />
            Google AdSense Management
          </h2>
          <AdManager />
        </div>

        {/* App Settings Management */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            🔧 App Settings
          </h2>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            
            // Save all form data
            const updates = [
              { key: 'app_logo_url', value: (document.getElementById('logoUrl') as HTMLInputElement)?.value || '', description: 'Application logo URL' },
              { key: 'app_logo_width', value: (document.getElementById('logoWidth') as HTMLInputElement)?.value || '48', description: 'Logo width in pixels' },
              { key: 'app_logo_height', value: (document.getElementById('logoHeight') as HTMLInputElement)?.value || '48', description: 'Logo height in pixels' },
              { key: 'app_name', value: (document.getElementById('appName') as HTMLInputElement)?.value || '', description: 'Application name' },
              { key: 'app_tagline', value: (document.getElementById('appTagline') as HTMLInputElement)?.value || '', description: 'Application tagline' }
            ];
            
            try {
              for (const update of updates) {
                if (update.value) {
                  await fetch('/api/admin/app-settings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(update)
                  });
                }
              }
              toast({
                title: "Settings Saved",
                description: "All app settings have been updated successfully",
              });
            } catch (error) {
              toast({
                title: "Error",
                description: "Failed to save settings. Please try again.",
                variant: "destructive"
              });
            }
          }}>
            <div className="space-y-6">
              {/* Logo Upload Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="logoFile">Upload Logo File</Label>
                  <Input
                    id="logoFile"
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // Check file size (limit to 2MB)
                        if (file.size > 2 * 1024 * 1024) {
                          toast({
                            title: "File Too Large",
                            description: "Please select an image smaller than 2MB",
                            variant: "destructive"
                          });
                          return;
                        }
                        
                        // Convert to base64 and save
                        const reader = new FileReader();
                        reader.onload = async (e) => {
                          const dataUrl = e.target?.result as string;
                          try {
                            await fetch('/api/admin/app-settings', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                key: 'app_logo_url',
                                value: dataUrl,
                                description: 'Application logo (uploaded file)'
                              })
                            });
                            toast({
                              title: "Logo Uploaded",
                              description: "Logo has been updated successfully",
                            });
                          } catch (error) {
                            toast({
                              title: "Upload Failed",
                              description: "Failed to upload logo. Please try again.",
                              variant: "destructive"
                            });
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="cursor-pointer"
                  />
                </div>
                <div>
                  <Label htmlFor="logoUrl">Or Logo URL</Label>
                  <Input
                    id="logoUrl"
                    name="logoUrl"
                    placeholder="https://example.com/logo.png"
                  />
                </div>
              </div>

              {/* Logo Size Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="logoWidth">Logo Width (px)</Label>
                  <Input
                    id="logoWidth"
                    name="logoWidth"
                    type="number"
                    placeholder="48"
                    min="20"
                    max="200"
                    defaultValue="48"
                  />
                </div>
                <div>
                  <Label htmlFor="logoHeight">Logo Height (px)</Label>
                  <Input
                    id="logoHeight"
                    name="logoHeight"
                    type="number"
                    placeholder="48"
                    min="20"
                    max="200"
                    defaultValue="48"
                  />
                </div>
              </div>

              {/* App Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="appName">App Name</Label>
                  <Input
                    id="appName"
                    name="appName"
                    placeholder="CSS Button Maker"
                  />
                </div>
                <div>
                  <Label htmlFor="appTagline">App Tagline</Label>
                  <Input
                    id="appTagline"
                    name="appTagline"
                    placeholder="Create beautiful CSS buttons"
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Save App Settings
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}