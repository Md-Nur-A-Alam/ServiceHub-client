"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Users, Ban, CheckCircle, Shield } from "lucide-react";
import { toast } from "react-toastify";

export default function UsersPage() {
  const queryClient = useQueryClient();

  const { data: users = [], isLoading, isError } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const response = await apiClient.get("/admin/users");
      return response.data.data;
    },
  });

  const banMutation = useMutation({
    mutationFn: async ({ id, banned }: { id: string; banned: boolean }) => {
      const response = await apiClient.patch(`/admin/users/${id}/ban`, { banned });
      return response.data;
    },
    onSuccess: (_, variables) => {
      toast.success(variables.banned ? "User banned successfully" : "User unbanned successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      // Invalidate general admin analytics just in case stats change
      queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error?.message || "Failed to update user ban status.");
    },
  });

  const handleBanToggle = (id: string, currentlyBanned: boolean) => {
    const action = currentlyBanned ? "unban" : "ban";
    if (confirm(`Are you sure you want to ${action} this user?`)) {
      banMutation.mutate({ id, banned: !currentlyBanned });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-surface-container rounded-xl border border-outline-variant" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center bg-surface border border-outline-variant rounded-2xl">
        <p className="text-on-surface/70">Failed to load users list.</p>
      </div>
    );
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <span className="px-2.5 py-0.5 rounded-full bg-error/15 text-error text-2xs font-bold uppercase">Admin</span>;
      case "provider":
        return <span className="px-2.5 py-0.5 rounded-full bg-secondary/15 text-secondary text-2xs font-bold uppercase">Provider</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full bg-primary/15 text-primary text-2xs font-bold uppercase">Customer</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5 text-primary" />
        <h1 className="text-xl font-bold text-on-surface font-display">User Management</h1>
      </div>

      {/* Desktop Table View (lg+) */}
      <div className="hidden lg:block bg-surface border border-outline-variant rounded-2xl overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container/40 border-b border-outline-variant text-xs text-on-surface/60 font-semibold uppercase tracking-wider">
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/60 text-sm">
            {users.map((u: any) => (
              <tr key={u.id} className="hover:bg-surface-container/20 transition-colors">
                <td className="px-6 py-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center overflow-hidden">
                    {u.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={u.avatarUrl} alt={u.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>{u.name.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <span className="font-bold text-on-surface">{u.name}</span>
                </td>
                <td className="px-6 py-4 text-on-surface/85">{u.email}</td>
                <td className="px-6 py-4">{getRoleBadge(u.role)}</td>
                <td className="px-6 py-4">
                  {u.banned ? (
                    <span className="px-2 py-0.5 rounded-full bg-error/15 text-error text-2xs font-semibold">Banned</span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-success/15 text-success text-2xs font-semibold">Active</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  {u.role !== "admin" && (
                    <button
                      onClick={() => handleBanToggle(u.id, !!u.banned)}
                      disabled={banMutation.isPending}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                        u.banned
                          ? "border-success/50 text-success hover:bg-success/5"
                          : "border-error/50 text-error hover:bg-error/5"
                      }`}
                    >
                      {u.banned ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Unban</span>
                        </>
                      ) : (
                        <>
                          <Ban className="w-3.5 h-3.5" />
                          <span>Ban</span>
                        </>
                      )}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet Card View (<lg) */}
      <div className="lg:hidden flex flex-col gap-4">
        {users.map((u: any) => (
          <div
            key={u.id}
            className="bg-surface border border-outline-variant rounded-2xl p-4 flex flex-col gap-3 shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center overflow-hidden shrink-0">
                {u.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={u.avatarUrl} alt={u.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{u.name.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-bold text-on-surface text-sm truncate">{u.name}</h3>
                  {getRoleBadge(u.role)}
                </div>
                <span className="text-xs text-on-surface/40 truncate block">{u.email}</span>
              </div>
            </div>

            <div className="border-t border-outline-variant/60 pt-2.5 flex items-center justify-between text-xs">
              <div>
                <span className="text-on-surface/50">Status:</span>
                <strong className={`ml-1 ${u.banned ? "text-error" : "text-success"}`}>
                  {u.banned ? "Banned" : "Active"}
                </strong>
              </div>

              {u.role !== "admin" && (
                <button
                  onClick={() => handleBanToggle(u.id, !!u.banned)}
                  disabled={banMutation.isPending}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                    u.banned
                      ? "border-success/50 text-success hover:bg-success/5"
                      : "border-error/50 text-error hover:bg-error/5"
                  }`}
                >
                  {u.banned ? "Unban" : "Ban"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
