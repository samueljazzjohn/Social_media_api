const express = require('express')
const userModel = require('../models/userModel')
const router = express.Router()
const jwt = require('jsonwebtoken')
const { authenticateToken } = require('../middleware/authToken')
const postModel = require('../models/postModel')
const commentModel = require('../models/commentModel')
const JWT_SECRET_KEY = require('../config/appconfig').auth.jwt_secret


router.get('/', (req, res, next) => {
    res.send("Hello Express")
})

// User authentication
router.post('/api/authenticate', (req, res, next) => {
    const { email, password } = req.body
    userModel.findOne({ email }).then((user) => {
        // Check if user exists in the database
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Check if password matches
        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const data = { userId: user._id, email: user.email }
        // Create a JWT token with user ID and email
        const token = jwt.sign(
            data,
            JWT_SECRET_KEY,
            { expiresIn: '1h' }
        );
        // Return the JWT token
        return res.json({ token });
    }).catch((err) => {
        return res.status(500).json({ message: err.message });
    })
})

// follow user
router.post('/api/follow/:id', authenticateToken, (req, res, next) => {

    console.log(req.body)

    const { id } = req.params

    // Check if the specified user ID exists in the database
    userModel.findByIdAndUpdate(id, { $addToSet: { followers: id } },
        { new: true }).then((user) => {
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Add the specified user ID to the following list of the authenticated user
            const authenticatedUserId = req.user.userId;
            userModel.findByIdAndUpdate(
                authenticatedUserId,
                { $addToSet: { following: id } },
                { new: true }).then((updatedUser) => {
                    if (!updatedUser) {
                        return res.status(404).json({ message: 'User not found' });
                    }
                    return res.json({ message: `You are now following ${user.name}` });
                }).catch((err) => {
                    return res.status(500).json({ message: err.message });
                })
        }).catch((err) => {
            return res.status(500).json({ message: err.message });

        })
})

// unfollow user
router.post('/api/unfollow/:id', authenticateToken, (req, res, next) => {

    console.log(req.body)

    const { id } = req.params

    // Check if the specified user ID exists in the database
    userModel.findByIdAndUpdate(id, { $pull: { followers: id } }, { new: true }).then((user) => {
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Add the specified user ID to the following list of the authenticated user
        const authenticatedUserId = req.user.userId;
        userModel.findByIdAndUpdate(
            authenticatedUserId,
            { $pull: { following: id } },
            { new: true }).then((updatedUser) => {
                if (!updatedUser) {
                    return res.status(404).json({ message: 'User not found' });
                }
                return res.json({ message: `You are unfollowing ${user.name}` });
            }).catch((err) => {
                return res.status(500).json({ message: err.message });
            })
    }).catch((err) => {
        return res.status(500).json({ message: err.message });

    })
})

// Getting user profile
router.get('/api/user', authenticateToken, (req, res, next) => {
    const userId = req.user.userId;

    // Find the user by ID and select only the necessary fields
    userModel.findById(userId, 'name followers following')
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.json({
                username: user.name,
                followers: user.followers.length,
                following: user.following.length,
            });
        })
        .catch(err => {
            return res.status(500).json({ message: err.message });
        });
});


//   Create a post

router.post('/api/posts', authenticateToken, async (req, res, next) => {
    const { title, description } = req.body;
    const createdBy = req.user.userId;

    const post = new postModel({
        title,
        description,
        createdBy
    })

    post.save().then((doc) => {
        return res.status(201).json({
            id: doc._id,
            title: doc.title,
            description: doc.description,
            createdAt: doc.created_at
        });
    }).catch((err) => {
        return res.status(500).json({ message: err.message });

    })
});


// Delete a post
router.delete('/api/posts/:id', authenticateToken, (req, res, next) => {
    const postId = req.params.id
    const userId = req.user.userId

    postModel.findOneAndDelete({ _id: postId.trim(), createdBy: userId }).then((deletedPost) => {
        if (!deletedPost) return res.status(404).json({ message: 'Post not found or you are not authorized to delete it.' });

        return res.json({ message: 'Post deleted successfully.' });
    }).catch((err) => {
        return res.status(500).json({ message: err.message });
    });
})

// Like a post
router.post('/api/like/:id', authenticateToken, (req, res, next) => {
    const postId = req.params.id
    const userId = req.user.userId

    postModel.findById(postId.trim()).then(async (post) => {
        if (!post) return res.status(404).json({ message: 'Post not found' });

        if (post.likes.includes(userId)) {
            return res.status(400).json({ message: 'You have already liked this post' });
        }
        // Add the authenticated user's ID to the likes array of the post
        post.likes.push(userId);
        await post.save();

        return res.json({
            message: `You have liked the post with ID ${postId}`,
            post: {
                id: post._id,
                title: post.title,
                description: post.description,
                likes: post.likes,
                createdAt: post.created_at
            }
        });
    }).catch((err) => {
        return res.status(500).json({ message: err.message });
    })
})

// Unlike a post
router.post('/api/unlike/:id', authenticateToken, (req, res, next) => {
    const postId = req.params.id
    const userId = req.user.userId

    postModel.findById(postId.trim()).then(async (post) => {
        if (!post) return res.status(404).json({ message: 'Post not found' });

        if (!post.likes.includes(userId)) {
            return res.status(400).json({ message: 'You have not liked this post' });
        }
        // Add the authenticated user's ID to the likes array of the post
        post.likes = post.likes.filter(userId => userId !== userId);
        await post.save();

        return res.json({
            message: `Post unliked successfully`,
            post: {
                id: post._id,
                title: post.title,
                description: post.description,
                likes: post.likes,
                createdAt: post.created_at
            }
        });
    }).catch((err) => {
        return res.status(500).json({ message: err.message });
    })
})


// Add comment to a post
router.post('/api/comment/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { comment } = req.body;
    const userId = req.user.userId

    // Check if the specified post ID exists in the database
    try {
        const post = await postModel.findByIdAndUpdate(id.trim());
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Create a new comment document
        const newComment = new commentModel({
            postId: id.trim(),
            userId,
            comment,
        });

        // Save the comment document to the database
        const savedComment = await newComment.save();

        //   Adding comments id to post model
        post.comments.push(savedComment._id)
        await post.save()

        // Return the comment ID
        return res.json({ commentId: savedComment._id });
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
});

// Get post with likes and comments
router.get('/api/posts/:id', authenticateToken, async (req, res) => {

    const { id } = req.params

    try {
        const post = await postModel
            .findById(id.trim())
            .populate('likes', 'username') // populate the likes with username only
            .populate({
                path: 'comments',
                populate: {
                    path: 'userId',
                    select: 'username' // select only the username field for the user who made the comment
                }
            })
            .exec();

        console.log(req.post)

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const { _id, title, description, createdTime, likes, comments } = post;

        return res.json({
            _id,
            title,
            description,
            createdTime,
            likes: likes.length,
            comments: comments.map(comment => ({
                _id: comment._id,
                text: comment.text,
                username: comment.userId.username,
                createdTime: comment.createdTime
            }))
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// All posts created by authenticated user
router.get('/api/all_posts', authenticateToken, (req, res) => {
    const userId = req.user.userId;

    postModel.find({ createdBy: userId })
        .populate('comments')
        .populate('likes')
        .sort({ created_at: 'desc' })
        .exec().then((posts) => {
            return res.json(
                posts.map((post) => ({
                    id: post._id,
                    title: post.title,
                    desc: post.description,
                    created_at: post.createdAt,
                    comments: post.comments,
                    likes: post.likes.length
                }))
            );
        }).catch((err) => {
            return res.status(500).json({ message: err.message });
        })
});



module.exports = router