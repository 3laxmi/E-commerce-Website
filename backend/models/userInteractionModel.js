import mongoose from "mongoose";

const userInteractionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  viewedProducts: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
      viewedAt: { type: Date, default: Date.now },
    },
  ],
  searchQueries: [
    {
      query: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
  lastUpdated: { type: Date, default: Date.now },
});

const userInteractionModel =
  mongoose.models.userInteraction ||
  mongoose.model("userInteraction", userInteractionSchema);

export default userInteractionModel;
