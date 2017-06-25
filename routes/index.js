const path = require('path');
const fs = require('fs');

const debug = require('debug');
const express = require('express');
const marked = require('marked');

const CDPImage = require('../lib/cdp-image');

const log = debug('image-maker:router');
const router = express.Router();
const readmeContent = fs.readFileSync('./README.md', 'utf8');
const readmeHtml = marked(readmeContent);
const cache = {};

router.get('/', (req, res, next) => {
	res.render('index', {
		content: readmeHtml,
		title: 'image-maker'
	});
});

router.post('/', (req, res, next) => {
	const imageId = Date.now();
	let parentImage;

	cache[imageId] = req.body.map((imageParams, idx) => {
		const image = new CDPImage(Object.assign({id: `${imageId}-${idx}`}, imageParams));

		if (idx === 0) {
			parentImage = image;
		} else {
			parentImage.addChild(image);
		}


		return image;
	});

	return Promise.all(cache[imageId].map(image => image.render()))
		.then(results => {
			log(results[0].imgUrl);
			log(results[0].viewUrl);
			res.json(results);
		})
		.catch((err) => {
			log(err.toString());
			next(err);
		});
});

router.get('/image/:imageId/view', (req, res, next) => {
	const imageId = req.params.imageId.replace(/-.+$/, '');

	res.render('template', cache[imageId][0]);
});

router.get('/image/:imageId/params', (req, res, next) => {
	const imageId = req.params.imageId.replace(/-.+$/, '');
	try {
		res.json(cache[imageId].map(image => image.toObject()));
	} catch(err){
		console.error(err);
		res.json([{}])
	}

});

module.exports = router;
