import mongoose from "mongoose";

const OrderSchema = mongoose.Schema({
    id: { type: Number, required: true },

    //orderNumber: { type: Number, required: true},

    details: [{
        id: { type: Number, required: true },
        sku: { type: String, required: true },
        mainSku: { type: String, required: true },
        quantity: { type: Number, required: true },
        desc: { type: String, required: true },
        accept: { type: Number, required: true },
        capacity: { type: Number, required: true },
        mainStock: { type: String, required: false },
        status: { type: String, required: true, enum: ["added", "pending"] }
    }],

    company: { type: String, required: true },

    createdBy: { type: String, required: true },

    processedBy: { type: String, required: true },

    status: { type: String, required: true, enum: ["approved", "pending", "canceled"] },

    createdAt: { type: Date, default: new Date((new Date()).getTime() + (3600000*(-7))) },
    lastModifiedAt: { type: Date, default: new Date((new Date()).getTime() + (3600000*(-7))) },
});

export default mongoose.model("Order", OrderSchema);
