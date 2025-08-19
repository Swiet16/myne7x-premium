import { useState } from 'react';
import { 
  LayoutDashboard, 
  CreditCard, 
  Package, 
  Users, 
  Settings, 
  BarChart3,
  Upload,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

const AdminSidebar = ({ activeTab, onTabChange, isDarkMode, onThemeToggle }: AdminSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Overview & Analytics' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, description: 'Charts & Reports' },
    { id: 'payments', label: 'Payments', icon: CreditCard, description: 'Payment Requests' },
    { id: 'products', label: 'Products', icon: Package, description: 'Product Management' },
    { id: 'upload', label: 'Upload', icon: Upload, description: 'Add New Products' },
    { id: 'users', label: 'Users', icon: Users, description: 'User Management' },
    { id: 'settings', label: 'Settings', icon: Settings, description: 'System Config' },
  ];

  return (
    <div className={cn(
      "fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 z-50",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-neon rounded-lg flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-orbitron font-bold text-lg text-glow">Myne7x</h2>
              <p className="text-xs text-muted-foreground">Admin Portal</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 p-0 hover:bg-sidebar-accent"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start h-12 transition-all duration-200",
                isActive && "bg-gradient-neon text-white shadow-neon-blue",
                !isActive && "hover:bg-sidebar-accent hover:shadow-neon-blue/20",
                isCollapsed && "px-0 justify-center"
              )}
              onClick={() => onTabChange(item.id)}
            >
              <Icon className={cn(
                "h-5 w-5",
                isActive && "text-white",
                isCollapsed ? "mx-0" : "mr-3"
              )} />
              {!isCollapsed && (
                <div className="flex-1 text-left">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-muted-foreground">{item.description}</div>
                </div>
              )}
            </Button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        <Button
          variant="ghost"
          onClick={onThemeToggle}
          className={cn(
            "w-full justify-start h-10",
            isCollapsed && "px-0 justify-center"
          )}
        >
          {isDarkMode ? (
            <Sun className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
          ) : (
            <Moon className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
          )}
          {!isCollapsed && (isDarkMode ? "Light Mode" : "Dark Mode")}
        </Button>
        
        {!isCollapsed && (
          <div className="text-xs text-muted-foreground text-center">
            <div className="font-orbitron text-neon-cyan">Myne7x Admin</div>
            <div>v2.0.0</div>
          </div>
        )}
      </div>

      {/* Floating effects */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-10 w-20 h-20 bg-neon-blue/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/3 -left-5 w-15 h-15 bg-neon-purple/10 rounded-full blur-lg animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 -left-8 w-12 h-12 bg-neon-cyan/10 rounded-full blur-md animate-pulse delay-2000"></div>
      </div>
    </div>
  );
};

export default AdminSidebar;