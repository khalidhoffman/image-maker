const path = require('path');
const fs = require('fs');

const debug = require('debug');
const express = require('express');
const marked = require('marked');

const PhantomJsImage = require('../lib/phantomjs-image');

const log = debug('image-maker:router');
const router = express.Router();
const pkgName = require('../package.json').name;
const isModule = process.cwd() !== path.resolve(__dirname, '../');
const projectDir = isModule ? path.join(process.cwd(), `./node_modules/${pkgName}/`) : process.cwd();
const readmeContent = fs.readFileSync(path.join(projectDir, './README.md'), 'utf8');
const readmeHtml = marked(readmeContent);
const imagesCache = {};

router.get('/', (req, res, next) => {
	res.render('index', {
		content: readmeHtml,
		title: 'image-maker'
	});
});

router.post('/', (req, res, next) => {
	const imageId = Date.now();
	let image;

	req.body.id = imageId;
	req.body.images = req.body.images.map((imageParams, idx) => {
		return Object.assign({id: `${imageId}-${idx}`}, imageParams);
	});

	imagesCache[imageId] = req.body;

	image = new PhantomJsImage(imagesCache[imageId]);

	return image.render()
		.then(result => {
			log(result.imgUrl);
			log(result.viewUrl);
			res.json(result);
		})
		.catch((err) => {
			log(err.toString());
			next(err);
		});
});

router.get('/image/:imageId/view', (req, res, next) => {
	const imageId = req.params.imageId.replace(/-.+$/, '');

	res.render('template', {
		cache: imagesCache[imageId],
		id: imageId
	});
});

router.get('/image/:imageId/params', (req, res, next) => {
	const imageId = req.params.imageId.replace(/-.+$/, '');

	res.json(imagesCache[imageId]);
});

module.exports = router;
