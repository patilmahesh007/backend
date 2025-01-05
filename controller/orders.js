import OrderModel from "../models/orders.model.js";

const postOrders = async (req, res) => {
    const { products, deliveryAddress, phone, paymentMode } = req.body;
  
    if (!products || !deliveryAddress || !phone || !paymentMode) {
      return responder(
        res,
        false,
        `products, totalBill, deliveryAddress, phone, paymentMode are required`,
        null,
        400
      );
    }
  
    let totalBill = 0;
  
    products.forEach((product) => {
      totalBill += product.price * product.quantity;
    });
  
    try {
      const newOrder = new OrderModel({
        userId: req.user._id,
        products,
        totalBill,
        deliveryAddress,
        phone,
        paymentMode,
      });
  
      const savedOrder = await newOrder.save();
  
      res.json({
        message: "Order placed successfully",
        data: savedOrder,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error placing order" });
    }
  };

export { postOrders };
