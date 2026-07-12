"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  AlertTriangle, 
  Loader2, 
  Eye, 
  Inbox,
  Sparkles,
  Image as ImageIcon,
  Smile,
  Link2,
  UploadCloud
} from "lucide-react";
import { toast } from "react-toastify";

interface ManageServicesTabProps {
  role: string;
}

const CATEGORIES = [
  { value: "cleaning", label: "Home Cleaning" },
  { value: "plumbing", label: "Plumbing" },
  { value: "electrical", label: "Electrical Work" },
  { value: "handyman", label: "Handyman Services" },
  { value: "gardening", label: "Gardening & Landscaping" },
  { value: "tutoring", label: "Tutoring & Lessons" },
  { value: "wellness", label: "Wellness & Personal Care" },
  { value: "automotive", label: "Automotive Repair" },
  { value: "other", label: "Other Services" },
];

const EMOJIS = ["🧹", "🪠", "⚡", "🔨", "🌱", "📚", "🧘", "🚗", "🐾", "✂️", "🎨", "💻", "📸", "🛠️"];

export function ManageServicesTab({ role }: ManageServicesTabProps) {
  const queryClient = useQueryClient();
  const [editingService, setEditingService] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  // Edit / Create Form States
  const [title, setTitle] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [fullDesc, setFullDesc] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("cleaning");
  const [location, setLocation] = useState("");
  
  // Image states
  const [imageMode, setImageMode] = useState<"emoji" | "url" | "upload">("emoji");
  const [imageEmoji, setImageEmoji] = useState("🛠️");
  const [imageUrl, setImageUrl] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const apiKey = process.env.NEXT_PUBLIC_IMG_API_KEY;
    if (!apiKey) {
      toast.error("ImgBB API key is missing in environmental configuration.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setUploadedUrl(data.data.url);
        toast.success("Image uploaded successfully!");
      } else {
        toast.error(data.error?.message || "Failed to upload image.");
      }
    } catch (err) {
      console.error("Error uploading to ImgBB:", err);
      toast.error("Network error uploading image to ImgBB.");
    } finally {
      setIsUploading(false);
    }
  };

  // Fetch services depending on role
  const { data: services, isLoading } = useQuery({
    queryKey: role === "admin" ? ["admin-services"] : ["provider-services"],
    queryFn: async () => {
      const endpoint = role === "admin" ? "/admin/services" : "/services/provider/me";
      const response = await apiClient.get(endpoint);
      return role === "admin" ? response.data.data : response.data.data || [];
    }
  });

  // Moderation status update mutation (Admin)
  const moderationMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "approved" | "rejected" }) => {
      const response = await apiClient.patch(`/admin/services/${id}/status`, { status });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Service status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-services"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error?.message || "Failed to update service status");
    }
  });

  // Delete service mutation (Provider/Admin)
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/services/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Service deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["provider-services"] });
      queryClient.invalidateQueries({ queryKey: ["admin-services"] });
      setDeletingId(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error?.message || "Failed to delete service");
    }
  });

  // Create service mutation (Provider)
  const createMutation = useMutation({
    mutationFn: async (serviceData: any) => {
      const response = await apiClient.post("/services", serviceData);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Service created successfully and sent to moderation!");
      queryClient.invalidateQueries({ queryKey: ["provider-services"] });
      setCreating(false);
      resetForm();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error?.message || "Failed to create service");
    }
  });

  // Update service mutation (Provider)
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await apiClient.patch(`/services/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Service updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["provider-services"] });
      setEditingService(null);
      resetForm();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error?.message || "Failed to update service");
    }
  });

  const resetForm = () => {
    setTitle("");
    setShortDesc("");
    setFullDesc("");
    setPrice("");
    setCategory("cleaning");
    setLocation("");
    setImageMode("emoji");
    setImageEmoji("🛠️");
    setImageUrl("");
    setUploadedUrl("");
  };

  const handleEditClick = (service: any) => {
    setEditingService(service);
    setTitle(service.title);
    setShortDesc(service.shortDesc);
    setFullDesc(service.fullDesc || "");
    setPrice(service.price.toString());
    setCategory(service.category);
    setLocation(service.location);
    
    const imgVal = service.images?.[0] || service.imageEmoji || "🛠️";
    if (imgVal.startsWith("http://") || imgVal.startsWith("https://") || imgVal.startsWith("/")) {
      setImageMode("url");
      setImageUrl(imgVal);
      setUploadedUrl(imgVal);
      setImageEmoji("🛠️");
    } else {
      setImageMode("emoji");
      setImageEmoji(imgVal);
      setImageUrl("");
      setUploadedUrl("");
    }
    setCreating(false);
  };

  const handleCreateClick = () => {
    resetForm();
    setCreating(true);
    setEditingService(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !shortDesc || !fullDesc || !price || !location) {
      toast.error("Please fill in all required fields");
      return;
    }

    let finalImage = "🛠️";
    if (imageMode === "emoji") {
      finalImage = imageEmoji;
    } else if (imageMode === "url") {
      if (!imageUrl) {
        toast.error("Please provide a valid image URL.");
        return;
      }
      finalImage = imageUrl;
    } else if (imageMode === "upload") {
      if (!uploadedUrl) {
        toast.error("Please upload an image file first.");
        return;
      }
      finalImage = uploadedUrl;
    }

    const payload = {
      title,
      shortDesc,
      fullDesc,
      price: Number(price),
      category,
      location,
      imageEmoji: finalImage,
      images: [finalImage]
    };

    if (creating) {
      createMutation.mutate(payload);
    } else if (editingService) {
      updateMutation.mutate({ id: editingService._id || editingService.id, data: payload });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-success/10 text-success border-success/20";
      case "pending":
        return "bg-warning/10 text-warning border-warning/20 animate-pulse";
      case "rejected":
        return "bg-error/10 text-error border-error/20";
      default:
        return "bg-outline-variant text-on-surface/60";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-on-surface font-display">
            {role === "admin" ? "Service Moderation Queue" : "Manage Services"}
          </h2>
          <p className="text-xs text-on-surface/50 mt-0.5">
            {role === "admin" 
              ? "Approve or reject service listings submitted by providers"
              : "Create, update, and manage your local service listings"
            }
          </p>
        </div>

        {role === "provider" && !creating && !editingService && (
          <button
            onClick={handleCreateClick}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary/95 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Service</span>
          </button>
        )}
      </div>

      {/* Forms (Create or Edit Mode) */}
      {(creating || editingService) && (
        <div className="bg-surface border border-outline-variant rounded-2xl p-6 shadow-sm max-w-2xl">
          <div className="flex justify-between items-center pb-4 border-b border-outline-variant mb-6">
            <h3 className="font-bold text-on-surface text-base">
              {creating ? "Add Service Listing" : `Edit: ${editingService?.title}`}
            </h3>
            <button
              onClick={() => {
                setCreating(false);
                setEditingService(null);
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container-high cursor-pointer text-on-surface/60"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-on-surface/75 uppercase tracking-wider mb-1.5">
                  Service Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Premium Bathroom Deep Cleaning"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface text-on-surface text-sm focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface/75 uppercase tracking-wider mb-1.5">
                  Price ($ per hour / service) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="50"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface text-on-surface text-sm focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface/75 uppercase tracking-wider mb-1.5">
                Short Description *
              </label>
              <input
                type="text"
                required
                maxLength={100}
                placeholder="Brief one-line summary of what you offer (max 100 chars)"
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface text-on-surface text-sm focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface/75 uppercase tracking-wider mb-1.5">
                Full Description (Details, Scope, Exclusions) *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Detail exactly what this service covers, inclusions, tools used, and requirements..."
                value={fullDesc}
                onChange={(e) => setFullDesc(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface text-on-surface text-sm focus:border-primary focus:outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-on-surface/75 uppercase tracking-wider mb-1.5">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface text-on-surface text-sm focus:border-primary focus:outline-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface/75 uppercase tracking-wider mb-1.5">
                  Service Location (City / Area) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dhaka, Gulshan"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface text-on-surface text-sm focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            {/* Cover Image Selection */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-on-surface/85">Cover Image / Icon *</label>
              
              {/* Tabs */}
              <div className="grid grid-cols-3 bg-surface-container/60 border border-outline-variant p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setImageMode("emoji")}
                  className={`flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                    imageMode === "emoji"
                      ? "bg-surface text-primary shadow-xs"
                      : "text-on-surface/65 hover:text-on-surface"
                  }`}
                >
                  <Smile className="w-3.5 h-3.5" />
                  <span>Emoji</span>
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode("url")}
                  className={`flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                    imageMode === "url"
                      ? "bg-surface text-primary shadow-xs"
                      : "text-on-surface/65 hover:text-on-surface"
                  }`}
                >
                  <Link2 className="w-3.5 h-3.5" />
                  <span>URL</span>
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode("upload")}
                  className={`flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                    imageMode === "upload"
                      ? "bg-surface text-primary shadow-xs"
                      : "text-on-surface/65 hover:text-on-surface"
                  }`}
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Upload</span>
                </button>
              </div>

              {/* Mode Views */}
              {imageMode === "emoji" && (
                <div className="flex flex-wrap gap-1.5 p-3.5 bg-surface-container-low border border-outline-variant rounded-xl max-h-40 overflow-y-auto">
                  {EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setImageEmoji(emoji)}
                      className={`w-9.5 h-9.5 text-xl flex items-center justify-center rounded-lg border hover:bg-surface-container-high cursor-pointer transition-all ${
                        imageEmoji === emoji ? "border-primary bg-primary/10" : "border-transparent"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}

              {imageMode === "url" && (
                <div className="flex flex-col gap-1.5">
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-outline-variant bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                  {imageUrl && (
                    <div className="w-20 h-20 border border-outline-variant rounded-xl overflow-hidden self-start">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imageUrl} alt="Preview URL" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              )}

              {imageMode === "upload" && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 px-4 py-2.5 bg-surface-container border border-outline-variant hover:bg-surface-container-high rounded-lg text-xs font-bold text-on-surface cursor-pointer transition-all">
                      <UploadCloud className="w-4 h-4" />
                      <span>{isUploading ? "Uploading..." : "Select File"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                        className="hidden"
                      />
                    </label>
                    {isUploading && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
                  </div>
                  {uploadedUrl && (
                    <div className="w-20 h-20 border border-outline-variant rounded-xl overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={uploadedUrl} alt="Preview Uploaded" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4 border-t border-outline-variant">
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary/95 transition-colors disabled:opacity-55 cursor-pointer flex items-center gap-2"
              >
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                )}
                <span>{creating ? "Submit Listing" : "Save Changes"}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setCreating(false);
                  setEditingService(null);
                }}
                className="px-5 py-2.5 rounded-xl border border-outline-variant text-on-surface text-xs font-bold hover:bg-surface-container transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Services List Table */}
      {!creating && !editingService && (
        <div className="bg-surface border border-outline-variant rounded-2xl overflow-hidden shadow-xs">
          {services.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface/40">
                <Inbox className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-on-surface text-sm">No Listings Found</h4>
                <p className="text-xs text-on-surface/50 mt-1 max-w-[280px]">
                  {role === "admin" 
                    ? "No services have been submitted for moderation." 
                    : "Create your first service listing to start receiving customer bookings!"
                  }
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant bg-surface-container/30 text-xs font-bold text-on-surface/60">
                    <th className="px-6 py-3.5">Service</th>
                    <th className="px-6 py-3.5">Category</th>
                    <th className="px-6 py-3.5">Location</th>
                    <th className="px-6 py-3.5">Price</th>
                    <th className="px-6 py-3.5">Status</th>
                    {role === "admin" && <th className="px-6 py-3.5">Provider</th>}
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant text-sm">
                  {services.map((service: any) => {
                    const id = service._id || service.id;
                    const emoji = service.images?.[0] || service.imageEmoji || "🛠️";
                    return (
                      <tr key={id} className="hover:bg-surface-container/20 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {emoji.startsWith("http://") || emoji.startsWith("https://") || emoji.startsWith("/") ? (
                              <img
                                src={emoji}
                                alt={service.title}
                                className="w-10 h-10 object-cover rounded-xl border border-outline-variant"
                              />
                            ) : (
                              <span className="w-10 h-10 text-2xl flex items-center justify-center bg-surface-container-high/40 rounded-xl">
                                {emoji}
                              </span>
                            )}
                            <div>
                              <div className="font-semibold text-on-surface">{service.title}</div>
                              <div className="text-xs text-on-surface/50 line-clamp-1 mt-0.5">{service.shortDesc}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 capitalize text-on-surface/80">{service.category}</td>
                        <td className="px-6 py-4 capitalize text-on-surface/80">{service.location}</td>
                        <td className="px-6 py-4 font-bold text-on-surface">${service.price}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(service.status)}`}>
                            {service.status}
                          </span>
                        </td>
                        {role === "admin" && (
                          <td className="px-6 py-4 text-xs text-on-surface/80">
                            <div>{service.provider?.name || "Unknown"}</div>
                            <div className="text-on-surface/40 mt-0.5">{service.provider?.email}</div>
                          </td>
                        )}
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            {role === "admin" && service.status === "pending" && (
                              <>
                                <button
                                  onClick={() => moderationMutation.mutate({ id, status: "approved" })}
                                  disabled={moderationMutation.isPending}
                                  className="p-1.5 rounded-lg bg-success/10 hover:bg-success/20 text-success cursor-pointer disabled:opacity-55"
                                  title="Approve Service"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => moderationMutation.mutate({ id, status: "rejected" })}
                                  disabled={moderationMutation.isPending}
                                  className="p-1.5 rounded-lg bg-error/10 hover:bg-error/20 text-error cursor-pointer disabled:opacity-55"
                                  title="Reject Service"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            )}

                            {role === "provider" && (
                              <button
                                onClick={() => handleEditClick(service)}
                                className="p-1.5 rounded-lg hover:bg-surface-container-high text-on-surface/70 hover:text-on-surface cursor-pointer"
                                title="Edit Listing"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            )}

                            {(role === "provider" || role === "admin") && (
                              <>
                                {deletingId === id ? (
                                  <div className="flex gap-1 items-center bg-error/10 p-1 rounded-lg">
                                    <button
                                      onClick={() => deleteMutation.mutate(id)}
                                      disabled={deleteMutation.isPending}
                                      className="p-1 rounded-md text-error hover:bg-error/20 font-bold text-xs cursor-pointer"
                                    >
                                      Confirm
                                    </button>
                                    <button
                                      onClick={() => setDeletingId(null)}
                                      className="p-1 rounded-md text-on-surface/60 hover:bg-surface-container-high cursor-pointer"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setDeletingId(id)}
                                    className="p-1.5 rounded-lg hover:bg-error/10 text-error/70 hover:text-error cursor-pointer"
                                    title="Delete Listing"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
