import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Shell } from "@/components/layout/Shell";
import { AuthorityModeProvider } from "@/context/AuthorityMode";
import { ReviewerProvider } from "@/context/Reviewer";

// Pages
import Home from "@/pages/Home";
import Brands from "@/pages/Brands";
import BrandDetail from "@/pages/BrandDetail";
import Operating from "@/pages/Operating";
import DepartmentDetail from "@/pages/DepartmentDetail";
import ProjectDetail from "@/pages/ProjectDetail";
import Predictors from "@/pages/Predictors";
import Pulse from "@/pages/Pulse";
import Financial from "@/pages/Financial";
import Decisions from "@/pages/Decisions";
import DecisionDetail from "@/pages/DecisionDetail";
import Risk from "@/pages/Risk";
import Brain from "@/pages/Brain";
import ReviewDetail from "@/pages/ReviewDetail";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Shell>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/brands" component={Brands} />
        <Route path="/brands/:code" component={BrandDetail} />
        <Route path="/operating" component={Operating} />
        <Route path="/departments/:id" component={DepartmentDetail} />
        <Route path="/projects/:id" component={ProjectDetail} />
        <Route path="/predictors" component={Predictors} />
        <Route path="/pulse" component={Pulse} />
        <Route path="/financial" component={Financial} />
        <Route path="/reviews/:id" component={ReviewDetail} />
        <Route path="/decisions" component={Decisions} />
        <Route path="/decisions/:id" component={DecisionDetail} />
        <Route path="/risk" component={Risk} />
        <Route path="/brain" component={Brain} />
        <Route component={NotFound} />
      </Switch>
    </Shell>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthorityModeProvider>
          <ReviewerProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
          </ReviewerProvider>
        </AuthorityModeProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
