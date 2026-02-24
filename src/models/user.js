// models/User.js - FIXED VERSION
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, "Name is required"], 
        trim: true, 
        minlength: 2, 
        maxlength: 50 
    },
    email: { 
        type: String, 
        required: [true, "Email is required"], 
        unique: true,  // ✅ THIS IS THE ONLY INDEX WE NEED
        lowercase: true, 
        trim: true, 
        match: [/^\S+@\S+\.\S+$/, "Invalid email"] 
    },
    password: { 
        type: String, 
        required: [true, "Password is required"], 
        minlength: 6, 
        select: false 
    },
    role: { 
        type: String, 
        enum: ["user", "admin"], 
        default: "user" 
    },
    isActive: { 
        type: Boolean, 
        default: true 
    },
    refreshToken: { 
        type: String, 
        select: false 
    },
    avatar: { 
        type: String, 
        default: null 
    },
    phone: { 
        type: String, 
        default: null 
    },
    addresses: [{
        label: String,
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: { 
            type: String, 
            default: "India" 
        },
        isDefault: { 
            type: Boolean, 
            default: false 
        },
    }],
    lastLoginAt: { 
        type: Date, 
        default: null 
    },
}, { 
    timestamps: true 
});

// ❌ REMOVE THIS LINE COMPLETELY:
// userSchema.index({ email: 1 });  ← DELETE THIS

userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    delete user.refreshToken;
    return user;
};

// ✅ Use this pattern to prevent OverwriteModelError
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;