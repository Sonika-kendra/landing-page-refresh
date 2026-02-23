import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import Logo from "@/assets/icons/logoDark.png";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormMode = 'register' | 'login';

const RegistrationModal = ({ isOpen, onClose }: RegistrationModalProps) => {
  const [mode, setMode] = useState<FormMode>('register');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    companyName: '',
  });

  // Prevent page scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Reset mode when opened
  useEffect(() => {
    if (isOpen) setMode('register');
  }, [isOpen]);

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1200));

    toast({
      title: mode === 'register' ? 'Registration Successful!' : 'Welcome Back!',
      description:
        mode === 'register'
          ? 'Your account has been created successfully.'
          : 'You are now logged in.',
    });

    setIsLoading(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
          >
            <div className="w-full max-w-md bg-accent text-accent-foreground rounded-lg shadow-elevated border border-white/10 p-6">

              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-4 right-6 p-2 text-white/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Logo */}
              <div className="text-center mb-4">
                <Link to="/" className="inline-flex items-center justify-center">
                  <img
                    src={Logo}
                    alt="Henig Diamonds"
                    className="h-12 w-auto object-contain"
                  />
                </Link>

                <h3 className="font-serif text-lg mt-3 text-white">
                  {mode === 'register' ? 'Partner With Us' : 'Welcome Back'}
                </h3>

                <p className="text-xs text-white/70 mt-1">
                  {mode === 'register'
                    ? 'Trade access only. Sign up to see prices.'
                    : 'Sign in to continue.'}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3">

                {mode === 'register' && (
                  <>
                    <div>
                      <Label className="text-white/90 text-sm">
                        First Name *
                      </Label>
                      <Input
                        name="firstName"
                        required
                        onChange={handleInputChange}
                        className="mt-1 bg-transparent border-white/30 text-white"
                      />
                    </div>

                    <div>
                      <Label className="text-white/90 text-sm">
                        Last Name *
                      </Label>
                      <Input
                        name="lastName"
                        required
                        onChange={handleInputChange}
                        className="mt-1 bg-transparent border-white/30 text-white"
                      />
                    </div>
                  </>
                )}

                <div>
                  <Label className="text-white/90 text-sm">
                    Email *
                  </Label>
                  <Input
                    name="email"
                    type="email"
                    required
                    onChange={handleInputChange}
                    className="mt-1 bg-transparent border-white/30 text-white"
                  />
                </div>

                <div>
                  <Label className="text-white/90 text-sm">
                    Company Name
                  </Label>
                  <Input
                    name="companyName"
                    onChange={handleInputChange}
                    className="mt-1 bg-transparent border-white/30 text-white"
                  />
                </div>

                <div>
                  <Label className="text-white/90 text-sm">
                    Password *
                  </Label>
                  <div className="relative">
                    <Input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      onChange={handleInputChange}
                      className="mt-1 pr-10 bg-transparent border-white/30 text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {mode === 'login' && (
                  <div className="flex justify-between items-center text-xs text-white/70">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={rememberMe}
                        onCheckedChange={(v) => setRememberMe(!!v)}
                      />
                      <span>Remember me</span>
                    </div>
                    <button className="text-primary hover:underline">
                      Forgot password?
                    </button>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-henig-gold"
                >
                  {isLoading
                    ? 'Processing…'
                    : mode === 'register'
                    ? 'Create Account'
                    : 'Sign In'}
                </Button>

                <p className="text-center text-xs text-white/70">
                  {mode === 'register'
                    ? 'Already have an account?'
                    : "Don't have an account?"}
                  <button
                    type="button"
                    onClick={() =>
                      setMode(mode === 'register' ? 'login' : 'register')
                    }
                    className="ml-2 text-primary hover:underline"
                  >
                    {mode === 'register' ? 'Sign In' : 'Register'}
                  </button>
                </p>
              </form>

              {mode === 'register' && (
                <div className="mt-4 bg-white/5 border border-white/10 rounded-sm p-3 space-y-1">
                  {[
                    'Exclusive collections',
                    'Wholesale pricing',
                    'Early access',
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex gap-2 text-xs items-center text-white/80"
                    >
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RegistrationModal;
