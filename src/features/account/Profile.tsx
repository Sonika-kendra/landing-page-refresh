import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
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

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Card className="p-6 max-w-md">
      <h2 className="font-medium mb-4">Personal Information</h2>
      <div className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input
            value={profileForm.title}
            onChange={(e) => setProfileForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="Mr / Mrs / Dr"
          />
        </div>
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
        <div>
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
  );
};

export default Profile;
