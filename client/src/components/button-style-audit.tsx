import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InteractiveButton } from "@/components/interactive-button";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

// Comprehensive button style definitions with validation
const buttonStyles = {
  // Quick Presets - These should always work
  quickPresets: {
    ocean: {
      name: "Ocean Blue",
      text: "Ocean Blue",
      backgroundStartColor: "#667eea",
      backgroundEndColor: "#764ba2",
      backgroundDirection: "135deg",
      textStartColor: "#ffffff",
      textEndColor: "#ffffff",
      borderRadius: 12,
      paddingX: 24,
      paddingY: 12,
      borderWidth: 0,
      fontWeight: 600,
      expected: "Gradient background with white text"
    },
    gradient: {
      name: "Purple Gradient",
      text: "Purple Gradient",
      backgroundStartColor: "#667eea",
      backgroundEndColor: "#764ba2",
      backgroundDirection: "135deg",
      textStartColor: "#ffffff",
      textEndColor: "#ffffff",
      borderRadius: 8,
      paddingX: 20,
      paddingY: 12,
      borderWidth: 0,
      fontWeight: 500,
      expected: "Smooth purple gradient"
    },
    neon: {
      name: "Neon Glow",
      text: "Neon Glow",
      backgroundStartColor: "#000000",
      backgroundEndColor: "#000000",
      textStartColor: "#ffffff",
      textEndColor: "#ffffff",
      borderRadius: 8,
      paddingX: 20,
      paddingY: 12,
      borderWidth: 2,
      borderStartColor: "#0ea5e9",
      borderEndColor: "#0ea5e9",
      enableBoxShadow: true,
      boxShadowColor: "#0ea5e9",
      boxShadowX: 0,
      boxShadowY: 0,
      boxShadowBlur: 15,
      boxShadowSpread: 0,
      fontWeight: 600,
      expected: "Black background with blue neon glow"
    }
  },

  // 3D Effects - Test depth and shadow
  threeD: {
    green3D: {
      name: "Green 3D Press",
      text: "Click me!",
      backgroundStartColor: "#4CAF50",
      backgroundEndColor: "#4CAF50",
      textStartColor: "#ffffff",
      textEndColor: "#ffffff",
      borderRadius: 8,
      paddingX: 20,
      paddingY: 12,
      borderWidth: 0,
      enable3D: true,
      enableBoxShadow: true,
      boxShadowColor: "#45a049",
      boxShadowX: 0,
      boxShadowY: 6,
      boxShadowBlur: 0,
      boxShadowSpread: 0,
      fontWeight: 500,
      expected: "3D green button with press effect"
    },
    blue3D: {
      name: "Blue 3D Press",
      text: "Click me!",
      backgroundStartColor: "#2196F3",
      backgroundEndColor: "#2196F3",
      textStartColor: "#ffffff",
      textEndColor: "#ffffff",
      borderRadius: 8,
      paddingX: 20,
      paddingY: 12,
      borderWidth: 0,
      enable3D: true,
      enableBoxShadow: true,
      boxShadowColor: "#1976D2",
      boxShadowX: 0,
      boxShadowY: 6,
      boxShadowBlur: 0,
      boxShadowSpread: 0,
      fontWeight: 500,
      expected: "3D blue button with press effect"
    }
  },

  // Gradient Collection - Test gradient combinations
  gradients: {
    purpleGradient: {
      name: "Purple Gradient",
      text: "Click me!",
      backgroundStartColor: "#667eea",
      backgroundEndColor: "#764ba2",
      backgroundDirection: "135deg",
      textStartColor: "#ffffff",
      textEndColor: "#ffffff",
      borderRadius: 8,
      paddingX: 20,
      paddingY: 12,
      borderWidth: 0,
      fontWeight: 500,
      expected: "Purple to blue gradient"
    },
    pinkGradient: {
      name: "Pink Gradient",
      text: "Click me!",
      backgroundStartColor: "#f093fb",
      backgroundEndColor: "#f5576c",
      backgroundDirection: "135deg",
      textStartColor: "#ffffff",
      textEndColor: "#ffffff",
      borderRadius: 8,
      paddingX: 20,
      paddingY: 12,
      borderWidth: 0,
      fontWeight: 500,
      expected: "Pink to red gradient"
    },
    blueGradient: {
      name: "Blue Gradient",
      text: "Click me!",
      backgroundStartColor: "#4facfe",
      backgroundEndColor: "#00f2fe",
      backgroundDirection: "135deg",
      textStartColor: "#ffffff",
      textEndColor: "#ffffff",
      borderRadius: 8,
      paddingX: 20,
      paddingY: 12,
      borderWidth: 0,
      fontWeight: 500,
      expected: "Blue to cyan gradient"
    }
  },

  // Shadow Border - Test border with shadow effects
  shadowBorder: {
    whiteShadow: {
      name: "White Shadow",
      text: "Click me!",
      backgroundStartColor: "#ffffff",
      backgroundEndColor: "#ffffff",
      textStartColor: "#333333",
      textEndColor: "#333333",
      borderRadius: 8,
      paddingX: 20,
      paddingY: 12,
      borderWidth: 2,
      borderStartColor: "#e0e0e0",
      borderEndColor: "#e0e0e0",
      borderStyle: "solid",
      enableBoxShadow: true,
      boxShadowColor: "rgba(0,0,0,0.1)",
      boxShadowX: 0,
      boxShadowY: 2,
      boxShadowBlur: 8,
      boxShadowSpread: 0,
      fontWeight: 500,
      expected: "White button with subtle shadow"
    },
    blueBorderShadow: {
      name: "Blue Border Shadow",
      text: "Click me!",
      backgroundStartColor: "#ffffff",
      backgroundEndColor: "#ffffff",
      textStartColor: "#3b82f6",
      textEndColor: "#3b82f6",
      borderRadius: 8,
      paddingX: 20,
      paddingY: 12,
      borderWidth: 2,
      borderStartColor: "#3b82f6",
      borderEndColor: "#3b82f6",
      borderStyle: "solid",
      enableBoxShadow: true,
      boxShadowColor: "rgba(59,130,246,0.3)",
      boxShadowX: 0,
      boxShadowY: 4,
      boxShadowBlur: 12,
      boxShadowSpread: 0,
      fontWeight: 500,
      expected: "White button with blue border and shadow"
    }
  },

  // Neumorphic - Test soft shadow effects
  neumorphic: {
    softNeumorphic: {
      name: "Soft Neumorphic",
      text: "Click me!",
      backgroundStartColor: "#e0e5ec",
      backgroundEndColor: "#e0e5ec",
      textStartColor: "#9baacf",
      textEndColor: "#9baacf",
      borderRadius: 50,
      paddingX: 25,
      paddingY: 15,
      borderWidth: 0,
      enableBoxShadow: true,
      boxShadowColor: "#a3b1c6",
      boxShadowX: 9,
      boxShadowY: 9,
      boxShadowBlur: 16,
      boxShadowSpread: 0,
      fontWeight: 500,
      expected: "Soft inset shadow effect"
    },
    roundedNeumorphic: {
      name: "Rounded Neumorphic",
      text: "Click me!",
      backgroundStartColor: "#e0e5ec",
      backgroundEndColor: "#e0e5ec",
      textStartColor: "#9baacf",
      textEndColor: "#9baacf",
      borderRadius: 15,
      paddingX: 25,
      paddingY: 15,
      borderWidth: 0,
      enableBoxShadow: true,
      boxShadowColor: "#c8d0e7",
      boxShadowX: 5,
      boxShadowY: 5,
      boxShadowBlur: 10,
      boxShadowSpread: 0,
      fontWeight: 500,
      expected: "Rounded neumorphic effect"
    }
  },

  // Retro - Test block shadows
  retro: {
    redRetro: {
      name: "Red Retro",
      text: "Click me!",
      backgroundStartColor: "#ff6b6b",
      backgroundEndColor: "#ff6b6b",
      textStartColor: "#ffffff",
      textEndColor: "#ffffff",
      borderRadius: 0,
      paddingX: 20,
      paddingY: 12,
      borderWidth: 3,
      borderStartColor: "#000000",
      borderEndColor: "#000000",
      borderStyle: "solid",
      enableBoxShadow: true,
      boxShadowColor: "#000000",
      boxShadowX: 5,
      boxShadowY: 5,
      boxShadowBlur: 0,
      boxShadowSpread: 0,
      fontWeight: 500,
      expected: "Red button with black block shadow"
    },
    tealRetro: {
      name: "Teal Retro",
      text: "Click me!",
      backgroundStartColor: "#4ecdc4",
      backgroundEndColor: "#4ecdc4",
      textStartColor: "#ffffff",
      textEndColor: "#ffffff",
      borderRadius: 0,
      paddingX: 20,
      paddingY: 12,
      borderWidth: 3,
      borderStartColor: "#000000",
      borderEndColor: "#000000",
      borderStyle: "solid",
      enableBoxShadow: true,
      boxShadowColor: "#000000",
      boxShadowX: 5,
      boxShadowY: 5,
      boxShadowBlur: 0,
      boxShadowSpread: 0,
      fontWeight: 500,
      expected: "Teal button with black block shadow"
    }
  }
};

// Test function to validate button styles
const validateButtonStyle = (style: any, category: string, name: string) => {
  const issues = [];
  
  // Test required properties
  if (!style.text || style.text.trim() === '') {
    issues.push("Missing button text");
  }
  
  // Test background colors
  if (!style.backgroundStartColor || !style.backgroundEndColor) {
    issues.push("Missing background colors");
  }
  
  // Test text colors
  if (!style.textStartColor || !style.textEndColor) {
    issues.push("Missing text colors");
  }
  
  // Test padding
  if (!style.paddingX || !style.paddingY) {
    issues.push("Missing padding values");
  }
  
  // Test border radius
  if (style.borderRadius === undefined || style.borderRadius === null) {
    issues.push("Missing border radius");
  }
  
  // Test 3D effects
  if (style.enable3D && !style.enableBoxShadow) {
    issues.push("3D effect enabled but no box shadow");
  }
  
  // Test box shadow
  if (style.enableBoxShadow) {
    if (!style.boxShadowColor) {
      issues.push("Box shadow enabled but no color");
    }
    if (style.boxShadowX === undefined || style.boxShadowY === undefined) {
      issues.push("Box shadow enabled but missing X/Y values");
    }
  }
  
  // Test border
  if (style.borderWidth > 0) {
    if (!style.borderStartColor || !style.borderEndColor) {
      issues.push("Border width set but missing border colors");
    }
  }
  
  return {
    category,
    name,
    style: style.name,
    issues,
    status: issues.length === 0 ? 'pass' : 'fail',
    expected: style.expected
  };
};

export function ButtonStyleAudit() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const runAudit = async () => {
    setIsRunning(true);
    const results = [];
    
    // Test all button styles
    for (const [categoryKey, categoryStyles] of Object.entries(buttonStyles)) {
      if (selectedCategory !== 'all' && selectedCategory !== categoryKey) continue;
      
      for (const [styleKey, style] of Object.entries(categoryStyles)) {
        const result = validateButtonStyle(style, categoryKey, styleKey);
        results.push(result);
        
        // Simulate async testing
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    setTestResults(results);
    setIsRunning(false);
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'fail':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'fail':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    }
  };
  
  const passCount = testResults.filter(r => r.status === 'pass').length;
  const failCount = testResults.filter(r => r.status === 'fail').length;
  const totalCount = testResults.length;
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Button Style Audit System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border rounded-lg"
              >
                <option value="all">All Categories</option>
                <option value="quickPresets">Quick Presets</option>
                <option value="threeD">3D Effects</option>
                <option value="gradients">Gradients</option>
                <option value="shadowBorder">Shadow Border</option>
                <option value="neumorphic">Neumorphic</option>
                <option value="retro">Retro</option>
              </select>
              
              <Button 
                onClick={runAudit}
                disabled={isRunning}
                className="px-6"
              >
                {isRunning ? 'Running Tests...' : 'Run Audit'}
              </Button>
            </div>
            
            {testResults.length > 0 && (
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-2xl font-bold text-green-700">{passCount}</div>
                  <div className="text-sm text-green-600">Passed</div>
                </div>
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="text-2xl font-bold text-red-700">{failCount}</div>
                  <div className="text-sm text-red-600">Failed</div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-2xl font-bold text-blue-700">{totalCount}</div>
                  <div className="text-sm text-blue-600">Total</div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {testResults.map((result, index) => (
                <div key={index} className={`p-4 rounded-lg border ${getStatusColor(result.status)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(result.status)}
                        <span className="font-medium">{result.style}</span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {result.category}
                        </span>
                      </div>
                      
                      <div className="text-sm opacity-75 mb-2">
                        Expected: {result.expected}
                      </div>
                      
                      {result.issues.length > 0 && (
                        <div className="text-sm">
                          <div className="font-medium mb-1">Issues:</div>
                          <ul className="list-disc list-inside space-y-1">
                            {result.issues.map((issue, i) => (
                              <li key={i}>{issue}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-4 flex-shrink-0">
                      <div className="text-xs text-gray-500 mb-2">Preview:</div>
                      <InteractiveButton
                        {...{
                          fontSize: 14,
                          fontWeight: 500,
                          borderDirection: "to right",
                          textDirection: "to right",
                          backgroundDirection: "to right",
                          width: 120,
                          height: 40,
                          transparentBackground: false,
                          enable3D: false,
                          shadowIntensity: 4,
                          borderStyle: "solid",
                          ...result
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}