import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  useConnectBot, 
  useDisconnectBot, 
  useGetBotStatus, 
  getGetBotStatusQueryKey 
} from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Smartphone, Power, Copy, CheckCircle2 } from "lucide-react";

const formSchema = z.object({
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits").regex(/^\d+$/, "Only numbers allowed")
});

export default function Connect() {
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);

  const { data: status } = useGetBotStatus({
    query: { refetchInterval: 3000, queryKey: getGetBotStatusQueryKey() }
  });

  const connectMutation = useConnectBot();
  const disconnectMutation = useDisconnectBot();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { phoneNumber: "" }
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    connectMutation.mutate({ data: { phoneNumber: values.phoneNumber } }, {
      onSuccess: () => {
        toast({ title: "Connection initiated", description: "Requesting pairing code..." });
      },
      onError: (error: any) => {
        toast({ 
          title: "Connection failed", 
          description: error?.message || "Could not connect", 
          variant: "destructive" 
        });
      }
    });
  };

  const handleDisconnect = () => {
    disconnectMutation.mutate(undefined, {
      onSuccess: () => {
        toast({ title: "Disconnected", description: "Bot has been disconnected successfully." });
      }
    });
  };

  const formatPairingCode = (code: string | null) => {
    if (!code) return "";
    return code.match(/.{1,4}/g)?.join("-") || code;
  };

  const copyCode = () => {
    if (status?.pairingCode) {
      navigator.clipboard.writeText(status.pairingCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({ title: "Copied!", description: "Pairing code copied to clipboard." });
    }
  };

  const isConnected = status?.state === "connected";
  const isPairing = status?.state === "pairing" && status?.pairingCode;

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 font-mono">Connection</h1>
        <p className="text-muted-foreground">Manage bot WhatsApp connection and pairing.</p>
      </div>

      {isConnected ? (
        <Card className="border-emerald-500/30 bg-emerald-500/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
          <CardHeader>
            <CardTitle className="flex items-center text-emerald-500">
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Bot is Connected
            </CardTitle>
            <CardDescription className="text-emerald-500/70">
              The bot is actively listening for commands.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-foreground">
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Phone Number</span>
                <span className="font-mono">+{status.phoneNumber}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Name</span>
                <span>{status.name || "Annie Bot"}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="destructive" 
              onClick={handleDisconnect}
              disabled={disconnectMutation.isPending}
              data-testid="button-disconnect"
              className="w-full sm:w-auto"
            >
              <Power className="w-4 h-4 mr-2" />
              Disconnect
            </Button>
          </CardFooter>
        </Card>
      ) : isPairing ? (
        <Card className="border-primary/30 bg-card">
          <CardHeader>
            <CardTitle>Pairing Required</CardTitle>
            <CardDescription>
              Enter this code in WhatsApp on your primary phone to link the bot.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-8 bg-secondary/50 rounded-xl border border-border text-center relative group">
              <div className="text-4xl md:text-5xl font-mono font-bold tracking-widest text-primary" data-testid="text-pairing-code">
                {formatPairingCode(status.pairingCode)}
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={copyCode}
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
              </Button>
            </div>

            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground ml-2">
              <li>Open WhatsApp on your primary phone</li>
              <li>Tap <strong>Linked devices</strong> in the menu</li>
              <li>Tap <strong>Link a device</strong></li>
              <li>Tap <strong>Link with phone number instead</strong> at the bottom</li>
              <li>Enter the code shown above</li>
            </ol>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              onClick={handleDisconnect}
              disabled={disconnectMutation.isPending}
              className="w-full sm:w-auto"
            >
              Cancel Pairing
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Connect Bot</CardTitle>
            <CardDescription>
              Enter the phone number the bot will use to connect to WhatsApp.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Smartphone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            placeholder="573001234567" 
                            className="pl-9 font-mono bg-secondary/20" 
                            {...field} 
                            data-testid="input-phone"
                          />
                        </div>
                      </FormControl>
                      <p className="text-xs text-muted-foreground mt-2">
                        Include country code without the + sign.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  disabled={connectMutation.isPending || status?.state === "connecting"}
                  className="w-full"
                  data-testid="button-connect"
                >
                  {connectMutation.isPending || status?.state === "connecting" ? (
                    <span className="flex items-center">
                      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      Connecting...
                    </span>
                  ) : (
                    "Get Pairing Code"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
