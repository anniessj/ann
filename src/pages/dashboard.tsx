import React from "react";
import { useGetBotStatus, useGetBotStats, useGetBotLogs, getGetBotStatusQueryKey, getGetBotStatsQueryKey, getGetBotLogsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Command, Activity, Users, ShieldAlert, Cpu, Layers } from "lucide-react";

export default function Dashboard() {
  const { data: status } = useGetBotStatus({
    query: { refetchInterval: 3000, queryKey: getGetBotStatusQueryKey() }
  });
  
  const { data: stats } = useGetBotStats({
    query: { refetchInterval: 5000, queryKey: getGetBotStatsQueryKey() }
  });

  const { data: logs } = useGetBotLogs({
    query: { refetchInterval: 5000, queryKey: getGetBotLogsQueryKey() }
  });

  const formatUptime = (seconds: number | null | undefined) => {
    if (!seconds) return "0s";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  };

  const recentLogs = logs?.slice(0, 5) || [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 font-mono">Overview</h1>
        <p className="text-muted-foreground">System metrics and recent bot activity.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card/50 backdrop-blur border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Commands</CardTitle>
            <Command className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-foreground" data-testid="stat-total-commands">
              {stats?.totalCommands?.toLocaleString() || "0"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-emerald-500">+{stats?.commandsToday || 0}</span> today
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 backdrop-blur border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Groups</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-foreground" data-testid="stat-active-groups">
              {stats?.activeGroups || 0} <span className="text-sm text-muted-foreground">/ {stats?.totalGroups || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">System Uptime</CardTitle>
            <Cpu className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-foreground" data-testid="stat-uptime">
              {formatUptime(status?.uptime)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Security Events</CardTitle>
            <ShieldAlert className="w-4 h-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-foreground" data-testid="stat-security">
              {((stats?.membersKicked || 0) + (stats?.linksBlocked || 0)).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Links blocked & kicks
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-primary" />
              <CardTitle>Recent Activity</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentLogs.length > 0 ? (
                recentLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/20 border border-border/50">
                    <div className="flex items-center space-x-4">
                      <div className={`w-2 h-2 rounded-full ${
                        log.status === "success" ? "bg-emerald-500" :
                        log.status === "error" ? "bg-red-500" : "bg-yellow-500"
                      }`} />
                      <div>
                        <p className="text-sm font-medium font-mono text-foreground">
                          {log.command}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {log.user || "Unknown User"} • {log.group || "Direct Message"}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground font-mono">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No recent activity
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Layers className="w-5 h-5 text-primary" />
              <CardTitle>System Load</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Commands Processed</span>
                <span className="font-mono text-foreground">{stats?.totalCommands || 0}</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[75%]" />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Stickers Created</span>
                <span className="font-mono text-foreground">{stats?.stickersCreated || 0}</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[45%]" />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Security Actions</span>
                <span className="font-mono text-foreground">
                  {(stats?.membersKicked || 0) + (stats?.linksBlocked || 0)}
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-destructive w-[15%]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
