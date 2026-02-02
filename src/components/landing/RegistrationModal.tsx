import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormMode = 'register' | 'login';

const RegistrationModal = ({ isOpen, onClose }: RegistrationModalProps) => {
  const [mode, setMode] = useState<FormMode>('login');
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

  /* ------------------ UX ENHANCEMENTS ------------------ */

  // Lock background scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  /* ------------------ HANDLERS ------------------ */

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
            className="fixed inset-0 z-40 bg-foreground/60 backdrop-blur-sm"
          />

          {/* Modal Wrapper */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 30 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="
              fixed inset-0 z-50 flex
              items-end md:items-center
              justify-center
              px-0 md:px-4
            "
          >
            {/* Modal Box */}
            <div
              className="
                w-full md:max-w-md
                bg-background
                rounded-t-lg md:rounded-sm
                shadow-elevated
                overflow-hidden
              "
            >
              {/* Header */}
              <div className="relative bg-secondary px-6 py-8 text-center">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 text-muted hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>

                <span className="text-primary text-lg">✦</span>
                <h2 className="font-serif text-2xl tracking-[0.1em] mt-2">
                  HENIG DIAMONDS
                </h2>

                <h3 className="font-serif text-xl mt-4">
                  {mode === 'register' ? 'Partner With Us' : 'Welcome Back'}
                </h3>

                <p className="text-sm text-muted mt-1">
                  {mode === 'register'
                    ? 'Access exclusive collections & pricing.'
                    : 'Sign in to continue.'}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {mode === 'register' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder="John"
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="lastName">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        placeholder="Doe"
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <Label>Email</Label>
                  <Input
                    name="email"
                    type="email"
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label>Password</Label>
                  <div className="relative">
                    <Input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      onChange={handleInputChange}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
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
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={rememberMe}
                        onCheckedChange={(v) => setRememberMe(!!v)}
                      />
                      <span className="text-sm text-muted">Remember me</span>
                    </div>
                    <button className="text-sm text-primary">
                      Forgot password?
                    </button>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full btn-henig-primary"
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing…' : mode === 'register' ? 'Create Account' : 'Sign In'}
                </Button>

                <p className="text-center text-sm text-muted">
                  {mode === 'register'
                    ? 'Already have an account?'
                    : "Don't have an account?"}
                  <button
                    type="button"
                    onClick={() =>
                      setMode(mode === 'register' ? 'login' : 'register')
                    }
                    className="ml-2 text-primary font-medium"
                  >
                    {mode === 'register' ? 'Sign In' : 'Register'}
                  </button>
                </p>
              </form>

              {/* Benefits */}
              {mode === 'register' && (
                <div className="px-6 pb-6">
                  <div className="bg-secondary rounded-sm p-4">
                    {[
                      'Exclusive collections',
                      'Wholesale pricing',
                      'Priority support',
                      'Early access',
                    ].map((item) => (
                      <div key={item} className="flex gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        {item}
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
