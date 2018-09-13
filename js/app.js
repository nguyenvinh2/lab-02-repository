'use strict';

function Horn(hornObject) {
	this.title = hornObject.title;
	this.description = hornObject.description;
	this.image = hornObject.image_url;
	this.keyword = hornObject.keyword;
	this.hornNumber = hornObject.horns;
}

Horn.prototype.render = function (section) {
	$('main').append(`<section class="clone"></section>`);
	const $animalClone = $(`section[class="clone"]`);
	const $animalHTML = $(`#photos`).html();
	$animalClone.html($animalHTML);

	$animalClone.find('p').text(this.description);
	$animalClone.find('img').attr('src', this.image);
	$animalClone.find('h2').text(this.title);
	$animalClone.removeClass('clone');
	$animalClone.addClass(this.keyword);
	$animalClone.addClass(section);

}

const hornKeyword = [];
const pageData = ['data/page-1.json', 'data/page-2.json'];
const sectionData = ['photos-page-1', 'photos-page-2'];
let count = 0;

Horn.readJSON = (page, section) => {
	Horn.allHorns = [];
	console.log(section)
	$.get(page, 'json')
		.then(data => {
			data.forEach(animal => {
				Horn.allHorns.push(new Horn(animal));
			})
			console.log(Horn.allHorns);
			Horn.allHorns.forEach(animal => {
				if (hornKeyword.indexOf(animal.keyword) === -1) {
					hornKeyword.push(animal.keyword);
				}
			});
			console.log(hornKeyword);
			populateFilterList(hornKeyword);
		})
		.then(() => Horn.loadHorns(section));
}

Horn.loadHorns = (section) => {
	console.log('IM HERE', section)
	console.log(Horn.allHorns)
	Horn.allHorns.forEach(animal => animal.render(section));
}

const populateFilterList = hornKeyword => {
	$.each(hornKeyword, (index, value) => {
		console.log(value);
		$('select').append(`<option value="${value}">${value.charAt(0).toUpperCase() + value.slice(1)}</option>`);
	});
}

$('#first').click(() => {
	$('.photos-page-2').hide();
	$('.photos-page-1').show();

}
);
$('#second').click(() => {
	$('.photos-page-1').hide();
	if (count === 0) {
		Horn.readJSON(pageData[1], sectionData[1]);
		count++;
	} else {
		$('.photos-page-2').show();
	}

});


$('select').change(() => {
	let $selection = $('select').val();

	if ($selection === 'default') {
		$('section').show();
	} else {
		$('section').hide();
		$(`section[class="${$selection}"]`).show();
	}

})

$(() => {
	Horn.readJSON(pageData[0], sectionData[0]);
})