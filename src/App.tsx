import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { websiteUrlConfig } from "@/config/config";

const Index = lazy(() => import("./pages/Index"));
const Diamonds = lazy(() => import("./pages/Diamonds"));
const Jewellery = lazy(() => import("./pages/Jewellery"));
const Blogs = lazy(() => import("./pages/Blogs"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename="/new">
        <Suspense fallback={<div className="min-h-screen" />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/diamonds" element={<Diamonds />} />
            <Route path="/jewellery" element={<Jewellery />} />
            <Route path={websiteUrlConfig.Blogs} element={<Blogs />} />
            <Route path={`${websiteUrlConfig.Blogs}/:slug`} element={<BlogPost />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
