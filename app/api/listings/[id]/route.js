import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import Listing from "@/models/Listing";
import User from "@/models/User";

async function getUser(session) {
  return await User.findOne({ email: session.user.email });
}

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    await connectDB();
    const listing = await Listing.findById(id).lean();
    if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    return NextResponse.json({ listing });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch listing" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { id } = await params;
  try {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const listing = await Listing.findById((await params).id);
    if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });

    const user = await getUser(session);
    if (listing.creator.toString() !== user._id.toString())
      return NextResponse.json({ error: "Not your listing" }, { status: 403 });

    const { title, location, imageUrl, description, price } = await request.json();
    if (!title || !location || !imageUrl || !description)
      return NextResponse.json({ error: "All fields except price are required" }, { status: 400 });

    const updated = await Listing.findByIdAndUpdate(
      (await params).id,
      { title: title.trim(), location: location.trim(), imageUrl: imageUrl.trim(), description: description.trim(), price: price ? parseFloat(price) : null },
      { new: true }
    );

    return NextResponse.json({ message: "Listing updated", listing: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update listing" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  try {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const listing = await Listing.findById((await params).id);
    if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });

    const user = await getUser(session);
    if (listing.creator.toString() !== user._id.toString())
      return NextResponse.json({ error: "Not your listing" }, { status: 403 });

    await Listing.findByIdAndDelete((await params).id);
    return NextResponse.json({ message: "Listing deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete listing" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  try {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const listing = await Listing.findById((await params).id);
    if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });

    const user = await getUser(session);
    const userId = user._id.toString();
    const liked = listing.likes.includes(userId);

    listing.likes = liked
      ? listing.likes.filter((id) => id !== userId)
      : [...listing.likes, userId];

    await listing.save();
    return NextResponse.json({ liked: !liked, likes: listing.likes.length });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update like" }, { status: 500 });
  }
}