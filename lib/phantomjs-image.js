const util = require('util');
const path = require('path');

const _ = require('lodash');
const request = require('superagent');

const Image = require('./image');

class PhantomJsImage extends Image {

	render() {
		const horseman = new Horseman();
		const screenShotDir = path.join(process.cwd(), '/public/');
		const screenShotPublicPath = `/assets/image-${this.id}.png`;
		let screenShotPath = path.join(screenShotDir, screenShotPublicPath);
		let result;

		return new Promise((resolve, reject) => {
			horseman.viewport(this.css.width, this.css.height)
				.on('error', (err) => {
					console.error(err);
				})
				.on('consoleMessage', function (msg) {
					console.log(msg);
				})
				.open(`http://${process.env.DOMAIN}/image/${this.id}/view`)
				.wait({
					fn: function waitForSelectorCount(selector) {
						const $image = $(selector);
						const imageData = $image.data('image-maker');

						return imageData && $image.height() >= _.get(imageData, 'background.css.width', 64);
					},
					args: ['#root-image'],
					value: true
				})
				.screenshot(screenShotPath)
				.then(() => {
					result = {
						imgPath: path.join(process.cwd(), '/public/', screenShotPublicPath),
						viewUrl: `http://${process.env.DOMAIN}/image/${this.id}/view`
					};

					return request.post('https://api.imgur.com/3/upload')
						.set('Authorization', `Client-ID ${process.env.IMGUR_ID}`)
						.attach('image', result.imgPath)
				})
				.then(function (imgResponse) {
					result.imgUrl = imgResponse.body.data.link;

					resolve(result);
				})
				.catch((err) => {
					console.error(err);
					reject(err);
				})
				.close()
		})
	}
}

module.exports = PhantomJsImage;