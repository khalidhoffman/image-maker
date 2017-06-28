class Image {

	constructor(params) {
		const defaults = {
			id: -1,
			width: 640,
			height: 640,
			format: 'png'
		};
		const fields = Object.assign(defaults, params);

		Object.keys(fields).forEach((fieldName) => {
			this[fieldName] = fields[fieldName];
		});
	}
}

module.exports = Image;