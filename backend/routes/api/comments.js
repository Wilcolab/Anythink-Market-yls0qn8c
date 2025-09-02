const router = require("express").Router();
const mongoose = require("mongoose");
const Comment = mongoose.model("Comment");
const User = mongoose.model("User");
const auth = require("../auth");

// Preload comment objects on routes with ':comment'
router.param("comment", async (req, res, next, id) => {
    try {
        const comment = await Comment.findById(id);
        if (!comment) {
            return res.sendStatus(404);
        }
        req.comment = comment;
        return next();
    } catch (err) {
        return next(err);
    }
});

router.delete("/:comment", auth.required, async (req, res, next) => {
    try {
        if (req.comment.author.toString() === req.payload.id.toString()) {
            await req.item.removeComment(req.comment._id);
            await req.comment.remove();
            await req.item.save();
            res.sendStatus(204);
        } else {
            res.sendStatus(403);
        }
    } catch (err) {
        return next(err);
    }
});

module.exports = router;