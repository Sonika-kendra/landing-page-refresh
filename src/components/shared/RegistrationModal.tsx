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
    phone: '',
  });

  /* Lock scroll */
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Reset to 'register' when modal opens
  useEffect(() => {
    if (isOpen) {
      setMode('register');
    }
  }, [isOpen]);

  /* Close on ESC */
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

    await new Promise((resolve) => setTimeout(resolve, 1500));

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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Wrapper */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 overflow-y-auto"
          >
            <div className="w-full max-w-md bg-accent text-accent-foreground rounded-lg shadow-elevated overflow-hidden border border-white/10">
              
              {/* Header */}
              <div className="relative px-6 py-8 text-center border-b border-white/10">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 text-white/70 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>

                <Link to="/" className="inline-flex items-center justify-center">
                  <img
                    src={Logo}
                    alt="Henig Diamonds"
                    className="h-12 md:h-14 w-auto object-contain"
                  />
                </Link>

                <h3 className="font-serif text-xl mt-4 text-white">
                  {mode === 'register' ? 'Partner With Us' : 'Welcome Back'}
                </h3>

                <p className="text-sm text-white/70 mt-1">
                  {mode === 'register'
                    ? 'Trade access only. Sign up to see prices.'
                    : 'Sign in to continue.'}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {mode === 'register' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white/90">First Name</Label>
                      <Input
                        name="firstName"
                        onChange={handleInputChange}
                        required
                        className="mt-1 bg-transparent border-white/30 text-white placeholder:text-white/60 focus:border-primary focus:ring-primary"
                      />
                    </div>
                    <div>
                      <Label className="text-white/90">Last Name</Label>
                      <Input
                        name="lastName"
                        onChange={handleInputChange}
                        required
                        className="mt-1 bg-transparent border-white/30 text-white placeholder:text-white/60 focus:border-primary focus:ring-primary"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <Label className="text-white/90">Email</Label>
                  <Input
                    name="email"
                    type="email"
                    required
                    onChange={handleInputChange}
                    className="mt-1 bg-transparent border-white/30 text-white placeholder:text-white/60 focus:border-primary focus:ring-primary"
                  />
                </div>

                <div>
                  <Label className="text-white/90">Password</Label>
                  <div className="relative">
                    <Input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      onChange={handleInputChange}
                      className="mt-1 pr-10 bg-transparent border-white/30 text-white placeholder:text-white/60 focus:border-primary focus:ring-primary"
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
                  <div className="flex justify-between items-center text-sm text-white/70">
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

                <p className="text-center text-sm text-white/70">
                  {mode === 'register'
                    ? 'Already have an account?'
                    : "Don't have an account?"}
                  <button
                    type="button"
                    onClick={() =>
                      setMode(mode === 'register' ? 'login' : 'register')
                    }
                    className="ml-2 text-primary font-medium hover:underline"
                  >
                    {mode === 'register' ? 'Sign In' : 'Register'}
                  </button>
                </p>
              </form>

              {/* Benefits */}
              {mode === 'register' && (
                <div className="px-6 pb-6">
                  <div className="bg-white/5 border border-white/10 rounded-sm p-4 space-y-2">
                    {[
                      'Exclusive collections',
                      'Wholesale pricing',
                      'Early access',
                    ].map((item) => (
                      <div key={item} className="flex gap-2 text-sm items-center text-white/80">
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
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
