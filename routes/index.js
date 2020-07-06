const express = require('express'),
    router = express.Router(),
    { ensureAuth, ensureGuest } = require('../middleware/auth'),
    Story = require('../models/Story')

// @desc  Login/Landing page
// @route GET /
router.get('/login', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login'
    })
})

// @desc  Dashboard
// @route GET /dashboard
router.get('/dashboard', ensureAuth, async(req, res) => {
    try {

        const stories = await Story.find({ user: req.user._id }).lean()

        res.render('dashboard', {
            name: req.user.displayName,
            image: req.user.image,
            stories
        })
    } catch (error) {
        console.error(error);
        res.render('error/500')

    }

})


module.exports = router