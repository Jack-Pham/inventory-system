import mongoose from "mongoose";

const ColorSchema = mongoose.Schema({
    id: { type: Number, required: true },

    description: { type: String, required: true},

    key: { type: String, required: true},

    createdAt: { type: Date, default: new Date },
    lastModifiedAt: { type: Date, default: new Date },
});

export default mongoose.model("Color", ColorSchema);
