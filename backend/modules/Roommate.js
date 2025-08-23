import mongoose from "mongoose";

const RoommateSchema = new mongoose.Schema({
  // User who posted this
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  
  // Post type
  type: {
    type: String,
    enum: ["looking_for_roommate", "room_available"],
    required: true
  },
  
  // Basic info
  title: { 
    type: String, 
    required: true,
    trim: true,
    maxLength: 100
  },
  description: { 
    type: String, 
    required: true,
    maxLength: 1000
  },
  
  // Budget/Price
  budget: {
    min: { type: Number },
    max: { type: Number },
    currency: { type: String, default: "INR" }
  },
  rent: { type: Number }, // If room_available
  
  // Location
  location: {
    area: { type: String, required: true },
    city: { type: String, required: true },
    nearbyCollege: { type: String },
    fullAddress: { type: String },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  
  // Preferences
  preferences: {
    gender: {
      type: String,
      enum: ["male", "female", "any"],
      default: "any"
    },
    ageRange: {
      min: { type: Number, min: 18, max: 35 },
      max: { type: Number, min: 18, max: 35 }
    },
    occupation: {
      type: String,
      enum: ["student", "working_professional", "any"],
      default: "any"
    },
    habits: [{
      type: String,
      enum: ["non_smoker", "vegetarian", "non_drinker", "pet_friendly", "early_sleeper", "night_owl"]
    }],
    cleanliness: {
      type: String,
      enum: ["very_clean", "moderately_clean", "flexible"]
    }
  },
  
  // Room details 
  roomDetails: {
    roomType: {
      type: String,
      enum: ["single", "shared", "1bhk", "2bhk", "3bhk"]
    },
    furnishing: {
      type: String,
      enum: ["fully_furnished", "semi_furnished", "unfurnished"]
    },
    amenities: [{
      type: String,
      enum: ["wifi", "ac", "parking", "laundry", "kitchen", "balcony", "gym"]
    }]
  },
  
  // Contact info
  contact: {
    name: { type: String, required: true },
    phone: { 
      type: String, 
      required: true,
      match: /^[6-9]\d{9}$/ // Indian mobile number pattern
    },
    email: { type: String },
    whatsapp: { type: String },
    preferredContact: {
      type: String,
      enum: ["phone", "email", "whatsapp", "in_app_chat"],
      default: "phone"
    }
  },
  
  // Images
  images: [{
    type: String,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+\.(jpg|jpeg|png|webp)$/i.test(v);
      },
      message: 'Invalid image URL'
    }
  }],
  
  // Status and visibility
  isActive: { type: Boolean, default: true },
  isPremium: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  
  // Expiry
  expiresAt: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
    }
  },
  
  // Analytics
  views: { type: Number, default: 0 },
  interested: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    interestedAt: { type: Date, default: Date.now }
  }],
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});




const Roommate = mongoose.models.Roommate || mongoose.model('Roommate', RoommateSchema);

export default Roommate;