const { body, validationResult } = require("express-validator");

const createNoteValidator = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({max: 100})
        .withMessage("Title cannot exceed 100 characters"),

    body("content")
        .trim()
        .notEmpty()
        .withMessage("Content is required"),

    body("tags")
        .optional()
        .isArray()
        .withMessage("Tags must be an array"),

    (req, res, next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        next();
    }
];

module.exports = {
    createNoteValidator
}