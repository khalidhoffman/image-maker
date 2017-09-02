const path = require('path');

const fs = require('mz/fs');
const request = require('superagent');
const Horseman = require('node-horseman');

const Image = require('./image');

const defaultTimeout = process.env.TIMEOUT || 60 * 1000;
const defaultWidth = 5.75 * 300; // arbitrary number
const defaultHeight = 8.25 * 300; // arbitrary number
const sizeUnit = 'px'; // for other options see: https://github.com/johntitus/node-horseman#pdfpath-papersize

class PhantomJsImage extends Image {

	constructor(params) {
		const defaults = {
			id: `output-${Date.now()}`,
			height: defaultHeight,
			width: defaultWidth,
			timeout: defaultTimeout,
			dir: 'guides',
			format: 'JPEG', // one of 'PNG', 'GIF', or 'JPEG'.
			pdfDir: '/tmp/',
			pdfOptions: {
				width: `${defaultWidth}${sizeUnit}`,
				height: `${defaultHeight}${sizeUnit}`,
				margin: '0px'
			}
		};
		const fields = Object.assign(defaults, params);
		// instantiate with augmented params
		super(fields);
	}

	render() {
		const horseman = new Horseman({timeout: this.timeout});
		const templateData = {
			images: this.images,
			id: this.id,
			styles: this.styles
		};
		const pdfFilePath = path.join(this.pdfDir, `${this.id}.pdf`);
		const viewUrl = `http://${process.env.DOMAIN}/image/view?data=${encodeURIComponent(JSON.stringify(templateData))}`;
		let result = {view: viewUrl};

		console.log(`view available at: ${viewUrl}`);

		return horseman.viewport(this.width, this.height)
			.on('error', (err) => {
				console.error(err);
			})
			.on('consoleMessage', function (msg) {
				console.log(msg);
			})
			.open(viewUrl)
			// wait for PDFView element to add `rendered` class before continuing
			.waitForSelector('.rendered-all', {timeout: this.timeout})
			// wait an additional period to allow everything to render properly
			.wait(1000)
			.do((done) => {
				switch (this.format.toLowerCase()) {
					case 'pdf':
						horseman.pdf(pdfFilePath, this.pdfOptions)
							.then(() => fs.readFile(pdfFilePath))
							.then((pdfData) => ({pdfData: new Buffer(pdfData, 'binary')}))
							.then(done)
							.catch((error) => done({error}));
						break;
					default:
						horseman.screenshotBase64(this.format.toUpperCase())
							.then((imageData) => {
								return request.post('https://api.imgur.com/3/upload')
									.set('Authorization', `Client-ID ${process.env.IMGUR_ID}`)
									.attach('image', new Buffer(imageData, 'base64'))
							})
							.then((imgResponse) => ({url: imgResponse.body.data.link}))
							.then(done)
							.catch((error) => done({error}));
				}
			})
			.then((viewCaptureResult) => {
				// reject promise if error received from do (screenshot/pdf) function
				if (viewCaptureResult && viewCaptureResult.error) {
					return Promise.reject(viewCaptureResult.error);
				}

				console.log('saved');
				result = viewCaptureResult;

				// remove temporary file if possible to avoid disk space error
				if (this.format.toLowerCase() === 'pdf') {
					return fs.unlink(pdfFilePath)
				}
			})
			.catch((error) => {
				console.error(error);
				result = {error};
			})
			.then(() => horseman.close())
			.then(() => {
				if (result.error) {
					console.error(result.error);
					// only cause error if url was not created
					if (!result.url) {
						return Promise.reject(result.error);
					}
				}

				return result;
			})
	}
}

module.exports = PhantomJsImage;