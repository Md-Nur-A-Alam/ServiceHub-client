"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { apiClient } from "@/lib/api-client";
import { toast } from "react-toastify";
import { PlusCircle, Loader2, Image, Smile, Link2, UploadCloud } from "lucide-react";

const EMOJIS = ["🧹", "🪠", "⚡", "🔨", "🌱", "📚", "🧘", "🚗", "🐾", "✂️", "🎨", "💻", "📸", "🛠️"];
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

export default function AddServicePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [fullDesc, setFullDesc] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("cleaning");
  const [location, setLocation] = useState("");

  // Cover image mode: "emoji" | "url" | "upload"
  const [imageMode, setImageMode] = useState<"emoji" | "url" | "upload">("emoji");
  const [selectedEmoji, setSelectedEmoji] = useState("🧹");
  const [imageUrl, setImageUrl] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState("");
  
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !shortDesc || !fullDesc || !price || !location) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const priceNum = Number(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error("Please enter a valid price greater than 0.");
      return;
    }

    // Resolve final image string depending on mode
    let finalImage = "🛠️";
    if (imageMode === "emoji") {
      finalImage = selectedEmoji;
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

    setIsSubmitting(true);
    try {
      await apiClient.post("/services", {
        title,
        shortDesc,
        fullDesc,
        price: priceNum,
        category,
        location,
        imageEmoji: finalImage,
      });

      toast.success("Service submitted successfully! Awaiting admin moderation.");
      router.push("/explore");
    } catch (err: any) {
      console.error("Failed to add service:", err);
      const errMsg = err.response?.data?.error?.message || "Failed to submit service. Please try again.";
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background min-h-screen py-12">
      <Container className="max-w-2xl">
        <div className="bg-surface border border-outline-variant rounded-2xl p-6 lg:p-8 space-y-6 shadow-sm">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <PlusCircle className="w-6 h-6" />
              <h1 className="text-2xl font-extrabold text-on-surface font-display">Add a New Service</h1>
            </div>
            <p className="text-xs text-on-surface/65">
              Create a premium showcase for your service. Once submitted, administrators will review and approve your listing.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="service-title" className="text-xs font-semibold text-on-surface/85">
                Service Title *
              </label>
              <input
                id="service-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Professional Deep Home Cleaning"
                className="w-full px-3.5 py-2.5 rounded-lg border border-outline-variant bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            {/* Short Description */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="service-short" className="text-xs font-semibold text-on-surface/85">
                Short Catchy Summary *
              </label>
              <input
                id="service-short"
                type="text"
                required
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                placeholder="e.g. Fast, reliable deep home cleaning with premium materials."
                className="w-full px-3.5 py-2.5 rounded-lg border border-outline-variant bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            {/* Full Description */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="service-full" className="text-xs font-semibold text-on-surface/85">
                Full Details & Service Scope *
              </label>
              <textarea
                id="service-full"
                required
                value={fullDesc}
                onChange={(e) => setFullDesc(e.target.value)}
                placeholder="Describe exactly what your service covers, what tools you bring, and your custom terms..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-outline-variant bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all h-32 resize-none"
              />
            </div>

            {/* Grid for Price, Category, Location */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Category */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="service-category" className="text-xs font-semibold text-on-surface/85">
                  Category *
                </label>
                <select
                  id="service-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-outline-variant bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="service-price" className="text-xs font-semibold text-on-surface/85">
                  Rate ($ / Hour) *
                </label>
                <input
                  id="service-price"
                  type="number"
                  required
                  min="1"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 55"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-outline-variant bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>

              {/* Location */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="service-location" className="text-xs font-semibold text-on-surface/85">
                  Location / City *
                </label>
                <input
                  id="service-location"
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. San Francisco"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-outline-variant bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Showcase Image selector */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-on-surface/85">
                Service Showcase Visual *
              </label>

              {/* Selection Mode Toggles */}
              <div className="grid grid-cols-3 gap-2 p-1 border border-outline-variant rounded-xl bg-surface-container/20">
                <button
                  type="button"
                  onClick={() => setImageMode("emoji")}
                  className={`py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    imageMode === "emoji" ? "bg-primary text-on-primary shadow-sm" : "text-on-surface/70 hover:bg-surface-container/40"
                  }`}
                >
                  <Smile className="w-3.5 h-3.5" />
                  <span>Emoji</span>
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode("url")}
                  className={`py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    imageMode === "url" ? "bg-primary text-on-primary shadow-sm" : "text-on-surface/70 hover:bg-surface-container/40"
                  }`}
                >
                  <Link2 className="w-3.5 h-3.5" />
                  <span>URL Link</span>
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode("upload")}
                  className={`py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    imageMode === "upload" ? "bg-primary text-on-primary shadow-sm" : "text-on-surface/70 hover:bg-surface-container/40"
                  }`}
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Upload File</span>
                </button>
              </div>

              {/* Mode 1: Emoji Selector */}
              {imageMode === "emoji" && (
                <div className="flex flex-wrap gap-2.5 p-3 border border-outline-variant rounded-xl bg-surface-container/30">
                  {EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setSelectedEmoji(emoji)}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all hover:scale-115 cursor-pointer ${
                        selectedEmoji === emoji
                          ? "bg-primary text-on-primary ring-2 ring-primary/45 scale-110"
                          : "bg-surface border border-outline-variant hover:bg-surface-container"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}

              {/* Mode 2: Direct URL Input */}
              {imageMode === "url" && (
                <div className="space-y-3">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-outline-variant bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                  {imageUrl && (
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-outline-variant max-w-xs bg-surface-container">
                      <img src={imageUrl} alt="Preview URL" className="w-full h-full object-cover" onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=Invalid+Image+URL";
                      }} />
                    </div>
                  )}
                </div>
              )}

              {/* Mode 3: ImgBB File Upload */}
              {imageMode === "upload" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-outline-variant hover:border-primary/50 rounded-xl cursor-pointer bg-surface-container/10 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {isUploading ? (
                          <>
                            <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
                            <p className="text-xs text-on-surface/75 font-semibold">Uploading to ImgBB...</p>
                          </>
                        ) : (
                          <>
                            <Image className="w-8 h-8 text-on-surface/50 mb-2" />
                            <p className="text-xs text-on-surface/75 font-semibold">Click to upload file</p>
                            <p className="text-[10px] text-on-surface/40 mt-1">PNG, JPG, or WEBP up to 5MB</p>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isUploading}
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {uploadedUrl && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-success">Uploaded Image Preview:</span>
                      <div className="relative aspect-video rounded-xl overflow-hidden border border-outline-variant max-w-xs bg-surface-container">
                        <img src={uploadedUrl} alt="ImgBB Uploaded Preview" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2.5 border border-outline-variant text-on-surface hover:bg-surface-container text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="px-6 py-2.5 bg-primary text-on-primary text-xs font-bold rounded-xl hover:brightness-110 disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Submit Service</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
}
