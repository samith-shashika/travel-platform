"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreatePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({ title: "", location: "", description: "", price: "" });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (status === "loading") return null;
  if (!session) { router.push("/login"); return null; }

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError(""); };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return setError("Image must be under 5MB");
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImage = async () => {
    if (!image) return null;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      return data.secure_url;
    } catch {
      setError("Image upload failed. Please try again.");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!image) return setError("Please select an image");
    setLoading(true);
    try {
      const imageUrl = await uploadImage();
      if (!imageUrl) { setLoading(false); return; }

      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, imageUrl, price: form.price ? parseFloat(form.price) : null }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error);
      router.push(`/listings/${data.listing._id}`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <div className="relative h-40 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=1920&auto=format&fit=crop"
          alt="header"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 flex items-center px-6 md:px-10">
          <div>
            <Link href="/feed" className="text-white/60 text-sm hover:text-white transition-colors">
              ← Back to feed
            </Link>
            <h1 className="text-3xl font-black text-white mt-1">List Your Experience</h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-white rounded-3xl shadow-sm p-6 md:p-10">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Experience Image <span className="text-red-400">*</span>
              </label>
              <div
                onClick={() => document.getElementById("imageInput").click()}
                className={`relative border-2 border-dashed rounded-2xl overflow-hidden cursor-pointer transition-colors ${
                  imagePreview ? "border-amber-400" : "border-gray-200 hover:border-amber-300"
                }`}
              >
                {imagePreview ? (
                  <div className="relative h-56">
                    <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <p className="text-white font-semibold text-sm">Click to change image</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-56 flex flex-col items-center justify-center text-gray-400">
                    <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="font-semibold text-sm">Click to upload image</p>
                    <p className="text-xs mt-1">PNG, JPG up to 5MB</p>
                  </div>
                )}
              </div>
              <input
                id="imageInput" type="file" accept="image/*"
                onChange={handleImage} className="hidden"
              />
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Experience Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text" name="title" value={form.title}
                onChange={handleChange} placeholder="e.g. Sunset Boat Tour in Bali"
                required
                className="w-full border border-gray-200 text-gray-900 placeholder-gray-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Location <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <input
                  type="text" name="location" value={form.location}
                  onChange={handleChange} placeholder="e.g. Bali, Indonesia"
                  required
                  className="w-full border border-gray-200 text-gray-900 placeholder-gray-400 pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                name="description" value={form.description}
                onChange={handleChange}
                placeholder="Describe your experience in detail..."
                required rows={5}
                className="w-full border border-gray-200 text-gray-900 placeholder-gray-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm resize-none"
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{form.description.length} characters</p>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Price <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">$</span>
                <input
                  type="number" name="price" value={form.price}
                  onChange={handleChange} placeholder="0.00"
                  min="0" step="0.01"
                  className="w-full border border-gray-200 text-gray-900 placeholder-gray-400 pl-8 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Leave empty if the experience is free</p>
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={loading || uploading}
              className="w-full bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-black font-black py-4 rounded-2xl transition-colors text-base"
            >
              {uploading ? "Uploading image..." : loading ? "Publishing..." : "Publish Experience 🚀"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}