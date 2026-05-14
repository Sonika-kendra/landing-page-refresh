import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { authApi, ProfileUpdatePayload } from '@/api/auth';
import { toast } from '@/hooks/use-toast';

const Profile = () => {
  const [profileForm, setProfileForm] = useState<ProfileUpdatePayload>({
    title: '',
    firstName: '',
    lastName: '',
    companyName: '',
    phone: '',
    mobileTelephone: '',
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    authApi
      .getProfile()
      .then((res) => {
        const u = res.data as any;
        setProfileForm({
          title: u.title ?? '',
          firstName: u.firstName ?? '',
          lastName: u.lastName ?? '',
          companyName: u.companyName ?? '',
          phone: u.phone ?? '',
          mobileTelephone: u.mobileTelephone ?? '',
        });
      })
      .catch(() => toast({ title: 'Failed to load profile', variant: 'destructive' }))
      .finally(() => setFetchLoading(false));
  }, []);

  const handleProfileSave = async () => {
    setProfileLoading(true);
    try {
      await authApi.updateProfile(profileForm);
      toast({ title: 'Profile updated successfully' });
    } catch {
      toast({ title: 'Failed to update profile', variant: 'destructive' });
    } finally {
      setProfileLoading(false);
    }
  };

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

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Personal Information */}
      <Card className="p-6">
        <h2 className="font-medium mb-4">Personal Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Title</Label>
            <Input
              value={profileForm.title}
              onChange={(e) => setProfileForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Mr / Mrs / Dr"
            />
          </div>
          <div />
          <div>
            <Label>First Name</Label>
            <Input
              value={profileForm.firstName}
              onChange={(e) => setProfileForm((f) => ({ ...f, firstName: e.target.value }))}
            />
          </div>
          <div>
            <Label>Last Name</Label>
            <Input
              value={profileForm.lastName}
              onChange={(e) => setProfileForm((f) => ({ ...f, lastName: e.target.value }))}
            />
          </div>
          <div className="col-span-2">
            <Label>Company Name</Label>
            <Input
              value={profileForm.companyName}
              onChange={(e) => setProfileForm((f) => ({ ...f, companyName: e.target.value }))}
            />
          </div>
          <div>
            <Label>Phone</Label>
            <Input
              value={profileForm.phone}
              onChange={(e) => setProfileForm((f) => ({ ...f, phone: e.target.value }))}
            />
          </div>
          <div>
            <Label>Mobile</Label>
            <Input
              value={profileForm.mobileTelephone}
              onChange={(e) => setProfileForm((f) => ({ ...f, mobileTelephone: e.target.value }))}
            />
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <Button onClick={handleProfileSave} disabled={profileLoading}>
            {profileLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </Card>

      {/* Change Password */}
      <Card className="p-6">
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
          <Button onClick={handlePasswordSave} disabled={passwordLoading}>
            {passwordLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Update Password
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
