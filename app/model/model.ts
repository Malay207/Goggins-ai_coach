import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    UserId: {
        type: String,
        required: true
    },
    ThreadId: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Challengepreferencess = new mongoose.Schema({
    UserId: {
        type: String,
        required: true
    },
    ChallengeId: {
        type: String,
        required: true
    },
    pushnotifications: {
        type: Boolean,
        default: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})
const userMetaSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            unique: true, // Ensures no duplicate userId
            required: true,
        },
        endpoint: {
            type: String,
            required: true,
        },
        p256dh: {
            type: String,
            required: true,
        },
        auth: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            default: Date.now,
        },
    }
);
const messageSchema = new mongoose.Schema({
    threadId: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["user", "assistant"],
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

// Middleware to update `updatedAt` timestamp before saving
const UserMeta = mongoose.models.UserMeta || mongoose.model("UserMeta", userMetaSchema);

const User = mongoose.models.Goggins_user || mongoose.model("Goggins_user", userSchema);
const Challengepreferences = mongoose.models.Challengepreferences || mongoose.model("Challengepreferences", Challengepreferencess);
const Message =
    mongoose.models.Message || mongoose.model("Message", messageSchema);
export { User, Challengepreferences, UserMeta, Message };