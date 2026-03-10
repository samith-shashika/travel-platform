"use client";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default function ListingCard({ listing }) {
  const timeAgo = formatDistanceToNow(new Date(listing.createdAt), { addSuffix: true });

  return (
    <Link href={`/listings/${listing._id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        {/* Image */}
        <div className="relative h-52 overflow-hidden bg-gray-100">
          <img
            src={listing.imageUrl}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&auto=format&fit=crop"; }}
          />
          {listing.price && (
            <div className="absolute top-3 right-3 bg-amber-400 text-black text-xs font-bold px-3 py-1 rounded-full">
              ${listing.price}
            </div>
          )}
          {listing.likes?.length > 0 && (
            <div className="absolute top-3 left-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
              ❤️ {listing.likes.length}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center gap-1 text-gray-400 text-xs mb-2">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {listing.location}
          </div>
          <h3 className="font-bold text-gray-900 text-base mb-1 line-clamp-1 group-hover:text-amber-500 transition-colors">
            {listing.title}
          </h3>
          <p className="text-gray-500 text-sm line-clamp-2 mb-3">{listing.description}</p>
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-400">by {listing.creatorName}</span>
            <span className="text-xs text-gray-400">{timeAgo}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}