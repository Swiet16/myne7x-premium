import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { CreditCard, Search, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface PaymentRequest {
  id: string;
  user_id: string;
  product_id: string;
  status: string;
  payment_method: string;
  contact_method: string;
  contact_value: string;
  transaction_id: string;
  payment_screenshot_url: string;
  admin_notes: string;
  alternative_payment_details?: string;
  created_at: string;
  product_title?: string;
  user_email?: string;
}

const PaymentRequestManagement = () => {
  const [requests, setRequests] = useState<PaymentRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<PaymentRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    fetchPaymentRequests();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('payment_requests_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'payment_requests' },
        () => {
          fetchPaymentRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchPaymentRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Fetch related data separately
      const formattedData = await Promise.all(
        (data || []).map(async (request) => {
          const [productData, profileData] = await Promise.all([
            supabase.from('products').select('title').eq('id', request.product_id).single(),
            supabase.from('profiles').select('email').eq('user_id', request.user_id).single()
          ]);
          
          return {
            ...request,
            product_title: productData.data?.title,
            user_email: profileData.data?.email
          };
        })
      );
      
      setRequests(formattedData);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load payment requests",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (requestId: string, status: string, notes?: string) => {
    try {
      const updates: any = { status };
      if (notes) updates.admin_notes = notes;

      const { error } = await supabase
        .from('payment_requests')
        .update(updates)
        .eq('id', requestId);

      if (error) throw error;

      // If approved, grant user access to the product
      if (status === 'approved') {
        const request = requests.find(r => r.id === requestId);
        if (request) {
          await supabase
            .from('user_product_access')
            .insert({
              user_id: request.user_id,
              product_id: request.product_id
            });

          // Create notification for user
          await supabase
            .from('notifications')
            .insert({
              user_id: request.user_id,
              title: 'Payment Approved!',
              message: `Your payment for "${request.product_title}" has been approved. You can now download the product.`,
              type: 'success',
              related_request_id: requestId
            });
        }
      }

      toast({
        title: "Success",
        description: `Payment request ${status} successfully`,
      });

      fetchPaymentRequests();
      setSelectedRequest(null);
      setAdminNotes('');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update payment request",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
    }
  };

  const filteredRequests = requests.filter(request =>
    request.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.product_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.payment_method.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Request Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading payment requests...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Request Management
        </CardTitle>
        <CardDescription>
          Review and approve payment requests from users
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{request.user_email}</div>
                      <div className="text-sm text-muted-foreground">
                        {request.contact_method}: {request.contact_value}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{request.product_title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {request.payment_method === 'nayapay' ? 'Nayapay' : 'Custom'}
                    </Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>
                    {new Date(request.created_at).toLocaleDateString()}
                  </TableCell>
                   <TableCell>
                     <div className="flex gap-2">
                       {/* Quick actions for pending requests */}
                       {request.status === 'pending' && (
                         <>
                           <Button
                             size="sm"
                             onClick={() => updateRequestStatus(request.id, 'approved')}
                             className="h-8 px-2"
                           >
                             <CheckCircle className="h-3 w-3" />
                           </Button>
                           <Button
                             size="sm"
                             variant="destructive"
                             onClick={() => updateRequestStatus(request.id, 'rejected')}
                             className="h-8 px-2"
                           >
                             <XCircle className="h-3 w-3" />
                           </Button>
                         </>
                       )}
                       
                       {/* View details button */}
                       <Dialog>
                         <DialogTrigger asChild>
                           <Button
                             size="sm"
                             variant="outline"
                             onClick={() => {
                               setSelectedRequest(request);
                               setAdminNotes(request.admin_notes || '');
                             }}
                             className="h-8 px-2"
                           >
                             <Eye className="h-3 w-3" />
                           </Button>
                         </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Payment Request Details</DialogTitle>
                            <DialogDescription>
                              Review the payment request information
                            </DialogDescription>
                          </DialogHeader>
                          {selectedRequest && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <strong>User:</strong> {selectedRequest.user_email}
                                </div>
                                <div>
                                  <strong>Product:</strong> {selectedRequest.product_title}
                                </div>
                                 <div>
                                   <strong>Payment Method:</strong> 
                                   <Badge variant="outline" className="ml-2">
                                     {selectedRequest.payment_method === 'nayapay' ? 'Nayapay' : 'Custom'}
                                   </Badge>
                                 </div>
                                <div>
                                  <strong>Transaction ID:</strong> {selectedRequest.transaction_id || 'N/A'}
                                </div>
                                <div>
                                  <strong>Contact:</strong> {selectedRequest.contact_method} - {selectedRequest.contact_value}
                                </div>
                                <div>
                                  <strong>Status:</strong> {getStatusBadge(selectedRequest.status)}
                                </div>
                              </div>

                              {selectedRequest.payment_screenshot_url && (
                                <div>
                                  <strong>Payment Screenshot:</strong>
                                  <div className="mt-2">
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button variant="outline" size="sm">
                                          <Eye className="h-4 w-4 mr-2" />
                                          View Screenshot
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent className="max-w-4xl">
                                        <DialogHeader>
                                          <DialogTitle>Payment Screenshot</DialogTitle>
                                        </DialogHeader>
                                        <div className="flex justify-center">
                                          <img 
                                            src={selectedRequest.payment_screenshot_url} 
                                            alt="Payment Screenshot" 
                                            className="max-w-full max-h-[70vh] object-contain border rounded"
                                          />
                                        </div>
                                      </DialogContent>
                                    </Dialog>
                                  </div>
                                </div>
                              )}

                              {selectedRequest.alternative_payment_details && (
                                <div>
                                  <strong>Additional Details:</strong>
                                  <p className="mt-1 text-sm">{selectedRequest.alternative_payment_details}</p>
                                </div>
                              )}

                              <div>
                                <strong>Admin Notes:</strong>
                                <Textarea
                                  value={adminNotes || selectedRequest.admin_notes || ''}
                                  onChange={(e) => setAdminNotes(e.target.value)}
                                  placeholder="Add admin notes..."
                                  className="mt-2"
                                />
                              </div>

                              {selectedRequest.status === 'pending' && (
                                <div className="flex gap-2 pt-4">
                                  <Button
                                    onClick={() => updateRequestStatus(selectedRequest.id, 'approved', adminNotes)}
                                    className="flex-1"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Approve
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    onClick={() => updateRequestStatus(selectedRequest.id, 'rejected', adminNotes)}
                                    className="flex-1"
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Reject
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No payment requests found
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentRequestManagement;