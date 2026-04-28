import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy, Component, ReactNode } from "react";
import { websiteUrlConfig } from '@/config/site';
import { AuthProvider } from '@/context/AuthContext';
import RegistrationModal from '@/components/shared/common/RegistrationModal';

class AdminErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-3 p-6 text-center">
          <p className="text-sm text-muted-foreground">Admin panel failed to load.</p>
          <p className="text-xs font-mono text-destructive">{(this.state.error as Error).message}</p>
          <button className="text-sm underline" onClick={() => this.setState({ error: null })}>Try again</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const Landing = lazy(() => import('@/features/landing'));
const Diamond = lazy(() => import('@/features/diamond'));
const Jewellery = lazy(() => import('@/features/jewellery'));
const Blogs = lazy(() => import('@/features/blog'));
const BlogPost = lazy(() => import('@/features/blog/PostDetail'));
const Contact = lazy(() => import('@/features/contact'));
const Shop = lazy(() => import('@/features/shop'));
const ProductDetail = lazy(() => import('@/features/shop/ProductDetail'));
const VerifyEmail = lazy(() => import('@/features/auth/VerifyEmail'));
const ResetPassword = lazy(() => import('@/features/auth/ResetPassword'));
const AdminLayout = lazy(() => import('@/features/admin'));
const AdminDashboard = lazy(() => import('@/features/admin/sections/Dashboard'));
const AdminUserApprovals = lazy(() => import('@/features/admin/sections/UserApprovals'));
const AdminAllUsers = lazy(() => import('@/features/admin/sections/AllUsers'));
const AdminUserDetail = lazy(() => import('@/features/admin/sections/UserDetail'));
const AdminPosts = lazy(() => import('@/features/admin/sections/Posts'));
const AdminSettings  = lazy(() => import('@/features/admin/sections/Settings'));
const AdminDraftUsers = lazy(() => import('@/features/admin/sections/DraftUsers'));
const AdminZohoSync  = lazy(() => import('@/features/admin/sections/ZohoSync'));
const PrivacyPolicy = lazy(() => import('@/features/privacy'));
const TermsAndConditions = lazy(() => import('@/features/terms'));
const NotFound = lazy(() => import('@/features/not-found'));

const queryClient = new QueryClient();

const AppRoutes = () => (
  <>
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
        <Route path="/verify/:id" element={<VerifyEmail />} />
        <Route path="/reset/:id" element={<ResetPassword />} />
        <Route path={websiteUrlConfig.PrivacyPolicy} element={<PrivacyPolicy />} />
        <Route path={websiteUrlConfig.TermsAndConditions} element={<TermsAndConditions />} />
        <Route path="/admin" element={<AdminErrorBoundary><AdminLayout /></AdminErrorBoundary>}>
          <Route index element={<AdminDashboard />} />
          <Route path="draft"     element={<AdminDraftUsers />} />
          <Route path="approvals" element={<AdminUserApprovals />} />
          <Route path="users" element={<AdminAllUsers />} />
          <Route path="users/:id" element={<AdminUserDetail />} />
          <Route path="posts" element={<AdminPosts />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="zoho"     element={<AdminZohoSync />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
    <RegistrationModal />
  </>
);

const App = () => (
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename="/new">
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </AuthProvider>
);

export default App;
