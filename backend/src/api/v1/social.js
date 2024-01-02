const express = require('express');
const passport = require('passport')
const router = express.Router();
const ObjectId = require('mongodb').ObjectId;

const Post = require('./../../models/social_post.js');

router.get('/posts', async (req, res) => {
	Post.find().then(posts => res.status(200).json(posts.filter(p => p.repliesTo == null)))
})

router.get('/posts/:post', async (req, res) => {
	const post = await global.database.findOne('social_posts', {_id: new ObjectId(req.params.post)})
	const replies = await global.database.query('social_posts', {repliesTo: new ObjectId(req.params.post)})
	res.status(200).json({post, replies})
})

router.put('/posts/:post/like', global.isAuth, async (req, res) => {
	const post = Post.findById(req.params.post);

	post.likes.addToSet(req.user.email);
	post.save()

	res.status(200).json()
})

router.put('/posts/:post', global.isAuth, async (req, res) => {
	global.database.updateOne('social_posts', {_id: new ObjectId(req.params.post)}, {
		$set: {
			text: req.body.text,
			tagged_people: req.body.oznaceni,
			hashtags: req.body.hashtags,
			attachments: req.body.attachments
		}
	})

	res.status(200).json()
})

router.delete('/posts/:post', global.isAuth, async (req, res) => {
	global.database.deleteOne('social_posts', {_id: new ObjectId(req.params.post)})

	res.status(200).json()
})

router.post('/post', global.isAuth, async (req, res) => {
	if(req.body.text == "") {
		res.status(200).redirect(global.frontendPublic + '/social');
		return;
	}

	const date = new Date();
	const post = new Post({
		text: req.body.text,
		datetime: `${date.getDate()}.${date.getMonth()+1}. ${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`,
		poster: req.user.email,
		hashtags: [],
		tagged_people: [],
		attachments: [],
		likes: [],
		repliesTo: null
	})

	post.save()

	res.status(200).redirect(global.frontendPublic + '/social')
})

module.exports = router;
