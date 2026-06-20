const express = require("express");
const Todo = require("../models/Todo");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, async(req, res) => {
    try{
        const todo = await Todo.create({
            title: req.body.title,
            userId: req.user.id
        });

        res.status(200).json(todo);
    }
    catch(error){
        res.status(500).json({
            message: error.message
        });
    }
})

router.get("/", authMiddleware, async(req, res) => {
    try{
        const todos = await Todo.find({
            userId: req.user.id
        });

        res.json(todos);
    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }
});

router.delete("/:id", authMiddleware, async(req, res) => {
    try{
        await Todo.findByIdAndDelete(
            req.params.id
        );

        res.json({
            message:"Todo deleted"
        });
    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }
});

module.exports = router;