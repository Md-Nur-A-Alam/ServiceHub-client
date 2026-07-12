"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { ShieldAlert, ShieldCheck, Loader2, Search, Inbox, AlertOctagon } from "lucide-react";
import { toast } from "react-toastify";

export function UsersTab() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch users
  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const response = await apiClient.get("/admin/users");
      return response.data.data || [];
    }
  });

  // Ban/Unban user mutation
  const banMutation = useMutation({
    mutationFn: async ({ id, banned }: { id: string; banned: boolean }) => {
      const response = await apiClient.patch(`/admin/users/${id}/ban`, { banned });
      return response.data;
    },
    onSuccess: (_, variables) => {
      toast.success(variables.banned ? "User banned successfully" : "User unbanned successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error?.message || "Failed to update user ban status");
    }
  });

  const filteredUsers = (users || []).filter((user: any) => {
    const term = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      user.role?.toLowerCase().includes(term)
    );
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-on-surface font-display">
            User Management
          </h2>
          <p className="text-xs text-on-surface/50 mt-0.5">
            Admin console to monitor users and moderate accounts
          </p>
        </div>

        {/* Search Box */}
        <div className="relative w-full sm:w-64">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-on-surface/40 pointer-events-none">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search by name, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-outline-variant bg-surface text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Users List Table */}
      <div className="bg-surface border border-outline-variant rounded-2xl overflow-hidden shadow-xs">
        {filteredUsers.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface/40">
              <Inbox className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-on-surface text-sm">No Users Found</h4>
              <p className="text-xs text-on-surface/50 mt-1 max-w-[280px]">
                No platform users match your search criteria.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container/30 text-xs font-bold text-on-surface/60">
                  <th className="px-6 py-3.5">User</th>
                  <th className="px-6 py-3.5">Email</th>
                  <th className="px-6 py-3.5">Role</th>
                  <th className="px-6 py-3.5">Banned Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant text-sm">
                {filteredUsers.map((user: any) => {
                  const initials = user.name
                    ?.split(" ")
                    .slice(0, 2)
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase() || "?";

                  return (
                    <tr key={user.id} className="hover:bg-surface-container/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                            {initials}
                          </div>
                          <div className="font-semibold text-on-surface">{user.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-on-surface/80">{user.email}</td>
                      <td className="px-6 py-4 capitalize">
                        <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${
                          user.role === "admin"
                            ? "bg-error/15 text-error"
                            : user.role === "provider"
                            ? "bg-primary/15 text-primary"
                            : "bg-success/15 text-success"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {user.banned ? (
                          <span className="flex items-center gap-1.5 text-error text-xs font-semibold">
                            <AlertOctagon className="w-3.5 h-3.5" />
                            <span>Banned</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-success text-xs font-semibold">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Active</span>
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {user.role !== "admin" && (
                          <button
                            onClick={() => banMutation.mutate({ id: user.id, banned: !user.banned })}
                            disabled={banMutation.isPending}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                              user.banned
                                ? "bg-success/10 text-success hover:bg-success/15"
                                : "bg-error/10 text-error hover:bg-error/15"
                            }`}
                          >
                            {user.banned ? "Unban Account" : "Ban Account"}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
