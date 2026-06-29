import React from "react";
import { Link, useLocation } from "wouter";
import { useGetBotStatus, getGetBotStatusQueryKey } from "@workspace/api-client-react";
import { 
  Terminal, 
  LayoutDashboard, 
  Link2, 
  Users, 
  Command, 
  ActivitySquare,
  Server,
  Wifi,
  WifiOff,
  RefreshCw
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/connect", label: "Connection", icon: Link2 },
  { href: "/groups", label: "Groups", icon: Users },
  { href: "/commands", label: "Commands", icon: Command },
  { href: "/logs", label: "Activity Logs", icon: ActivitySquare },
];

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const { data: status } = useGetBotStatus({
    query: { refetchInterval: 3000, queryKey: getGetBotStatusQueryKey() }
  });

  const getStatusColor = () => {
    if (!status) return "bg-gray-500";
    if (status.state === "connected") return "bg-emerald-500";
    if (status.state === "pairing" || status.state === "connecting") return "bg-yellow-500";
    return "bg-red-500";
  };

  const getStatusText = () => {
    if (!status) return "Unknown";
    if (status.state === "connected") return "Connected";
    if (status.state === "pairing") return "Pairing...";
    if (status.state === "connecting") return "Connecting...";
    return "Disconnected";
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Terminal className="w-6 h-6 text-primary mr-3" />
          <h1 className="font-mono font-bold text-lg tracking-tight text-foreground">
            ANNIE_BOT<span className="text-primary animate-pulse">_</span>
          </h1>
        </div>
        
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                data-testid={`nav-${item.label.toLowerCase()}`}
                className={`flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon className={`w-5 h-5 mr-3 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center p-3 bg-secondary/50 rounded-lg border border-border">
            <Server className="w-4 h-4 text-muted-foreground mr-3" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">
                System Status
              </p>
              <p className="text-xs text-muted-foreground truncate">
                Operational
              </p>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Status Bar */}
        <header className="h-16 border-b border-border bg-background/50 backdrop-blur-sm flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-secondary/30 border border-border">
              <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
              <span className="text-xs font-mono font-medium text-foreground uppercase tracking-wider">
                {getStatusText()}
              </span>
            </div>
            {status?.phoneNumber && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>Number:</span>
                <span className="font-mono text-foreground">+{status.phoneNumber}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {status?.state === "connected" ? (
              <Wifi className="w-4 h-4 text-emerald-500" />
            ) : status?.state === "pairing" || status?.state === "connecting" ? (
              <RefreshCw className="w-4 h-4 text-yellow-500 animate-spin" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-500" />
            )}
            <div className="text-xs font-mono text-muted-foreground">
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
          <div className="max-w-6xl mx-auto relative z-10">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
