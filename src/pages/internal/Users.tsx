import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Search } from "lucide-react";
import { useFounderCheck } from "@/hooks/useFounderCheck";
import { InternalLayout } from "@/components/InternalLayout";

interface UserData {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  updated_at: string;
  trades_count: number;
  chats_count: number;
}

export default function Users() {
  const { loading: roleLoading } = useFounderCheck();
  const [users, setUsers] = useState<UserData[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      if (roleLoading) return;

      try {
        const { data: profiles, error } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        // Fetch trade and chat counts for each user
        const usersWithCounts = await Promise.all(
          (profiles || []).map(async (profile) => {
            const { count: tradesCount } = await supabase
              .from("trades")
              .select("*", { count: "exact", head: true })
              .eq("user_id", profile.id);

            const { count: chatsCount } = await supabase
              .from("chats")
              .select("*", { count: "exact", head: true })
              .eq("user_id", profile.id);

            return {
              ...profile,
              trades_count: tradesCount || 0,
              chats_count: chatsCount || 0,
            };
          })
        );

        setUsers(usersWithCounts);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [roleLoading]);

  const filteredUsers = users.filter(
    (user) =>
      user.email?.toLowerCase().includes(search.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  if (roleLoading || loading) {
    return (
      <InternalLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </InternalLayout>
    );
  }

  return (
    <InternalLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Users</h1>
          <p className="text-muted-foreground mt-1">
            View and analyze all registered users on the platform
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Directory</CardTitle>
            <CardDescription>
              {users.length} total users • Search by name or email
            </CardDescription>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-center">Trades</TableHead>
                    <TableHead className="text-center">Sessions</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.full_name || "Anonymous User"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                      <TableCell className="text-center font-semibold">
                        {user.trades_count}
                      </TableCell>
                      <TableCell className="text-center font-semibold">
                        {user.chats_count}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(user.updated_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            new Date(user.updated_at) >
                            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                              ? "default"
                              : "secondary"
                          }
                        >
                          {new Date(user.updated_at) >
                          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                            ? "Active"
                            : "Inactive"}
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
