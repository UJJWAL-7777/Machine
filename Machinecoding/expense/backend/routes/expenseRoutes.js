const express = require("express");
const router = express.Router();

const Expense = require("../models/Expense");

router.post("/", async(req, res) => {
    try{
        const expense = await Expense.create(req.body);
        res.status(201).json(expense);
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
});

router.get("/", async( req, res) => {
    try{
        const expense = await Expense.find().sort({createdAt: -1});
        res.json(expense);
    }
    catch(err){
        res.statis(500).json({message: err.message});
    }
});

router.delete("/:id", async(req, res) => {
    try{
        await Expense.findByIdAndDelete(req.params.id);
        res.json({message: "Expense Deleted"});
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
});

module.exports = router;