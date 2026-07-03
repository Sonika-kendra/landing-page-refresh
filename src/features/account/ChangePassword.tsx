import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { authApi } from '@/api/auth';
import { toast } from '@/hooks/use-toast';

const ChangePassword = () => {
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handlePasswordSave = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({ title: 'New passwords do not match', variant: 'destructive' });
      return;
    }
    if (passwordForm.newPassword.length < 5) {
      toast({ title: 'Password must be at least 5 characters', variant: 'destructive' });
      return;
    }
    setPasswordLoading(true);
    try {
      await authApi.changePassword(passwordForm.oldPassword, passwordForm.newPassword);
      toast({ title: 'Password changed successfully' });
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch {
      toast({ title: 'Failed to change password — check your current password', variant: 'destructive' });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <Card className="p-6 max-w-md">
      <h2 className="font-medium mb-1">Change Password</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Leave blank if you do not want to change your password.
      </p>
      <Separator className="mb-4" />
      <div className="space-y-4">
        <div>
          <Label>Current Password</Label>
          <div className="relative">
            <Input
              type={showOld ? 'text' : 'password'}
              value={passwordForm.oldPassword}
              onChange={(e) => setPasswordForm((f) => ({ ...f, oldPassword: e.target.value }))}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowOld((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div>
          <Label>New Password</Label>
          <div className="relative">
            <Input
              type={showNew ? 'text' : 'password'}
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm((f) => ({ ...f, newPassword: e.target.value }))}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowNew((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div>
          <Label>Confirm New Password</Label>
          <div className="relative">
            <Input
              type={showConfirm ? 'text' : 'password'}
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm((f) => ({ ...f, confirmPassword: e.target.value }))}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-6">
        <Button variant="outline" onClick={handlePasswordSave} disabled={passwordLoading} className="bg-primary border-primary text-white transition-colors duration-300 hover:bg-white hover:text-accent hover:border-white [&:hover_svg]:translate-x-2">
          {passwordLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Update Password
          {!passwordLoading && <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300" />}
        </Button>
      </div>
    </Card>
  );
};

export default ChangePassword;
