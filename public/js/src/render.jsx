import ReactDOM from 'react-dom';
import React from 'react';
import request from 'superagent';
import ImageView from './views/image-view.jsx';
import $ from 'jquery'

window.$ = $;
window.IMAGE_MAKER_API_URL = 'http://localhost:3333';

$(document).ready(function(){
	const rootEle = document.getElementById('root');
	const imageId = $('#root').attr('data-image-id');

	request.get(`${IMAGE_MAKER_API_URL}/image/${imageId}/params`)
		.then((response) => {
			ReactDOM.render(<div>{response.body.map((imageData, idx) => <ImageView key={idx} root={true} {...imageData} />)}</div>, rootEle);
			$('#root').data('image-maker', response.body);
		})
		.catch((err) => {
			console.error(err);
			ReactDOM.render(<h1 root={true}>Error: {err.toString()}</h1>, document.getElementById('root'));
		})
});

