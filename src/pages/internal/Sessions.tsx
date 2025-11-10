import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare } from "lucide-react";
import { useFounderCheck } from "@/hooks/useFounderCheck";
import { InternalLayout } from "@/components/InternalLayout";

interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  user_id: string;
  user_email: string;
  message_count: number;
}

export default function Sessions() {
  const { loading: roleLoading } = useFounderCheck();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      if (roleLoading) return;

      try {
        const { data: chats, error: chatsError } = await supabase
          .from("chats")
          .select("*, profiles(email)")
          .order("created_at", { ascending: false });

        if (chatsError) throw chatsError;

        const sessionsWithCounts = await Promise.all(
          (chats || []).map(async (chat) => {
            const { count } = await supabase
              .from("messages")
              .select("*", { count: "exact", head: true })
              .eq("chat_id", chat.id);

            return {
              id: chat.id,
              title: chat.title,
              created_at: chat.created_at,
              user_id: chat.user_id,
              user_email: (chat.profiles as any)?.email || "Unknown",
              message_count: count || 0,
            };
          })
        );

        setSessions(sessionsWithCounts);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [roleLoading]);

  if (roleLoading || loading) {
    return (
      <InternalLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </InternalLayout>
    );
  }

  const totalMessages = sessions.reduce((sum, session) => sum + session.message_count, 0);
  const avgMessagesPerSession =
    sessions.length > 0 ? (totalMessages / sessions.length).toFixed(1) : 0;

  return (
    <InternalLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI Chat Sessions</h1>
          <p className="text-muted-foreground mt-1">Monitor chat activity and AI engagement</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sessions.length}</div>
              <p className="text-xs text-muted-foreground mt-1">All-time chat sessions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMessages}</div>
              <p className="text-xs text-muted-foreground mt-1">User + AI messages</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg per Session</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgMessagesPerSession}</div>
              <p className="text-xs text-muted-foreground mt-1">Messages per chat</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Sessions</CardTitle>
            <CardDescription>Latest AI chat interactions across all users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Session Title</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead className="text-center">Messages</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell className="font-medium">{session.title}</TableCell>
                      <TableCell className="text-muted-foreground">{session.user_email}</TableCell>
                      <TableCell className="text-center font-semibold">
                        {session.message_count}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(session.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={session.message_count > 5 ? "default" : "secondary"}>
                          {session.message_count > 5 ? "Active" : "Brief"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </InternalLayout>
  );
}
