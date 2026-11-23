const Product = require("../models/Product");

const createProduct = async (req, res) => {
    try{
        const {name, description, price, category, stock, image} = req.body;

        if(!name || !description || price === undefined || !category) {
            return res.status(400).json({
                message: "Required fields are missing"
            });
        }

        if(price < 0 || (stock !== undefined && stock < 0)) {
            return res.status(400).json({
                message: "Price and stock cannot be negative"
            });
        }

        const product = await Product.create({
            name,
            description,
            price,
            category,
            stock,
            image,
            createdBy: req.user.id
        });

        res.status(201).json({
            message: "Product created successfully",
            product
        });

    } catch(error) {
        res.status(500).json({
            message: error.message
        });
    }
};


const getAllProducts = async (req, res) => {
    try{
        const {
            search,
            category,
            minPrice,
            maxPrice,
            sort,
            page = 1,
            limit = 10
        } = req.query;

        let filter = {};

        if(search) {
            filter.name = {
                $regex: search,
                $options: "i"
            };
        }

        if(category) {
            filter.category = category;
        }

        if(minPrice !== undefined || maxPrice !== undefined) {
            filter.price = {};

            if(minPrice !== undefined) {
                filter.price.$gte = Number(minPrice);
            }

            if(maxPrice !== undefined) {
                filter.price.$lte = Number(maxPrice);
            }
        }

        let sortOption = {};

        if(sort === "price_asc") {
            sortOption.price = 1;
        } else if(sort === "price_desc") {
            sortOption.price = -1;
        } else if(sort == "newest") {
            sortOption.createdAt = -1;
        }

        const skip = (Number(page) - 1) * Number(limit);

        const products = await Product.find(filter)
            .sort(sortOption)
            .skip(skip)
            .limit(Number(limit));

        const totalProducts = await Product.countDocuments(filter);


        res.status(200).json({
            totalProducts,
            currentPage: Number(page),
            totalPages: Math.ceil(totalProducts / Number(limit)),
            products
        });
    } catch(error) {
        res.status(500).json({
            message: error.message
        });
    }
};


const getProductById = async(req, res) => {
    try{
        const product = await Product.findById(req.params.id);

        if(!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            product
        });
    } catch(error) {
        if(error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }

        res.status(500).json({
            message: error.message
        });
    }
};


const updateProduct = async(req, res) => {
    try{
        const product = await Product.findById(req.params.id);

        if(!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        const{name, description, price, category, stock, image} = req.body;

        if(price !== undefined && price < 0) {
            return res.status(400).json({
                message: "Price cannot be negative"
            });
        }

        if(stock !== undefined && stock < 0) {
            return res.status(400).json({
                message: "Stock cannot be negative"
            });
        }

        product.name = name ?? product.name;               //   ---  ?? (Nullish Coalescing Operator)
        product.description = description ?? product.description;
        product.price = price ?? product.price;
        product.category = category ?? product.category;
        product.stock = stock ?? product.stock;
        product.image = image ?? product.image;

        await product.save();

        res.status(200).json({
            message: "Product updated successfully",
            product
        });
    } catch(error) {
        if(error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }
        res.status(500).json({
            messaeg: error.message
        });
    }
};



const deleteProduct = async (req, res) => {
    try{
        const product = await Product.findById(req.params.id);

        if(!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        await Product.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "oproduct deleted successfully"
        });
    } catch(error) {
        if(error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }

        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct };