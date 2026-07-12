"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { User, Mail, Shield, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

export function SettingsTab() {
  const { data: session, isPending } = authClient.useSession();
  const [name, setName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    try {
      setIsUpdating(true);
      await authClient.updateUser({
        name: name.trim()
      });
      toast.success("Profile updated successfully!");
      // Sync session state
      await authClient.getSession();
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const user = session?.user;

  if (!user) return null;

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-on-surface font-display">
          Profile & Account Settings
        </h2>
        <p className="text-xs text-on-surface/50 mt-0.5">
          Manage your personal details and account configurations
        </p>
      </div>

      <div className="bg-surface border border-outline-variant rounded-2xl p-6 space-y-6 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Avatar display */}
          <div className="flex items-center gap-4 pb-4 border-b border-outline-variant/60">
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold font-display">
              {user.name?.split(" ").slice(0,2).map(n => n[0]).join("").toUpperCase() || "?"}
            </div>
            <div>
              <h3 className="font-bold text-on-surface text-base">{user.name}</h3>
              <p className="text-xs text-on-surface/50 capitalize mt-0.5">Account Role: <span className="font-semibold text-primary">{user.role}</span></p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-on-surface/75 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-on-surface/40" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface text-on-surface text-sm focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface/75 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-on-surface/40" />
                <span>Email Address (Read-only)</span>
              </label>
              <input
                type="email"
                readOnly
                disabled
                value={user.email}
                className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container/45 text-on-surface/60 text-sm focus:outline-none cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface/75 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-on-surface/40" />
                <span>Account Access Level</span>
              </label>
              <div className="flex items-center gap-2 p-3 bg-surface-container/20 border border-outline-variant/60 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-success" />
                <span className="text-xs font-semibold text-on-surface/80 capitalize">
                  Authorized as {user.role} account
                </span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isUpdating}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary/95 transition-colors disabled:opacity-55 cursor-pointer"
          >
            {isUpdating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Save Profile Settings</span>
          </button>
        </form>
      </div>
    </div>
  );
}
