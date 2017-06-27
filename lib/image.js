class Image {

	constructor(params) {
		const defaults = {
			id: -1,
			css: {
				width: 64,
				height: 64,
			},
			format: 'png',
			src: '',
			images: []
		};
		var fields = Object.assign(defaults, params);

		this.images = params.children || params.images;

		Object.keys(fields).forEach((fieldName) => {
			switch (fieldName) {
				case 'children':
					this.images = fields[fieldName];
					break;
				default:
					this[fieldName] = fields[fieldName];
			}
		});
	}

	addChild(image) {
		this.images.push(image);
	}

	toObject() {
		return {
			images: this.images.map(image => image.toObject ? image.toObject() : image),
			id: this.id,
			format: this.format,
			src: this.src,
			css: this.css
		}
	}
}

module.exports = Image;