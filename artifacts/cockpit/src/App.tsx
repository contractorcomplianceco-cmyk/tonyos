import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Shell } from "@/components/layout/Shell";

// Pages
import Home from "@/pages/Home";
import Strategy from "@/pages/Strategy";
import Decisions from "@/pages/Decisions";
import DecisionDetail from "@/pages/DecisionDetail";
import Financial from "@/pages/Financial";
import Risk from "@/pages/Risk";
import Roadmap from "@/pages/Roadmap";
import Partnerships from "@/pages/Partnerships";
import Milestones from "@/pages/Milestones";
import Reviews from "@/pages/Reviews";
import ReviewDetail from "@/pages/ReviewDetail";
import Sources from "@/pages/Sources";
import Guardrails from "@/pages/Guardrails";

const queryClient = new QueryClient();

function Router() {
  return (
    <Shell>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/strategy" component={Strategy} />
        <Route path="/decisions" component={Decisions} />
        <Route path="/decisions/:id" component={DecisionDetail} />
        <Route path="/financial" component={Financial} />
        <Route path="/risk" component={Risk} />
        <Route path="/roadmap" component={Roadmap} />
        <Route path="/partnerships" component={Partnerships} />
        <Route path="/milestones" component={Milestones} />
        <Route path="/reviews" component={Reviews} />
        <Route path="/reviews/:id" component={ReviewDetail} />
        <Route path="/sources" component={Sources} />
        <Route path="/guardrails" component={Guardrails} />
        <Route component={NotFound} />
      </Switch>
    </Shell>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
