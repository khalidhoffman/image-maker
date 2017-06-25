const {exec} = require('child_process');
const fs = require('fs');
const util = require('util');
const path = require('path');

const _ = require('lodash');
const debug = require('debug');
const request = require('superagent');
const CDP = require('chrome-remote-interface');

const Image = require('./image');

const log = debug('image-maker:cdp-image');
const headlessChromeScript = process.env.CHROME_SCRIPT || 'google-chrome --headless --hide-scrollbars --remote-debugging-port=9222 --disable-gpu --enable-logging --v=1';

class CDPImage extends Image {
	constructor(params) {
		super(params);
		this.cdp = {};
		this.state = {};
	}

	init() {
		return this.cleanUp()
			.then(() => {
				this.chrome = exec(headlessChromeScript, {shell: true});
				this.state.init = false;
				return new Promise((resolve) => {
					this.chrome.stdout.on('data', _.debounce((data) => {
						if (!this.state.init) {
							this.state.init = true;
							resolve(data)
						}
					}, 500));
					this.chrome.stderr.on('data', _.debounce((data) => {
						if (!this.state.init) {
							this.state.init = true;
							resolve(data)
						}
					}, 500));
				})
			})
	}

	cleanUp() {
		return new Promise((resolve, reject) => {
			exec(`for pid in $(ps -ef | grep "[^\]]chrome --headless" | awk '{print $2}'); do kill -9 $pid; done`, {shell: true}, (err, stdout, stderr) => {
				log({err, stdout, stderr});
				resolve({err, stdout, stderr});
			})
		})
	}

	/**
	 * renders view to an image file
	 * @returns {Promise.<{imgPath, imgUrl, viewUrl}>}
	 */
	render() {
		const publicDir = path.join(process.cwd(), '/public/');
		const publicScreenShotPath = `/assets/image-${this.id}.${this.format}`;
		const screenShotPath = this.cdp.output || path.join(publicDir, publicScreenShotPath);
		const url = `http://${process.env.DOMAIN}/image/${this.id}/view`;
		const format = this.format === 'jpeg' ? 'jpeg' : 'png';
		const viewportWidth = this.css.width || this.cdp.viewportWidth;
		const viewportHeight = this.css.height || this.cdp.viewportHeight;
		const delay = this.cdp.delay || 0;
		const userAgent = this.cdp.userAgent;
		const fullPage = this.cdp.full;
		/**
		 *
		 * @name client - client for Chrome Debugging Protocol
		 * @type {{DOM, Network, Network, Emulation, Page}}
		 */
		let client;
		let result;


		// Start the Chrome Debugging Protocol
		return this.init()
			.then(() => CDP())
			.then((cdpClient) => {

				// Extract used DevTools domains.
				client = cdpClient;

				// Enable events on domains we are interested in.
				return client.Page.enable()
					.then(() => client.DOM.enable())
					.then(() => client.Network.enable())
					.then(() => {
						// If user agent override was specified, pass to Network domain
						if (userAgent) {
							return client.Network.setUserAgentOverride({userAgent});
						}
					})
					.then(() => {
						// Set up viewport resolution, etc.
						const deviceMetrics = {
							width: viewportWidth,
							height: viewportHeight,
							deviceScaleFactor: 0,
							mobile: false,
							fitWindow: false,
						};

						return client.Emulation.setDeviceMetricsOverride(deviceMetrics)
					})
					.then(() => {
						return client.Emulation.setVisibleSize({
							width: viewportWidth,
							height: viewportHeight,
						})
					})
					// Navigate to target page
					.then(() => client.Page.navigate({url}))
					// Wait for page load event to take screenshot
					.then(() => client.Page.loadEventFired())
					.then(() => {
						return new Promise((resolve) => {
							resolve();
						}, delay)
					})
					.then(() => {
						// If the `full` CLI option was passed, we need to measure the height of
						// the rendered page and use Emulation.setVisibleSize
						if (fullPage) {
							return client.DOM.getDocument()
								.then(result => {
									const {root: {nodeId: documentNodeId}} = result;

									return client.DOM.querySelector({
										selector: 'body',
										nodeId: documentNodeId,
									})
								})
								.then(result => {
									const {nodeId: bodyNodeId} = result;

									return client.DOM.getBoxModel({nodeId: bodyNodeId});
								})
								.then(result => {
									const {model: {height}} = result;

									return client.Emulation.setVisibleSize({width: viewportWidth, height: height})
								})
								// This forceViewport call ensures that content outside the viewport is
								// rendered, otherwise it shows up as grey. Possibly a bug?
								.then(() => client.Emulation.forceViewport({x: 0, y: 0, scale: 1}));
						}
					})
					.then(() => client.Page.captureScreenshot({format}))
					.then((screenshot) => {
						return new Promise((resolve, reject) => {
							fs.writeFile(screenShotPath, new Buffer(screenshot.data, 'base64'), 'base64', (err) => {
								if (err) {
									reject(err);
									return;
								}
								resolve();
							})
						})
					})
					.then(() => {
						log('Screenshot saved');
						client.close();

						result = {
							imgPath: path.join(screenShotPath),
							viewUrl: `http://${process.env.DOMAIN}/image/${this.id}/view`
						};

						return request.post('https://api.imgur.com/3/upload')
							.set('Authorization', `Client-ID ${process.env.IMGUR_ID}`)
							.attach('image', result.imgPath)
					})
					.then((imgResponse) => {
						result.imgUrl = imgResponse.body.data.link;

						return this.cleanUp();
					})
					.then(() => result)
			})
			.catch(err => {
				console.error(err);
				return this.cleanUp()
					.then(() => Promise.reject(err));
			})
	}
}

module.exports = CDPImage;