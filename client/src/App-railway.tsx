import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { WidgetProvider } from "./components/widget-system/widget-context";
import GradientDesigner from "./pages/gradient-designer";
import WidgetGradientDesigner from "./pages/widget-gradient-designer";
import ButtonGallery from "./pages/button-gallery";
import Landing from "./pages/landing";
import NotFound from "./pages/not-found";
import AdminLogin from "./pages/admin-login";
import AdminPanel from "./pages/admin-panel";
import { useAuth } from "./hooks/useAuth";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      <Route path="/" component={GradientDesigner} />
      <Route path="/gallery" component={ButtonGallery} />
      <Route path="/admin-login" component={AdminLogin} />
      <Route path="/admin" component={AdminPanel} />
      <Route path="/admin-panel">
        <WidgetProvider>
          <AdminPanel />
        </WidgetProvider>
      </Route>
      <Route path="/widget-designer">
        <WidgetProvider>
          <WidgetGradientDesigner />
        </WidgetProvider>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;