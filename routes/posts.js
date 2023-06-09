const Post = require('../models/Post')
const User = require('../models/User')
const router = require('express').Router();

//create post
router.post('/save', async (req, res) => {
    const newPost = new Post(req.body)
    try {
        const savedPost = await newPost.save()
        res.status(200).send(newPost)
    } catch (err) {
        return res.status(500).json(err)
    }
})
//update post
router.put('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (post.userId == req.body.userId) {
            await post.updateOne({ $set: req.body })
            res.status(200).json('Post has been updated')
        } else {
            return res.status(403).json('You can update only your post!')
        }
    } catch (e) {
        return res.status(500).json(e)
    }
})
//delete post
router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (post.userId == req.body.userId) {
            await post.deleteOne()
            res.status(200).json('Post has been deleted')
        } else {
            return res.status(403).json('You can delete only your post!')
        }
    } catch (e) {
        return res.status(500).json(e)
    }
})
//like / dislike post
router.put('/:id/like', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } })
            res.status(200).json('You have liked this post')
        } else {
            await post.updateOne({ $pull: { likes: req.body.userId } })
            res.status(200).json('You have disliked this post')
        }
    } catch (e) {
        return res.status(500).json(e)
    }
})
//get post
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        res.status(200).json(post)
    } catch (e) {
        return res.status(500).json(e)
    }
})
//get timeline posts
router.get('/timeline/all', async (req, res) => {
    try {
        const currentUser = await User.findById(req.body.userId)
        const userPosts = await Post.find({ userId: currentUser._id })
        const friendPosts = await Promise.all(
            currentUser.following.map((friendId) => {
                return Post.find({ userId: friendId })
            })
        )
        res.status(200).json(userPosts.concat(...friendPosts))
    } catch (e) {
        return res.status(500).json(e)
    }
})

module.exports = router