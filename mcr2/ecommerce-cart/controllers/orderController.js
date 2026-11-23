const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const placeOrder = async (req, res) => {
    try {
        const { shippingAddress } = req.body;

        if (!shippingAddress) {
            return res.status(400).json({
                message: "Shipping address is required"
            });
        }

        const cart = await Cart.findOne({
            user: req.user.id
        }).populate("items.product");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                message: "Your cart is empty"
            });
        }

        let totalAmount = 0;
        const orderItems = [];

        for (const item of cart.items) {
            const product = item.product;

            if (!product) {
                return res.status(404).json({
                    message: "A product in your cart no longer exists"
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for ${product.name}`
                });
            }

            orderItems.push({
                product: product._id,
                quantity: item.quantity,
                price: product.price
            });

            totalAmount += product.price * item.quantity;
        }

        for (const item of cart.items) {
            await Product.findByIdAndUpdate(
                item.product._id,
                {
                    $inc: {
                        stock: -item.quantity
                    }
                }
            );
        }

        const order = await Order.create({
            user: req.user.id,
            items: orderItems,
            totalAmount,
            shippingAddress
        });

        cart.items = [];
        await cart.save();

        res.status(201).json({
            message: "Order placed successfully",
            order
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.user.id
        })
            .populate("items.product", "name image")
            .sort({ createdAt: -1 });

        res.status(200).json({
            totalOrders: orders.length,
            orders
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


const getOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user.id
        }).populate("items.product", "name image");

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.status(200).json({
            order
        });

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid order ID"
            });
        }

        res.status(500).json({
            message: error.message
        });
    }
};


const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        if (order.status === "cancelled") {
            return res.status(400).json({
                message: "Order is already cancelled"
            });
        }

        if (order.status !== "pending") {
            return res.status(400).json({
                message: "Only pending orders can be cancelled"
            });
        }

        for (const item of order.items) {
            await Product.findByIdAndUpdate(
                item.product,
                {
                    $inc: {
                        stock: item.quantity
                    }
                }
            );
        }

        order.status = "cancelled";

        await order.save();

        res.status(200).json({
            message: "Order cancelled successfully",
            order
        });

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid order ID"
            });
        }

        res.status(500).json({
            message: error.message
        });
    }
};


const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatuses = [
            "pending",
            "confirmed",
            "shipped",
            "delivered",
            "cancelled"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid order status"
            });
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        if (order.status === "cancelled") {
            return res.status(400).json({
                message: "Cannot update a cancelled order"
            });
        }

        order.status = status;

        await order.save();

        res.status(200).json({
            message: "Order status updated successfully",
            order
        });

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid order ID"
            });
        }

        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = { placeOrder, getMyOrders, getOrderById, cancelOrder, updateOrderStatus };