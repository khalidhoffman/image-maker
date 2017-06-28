const util = require('util');
const path = require('path');

const _ = require('lodash');
const request = require('superagent');
const Horseman = require('node-horseman');

const Image = require('./image');

class PhantomJsImage extends Image {

	render() {
		const horseman = new Horseman();

		return new Promise((resolve, reject) => {
			console.log(`width: ${this.width/(300*2.7)}, height; ${this.height/(300*2.7)}`)
			horseman.viewport(this.width, this.height)
				.on('error', (err) => {
					console.error(err);
				})
				.on('consoleMessage', function (msg) {
					console.log(msg);
				})
				.open(`http://${process.env.DOMAIN}/image/${this.id}/view`)
				.evaluate( function(selector){
					var $body = $(selector);
					$body.width(this.width);
					$body.height(this.height);
				}, 'body')
				.wait({
					fn: function waitForSelectorCount(selector) {
						var $image = $(selector);
						var imageData = $image.data('image-maker');

						return imageData && $image.height() >= this.height;
					},
					args: ['#root'],
					value: true
				})
				.screenshotBase64(this.format.toUpperCase())
				.then((imageData) => {

					return request.post('https://api.imgur.com/3/upload')
						.set('Authorization', `Client-ID ${process.env.IMGUR_ID}`)
						.attach('image', new Buffer(imageData, 'base64'))
				})
				.then((imgResponse) => {
					resolve({
						viewUrl: `http://${process.env.DOMAIN}/image/${this.id}/view`,
						imgUrl: imgResponse.body.data.link
					})
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