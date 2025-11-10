import { ReactNode, useState } from "react";
import { NavLink } from "@/components/NavLink";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  TrendingUp,
  CreditCard,
  Activity,
  Settings,
  FileText,
  Menu,
  X,
} from "lucide-react";

interface InternalLayoutProps {
  children: ReactNode;
}

const navItems = [
  { to: "/internal-console", icon: LayoutDashboard, label: "Overview", end: true },
  { to: "/internal-console/users", icon: Users, label: "Users" },
  { to: "/internal-console/sessions", icon: MessageSquare, label: "Sessions" },
  { to: "/internal-console/analytics", icon: TrendingUp, label: "Trade Analytics" },
  { to: "/internal-console/billing", icon: CreditCard, label: "Billing & Plans" },
  { to: "/internal-console/system", icon: Activity, label: "System Metrics" },
  { to: "/internal-console/config", icon: Settings, label: "Configuration" },
  { to: "/internal-console/logs", icon: FileText, label: "Logs" },
];

export function InternalLayout({ children }: InternalLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-card border-b border-border z-30 flex items-center px-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-accent rounded-lg smooth-transition"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <span className="ml-3 font-semibold text-foreground">Internal Console</span>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-card border-r border-border z-40 smooth-transition lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-bold text-foreground">Internal Console</h1>
          <p className="text-sm text-muted-foreground mt-1">Founder Dashboard</p>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground smooth-transition"
              activeClassName="bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="lg:ml-64 pt-14 lg:pt-0 min-h-screen">
        <div className="p-6 lg:p-8">{children}</div>
      </main>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
