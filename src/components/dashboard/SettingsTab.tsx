"use client";

import { useState, useEffect, useRef } from "react";
import { authClient } from "@/lib/auth-client";
import { User, Mail, Shield, ShieldCheck, Loader2, Camera } from "lucide-react";
import { toast } from "react-toastify";
import { uploadImageToImgBB } from "@/lib/uploadImage";

export function SettingsTab() {
  const { data: session, isPending } = authClient.useSession();
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setImage(session.user.image || "");
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
        name: name.trim(),
        image: image,
      });
      toast.success("Profile updated successfully!");
      await authClient.getSession();
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }

    try {
      setIsUploadingImage(true);
      const url = await uploadImageToImgBB(file);
      setImage(url);
      
      // Auto-save image so they don't have to click save
      await authClient.updateUser({ image: url });
      await authClient.getSession();
      toast.success("Profile picture updated!");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload image.");
    } finally {
      setIsUploadingImage(false);
      // Reset input so the same file can be selected again if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
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

  const initials = user.name?.split(" ").slice(0,2).map(n => n[0]).join("").toUpperCase() || "?";

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-on-surface font-display tracking-tight">
          Profile Settings
        </h2>
        <p className="text-sm text-on-surface/60 mt-1">
          Manage your personal details, avatar, and account configurations.
        </p>
      </div>

      <div className="bg-surface border border-outline-variant rounded-3xl p-6 sm:p-8 space-y-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Avatar Section */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 pb-8 border-b border-outline-variant/60">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-primary/10 border-4 border-surface shadow-md flex items-center justify-center text-3xl font-black font-display text-primary relative">
                {image ? (
                  <img src={image} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  initials
                )}
                
                {/* Hover Overlay */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingImage}
                  className="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:opacity-100 disabled:bg-black/40"
                >
                  {isUploadingImage ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <Camera className="w-6 h-6 mb-1" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Change</span>
                    </>
                  )}
                </button>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            <div>
              <h3 className="font-extrabold text-on-surface text-xl">{user.name}</h3>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="px-2.5 py-1 rounded-md bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider">
                  {user.role}
                </span>
                <span className="text-xs text-on-surface/50 font-medium">{user.email}</span>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-on-surface/70 uppercase tracking-widest mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl border-2 border-outline-variant/60 bg-surface text-on-surface text-sm font-medium focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface/70 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                readOnly
                disabled
                value={user.email}
                className="w-full px-4 py-3.5 rounded-2xl border-2 border-outline-variant/30 bg-surface-container/30 text-on-surface/60 text-sm font-medium focus:outline-none cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface/70 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span>Account Access</span>
              </label>
              <div className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 border-success/20 bg-success/5">
                <ShieldCheck className="w-5 h-5 text-success" />
                <span className="text-sm font-bold text-on-surface/80 capitalize">
                  {user.role} Privileges
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isUpdating}
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-primary text-on-primary text-sm font-bold hover:brightness-110 active:brightness-95 transition-all disabled:opacity-50 cursor-pointer shadow-md shadow-primary/20"
            >
              {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
