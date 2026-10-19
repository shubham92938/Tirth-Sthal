const mongoose = require("mongoose");

// ── A devotee's Goseva pledge (donation intent, fodder, adoption,
//    medical help or volunteering) submitted from the Goseva page ──
// NOTE: This records the *pledge/intent*. Online payment collection
// (e.g. Razorpay/UPI gateway) can be plugged in later — `status`
// already supports a pending → confirmed → completed workflow.
const GosevaPledgeSchema = new mongoose.Schema(
  {
    // Linked account when the devotee was logged in (optional —
    // guests can also pledge, same spirit as the Contact page form)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [80, "Name cannot exceed 80 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[+\d][\d\s-]{9,15}$/, "Please enter a valid phone number"],
    },

    // Gaushala the seva is offered to. `gaushalaName` is a snapshot so
    // the pledge stays readable even if the listing is renamed/removed.
    gaushala: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gaushala",
      default: null,
    },
    gaushalaName: { type: String, trim: true, default: "Any Gaushala" },

    sevaType: {
      type: String,
      enum: ["donation", "fodder", "adopt-cow", "medical", "volunteer", "other"],
      default: "donation",
    },

    // Pledged amount in ₹ (0 for volunteering / in-kind seva)
    amount: { type: Number, default: 0, min: [0, "Amount cannot be negative"] },

    preferredDate: Date, // mainly for volunteers
    message: { type: String, trim: true, maxlength: 1000 },

    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

GosevaPledgeSchema.index({ user: 1, createdAt: -1 });
GosevaPledgeSchema.index({ status: 1, sevaType: 1 });

module.exports = mongoose.model("GosevaPledge", GosevaPledgeSchema);
