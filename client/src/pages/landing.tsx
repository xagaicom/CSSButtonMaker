import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette, Sparkles, Code, Save } from "lucide-react";
// CSS Logo placeholder - using CSS icon instead

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="w-60 h-60 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-6xl font-bold">
              CSS
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              CSS Button Maker
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Create beautiful, interactive buttons with live preview and clean CSS generation. 
            Design with separate gradient controls, 3D effects, and modern styling options.
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg"
            onClick={() => window.location.href = '/api/login'}
          >
            Get Started
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center border-purple-200 dark:border-purple-700">
            <CardHeader>
              <Palette className="w-12 h-12 mx-auto mb-4 text-purple-600" />
              <CardTitle className="text-lg">Advanced Gradients</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Separate controls for border, text, and background gradients with custom directions
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center border-blue-200 dark:border-blue-700">
            <CardHeader>
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <CardTitle className="text-lg">3D Effects</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Create realistic 3D buttons with shadows, highlights, and interactive hover effects
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center border-green-200 dark:border-green-700">
            <CardHeader>
              <Code className="w-12 h-12 mx-auto mb-4 text-green-600" />
              <CardTitle className="text-lg">Clean CSS</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Generate optimized CSS code with copy/download functionality for easy integration
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center border-orange-200 dark:border-orange-700">
            <CardHeader>
              <Save className="w-12 h-12 mx-auto mb-4 text-orange-600" />
              <CardTitle className="text-lg">Save & Share</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Save your designs to your account and share them with your team
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Join thousands of designers and developers creating beautiful buttons
          </p>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => window.location.href = '/api/login'}
          >
            Sign in to start designing
          </Button>
        </div>
      </div>
    </div>
  );
}