'use strict';

function Horn(hornObject) {
	this.title = hornObject.title;
	this.description = hornObject.description;
	this.image = hornObject.image_url;
	this.keyword = hornObject.keyword;
	this.hornNumber = hornObject.horns;
}

Horn.prototype.render = function () {
	$('main').append('<section class="clone"></section>');
	const $animalClone = $('section[class="clone"]');

	const $animalHTML = $('#photo-template').html();
	$animalClone.html($animalHTML);

	$animalClone.find('p').text(this.description);
	$animalClone.find('img').attr('src', this.image);
	$animalClone.find('h2').text(this.title);
	$animalClone.removeClass('clone');
	$animalClone.addClass(this.title);
}

Horn.allHorns = [];

Horn.readJSON = () => {
	$.get('data/page-1.json', 'json')
		.then(data => {
			data.forEach(animal => {
				Horn.allHorns.push(new Horn(animal));
			})
			console.log(Horn.allHorns);
		})
		.then(Horn.loadHorns);
}

Horn.loadHorns = () => {
	Horn.allHorns.forEach(animal => animal.render());
}

$(() => Horn.readJSON());
