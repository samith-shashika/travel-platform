"use client";
import { use, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default function ListingDetailPage({ params }) {
  const { id } = use(params);
  const { data: session } = useSession();
  const router = useRouter();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`/api/listings/${id}`);
        const data = await res.json();
        if (!res.ok) { router.push("/feed"); return; }
        setListing(data.listing);
        setLikes(data.listing.likes?.length || 0);
        if (session?.user?.id) {
          setLiked(data.listing.likes?.includes(session.user.id));
        }
      } catch (err) {
        router.push("/feed");
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id, session, router]);

  const handleLike = async () => {
    if (!session) { router.push("/login"); return; }
    setLikeLoading(true);
    try {
      const res = await fetch(`/api/listings/${id}`, { method: "PATCH" });
      const data = await res.json();
      setLiked(data.liked);
      setLikes(data.likes);
    } catch (err) {
      console.error(err);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/listings/${id}`, { method: "DELETE" });
      if (res.ok) router.push("/feed");
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteLoading(false);
      setShowConfirm(false);
    }
  };

  const isOwner = session?.user?.id === listing?.creator?.toString();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">
          <div className="h-80 bg-gray-200 rounded-3xl mb-8" />
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/4" />
            <div className="h-10 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  if (!listing) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero Image */}
      <div className="relative h-80 md:h-[480px] overflow-hidden">
        <img
          src={listing.imageUrl}
          alt={listing.title}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&auto=format&fit=crop"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Back button */}
        <Link
          href="/feed"
          className="absolute top-6 left-6 bg-black/30 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-black/50 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>

        {/* Price badge */}
        {listing.price && (
          <div className="absolute top-6 right-6 bg-amber-400 text-black font-black text-lg px-5 py-2 rounded-full">
            ${listing.price}
          </div>
        )}

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="flex items-center gap-2 text-white/70 text-sm mb-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {listing.location}
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            {listing.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-3xl shadow-sm p-6 md:p-10">

          {/* Meta row */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center text-black font-black text-sm">
                {listing.creatorName?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{listing.creatorName}</p>
                <p className="text-gray-400 text-xs">
                  {formatDistanceToNow(new Date(listing.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Like button */}
              <button
                onClick={handleLike}
                disabled={likeLoading}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold transition-all ${
                  liked
                    ? "bg-red-50 border-red-200 text-red-500"
                    : "bg-gray-50 border-gray-200 text-gray-500 hover:border-red-200 hover:text-red-400"
                }`}
              >
                <span>{liked ? "❤️" : "🤍"}</span>
                <span>{likes}</span>
              </button>

              {/* Owner actions */}
              {isOwner && (
                <>
                  <Link
                    href={`/edit/${listing._id}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-gray-500 hover:border-amber-400 hover:text-amber-500 text-sm font-semibold transition-all bg-gray-50"
                  >
                    ✏️ Edit
                  </Link>
                  <button
                    onClick={() => setShowConfirm(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-gray-500 hover:border-red-400 hover:text-red-500 text-sm font-semibold transition-all bg-gray-50"
                  >
                    🗑️ Delete
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-lg font-black text-gray-900 mb-3">About this experience</h2>
            <p className="text-gray-600 leading-relaxed text-base">{listing.description}</p>
          </div>

          {/* Info cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-xs text-gray-400 mb-1">Location</p>
              <p className="font-bold text-gray-800 text-sm">📍 {listing.location}</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-xs text-gray-400 mb-1">Price</p>
              <p className="font-bold text-gray-800 text-sm">
                {listing.price ? `💰 $${listing.price}` : "🎉 Free"}
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-xs text-gray-400 mb-1">Likes</p>
              <p className="font-bold text-gray-800 text-sm">❤️ {likes} people liked this</p>
            </div>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowConfirm(false)} />
          <div className="relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-black text-gray-900 mb-2">Delete listing?</h3>
            <p className="text-gray-500 text-sm mb-6">
              This action cannot be undone. The listing will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-2xl transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-semibold py-3 rounded-2xl transition-colors text-sm"
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}