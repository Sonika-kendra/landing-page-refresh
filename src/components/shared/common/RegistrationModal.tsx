import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { authApi } from '@/api/auth';
import { websiteUrlConfig } from '@/config/site';
import Logo from '@/assets/icons/logoDark.png';

type FormMode = 'register' | 'login' | 'forgot' | 'verify-pending' | 'forgot-sent';
type AccountManager = { _id: string; full_name?: string; firstName?: string; lastName?: string; email: string };

const DEPARTMENT_OPTIONS = [
  { value: 'accounts', label: 'Accounts' },
  { value: 'buying', label: 'Buying' },
  { value: 'sales', label: 'Sales' },
  { value: 'management', label: 'Management' },
];

const ERROR_MAP: Record<string, string> = {
  EMAIL_NOT_VERIFIED: 'Please verify your email before logging in.',
  WRONG_PASSWORD: 'Incorrect password. Please try again.',
  BLOCKED_USER: 'Account temporarily blocked due to too many failed attempts. Try again in 2 hours.',
  USER_DOES_NOT_EXIST: 'No account found with this email address.',
  EMAIL_ALREADY_EXISTS: 'An account with this email already exists. Please sign in.',
  CURRENT_CLIENT: 'You already have an account. Please sign in.',
  WRONG_STATUS: 'Your account is pending approval. You will be notified once approved.',
  NO_STATUS: 'Your account is pending review. Please contact us.',
  ZOHO_CONTACT_INACTIVE: 'Your account is currently inactive. Please contact us.',
  TOO_MANY_LOGIN_ATTEMPTS: 'Too many login attempts. Please try again later.',
  TOO_MANY_REGISTER_ATTEMPTS: 'Too many registration attempts. Please try again later.',
  TOO_MANY_FORGOT_PASSWORD_ATTEMPTS: 'Too many reset attempts. Please try again later.',
  TOKEN_NOT_FOUND_OR_ALREADY_VERIFIED: 'This email is already verified or the link is invalid.',
};

const TermsLink = () => (
  <a
    href={websiteUrlConfig.TermsAndConditions}
    target="_blank"
    rel="noopener noreferrer"
    className="text-primary hover:underline"
  >
    Terms &amp; Conditions
  </a>
);

const mapApiError = (err: unknown): string => {
  const axiosErr = err as { response?: { data?: { error?: string; errors?: { msg: string } | { msg: string }[] } } };
  const data = axiosErr?.response?.data;
  const errors = data?.errors;
  const code = data?.error
    ?? (Array.isArray(errors) ? errors[0]?.msg : errors?.msg)
    ?? '';
  return ERROR_MAP[code] ?? 'Something went wrong. Please try again.';
};

const RegistrationModal = () => {
  const { isModalOpen, closeModal, initialView, setAuth, waitForLogout, redirectAfterLogin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [mode, setMode] = useState<FormMode>(initialView);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');
  const [resendSuccess, setResendSuccess] = useState(false);

  const [accountManagers, setAccountManagers] = useState<AccountManager[]>([]);
  const [selectedAccountManager, setSelectedAccountManager] = useState('');
  const [department, setDepartment] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    companyName: '',
    phone: '',
    forgotEmail: '',
    acceptTerms: false,
  });

  useEffect(() => {
    authApi.getAccountManagers()
      .then((res) => { if (res.data?.accountManagers?.length) setAccountManagers(res.data.accountManagers); })
      .catch(() => {});
  }, []);

  // Sync mode when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setMode(initialView);
      setApiError('');
      setShowPassword(false);
      setResendSuccess(false);
    }
  }, [isModalOpen, initialView]);

  // Lock background scroll
  useEffect(() => {
    document.body.style.overflow = isModalOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isModalOpen]);

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal(); };
    if (isModalOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isModalOpen, closeModal]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const switchMode = (next: FormMode) => {
    setApiError('');
    setMode(next);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    setIsLoading(true);
    try {
      await waitForLogout();
      const res = await authApi.login({ email: formData.email, password: formData.password });
      const redirectTo = redirectAfterLogin; // capture before closeModal clears it
      setAuth(res.data.token, res.data.user);
      toast({ title: 'Welcome Back!', description: 'You are now signed in.' });
      closeModal();
      if (redirectTo) navigate(redirectTo);
    } catch (err) {
      setApiError(mapApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!department) {
      setApiError('Please select a department.');
      return;
    }
    setApiError('');
    setIsLoading(true);
    try {
      await authApi.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        companyName: formData.companyName,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        acceptTermsAndConditions: formData.acceptTerms,
        department,
        ...(selectedAccountManager && { accountManagerId: selectedAccountManager }),
      });
      setPendingEmail(formData.email);
      setMode('verify-pending');
    } catch (err) {
      setApiError(mapApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    setIsLoading(true);
    try {
      await authApi.forgotPassword(formData.forgotEmail);
      setPendingEmail(formData.forgotEmail);
      setMode('forgot-sent');
    } catch (err) {
      setApiError(mapApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!pendingEmail || isLoading) return;
    setApiError('');
    setResendSuccess(false);
    setIsLoading(true);
    try {
      await authApi.resendVerification(pendingEmail);
      setResendSuccess(true);
    } catch (err) {
      setApiError(mapApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const headerContent = {
    login:           { title: 'Welcome Back',      sub: 'Sign in to continue.' },
    register:        { title: 'Partner With Us',   sub: 'Trade access only. Sign up to see prices.' },
    forgot:          { title: 'Reset Password',    sub: 'Enter your email to receive a reset link.' },
    'verify-pending':{ title: 'Verify Your Email', sub: 'Check your inbox to confirm your account.' },
    'forgot-sent':   { title: 'Email Sent',        sub: 'A reset link has been sent to your email.' },
  };

  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
          className="fixed inset-0 z-[1200] bg-foreground/60 backdrop-blur-sm"
        />
      )}
      {isModalOpen && (
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.97, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 30 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          className="fixed inset-0 z-[1300] overflow-y-auto"
        >
            <div className="flex min-h-full items-end md:items-center justify-center px-0 md:px-4 md:py-6">
            {/* Modal Box */}
            <div className="w-full md:max-w-md bg-foreground text-background rounded-t-lg md:rounded-sm shadow-elevated overflow-hidden">

              {/* Header */}
              <div className="relative px-6 pt-8 pb-4 text-center">
                {/* Close button */}
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 p-1.5 rounded-full border border-background/30 text-background/70 hover:text-background hover:border-background/60"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Logo */}
                <div className="flex justify-center mb-4">
                  <img
                    src={Logo}
                    alt="Henig Diamonds"
                    className="h-14 w-auto object-contain"
                  />
                </div>

                {/* Title + subtitle */}
                <h3 className="font-serif text-xl text-background">{headerContent[mode].title}</h3>
                <p className="text-xs text-background/60 mt-1">{headerContent[mode].sub}</p>
              </div>

              {/* Error Banner */}
              {apiError && (
                <div className="mx-6 mt-4 border-l-2 border-primary bg-primary/10 pl-3 pr-4 py-2.5 text-sm text-background">
                  {apiError}
                </div>
              )}

              {/* LOGIN FORM */}
              {mode === 'login' && (
                <form onSubmit={handleLoginSubmit} className="px-6 pt-2 pb-6 space-y-3">
                  <div>
                    <Label htmlFor="email" className="text-background text-xs">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@company.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="mt-0.5 h-9 text-sm bg-foreground/20 border-background/20 text-background placeholder:text-background/40 focus:border-primary"
                    />
                  </div>

                  <div>
                    <Label htmlFor="password" className="text-background text-xs">Password</Label>
                    <div className="relative mt-0.5">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="pr-10 h-9 text-sm bg-foreground/20 border-background/20 text-background placeholder:text-background/40 focus:border-primary"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-background/60"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={rememberMe}
                        onCheckedChange={(v) => setRememberMe(!!v)}
                      />
                      <span className="text-sm text-background/60">Remember me</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => switchMode('forgot')}
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <Button type="submit" className="w-full btn-henig-primary" disabled={isLoading}>
                    {isLoading ? 'Signing In…' : 'Sign In'}
                  </Button>

                  <p className="text-center text-xs text-background/50">
                    By signing in, you agree to our <TermsLink />.
                  </p>

                  <p className="text-center text-sm text-background/60">
                    Don't have an account?
                    <button
                      type="button"
                      onClick={() => switchMode('register')}
                      className="ml-2 text-primary font-medium hover:underline"
                    >
                      Register
                    </button>
                  </p>
                </form>
              )}

              {/* REGISTER FORM */}
              {mode === 'register' && (
                <>
                  <form onSubmit={handleRegisterSubmit} className="px-6 pt-2 pb-3 space-y-2.5">
                    <div>
                      <Label htmlFor="firstName" className="text-background text-xs">First Name *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder=""
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="mt-0.5 h-9 text-sm bg-foreground/20 border-background/20 text-background placeholder:text-background/40 focus:border-primary"
                      />
                    </div>

                    <div>
                      <Label htmlFor="lastName" className="text-background text-xs">Last Name *</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        placeholder=""
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="mt-0.5 h-9 text-sm bg-foreground/20 border-background/20 text-background placeholder:text-background/40 focus:border-primary"
                      />
                    </div>

                    <div>
                      <Label htmlFor="reg-email" className="text-background text-xs">Email *</Label>
                      <Input
                        id="reg-email"
                        name="email"
                        type="email"
                        placeholder=""
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="mt-0.5 h-9 text-sm bg-foreground/20 border-background/20 text-background placeholder:text-background/40 focus:border-primary"
                      />
                    </div>

                    <div>
                      <Label htmlFor="companyName" className="text-background text-xs">Company Name *</Label>
                      <Input
                        id="companyName"
                        name="companyName"
                        placeholder=""
                        value={formData.companyName}
                        onChange={handleInputChange}
                        required
                        className="mt-0.5 h-9 text-sm bg-foreground/20 border-background/20 text-background placeholder:text-background/40 focus:border-primary"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-background text-xs">Phone *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder=""
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="mt-0.5 h-9 text-sm bg-foreground/20 border-background/20 text-background placeholder:text-background/40 focus:border-primary"
                      />
                    </div>

                    <div>
                      <Label htmlFor="department" className="text-background text-xs">Department *</Label>
                      <Select value={department || undefined} onValueChange={setDepartment}>
                        <SelectTrigger
                          id="department"
                          className="mt-0.5 h-9 bg-foreground/20 border-background/20 text-background text-sm focus:border-primary focus:ring-0 focus:ring-offset-0 [&>span]:text-background/40 data-[placeholder]:text-background/40"
                        >
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent className="z-[1400]">
                          {DEPARTMENT_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {accountManagers.length > 0 && (
                      <div>
                        <Label htmlFor="accountManager" className="text-background text-xs">Account Manager</Label>
                        <Select value={selectedAccountManager || undefined} onValueChange={setSelectedAccountManager}>
                          <SelectTrigger
                            id="accountManager"
                            className="mt-0.5 h-9 bg-foreground/20 border-background/20 text-background text-sm focus:border-primary focus:ring-0 focus:ring-offset-0 [&>span]:text-background/40 data-[placeholder]:text-background/40"
                          >
                            <SelectValue placeholder="Select account manager (optional)" />
                          </SelectTrigger>
                          <SelectContent className="z-[1400]">
                            {accountManagers.map((am) => (
                              <SelectItem key={am._id} value={am._id}>
                                {am.full_name || [am.firstName, am.lastName].filter(Boolean).join(' ')}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div>
                      <Label htmlFor="reg-password" className="text-background text-xs">Password *</Label>
                      <div className="relative mt-0.5">
                        <Input
                          id="reg-password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder=""
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                          minLength={12}
                          className="pr-10 h-9 text-sm bg-foreground/20 border-background/20 text-background placeholder:text-background/40 focus:border-primary"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-background/60"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 !mt-3">
                      <Checkbox
                        id="acceptTerms"
                        checked={formData.acceptTerms}
                        onCheckedChange={(v) => setFormData({ ...formData, acceptTerms: !!v })}
                        required
                        className="mt-0.5"
                      />
                      <Label htmlFor="acceptTerms" className="text-xs text-background/70 font-normal leading-snug">
                        I agree to the <TermsLink />
                      </Label>
                    </div>

                    <Button type="submit" className="w-full btn-henig-primary !mt-4" disabled={isLoading}>
                      {isLoading ? 'Creating Account…' : 'CREATE ACCOUNT'}
                    </Button>

                    <p className="text-center text-sm text-background/60">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => switchMode('login')}
                        className="text-primary font-medium hover:underline"
                      >
                        Sign In
                      </button>
                    </p>
                  </form>

                  <div className="px-6 pb-4">
                    <div className="border border-background/20 rounded-sm px-4 py-3 space-y-1.5">
                      {['Exclusive collections', 'Wholesale pricing', 'Early access'].map((item) => (
                        <div key={item} className="flex items-center gap-2 text-xs text-background/80">
                          <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* FORGOT PASSWORD FORM */}
              {mode === 'forgot' && (
                <form onSubmit={handleForgotSubmit} className="px-6 pt-2 pb-6 space-y-4">
                  <div>
                    <Label htmlFor="forgotEmail" className="text-background">Email</Label>
                    <Input
                      id="forgotEmail"
                      name="forgotEmail"
                      type="email"
                      placeholder="you@company.com"
                      value={formData.forgotEmail}
                      onChange={handleInputChange}
                      required
                      className="mt-1 bg-foreground/20 border-background/20 text-background placeholder:text-background/40 focus:border-primary"
                    />
                  </div>

                  <Button type="submit" className="w-full btn-henig-primary" disabled={isLoading}>
                    {isLoading ? 'Sending…' : 'Send Reset Link'}
                  </Button>

                  <p className="text-center text-sm text-background/60">
                    <button
                      type="button"
                      onClick={() => switchMode('login')}
                      className="text-primary font-medium hover:underline"
                    >
                      ← Back to Sign In
                    </button>
                  </p>
                </form>
              )}

              {/* VERIFY PENDING */}
              {mode === 'verify-pending' && (
                <div className="px-6 pb-6 space-y-4 text-center">
                  <CheckCircle className="w-10 h-10 text-primary mx-auto" />
                  <p className="text-sm text-background/70 leading-relaxed">
                    We've sent a verification link to{' '}
                    <span className="font-medium text-background">{pendingEmail}</span>.
                    Click the link in the email to verify your account.
                  </p>
                  <div className="border border-background/20 rounded-sm p-4 text-xs text-background/60 text-left">
                    Once verified, your account will be reviewed by our team. You'll receive
                    an email when your account is approved.
                  </div>
                  {resendSuccess ? (
                    <p className="text-sm text-primary">Verification email resent.</p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={isLoading}
                      className="text-sm text-primary hover:underline disabled:opacity-50"
                    >
                      {isLoading ? 'Sending…' : 'Didn\'t receive it? Resend email'}
                    </button>
                  )}
                </div>
              )}

              {/* FORGOT SENT */}
              {mode === 'forgot-sent' && (
                <div className="px-6 pb-6 space-y-4 text-center">
                  <CheckCircle className="w-10 h-10 text-primary mx-auto" />
                  <p className="text-sm text-background/70 leading-relaxed">
                    If an account exists for{' '}
                    <span className="font-medium text-background">{pendingEmail}</span>,
                    you'll receive a password reset link shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => switchMode('login')}
                    className="text-sm text-primary hover:underline"
                  >
                    ← Back to Sign In
                  </button>
                </div>
              )}

            </div>
            </div>
          </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RegistrationModal;
