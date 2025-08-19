import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerDemo } from '@/components/ui/date-picker';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { 
  Download, 
  FileText, 
  Users, 
  CreditCard, 
  Package,
  Calendar,
  Filter
} from 'lucide-react';

interface ExportDataProps {
  onExport?: (type: string, data: any[]) => void;
}

const ExportData = ({ onExport }: ExportDataProps) => {
  const [exportType, setExportType] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [loading, setLoading] = useState(false);

  const exportOptions = [
    { 
      value: 'payment_requests', 
      label: 'Payment Requests', 
      icon: CreditCard,
      description: 'All payment request data with user details'
    },
    { 
      value: 'users', 
      label: 'User Data', 
      icon: Users,
      description: 'User profiles and registration info'
    },
    { 
      value: 'products', 
      label: 'Products', 
      icon: Package,
      description: 'Product catalog and performance data'
    },
    { 
      value: 'analytics', 
      label: 'Analytics Report', 
      icon: FileText,
      description: 'Comprehensive analytics and revenue data'
    }
  ];

  const handleExport = async (format: 'csv' | 'excel') => {
    if (!exportType) {
      toast({
        title: "Error",
        description: "Please select data type to export",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      let data: any[] = [];
      let filename = '';

      switch (exportType) {
        case 'payment_requests':
          data = await fetchPaymentRequests();
          filename = `payment_requests_${new Date().toISOString().split('T')[0]}`;
          break;
        case 'users':
          data = await fetchUsers();
          filename = `users_${new Date().toISOString().split('T')[0]}`;
          break;
        case 'products':
          data = await fetchProducts();
          filename = `products_${new Date().toISOString().split('T')[0]}`;
          break;
        case 'analytics':
          data = await fetchAnalytics();
          filename = `analytics_${new Date().toISOString().split('T')[0]}`;
          break;
      }

      if (format === 'csv') {
        downloadCSV(data, filename);
      } else {
        // For Excel format, we'll create a more structured export
        downloadExcel(data, filename);
      }

      onExport?.(exportType, data);

      toast({
        title: "Success",
        description: `${exportType.replace('_', ' ')} data exported successfully`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Error",
        description: "Failed to export data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentRequests = async () => {
    let query = supabase
      .from('payment_requests')
      .select(`
        *,
        products(title, price),
        profiles(email, full_name)
      `);

    if (dateFrom) {
      query = query.gte('created_at', dateFrom.toISOString());
    }
    if (dateTo) {
      query = query.lte('created_at', dateTo.toISOString());
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data?.map(item => ({
      id: item.id,
      user_email: item.profiles?.email || 'N/A',
      user_name: item.profiles?.full_name || 'N/A',
      product_title: item.products?.title,
      product_price: item.products?.price,
      payment_method: item.payment_method,
      status: item.status,
      transaction_id: item.transaction_id,
      contact_method: item.contact_method,
      contact_value: item.contact_value,
      admin_notes: item.admin_notes,
      created_at: item.created_at,
      updated_at: item.updated_at
    })) || [];
  };

  const fetchUsers = async () => {
    let query = supabase
      .from('profiles')
      .select(`
        *,
        user_roles(role)
      `);

    if (dateFrom) {
      query = query.gte('created_at', dateFrom.toISOString());
    }
    if (dateTo) {
      query = query.lte('created_at', dateTo.toISOString());
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data?.map(item => ({
      id: item.id,
      email: item.email,
      full_name: item.full_name,
      whatsapp_number: item.whatsapp_number,
      telegram_id: item.telegram_id,
      role: Array.isArray(item.user_roles) ? item.user_roles[0]?.role || 'user' : 'user',
      created_at: item.created_at,
      updated_at: item.updated_at
    })) || [];
  };

  const fetchProducts = async () => {
    let query = supabase
      .from('products')
      .select('*');

    if (dateFrom) {
      query = query.gte('created_at', dateFrom.toISOString());
    }
    if (dateTo) {
      query = query.lte('created_at', dateTo.toISOString());
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  };

  const fetchAnalytics = async () => {
    // Combine multiple data sources for analytics report
    const [payments, users, products] = await Promise.all([
      fetchPaymentRequests(),
      fetchUsers(),
      fetchProducts()
    ]);

    const analytics = {
      summary: {
        total_users: users.length,
        total_products: products.length,
        total_payments: payments.length,
        approved_payments: payments.filter(p => p.status === 'approved').length,
        pending_payments: payments.filter(p => p.status === 'pending').length,
        rejected_payments: payments.filter(p => p.status === 'rejected').length,
        total_revenue: payments
          .filter(p => p.status === 'approved')
          .reduce((sum, p) => sum + (p.product_price || 0), 0)
      },
      payments,
      users,
      products
    };

    return [analytics];
  };

  const downloadCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadExcel = (data: any[], filename: string) => {
    // For now, we'll use CSV format for Excel export
    // In a production app, you'd use a library like xlsx
    downloadCSV(data, filename);
  };

  return (
    <div className="space-y-6">
      <Card className="card-neon">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-glow">
            <Download className="h-5 w-5 text-neon-blue" />
            Export Data
          </CardTitle>
          <CardDescription>
            Export platform data in CSV or Excel format
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Export Type Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Data Type</label>
            <Select value={exportType} onValueChange={setExportType}>
              <SelectTrigger>
                <SelectValue placeholder="Select data type to export" />
              </SelectTrigger>
              <SelectContent>
                {exportOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <option.icon className="h-4 w-4" />
                      <div>
                        <div>{option.label}</div>
                        <div className="text-xs text-muted-foreground">{option.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                From Date
              </label>
              <DatePickerDemo 
                date={dateFrom} 
                onDateChange={setDateFrom}
                placeholder="Select start date"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                To Date
              </label>
              <DatePickerDemo 
                date={dateTo} 
                onDateChange={setDateTo}
                placeholder="Select end date"
              />
            </div>
          </div>

          {/* Export Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={() => handleExport('csv')}
              disabled={loading || !exportType}
              className="btn-neon flex-1"
            >
              <FileText className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button
              onClick={() => handleExport('excel')}
              disabled={loading || !exportType}
              variant="secondary"
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Excel
            </Button>
          </div>

          {loading && (
            <div className="text-center py-4">
              <div className="inline-flex items-center gap-2 text-neon-cyan">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-neon-cyan"></div>
                Preparing export...
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Export Preview */}
      {exportType && (
        <Card className="card-neon">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-neon-purple" />
              Export Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              <p><strong>Data Type:</strong> {exportOptions.find(opt => opt.value === exportType)?.label}</p>
              <p><strong>Date Range:</strong> {
                dateFrom && dateTo 
                  ? `${dateFrom.toLocaleDateString()} - ${dateTo.toLocaleDateString()}`
                  : dateFrom
                  ? `From ${dateFrom.toLocaleDateString()}`
                  : dateTo
                  ? `Until ${dateTo.toLocaleDateString()}`
                  : 'All time'
              }</p>
              <p><strong>Format:</strong> CSV / Excel compatible</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Separate DatePicker component for better organization
const DatePicker = ({ date, onDateChange, placeholder }: {
  date?: Date;
  onDateChange: (date?: Date) => void;
  placeholder: string;
}) => {
  return (
    <DatePickerDemo 
      date={date} 
      onDateChange={onDateChange}
      placeholder={placeholder}
    />
  );
};

export default ExportData;