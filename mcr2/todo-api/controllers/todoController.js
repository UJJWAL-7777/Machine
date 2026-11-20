const Todo = require("../models/Todo");

const createTodo = async (req, res) => {
    try{
        const {title, description, completed, priority, dueDate} = req.body;

        if(!title || !title.trim()) {
            return res.status(400).json({
                message: "Title is required"
            });
        }

        if (priority && !["low", "medium", "high"].includes(priority)) {
            return res.status(400).json({
                message: "Priority must be low, medium, or high"
            });
        }

        if (completed !== undefined && typeof completed !== "boolean") {
            return res.status(400).json({
                message: "Completed must be a boolean"
            });
        }

        if (description !== undefined && typeof description !== "string") {
            return res.status(400).json({
                message: "Description must be a string"
            });
        }

        let parsedDueDate = dueDate;
        if (dueDate !== undefined && dueDate !== null) {
            parsedDueDate = new Date(dueDate);
            if (Number.isNaN(parsedDueDate.getTime())) {
                return res.status(400).json({
                    message: "Invalid due date"
                });
            }
        }

        const todo = await Todo.create({
            title: title.trim(),
            description,
            completed,
            priority,
            dueDate: parsedDueDate
        });


        res.status(201).json({
            message: "Todo created successfully",
            todo
        });
    } catch(error) {
        res.status(500).json({
            message: error.message
        });
    }
};


const getAllTodos = async (req, res) => {
    try {
        const { completed, priority } = req.query;

        const filter = {};

        if (completed !== undefined) {
            if (completed !== "true" && completed !== "false") {
                return res.status(400).json({
                    message: "Completed must be true or false"
                });
            }
            filter.completed = completed === "true";
        }

        if (priority) {
            if (!["low", "medium", "high"].includes(priority)) {
                return res.status(400).json({
                    message: "Priority must be low, medium, or high"
                });
            }
            filter.priority = priority;
        }

        const todos = await Todo.find(filter).sort({ createdAt: -1 });

        res.status(200).json({
            count: todos.length,
            todos
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


const getTodoById = async (req, res) => {
    try {
        const { id } = req.params;

        const todo = await Todo.findById(id);

        if (!todo) {
            return res.status(404).json({
                message: "Todo not found"
            });
        }

        res.status(200).json({
            todo
        });

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid Todo ID"
            });
        }

        res.status(500).json({
            message: error.message
        });
    }
};

const updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, completed, priority, dueDate } = req.body;
        const updates = {};

        if (title !== undefined) {
            if (typeof title !== "string" || !title.trim()) {
                return res.status(400).json({
                    message: "Title is required"
                });
            }
            updates.title = title.trim();
        }

        if (description !== undefined) {
            if (typeof description !== "string") {
                return res.status(400).json({
                    message: "Description must be a string"
                });
            }
            updates.description = description;
        }

        if (completed !== undefined) {
            if (typeof completed !== "boolean") {
                return res.status(400).json({
                    message: "Completed must be a boolean"
                });
            }
            updates.completed = completed;
        }

        if (priority !== undefined) {
            if (!["low", "medium", "high"].includes(priority)) {
                return res.status(400).json({
                    message: "Priority must be low, medium, or high"
                });
            }
            updates.priority = priority;
        }

        if (dueDate !== undefined) {
            if (dueDate === null) {
                updates.dueDate = null;
            } else {
                const parsedDueDate = new Date(dueDate);
                if (Number.isNaN(parsedDueDate.getTime())) {
                    return res.status(400).json({
                        message: "Invalid due date"
                    });
                }
                updates.dueDate = parsedDueDate;
            }
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                message: "No valid fields provided"
            });
        }

        const todo = await Todo.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        );

        if (!todo) {
            return res.status(404).json({
                message: "Todo not found"
            });
        }

        res.status(200).json({
            message: "Todo updated successfully",
            todo
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid Todo ID"
            });
        }
        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: error.message
            });
        }
        res.status(500).json({
            message: error.message
        });
    }
};

const deleteTodo = async (req, res) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);

        if (!todo) {
            return res.status(404).json({
                message: "Todo not found"
            });
        }

        res.status(200).json({
            message: "Todo deleted successfully"
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid Todo ID"
            });
        }
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createTodo,
    getAllTodos,
    getTodoById,
    updateTodo,
    deleteTodo
};
