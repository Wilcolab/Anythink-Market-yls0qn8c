const router = require("express").Router();
const mongoose = require("mongoose");
const Comment = mongoose.model("Comment");
const User = mongoose.model("User");
const auth = require("../auth");

// Preload comment objects on routes with ':comment'
/**
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @param {*} id
 * @returns
 */
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

// Hey GitHub Copilot, I'm following a tutorial!

/**
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
router.get('/', auth.optional, async (req, res, next) => {
    try {
        const comments = await Comment.find()
            .populate('author');

        return res.json({
            comments: comments.map(function (comment) {
                return comment.toJSONFor(false);
            })
        });
    } catch (err) {
        next(err);
    }
});

// delete a comment
/**
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
router.delete("/delete/:comment", auth.required, async function (req, res, next) {
    try {
        if (req.comment.author.toString() === req.payload.id.toString()) {
            await req.comment.remove();
            return res.sendStatus(204);
        } else {
            res.sendStatus(403);
        }
    } catch (next) {
        next(err);
    }
});

/**
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
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