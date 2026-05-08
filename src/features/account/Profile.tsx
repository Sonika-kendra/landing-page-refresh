import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const Profile = () => (
  <Card className="p-6 max-w-2xl">
    <h2 className="font-medium mb-4">Personal Information</h2>
    <div className="grid grid-cols-2 gap-4">
      <div><Label>First Name</Label><Input defaultValue="Henig" /></div>
      <div><Label>Last Name</Label><Input defaultValue="Customer" /></div>
      <div className="col-span-2"><Label>Email</Label><Input defaultValue="customer@henigdiamonds.co.uk" /></div>
      <div><Label>Phone</Label><Input defaultValue="+44 20 1234 5678" /></div>
      <div><Label>Company</Label><Input defaultValue="Henig Jewellers Ltd" /></div>
    </div>
    <div className="flex justify-end mt-6">
      <Button>Save Changes</Button>
    </div>
  </Card>
);

export default Profile;
