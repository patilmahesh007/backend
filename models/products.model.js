import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    shortDescription: {
        type: String,
        required: true
    },
    longDescription: {
        type: String,
        required: true
    },category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    curentPrice: {
        type: Number,
        required: true
    },
    images: {
        type: [String],
        required: true
    },
    tags: {
        type: [String],
        required: true
    },
}, {
    timestamps: true
})
const ProductModel = mongoose.model("Product", productSchema)
export  {ProductModel}

