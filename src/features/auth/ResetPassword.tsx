import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { authApi } from '@/api/auth';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/shared/common/LoadingSpinner';
import Logo from '@/assets/icons/logoLight.png';

const resetSchema = z
  .object({
    password: z.string().min(12, 'Password must be at least 12 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ResetData = z.infer<typeof resetSchema>;

const ResetPassword = () => {
  const { id } = useParams<{ id: string }>();
  const { openModal } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);

  const form = useForm<ResetData>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const handleSubmit = async (data: ResetData) => {
    if (!id) {
      setApiError('Invalid reset link.');
      return;
    }
    setApiError('');
    setIsLoading(true);
    try {
      await authApi.resetPassword(id, data.password);
      setSuccess(true);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } };
      const code = axiosErr?.response?.data?.error ?? '';
      const messages: Record<string, string> = {
        TOKEN_NOT_FOUND_OR_ALREADY_VERIFIED: 'This reset link is invalid or has already been used.',
        PASSWORD_TOO_SHORT_MIN_12: 'Password must be at least 12 characters.',
      };
      setApiError(messages[code] ?? 'Failed to reset password. The link may have expired.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <Link to="/" className="mb-10">
        <img src={Logo} alt="Henig Diamonds" className="h-10 w-auto object-contain" />
      </Link>

      <div className="w-full max-w-sm space-y-6">
        {!success ? (
          <>
            <div className="text-center space-y-1">
              <h1 className="text-xl font-light tracking-widest uppercase">Set New Password</h1>
              <p className="text-sm text-muted-foreground">Choose a strong password for your account.</p>
            </div>

            {apiError && (
              <div className="rounded-sm bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                {apiError}
              </div>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs tracking-wider uppercase">New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Min. 12 characters"
                            autoComplete="new-password"
                            className="pr-10"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            tabIndex={-1}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs tracking-wider uppercase">Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirm ? 'text' : 'password'}
                            placeholder="Repeat password"
                            autoComplete="new-password"
                            className="pr-10"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirm((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            tabIndex={-1}
                          >
                            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full btn-henig-gold mt-2" disabled={isLoading}>
                  {isLoading ? <LoadingSpinner size={16} /> : 'Set New Password'}
                </Button>
              </form>
            </Form>
          </>
        ) : (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="rounded-full bg-primary/10 p-4">
                <CheckCircle2 className="h-10 w-10 text-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-xl font-light tracking-widest uppercase">Password Updated</h1>
              <p className="text-sm text-muted-foreground">
                Your password has been changed successfully. You can now sign in with your new password.
              </p>
            </div>
            <Button
              className="btn-henig-gold"
              onClick={() => { navigate('/'); openModal('login'); }}
            >
              Sign In
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
