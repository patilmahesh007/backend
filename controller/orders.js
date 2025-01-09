import OrderModel from "../models/orders.model.js";

const postOrders = async (req, res) => {
  const { products, deliveryAddress, phone, paymentMode } = req.body;

  if (!products || !deliveryAddress || !phone || !paymentMode) {
    return res.json(
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

const putOrders = async (req, res) => {
  const user = req.user;
  const { id } = req.params;

  try {
    // Find the order by ID
    const order = await OrderModel.findById(id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Check if the user is authorized to update the order
    if (user.role === "user" && order.userId.toString() !== user._id) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized to update this order",
      });
    }

    // User can only cancel an order if it is not delivered
    if (user.role === "user") {
      if (order.status === "delivered") {
        return res.status(400).json({
          success: false,
          message: "Order has already been delivered",
        });
      }

      if (req.body.status === "cancelled") {
        order.status = "cancelled";
      }
    }

    // Update order fields
    if (req.body.phone) {
      order.phone = req.body.phone;
    }

    if (req.body.deliveryAddress) {
      order.deliveryAddress = req.body.deliveryAddress;
    }

    // Admin-specific updates
    if (user.role === "admin") {
      if (req.body.status) order.status = req.body.status;
      if (req.body.timeline) order.timeline = req.body.timeline;
    }

    // Save the updated order
    await order.save();

    // Return the updated order
    return res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: order,
    });
  } 
  
  
  
  catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the order",
      error: error.message,
    });
  }
};


export { postOrders, putOrders };
