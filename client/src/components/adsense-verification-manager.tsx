import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Copy, Check, Globe, Code, FileText, Shield, AlertCircle } from "lucide-react";
import { AnimatedButton } from "./animated-button";
import { AnimatedCard } from "./animated-card";

interface AdSenseVerification {
  id: string;
  method: "adsense_code" | "ads_txt" | "meta_tag";
  code: string;
  isActive: boolean;
  verified: boolean;
  publisherId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export function AdSenseVerificationManager() {
  const [selectedMethod, setSelectedMethod] = useState<"adsense_code" | "ads_txt" | "meta_tag">("meta_tag");
  const [verificationCode, setVerificationCode] = useState("");
  const [publisherId, setPublisherId] = useState("");
  const [isPlaced, setIsPlaced] = useState(false);
  const [copiedCode, setCopiedCode] = useState("");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch current verification settings
  const { data: verification } = useQuery<AdSenseVerification>({
    queryKey: ['/api/admin/adsense-verification'],
    retry: false,
  });

  // Save verification settings
  const saveVerificationMutation = useMutation({
    mutationFn: async (data: {
      method: string;
      code: string;
      publisherId?: string;
      isActive: boolean;
    }) => {
      return apiRequest("POST", "/api/admin/adsense-verification", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/adsense-verification'] });
      toast({
        title: "Verification saved",
        description: "AdSense verification settings have been updated successfully",
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

  // Verify site ownership
  const verifyMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/admin/adsense-verification/verify", {
        method: selectedMethod,
        code: verificationCode,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/adsense-verification'] });
      toast({
        title: "Verification successful",
        description: "Your site has been verified with Google AdSense",
      });
    },
    onError: (error) => {
      toast({
        title: "Verification failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    if (!verificationCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter the verification code",
        variant: "destructive",
      });
      return;
    }

    saveVerificationMutation.mutate({
      method: selectedMethod,
      code: verificationCode,
      publisherId: publisherId || undefined,
      isActive: true,
    });
  };

  const handleVerify = () => {
    if (!isPlaced) {
      toast({
        title: "Error",
        description: "Please confirm that you have placed the verification code on your site",
        variant: "destructive",
      });
      return;
    }

    verifyMutation.mutate();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(""), 2000);
    toast({
      title: "Copied to clipboard",
      description: "Verification code has been copied to your clipboard",
    });
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "adsense_code":
        return <Code className="w-5 h-5" />;
      case "ads_txt":
        return <FileText className="w-5 h-5" />;
      case "meta_tag":
        return <Globe className="w-5 h-5" />;
      default:
        return <Shield className="w-5 h-5" />;
    }
  };

  const getMethodDescription = (method: string) => {
    switch (method) {
      case "adsense_code":
        return "Add AdSense code snippet to your site's <head> section";
      case "ads_txt":
        return "Upload ads.txt file to your site's root directory";
      case "meta_tag":
        return "Add HTML meta tag to your site's <head> section";
      default:
        return "";
    }
  };

  const generateExampleCode = () => {
    switch (selectedMethod) {
      case "adsense_code":
        return `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${publisherId || "XXXXXXXXXXXXXXXXX"}"
     crossorigin="anonymous"></script>`;
      case "ads_txt":
        return `google.com, pub-${publisherId || "XXXXXXXXXXXXXXXXX"}, DIRECT, f08c47fec0942fa0`;
      case "meta_tag":
        return `<meta name="google-adsense-account" content="ca-pub-${publisherId || "XXXXXXXXXXXXXXXXX"}">`;
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AdSense Verification</h2>
          <p className="text-gray-600 mt-1">Verify your site ownership with Google AdSense</p>
        </div>
        {verification?.verified && (
          <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-3 py-2 rounded-lg">
            <Check className="w-5 h-5" />
            <span className="font-medium">Site Verified</span>
          </div>
        )}
      </div>

      {/* Current Status */}
      {verification && (
        <AnimatedCard className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Shield className="w-5 h-5" />
              Current Verification Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium">Method</Label>
                <div className="flex items-center gap-2 mt-1">
                  {getMethodIcon(verification.method)}
                  <span className="capitalize">{verification.method.replace('_', ' ')}</span>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <div className="flex items-center gap-2 mt-1">
                  {verification.verified ? (
                    <><Check className="w-4 h-4 text-green-500" /><span className="text-green-700">Verified</span></>
                  ) : (
                    <><AlertCircle className="w-4 h-4 text-yellow-500" /><span className="text-yellow-700">Pending</span></>
                  )}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Publisher ID</Label>
                <p className="text-sm text-gray-600 mt-1">{verification.publisherId || 'Not set'}</p>
              </div>
            </div>
          </CardContent>
        </AnimatedCard>
      )}

      {/* Verification Setup */}
      <AnimatedCard>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Set Up Site Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Publisher ID */}
          <div>
            <Label htmlFor="publisherId">Google AdSense Publisher ID</Label>
            <Input
              id="publisherId"
              placeholder="ca-pub-1234567890123456"
              value={publisherId}
              onChange={(e) => setPublisherId(e.target.value)}
              className="mt-1"
            />
            <p className="text-sm text-gray-500 mt-1">
              Find your Publisher ID in your AdSense account settings
            </p>
          </div>

          {/* Verification Method Selection */}
          <div>
            <Label className="text-base font-medium">Select verification method:</Label>
            <RadioGroup
              value={selectedMethod}
              onValueChange={(value) => setSelectedMethod(value as any)}
              className="mt-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="meta_tag" id="meta_tag" />
                <Label htmlFor="meta_tag" className="flex items-center gap-2 cursor-pointer">
                  <Globe className="w-4 h-4" />
                  Meta tag (Recommended)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="adsense_code" id="adsense_code" />
                <Label htmlFor="adsense_code" className="flex items-center gap-2 cursor-pointer">
                  <Code className="w-4 h-4" />
                  AdSense code snippet
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ads_txt" id="ads_txt" />
                <Label htmlFor="ads_txt" className="flex items-center gap-2 cursor-pointer">
                  <FileText className="w-4 h-4" />
                  Ads.txt snippet
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Method Description */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700">
              {getMethodDescription(selectedMethod)}
            </p>
          </div>

          {/* Code Input */}
          <div>
            <Label htmlFor="verificationCode">
              {selectedMethod === "meta_tag" ? "HTML Meta Tag" : 
               selectedMethod === "adsense_code" ? "AdSense Code Snippet" : 
               "Ads.txt Content"}
            </Label>
            <div className="relative mt-1">
              <Textarea
                id="verificationCode"
                placeholder={generateExampleCode()}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="font-mono text-sm"
                rows={selectedMethod === "meta_tag" ? 2 : 4}
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(verificationCode)}
                disabled={!verificationCode}
              >
                {copiedCode === verificationCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Example Code */}
          {publisherId && (
            <div>
              <Label className="text-sm font-medium">Example Code:</Label>
              <div className="relative mt-1">
                <pre className="bg-gray-100 p-3 rounded text-sm font-mono overflow-x-auto">
                  {generateExampleCode()}
                </pre>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(generateExampleCode())}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Placement Confirmation */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isPlaced"
              checked={isPlaced}
              onCheckedChange={(checked) => setIsPlaced(checked as boolean)}
            />
            <Label htmlFor="isPlaced" className="text-sm">
              I've placed the {selectedMethod.replace('_', ' ')} on my site
            </Label>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <AnimatedButton
              onClick={handleSave}
              disabled={saveVerificationMutation.isPending}
              isLoading={saveVerificationMutation.isPending}
              animationType="pulse"
            >
              Save Settings
            </AnimatedButton>
            
            <AnimatedButton
              onClick={handleVerify}
              disabled={verifyMutation.isPending || !isPlaced}
              isLoading={verifyMutation.isPending}
              animationType="glow"
              variant="default"
              className="bg-blue-600 hover:bg-blue-700"
            >
              Verify Site
            </AnimatedButton>
          </div>
        </CardContent>
      </AnimatedCard>

      {/* Implementation Instructions */}
      <AnimatedCard>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Implementation Instructions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {selectedMethod === "meta_tag" && (
              <div className="space-y-2">
                <h4 className="font-medium">Meta Tag Method:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                  <li>Copy the meta tag code above</li>
                  <li>Add it to the &lt;head&gt; section of every page on your site</li>
                  <li>Make sure it appears before the closing &lt;/head&gt; tag</li>
                  <li>Click "Verify Site" after implementation</li>
                </ol>
              </div>
            )}
            
            {selectedMethod === "adsense_code" && (
              <div className="space-y-2">
                <h4 className="font-medium">AdSense Code Method:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                  <li>Copy the AdSense code snippet above</li>
                  <li>Add it to the &lt;head&gt; section of every page</li>
                  <li>The code will automatically serve ads once approved</li>
                  <li>Click "Verify Site" after implementation</li>
                </ol>
              </div>
            )}
            
            {selectedMethod === "ads_txt" && (
              <div className="space-y-2">
                <h4 className="font-medium">Ads.txt Method:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                  <li>Copy the ads.txt content above</li>
                  <li>Create a file named "ads.txt" in your site's root directory</li>
                  <li>Upload the file to: https://yoursite.com/ads.txt</li>
                  <li>Click "Verify Site" after implementation</li>
                </ol>
              </div>
            )}
          </div>
        </CardContent>
      </AnimatedCard>
    </div>
  );
}