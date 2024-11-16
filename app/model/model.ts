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

const User = mongoose.models.Goggins_user || mongoose.model("Goggins_user", userSchema);
const Challengepreferences = mongoose.models.Challengepreferences ||mongoose.model("Challengepreferences", Challengepreferencess);

export { User, Challengepreferences };