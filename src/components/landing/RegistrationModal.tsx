import { useState } from 'react';
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: mode === 'register' ? 'Registration Successful!' : 'Welcome Back!',
      description: mode === 'register' 
        ? 'Your account has been created. You can now access exclusive features.' 
        : 'You have been logged in successfully.',
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
            className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4"
          >
            <div className="bg-background rounded-sm shadow-elevated overflow-hidden">
              {/* Header */}
              <div className="relative bg-secondary px-6 py-8 text-center">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 text-muted hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="mb-4">
                  <span className="text-primary text-lg">✦</span>
                  <h2 className="font-serif text-2xl tracking-[0.1em] text-foreground mt-2">
                    HENIG DIAMONDS
                  </h2>
                </div>
                
                <h3 className="font-serif text-xl text-foreground mb-2">
                  {mode === 'register' ? 'Partner With Us' : 'Welcome Back'}
                </h3>
                <p className="text-sm text-muted">
                  {mode === 'register' 
                    ? 'Create an account to access exclusive collections and pricing.' 
                    : 'Enter your credentials to continue.'}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {mode === 'register' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-sm text-muted">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="John"
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-sm text-muted">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Doe"
                        className="mt-1"
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="email" className="text-sm text-muted">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="text-sm text-muted">
                    Password
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className="pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {mode === 'register' && (
                  <>
                    <div>
                      <Label htmlFor="companyName" className="text-sm text-muted">
                        Company Name
                      </Label>
                      <Input
                        id="companyName"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        placeholder="Your Company Ltd"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-sm text-muted">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+44 20 7123 4567"
                        className="mt-1"
                      />
                    </div>
                  </>
                )}

                {mode === 'login' && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      />
                      <label htmlFor="remember" className="text-sm text-muted cursor-pointer">
                        Remember me
                      </label>
                    </div>
                    <button type="button" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </button>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full btn-henig-primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full"
                      />
                      Processing...
                    </span>
                  ) : (
                    <>
                      {mode === 'register' ? 'Create Account' : 'Sign In'}
                    </>
                  )}
                </Button>

                <div className="henig-separator mx-auto my-6" />

                <p className="text-center text-sm text-muted">
                  {mode === 'register' ? 'Already have an account?' : "Don't have an account?"}
                  <button
                    type="button"
                    onClick={() => setMode(mode === 'register' ? 'login' : 'register')}
                    className="ml-2 text-primary hover:underline font-medium"
                  >
                    {mode === 'register' ? 'Sign In' : 'Register'}
                  </button>
                </p>
              </form>

              {/* Benefits */}
              {mode === 'register' && (
                <div className="px-6 pb-6">
                  <div className="bg-secondary rounded-sm p-4">
                    <p className="text-xs text-muted mb-3 uppercase tracking-wider">
                      Partner Benefits
                    </p>
                    <ul className="space-y-2">
                      {[
                        'Access to exclusive collections',
                        'Wholesale pricing for trade partners',
                        'Priority customer support',
                        'Early access to new arrivals',
                      ].map((benefit) => (
                        <li key={benefit} className="flex items-center gap-2 text-sm text-foreground">
                          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
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
