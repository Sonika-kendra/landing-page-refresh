import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { websiteUrlConfig } from '@/config/site';

const Landing = lazy(() => import('@/features/landing'));
const Diamond = lazy(() => import('@/features/diamond'));
const Jewellery = lazy(() => import('@/features/jewellery'));
const Blogs = lazy(() => import('@/features/blog'));
const BlogPost = lazy(() => import('@/features/blog/PostDetail'));
const Contact = lazy(() => import('@/features/contact'));
const Shop = lazy(() => import('@/features/shop'));
const ProductDetail = lazy(() => import('@/features/shop/ProductDetail'));
const NotFound = lazy(() => import('@/features/not-found'));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename="/new">
        <Suspense fallback={<div className="min-h-screen" />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/diamonds" element={<Diamond />} />
            <Route path="/jewellery" element={<Jewellery />} />
            <Route path={websiteUrlConfig.Blogs} element={<Blogs />} />
            <Route path={`${websiteUrlConfig.Blogs}/:slug`} element={<BlogPost />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:id" element={<ProductDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
