const Cart = require("../models/Cart");
const Product = require("../models/Product");

const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (!productId || !quantity || quantity < 1) {
            return res.status(400).json({
                message: "Valid product ID and quantity are required"
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        if (product.stock < quantity) {
            return res.status(400).json({
                message: "Insufficient stock"
            });
        }

        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            cart = await Cart.create({
                user: req.user.id,
                items: [{
                    product: productId,
                    quantity
                }]
            });
        } else {
            const itemIndex = cart.items.findIndex(
                item => item.product.toString() === productId
            );

            if (itemIndex > -1) {
                const newQuantity = cart.items[itemIndex].quantity + quantity;

                if (newQuantity > product.stock) {
                    return res.status(400).json({
                        message: "Insufficient stock"
                    });
                }

                cart.items[itemIndex].quantity = newQuantity;
            } else {
                cart.items.push({
                    product: productId,
                    quantity
                });
            }

            await cart.save();
        }

        res.status(200).json({
            message: "Product added to cart successfully",
            cart
        });

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }

        res.status(500).json({
            message: error.message
        });
    }
};



const getMyCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id })
            .populate("items.product", "name price image category stock");

        if (!cart) {
            return res.status(200).json({
                message: "Your cart is empty",
                cart: {
                    items: []
                }
            });
        }

        res.status(200).json({
            cart
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


const updateCartItem = async (req, res) => {
    try {
        const { quantity } = req.body;
        const { productId } = req.params;

        if (!Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({
                message: "Quantity must be a positive integer"
            });
        }

        const cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        const itemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                message: "Product not found in cart"
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        if (quantity > product.stock) {
            return res.status(400).json({
                message: "Insufficient stock"
            });
        }

        cart.items[itemIndex].quantity = quantity;

        await cart.save();

        res.status(200).json({
            message: "Cart quantity updated successfully",
            cart
        });

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }

        res.status(500).json({
            message: error.message
        });
    }
};


const removeCartItem = async (req, res) => {
    try {
        const { productId } = req.params;

        const cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        const itemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                message: "Product not found in cart"
            });
        }

        cart.items.splice(itemIndex, 1);

        await cart.save();

        res.status(200).json({
            message: "Product removed from cart successfully",
            cart
        });

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }

        res.status(500).json({
            message: error.message
        });
    }
};


const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        cart.items = [];

        await cart.save();

        res.status(200).json({
            message: "Cart cleared successfully",
            cart
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};



module.exports = { addToCart, getMyCart, updateCartItem, removeCartItem, clearCart };