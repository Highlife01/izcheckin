import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

function Router() {
  return <Switch>
    <Route path="/" component={() => <Home initialTab="home" />} />
    <Route path="/kesfet" component={() => <Home initialTab="discover" />} />
    <Route path="/check-in" component={() => <Home initialTab="checkin" />} />
    <Route path="/bildirimler" component={() => <Home initialTab="notifications" />} />
    <Route path="/profil" component={() => <Home initialTab="profile" />} />
    <Route path="/404" component={NotFound} />
    <Route component={NotFound} />
  </Switch>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster position="top-center" /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>;
}
