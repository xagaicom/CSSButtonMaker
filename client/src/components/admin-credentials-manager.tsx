import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  User, 
  Key, 
  Shield, 
  Save, 
  AlertCircle,
  Eye,
  EyeOff
} from "lucide-react";
import { AnimatedCard } from "./animated-card";

interface AdminProfile {
  id: string;
  username: string;
  email?: string;
}

export function AdminCredentialsManager() {
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch admin profile
  const { data: adminProfile } = useQuery<AdminProfile>({
    queryKey: ['/api/admin/profile'],
    retry: false,
  });

  // Update credentials mutation
  const updateCredentialsMutation = useMutation({
    mutationFn: async (data: {
      username?: string;
      password?: string;
      email?: string;
      currentPassword: string;
    }) => {
      return apiRequest("PUT", "/api/admin/credentials", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/profile'] });
      setCredentials({
        username: "",
        email: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      toast({
        title: "Success",
        description: "Admin credentials updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });



  const handleUpdateCredentials = () => {
    if (!credentials.currentPassword) {
      toast({
        title: "Error",
        description: "Current password is required",
        variant: "destructive",
      });
      return;
    }

    if (credentials.newPassword && credentials.newPassword !== credentials.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (credentials.newPassword && credentials.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "New password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    const updates: any = {
      currentPassword: credentials.currentPassword,
    };

    if (credentials.username && credentials.username !== adminProfile?.username) {
      updates.username = credentials.username;
    }

    if (credentials.email !== adminProfile?.email) {
      updates.email = credentials.email;
    }

    if (credentials.newPassword) {
      updates.password = credentials.newPassword;
    }

    updateCredentialsMutation.mutate(updates);
  };



  const togglePasswordVisibility = (field: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field as keyof typeof prev]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Admin Credentials</h2>
          <p className="text-gray-600 mt-1">Manage your admin username, password, and email</p>
        </div>
        {adminProfile && (
          <div className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg">
            <User className="w-5 h-5" />
            <span className="font-medium">Logged in as: {adminProfile.username}</span>
          </div>
        )}
      </div>

      <div className="space-y-6">
          {/* Current Admin Info */}
          {adminProfile && (
            <AnimatedCard className="bg-gray-50 border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Shield className="w-5 h-5" />
                  Current Admin Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Username</Label>
                    <p className="text-sm text-gray-600 mt-1">{adminProfile.username}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Email</Label>
                    <p className="text-sm text-gray-600 mt-1">{adminProfile.email || 'Not set'}</p>
                  </div>
                </div>
              </CardContent>
            </AnimatedCard>
          )}

          {/* Update Credentials Form */}
          <AnimatedCard>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                Update Credentials
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="username">New Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder={adminProfile?.username || "Enter new username"}
                    value={credentials.username}
                    onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={adminProfile?.email || "Enter email address"}
                    value={credentials.email}
                    onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password *</Label>
                  <div className="relative mt-1">
                    <Input
                      id="currentPassword"
                      type={showPasswords.current ? "text" : "password"}
                      placeholder="Enter current password"
                      value={credentials.currentPassword}
                      onChange={(e) => setCredentials({...credentials, currentPassword: e.target.value})}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() => togglePasswordVisibility('current')}
                    >
                      {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="newPassword">New Password (optional)</Label>
                    <div className="relative mt-1">
                      <Input
                        id="newPassword"
                        type={showPasswords.new ? "text" : "password"}
                        placeholder="Enter new password"
                        value={credentials.newPassword}
                        onChange={(e) => setCredentials({...credentials, newPassword: e.target.value})}
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={() => togglePasswordVisibility('new')}
                      >
                        {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative mt-1">
                      <Input
                        id="confirmPassword"
                        type={showPasswords.confirm ? "text" : "password"}
                        placeholder="Confirm new password"
                        value={credentials.confirmPassword}
                        onChange={(e) => setCredentials({...credentials, confirmPassword: e.target.value})}
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={() => togglePasswordVisibility('confirm')}
                      >
                        {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-yellow-800">Important:</p>
                    <p className="text-yellow-700 mt-1">
                      Your current password is required for all changes. Only fill in the fields you want to update.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleUpdateCredentials}
                disabled={updateCredentialsMutation.isPending}
                className="w-full"
              >
                {updateCredentialsMutation.isPending ? "Updating..." : "Update Credentials"}
              </Button>
            </CardContent>
          </AnimatedCard>
        </div>
    </div>
  );
}