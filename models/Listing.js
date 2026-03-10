import mongoose from "mongoose";

const ListingSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  imageUrl: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  price: { type: Number, default: null },
  likes: { type: [String], default: [] },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  creatorName: { type: String, required: true },
}, { timestamps: true });

ListingSchema.index({ title: "text", location: "text", description: "text" });
ListingSchema.index({ createdAt: -1 });

export default mongoose.models.Listing || mongoose.model("Listing", ListingSchema);