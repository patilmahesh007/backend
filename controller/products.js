import { ProductModel } from "../models/products.model.js";

const postProducts = async (req, res) => {
    const { name, shortDescription, longDescription, category, price, curentPrice, images } = req.body;

    const mandetoryFields = ["name", "shortDescription", "longDescription", "category", "price", "images"];

    for (const field of mandetoryFields) {
        if (!req.body[field]) {
            return res.status(400).json({ message: ` ${field}  is  required` });
        }
    }
    const newProducts = new ProductModel({ name, shortDescription, longDescription, category, price, curentPrice, images });
    try {
        const savedProducts = await newProducts.save();

        return res.json({
            message: "Product added successfully",
            data: savedProducts,
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error adding product" });
    }

}     

const getProducts = async (req, res) => {
    try {
        const { limit = 1, search } = req.query;

        const query = search
            ? { $or: [
                { name: { $regex: search, $options: "i" } },
                { shortDescription: { $regex: search, $options: "i" } },
                { longDescription: { $regex: search, $options: "i" } },
                { tags: { $regex: search, $options: "i" } }
            ] }
            : {};

        const products = await ProductModel.find(query).limit(Number(limit));

        return res.json(products);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error fetching products" });
    }
};


export { postProducts ,getProducts};