'use strict';

function Horn(hornObject, page) {
	this.title = hornObject.title;
	this.description = hornObject.description;
	this.image = hornObject.image_url;
	this.keyword = hornObject.keyword;
	this.hornNumber = hornObject.horns;
	this.page = page;
}

Horn.prototype.render = function () {
	const $source = $('#photo-template').html();
	const template = Handlebars.compile($source);
	return template(this);
}

Horn.allHorns = [];
const hornKeyword = [];
const pageData = ['data/page-1.json', 'data/page-2.json'];
const sectionData = ['photos-page-1', 'photos-page-2'];
let keepPageTrack = 'photos-page-1';

Horn.readJSON = (page, section) => {
	let asyncTiming = 0;
	for (let i = 0; i < page.length; i++) {
		$.get(page[i], 'json')
			.then(data => {
				asyncTiming++;
				data.forEach(animal => {
					Horn.allHorns.push(new Horn(animal, section[i]));
				})
				Horn.allHorns.forEach(animal => {
					if (hornKeyword.indexOf(animal.keyword) === -1) {
						hornKeyword.push(animal.keyword);
					}
				});
				if (asyncTiming === page.length) {
					sortByHorn;
					Horn.loadHorns();
				}
			});
	}
}

Horn.loadHorns = () => {
	populateFilterList(hornKeyword);
	Horn.allHorns.forEach(animal => $('#photos').append(animal.render()));
	$('.photos-page-2').hide();
}

const sortByHorn = () => {
	Horn.allHorns.sort(function (HornOne, HornTwo) {
		return HornOne.hornNumber - HornTwo.hornNumber;
	});
}

const sortByName = () => {
	Horn.allHorns.sort(function (NameOne, NameTwo) {
		if (NameOne.title > NameTwo.title) {
			return 1;
		} else if (NameOne.title < NameTwo.title) {
			return -1;
		} else {
			return 0
		};
	});
}

const populateFilterList = hornKeyword => {
	$.each(hornKeyword.sort(), (index, value) => {
		$('select').append(`<option value="${value}">${value.charAt(0).toUpperCase() + value.slice(1)}</option>`);
	});
}

$('#first').click(() => {
	$('select').get(0).selectedIndex = 0;
	keepPageTrack = 'photos-page-1';
	$('.photos-page-2').hide();
	$('.photos-page-1').show();
}
);
$('#second').click(() => {
	$('select').get(0).selectedIndex = 0;
	keepPageTrack = 'photos-page-2';
	$('.photos-page-2').show();
	$('.photos-page-1').hide();
}
);
$('#sort-name').click(() => {
	$('main').empty();
	sortByName();
	Horn.loadHorns();
	$('section').hide();
	$(`.${keepPageTrack}`).show();
}
);
$('#sort-horn').click(() => {
	$('main').empty();
	sortByHorn();
	Horn.loadHorns();
	$('section').hide();
	$(`.${keepPageTrack}`).show();
}
);

$('select').change(() => {
	$('section').hide();
	let $selection = $('select').val();

	if ($selection === 'default') {
		$('section').show();
	} else {
		$('section').hide();
		$(`.${$selection}.${keepPageTrack}`).show();
	}

})

$(() => {
	Horn.readJSON(pageData, sectionData);
})
