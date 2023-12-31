const express = require('express');
const passport = require('passport')
const router = express.Router();
const ObjectId = require('mongodb').ObjectId;

router.get('/posts', async (req, res) => {
	const posts = await global.database.queryAll('social_posts')
	res.status(200).json(posts.filter(p => p.responseTo == null))
})

router.get('/posts/:post', async (req, res) => {
	const post = await global.database.findOne('social_posts', {_id: new ObjectId(req.params.post)})
	const replies = await global.database.query('social_posts', {repliesTo: new ObjectId(req.params.post)})
	res.status(200).json({post, replies})
})

router.post('/posts/:post/like', global.isAuth, async (req, res) => {
	global.database.updateOne('social_posts', {_id: new ObjectId(req.params.post)}, {$addToSet: {likes: req.user.email}})

	res.status(200).json()
})

router.post('/post', global.isAuth, async (req, res) => {
	const date = new Date();
	global.database.insertOne('social_posts', {
		text: req.body.text,
		datetime: `${date.getDate()}.${date.getMonth()} ${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`,
		poster: req.user.email,
		hashtags: [],
		tagged_people: [],
		attachments: [],
		likes: [],
		repliesTo: null
	}).catch(console.error);

	res.status(200).redirect(global.frontendPublic + '/social')
})

module.exports = router;
