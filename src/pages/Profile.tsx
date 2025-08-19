import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { User, Package, Clock, CheckCircle, XCircle, MessageSquare } from 'lucide-react';

interface Profile {
  id: string;
  full_name: string;
  whatsapp_number: string;
  telegram_id: string;
}

interface PaymentRequest {
  id: string;
  payment_method: string;
  transaction_id: string;
  contact_method: string;
  contact_value: string;
  status: string;
  admin_notes: string;
  created_at: string;
  products: {
    title: string;
    price: number;
  };
}

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchPaymentRequests();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setProfile(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentRequests = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('payment_requests')
        .select(`
          *,
          products (
            title,
            price
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPaymentRequests(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load payment requests",
        variant: "destructive"
      });
    }
  };

  const updateProfile = async (formData: FormData) => {
    if (!user) return;

    setSaving(true);
    try {
      const profileData = {
        user_id: user.id,
        email: user.email!,
        full_name: formData.get('full_name') as string,
        whatsapp_number: formData.get('whatsapp_number') as string,
        telegram_id: formData.get('telegram_id') as string,
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(profileData);

      if (error) throw error;

      setProfile({ ...profileData, id: profile?.id || '' });
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-yellow-500';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Profile Info
          </TabsTrigger>
          <TabsTrigger value="requests">
            <Package className="h-4 w-4 mr-2" />
            Payment Requests
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your profile information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  updateProfile(formData);
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ''}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    type="text"
                    defaultValue={profile?.full_name || ''}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
                  <Input
                    id="whatsapp_number"
                    name="whatsapp_number"
                    type="text"
                    defaultValue={profile?.whatsapp_number || ''}
                    placeholder="+1234567890"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telegram_id">Telegram ID</Label>
                  <Input
                    id="telegram_id"
                    name="telegram_id"
                    type="text"
                    defaultValue={profile?.telegram_id || ''}
                    placeholder="@yourusername"
                  />
                </div>
                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests">
          <div className="space-y-4">
            {paymentRequests.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No payment requests</h3>
                  <p className="text-muted-foreground">
                    You haven't made any payment requests yet
                  </p>
                </CardContent>
              </Card>
            ) : (
              paymentRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {request.products.title}
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(request.status)}
                        <Badge className={getStatusColor(request.status)}>
                          {request.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <CardDescription>
                      Requested on {new Date(request.created_at).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p><strong>Payment Method:</strong> {request.payment_method}</p>
                        <p><strong>Contact:</strong> {request.contact_method} - {request.contact_value}</p>
                        {request.transaction_id && (
                          <p><strong>Transaction ID:</strong> {request.transaction_id}</p>
                        )}
                      </div>
                      <div>
                        <p><strong>Amount:</strong> ${request.products.price}</p>
                        {request.admin_notes && (
                          <div className="mt-2">
                            <div className="flex items-center space-x-2">
                              <MessageSquare className="h-4 w-4" />
                              <strong>Admin Notes:</strong>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {request.admin_notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;