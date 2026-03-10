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
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: data });
      const json = await res.json();
      return json.secure_url;
    } catch { setError("Image upload failed."); return null; }
    finally { setUploading(false); }
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
    } catch { setError("Something went wrong."); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Full bleed hero header */}
      <div className="relative h-52 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=1920&auto=format&fit=crop" alt="header" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
        <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 pt-8">
          <Link href="/feed" className="text-white/60 text-sm hover:text-white mb-2 w-fit">← Back to feed</Link>
          <h1 className="text-4xl md:text-5xl font-black text-white">List Your Experience</h1>
          <p className="text-white/60 mt-2 text-sm">Share your travel experience with the world</p>
        </div>
      </div>

      {/* Two column layout */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm">{error}</div>}

        <form onSubmit={submit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* LEFT — Image upload */}
            <div className="bg-white rounded-3xl shadow-sm p-6 flex flex-col">
              <h2 className="font-black text-gray-900 text-lg mb-4">Experience Photo</h2>
              <div
                onClick={() => document.getElementById("imageInput").click()}
                className={`flex-1 min-h-80 border-2 border-dashed rounded-2xl overflow-hidden cursor-pointer transition-colors ${imagePreview ? "border-amber-400" : "border-gray-200 hover:border-amber-300"}`}
              >
                {imagePreview ? (
                  <div className="relative h-full min-h-80">
                    <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <p className="text-white font-semibold text-sm bg-black/50 px-4 py-2 rounded-full">Click to change</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-full min-h-80 flex flex-col items-center justify-center text-gray-400 p-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="font-bold text-gray-500 text-base">Click to upload photo</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                    <div className="mt-4 bg-amber-400 text-black text-xs font-bold px-4 py-2 rounded-full">Browse Files</div>
                  </div>
                )}
              </div>
              <input id="imageInput" type="file" accept="image/*" onChange={handleImage} className="hidden" />
            </div>

            {/* RIGHT — Form fields */}
            <div className="bg-white rounded-3xl shadow-sm p-6 flex flex-col gap-5">
              <h2 className="font-black text-gray-900 text-lg">Experience Details</h2>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Title <span className="text-red-400">*</span></label>
                <input type="text" name="title" value={form.title} onChange={handleChange}
                  placeholder="e.g. Sigiriya Rock Fortress Hike" required
                  className="w-full border border-gray-200 text-gray-900 placeholder-gray-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Location <span className="text-red-400">*</span></label>
                <div className="relative">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <input type="text" name="location" value={form.location} onChange={handleChange}
                    placeholder="e.g. Sigiriya, Sri Lanka" required
                    className="w-full border border-gray-200 text-gray-900 placeholder-gray-400 pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm" />
                </div>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-bold text-gray-700 mb-1">Description <span className="text-red-400">*</span></label>
                <textarea name="description" value={form.description} onChange={handleChange}
                  placeholder="Describe what makes this experience special..." required rows={6}
                  className="w-full border border-gray-200 text-gray-900 placeholder-gray-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm resize-none" />
                <p className="text-xs text-gray-400 text-right mt-1">{form.description.length} chars</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Price <span className="text-gray-400 font-normal">(optional)</span></label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">$</span>
                  <input type="number" name="price" value={form.price} onChange={handleChange}
                    placeholder="0.00" min="0" step="0.01"
                    className="w-full border border-gray-200 text-gray-900 placeholder-gray-400 pl-8 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm" />
                </div>
                <p className="text-xs text-gray-400 mt-1">Leave empty if free</p>
              </div>

              <button type="submit" disabled={loading || uploading}
                className="w-full bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-black font-black py-4 rounded-2xl transition-colors text-base mt-auto">
                {uploading ? "Uploading image..." : loading ? "Publishing..." : "Publish Experience 🚀"}
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}