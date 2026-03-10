import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import Listing from "@/models/Listing";
import User from "@/models/User";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = 9;
    const skip = (page - 1) * limit;

    const query = search
      ? { $or: [{ title: { $regex: search, $options: "i" } }, { location: { $regex: search, $options: "i" } }] }
      : {};

    const total = await Listing.countDocuments(query);
    const listings = await Listing.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean();

    return NextResponse.json({ listings, pagination: { total, page, totalPages: Math.ceil(total / limit), hasMore: page * limit < total } });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { title, location, imageUrl, description, price } = await request.json();
    if (!title || !location || !imageUrl || !description)
      return NextResponse.json({ error: "All fields except price are required" }, { status: 400 });

    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const listing = await Listing.create({
      title: title.trim(), location: location.trim(),
      imageUrl: imageUrl.trim(), description: description.trim(),
      price: price ? parseFloat(price) : null,
      creator: user._id, creatorName: user.name,
    });

    return NextResponse.json({ message: "Listing created", listing }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create listing" }, { status: 500 });
  }
}