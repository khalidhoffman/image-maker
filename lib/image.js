class Image {

    constructor(params){
        const defaults = {
            id: -1,
            css : {
				width: 64,
				height: 64,
            },
            format: 'png',
            src: '',
			images: []
        };
        const {id, css, format, src, images} = Object.assign(defaults, params);

		this.images = params.children || images;
		this.id = id;
        this.format = format;
        this.src = src;
		this.css = css;
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