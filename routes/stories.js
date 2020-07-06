const { route } = require('.');

const express = require('express'),
    router = express.Router(),
    { ensureAuth } = require('../middleware/auth'),
    Story = require('../models/Story')

// @desc  Show all Stories
// @route GET /stories
router.get('/', ensureAuth, async(req, res) => {
    try {

        const stories = await Story.find({ status: 'public' })
            .populate('user')
            .sort({ createdAt: 'desc' })
            .lean()

        res.render('stories/index', {
            stories
        })

    } catch (error) {
        console.error(error);
        res.render('error/500')
    }
})

// @desc  Show add page
// @route GET /stories/add
router.get('/add', ensureAuth, (req, res) => {
    res.render('stories/add')
})

// @desc  Process add form
// @route POST /stories
router.post('/', ensureAuth, async(req, res) => {
    try {

        req.body.user = req.user._id
        await Story.create(req.body)
        res.redirect('/dashboard')

    } catch (error) {
        console.error(error);
        res.render('error/500')

    }
})


// @desc  Show single story
// @route GET /stories/:id
router.get('/:id', ensureAuth, async(req, res) => {
    try {

        let story = await Story.findById(req.params.id)
            .populate('user')
            .lean()

        if (!story)
            return res.render('error/404')
        res.render('stories/show', {
            story
        })

    } catch (error) {
        console.error(error);
        res.render('error/500')
    }
})


// @desc  Show edit page
// @route GET /stories/edit/:id
router.get('/edit/:id', ensureAuth, async(req, res) => {
    try {
        const story = await Story.findOne({
            _id: req.params.id
        }).lean()

        if (!story)
            return res.render('error/404')
        if (story.user != req.user.id)
            return res.redirect('/stories')

        res.render('stories/edit', {
            story
        })
    } catch (error) {
        console.error(error);
        res.render('error/500')
    }

})


// @desc Update sotry
// @route PUT /stories/:id
router.put('/:id', ensureAuth, async(req, res) => {

    try {
        let story = await Story.findById(req.params.id).lean()
        if (!story)
            return res.render('error/404')
        if (story.user != req.user.id)
            return res.redirect('/stories')
        story = await Story.findOneAndUpdate({ _id: req.params.id },
            req.body, {
                new: true,
                runValidators: true
            }
        )

        res.redirect('/dashboard')

    } catch (error) {
        console.error(error);
        res.render('error/500')
    }




})

// @des Delete sotry
// @route DELETE /stories/:id
router.delete('/:id', ensureAuth, async(req, res) => {
    try {
        await Story.remove({ _id: req.params.id })
        res.redirect('/dashboard')
    } catch (error) {
        console.error(error);
        res.render('error/500')
    }
})

// @desc    User stories
// @route   GET /stories/user/:userId
router.get('/user/:userId', ensureAuth, async(req, res) => {
    try {
        const stories = await Story.find({
                user: req.params.userId,
                status: 'public',
            })
            .populate('user')
            .lean()

        res.render('stories/index', {
            stories,
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

module.exports = router