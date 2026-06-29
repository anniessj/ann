import React from "react";
import { useGetCommands, getGetCommandsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Command as CommandIcon } from "lucide-react";

export default function Commands() {
  const [search, setSearch] = React.useState("");
  
  const { data: commands, isLoading } = useGetCommands({
    query: { queryKey: getGetCommandsQueryKey() }
  });

  const getPermissionBadge = (permission: string) => {
    switch (permission) {
      case "owner":
        return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20">Owner</Badge>;
      case "admin":
        return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20">Admin</Badge>;
      default:
        return <Badge variant="outline" className="text-muted-foreground">Everyone</Badge>;
    }
  };

  const filteredCommands = React.useMemo(() => {
    if (!commands) return [];
    if (!search) return commands;
    const lower = search.toLowerCase();
    return commands.filter(
      c => c.command.toLowerCase().includes(lower) || 
           c.description.toLowerCase().includes(lower) ||
           c.category.toLowerCase().includes(lower)
    );
  }, [commands, search]);

  const categories = React.useMemo(() => {
    const cats = new Set(filteredCommands.map(c => c.category));
    return Array.from(cats).sort();
  }, [filteredCommands]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 font-mono">Commands</h1>
          <p className="text-muted-foreground">Command reference and permissions.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search commands..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-secondary/20 font-mono"
            data-testid="input-search-commands"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="h-8 bg-secondary/50 rounded w-48 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <Card key={i} className="bg-card"><CardContent className="h-24 p-6" /></Card>
            ))}
          </div>
        </div>
      ) : filteredCommands.length === 0 ? (
        <div className="text-center py-16 px-4 bg-card rounded-lg border border-border">
          <CommandIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-1">No commands found</h3>
          <p className="text-muted-foreground">No commands match your search criteria.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {categories.map(category => {
            const categoryCommands = filteredCommands.filter(c => c.category === category);
            return (
              <div key={category} className="space-y-4">
                <div className="flex items-center space-x-2 border-b border-border pb-2">
                  <h2 className="text-lg font-semibold text-primary capitalize font-mono">{category}</h2>
                  <Badge variant="secondary" className="text-xs">{categoryCommands.length}</Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {categoryCommands.map(cmd => (
                    <Card key={cmd.command} className="bg-card/50 border-border hover:bg-secondary/10 transition-colors" data-testid={`cmd-${cmd.command}`}>
                      <CardHeader className="p-4 pb-2">
                        <div className="flex items-start justify-between">
                          <CardTitle className="font-mono text-base text-foreground bg-secondary/30 px-2 py-0.5 rounded border border-border/50">
                            {cmd.command}
                          </CardTitle>
                          {getPermissionBadge(cmd.permission)}
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {cmd.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
