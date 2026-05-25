import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { authApi } from '@/api/auth';
import { useAuth } from '@/context/AuthContext';
import Logo from '@/assets/icons/logoLight.png';

type Status = 'loading' | 'success' | 'error';

const VerifyEmail = () => {
  const { id } = useParams<{ id: string }>();
  const { openModal } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!id) {
      setErrorMsg('Invalid verification link.');
      setStatus('error');
      return;
    }

    authApi
      .verify(id)
      .then(() => setStatus('success'))
      .catch((err: unknown) => {
        const axiosErr = err as { response?: { data?: { error?: string } } };
        const code = axiosErr?.response?.data?.error ?? '';
        const messages: Record<string, string> = {
          USER_DOES_NOT_EXIST: 'No account found for this verification link.',
          TOKEN_NOT_FOUND_OR_ALREADY_VERIFIED: 'This link is invalid or your email is already verified.',
        };
        setErrorMsg(messages[code] ?? 'Verification failed. The link may have expired.');
        setStatus('error');
      });
  }, [id]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <Link to="/" className="mb-10">
        <img src={Logo} alt="Henig Diamonds" className="h-10 w-auto object-contain" />
      </Link>

      <div className="w-full max-w-sm text-center space-y-6">
        {status === 'loading' && (
          <>
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
            <p className="text-sm text-muted-foreground">Verifying your email address…</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="flex justify-center">
              <div className="rounded-full bg-primary/10 p-4">
                <CheckCircle2 className="h-10 w-10 text-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-xl font-light tracking-widest uppercase">Email Verified</h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your email has been verified. Your account is now pending review by our team.
                You'll receive an email once your account is approved.
              </p>
            </div>
            <Button
              className="btn-henig-gold"
              onClick={() => { navigate('/'); openModal('login'); }}
            >
              Sign In
            </Button>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="flex justify-center">
              <div className="rounded-full bg-destructive/10 p-4">
                <XCircle className="h-10 w-10 text-destructive" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-xl font-light tracking-widest uppercase">Verification Failed</h1>
              <p className="text-sm text-muted-foreground leading-relaxed">{errorMsg}</p>
            </div>
            <Link to="/">
              <Button variant="outline" className="w-full">
                Return to Home
              </Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
