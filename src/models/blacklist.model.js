import mongoose from "mongoose";

const blacklistTokenSchema = new mongoose.Schema(
    {
        token: {
            type: String,
            required: [true, "Token is required"],
        },
    },
    { timestamps: true }
);

const tokenBlacklistModel = mongoose.model("Blacklist", blacklistTokenSchema);

export default tokenBlacklistModel;