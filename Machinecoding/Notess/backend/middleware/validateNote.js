const validate = (req, res, next) => {
    const {title, content} = req.body;
    if(!titel || !content) {
        return res.status(400).json({
            message: "Title and Content are required"
        });
    }

    next();
};

module.exports = validateNote;