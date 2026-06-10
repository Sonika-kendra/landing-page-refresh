import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy, Component, ReactNode } from "react";
import { websiteUrlConfig } from '@/config/site';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { FavouritesProvider } from '@/context/FavouritesContext';
import RegistrationModal from '@/components/shared/common/RegistrationModal';
import ProtectedRoute from '@/components/shared/common/ProtectedRoute';

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
const AdminCategories = lazy(() => import('@/features/admin/sections/Categories'));
const AdminProducts   = lazy(() => import('@/features/admin/sections/Products'));
const AdminOrders     = lazy(() => import('@/features/admin/sections/Orders'));
const AdminOrderDetail= lazy(() => import('@/features/admin/sections/OrderDetail'));
const AdminStock      = lazy(() => import('@/features/admin/sections/Stock'));
const AdminCartMonitor    = lazy(() => import('@/features/admin/sections/CartMonitor'));
const AdminEmailTemplates = lazy(() => import('@/features/admin/sections/EmailTemplates'));
const AdminEmailEditor    = lazy(() => import('@/features/admin/sections/Email'));
const Cart            = lazy(() => import('@/features/cart'));
const Checkout        = lazy(() => import('@/features/checkout'));
const AccountLayout   = lazy(() => import('@/features/account/AccountLayout'));
const MyOrders        = lazy(() => import('@/features/account/MyOrders'));
const MyOrderDetail   = lazy(() => import('@/features/account/MyOrderDetail'));
const AddressBook     = lazy(() => import('@/features/account/AddressBook'));
const AccountProfile        = lazy(() => import('@/features/account/Profile'));
const AccountChangePassword = lazy(() => import('@/features/account/ChangePassword'));
const AccountWishlist       = lazy(() => import('@/features/account/MyWishlist'));
const PrivacyPolicy = lazy(() => import('@/features/privacy'));
const TermsAndConditions = lazy(() => import('@/features/terms'));
const CancellationReturnsPolicy = lazy(() => import('@/features/cancellation-returns'));
const QualityPolicy = lazy(() => import('@/features/quality-policy'));
const CookiesPolicy = lazy(() => import('@/features/cookies-policy'));
const Wishlist = lazy(() => import('@/features/wishlist'));
const SitemapPage = lazy(() => import('@/features/sitemap'));
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
        <Route path={websiteUrlConfig.Contact} element={<Contact />} />
        <Route path="/jewellery/all" element={<Shop />} />
        <Route path="/jewellery/all/:id" element={<ProductDetail />} />
        <Route path="/jewellery/:category/:subCategory/:id" element={<ProductDetail />} />
        <Route path="/jewellery/:category" element={<Shop />} />
        <Route path="/verify/:id" element={<VerifyEmail />} />
        <Route path="/reset/:id" element={<ResetPassword />} />
        <Route path={websiteUrlConfig.PrivacyPolicy} element={<PrivacyPolicy />} />
        <Route path={websiteUrlConfig.TermsAndConditions} element={<TermsAndConditions />} />
        <Route path={websiteUrlConfig.CancellationReturnsPolicy} element={<CancellationReturnsPolicy />} />
        <Route path={websiteUrlConfig.QualityPolicy} element={<QualityPolicy />} />
        <Route path={websiteUrlConfig.CookiesPolicy} element={<CookiesPolicy />} />
        <Route path={websiteUrlConfig.Sitemap} element={<SitemapPage />} />
        <Route path="/admin" element={<AdminErrorBoundary><AdminLayout /></AdminErrorBoundary>}>
          <Route index element={<AdminDashboard />} />
          <Route path="draft"     element={<AdminDraftUsers />} />
          <Route path="approvals" element={<AdminUserApprovals />} />
          <Route path="users" element={<AdminAllUsers />} />
          <Route path="users/:id" element={<AdminUserDetail />} />
          <Route path="posts" element={<AdminPosts />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="zoho"     element={<AdminZohoSync />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="products"   element={<AdminProducts />} />
          <Route path="orders"     element={<AdminOrders />} />
          <Route path="orders/:id" element={<AdminOrderDetail />} />
          <Route path="stock"      element={<AdminStock />} />
          <Route path="carts"        element={<AdminCartMonitor />} />
          <Route path="email"        element={<AdminEmailTemplates />} />
          <Route path="email/:id"    element={<AdminEmailEditor />} />
        </Route>
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/account" element={<ProtectedRoute><AccountLayout /></ProtectedRoute>}>
          <Route index element={<MyOrders />} />
          <Route path="orders" element={<MyOrders />} />
          <Route path="orders/:id" element={<MyOrderDetail />} />
          <Route path="wishlist" element={<AccountWishlist />} />
          <Route path="addresses" element={<AddressBook />} />
          <Route path="profile" element={<AccountProfile />} />
          <Route path="change-password" element={<AccountChangePassword />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
    <RegistrationModal />
  </>
);

const App = () => (
  <AuthProvider>
    <FavouritesProvider>
    <CartProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter basename="/new">
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </CartProvider>
    </FavouritesProvider>
  </AuthProvider>
);

export default App;
