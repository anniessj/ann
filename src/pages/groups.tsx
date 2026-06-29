import React from "react";
import { useGetBotGroups, getGetBotGroupsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Shield, ShieldOff, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Groups() {
  const [search, setSearch] = React.useState("");
  
  const { data: groups, isLoading } = useGetBotGroups({
    query: { queryKey: getGetBotGroupsQueryKey() }
  });

  const filteredGroups = React.useMemo(() => {
    if (!groups) return [];
    if (!search) return groups;
    return groups.filter(g => g.name.toLowerCase().includes(search.toLowerCase()));
  }, [groups, search]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 font-mono">Groups</h1>
          <p className="text-muted-foreground">Manage monitored WhatsApp groups.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search groups..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-secondary/20"
            data-testid="input-search-groups"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="bg-card border-border">
              <CardHeader className="space-y-2">
                <div className="h-5 bg-secondary/50 rounded w-2/3 animate-pulse" />
                <div className="h-4 bg-secondary/50 rounded w-1/3 animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-secondary/50 rounded w-1/4 animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredGroups.length === 0 ? (
        <div className="text-center py-16 px-4 bg-card rounded-lg border border-border">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-1">No groups found</h3>
          <p className="text-muted-foreground">
            {search ? "No groups match your search query." : "The bot is not currently in any active groups."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGroups.map((group) => (
            <Card key={group.id} className="bg-card border-border hover:border-primary/50 transition-colors" data-testid={`card-group-${group.id}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base font-semibold leading-tight line-clamp-2" title={group.name}>
                    {group.name}
                  </CardTitle>
                  <Badge variant={group.active ? "default" : "secondary"} className={group.active ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20" : ""}>
                    {group.active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <CardDescription className="text-xs font-mono truncate">
                  ID: {group.id.split('@')[0]}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mt-2 pt-4 border-t border-border/50">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{group.memberCount} members</span>
                  </div>
                  <div className="flex items-center text-sm">
                    {group.antilink ? (
                      <span className="flex items-center text-emerald-500" title="Anti-link protection active">
                        <Shield className="w-4 h-4 mr-1.5" />
                        Anti-link
                      </span>
                    ) : (
                      <span className="flex items-center text-muted-foreground" title="Anti-link protection inactive">
                        <ShieldOff className="w-4 h-4 mr-1.5" />
                        No Anti-link
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
