import React from "react";
import { useGetBotLogs, getGetBotLogsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Activity, Clock, Terminal, User, Users } from "lucide-react";

export default function Logs() {
  const { data: logs, isLoading } = useGetBotLogs({
    query: { refetchInterval: 5000, queryKey: getGetBotLogsQueryKey() }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20">Success</Badge>;
      case "error":
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20">Error</Badge>;
      case "blocked":
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20">Blocked</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return {
      date: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      time: d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 font-mono">Activity Logs</h1>
          <p className="text-muted-foreground">Real-time command execution history.</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="font-mono font-medium">Live</span>
        </div>
      </div>

      <Card className="bg-card border-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-secondary/40">
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="w-[180px] font-mono text-muted-foreground">Timestamp</TableHead>
                <TableHead className="font-mono text-muted-foreground">Command</TableHead>
                <TableHead className="font-mono text-muted-foreground">User</TableHead>
                <TableHead className="font-mono text-muted-foreground">Context</TableHead>
                <TableHead className="text-right font-mono text-muted-foreground">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <TableRow key={i} className="border-border">
                    <TableCell><div className="h-4 bg-secondary/50 rounded w-24 animate-pulse" /></TableCell>
                    <TableCell><div className="h-4 bg-secondary/50 rounded w-16 animate-pulse" /></TableCell>
                    <TableCell><div className="h-4 bg-secondary/50 rounded w-32 animate-pulse" /></TableCell>
                    <TableCell><div className="h-4 bg-secondary/50 rounded w-32 animate-pulse" /></TableCell>
                    <TableCell className="text-right"><div className="h-5 bg-secondary/50 rounded w-16 ml-auto animate-pulse" /></TableCell>
                  </TableRow>
                ))
              ) : !logs || logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground border-border">
                    <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    No activity logs recorded yet.
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => {
                  const { date, time } = formatDate(log.timestamp);
                  return (
                    <TableRow key={log.id} className="border-border hover:bg-secondary/20 transition-colors group">
                      <TableCell className="font-mono whitespace-nowrap">
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="w-3.5 h-3.5 mr-2 opacity-50" />
                          <span className="text-foreground">{time}</span>
                          <span className="ml-2 text-xs opacity-50">{date}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Terminal className="w-3.5 h-3.5 mr-2 text-primary opacity-70" />
                          <span className="font-mono text-primary font-medium">{log.command}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-muted-foreground">
                          <User className="w-3.5 h-3.5 mr-2 opacity-50" />
                          <span className="truncate max-w-[150px]">{log.user || "Unknown"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-muted-foreground">
                          <Users className="w-3.5 h-3.5 mr-2 opacity-50" />
                          <span className="truncate max-w-[200px]">{log.group || "Direct Message"}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {getStatusBadge(log.status)}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
