var map;
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 40.7128, lng: -74.0060}, //TODO: center on user's location
		zoom: 15
	});


	fetch("https://data.cityofnewyork.us/resource/9w7m-hzhe.json?$limit=5000")//make an initial call -----TO DO: narrow down to user's zip?
	.then(res => res.json())
	.then(data => {
		plotPoints(data);
		populateFilters(data);
	});
}

async function plotPoints(data) {
	for (let i of data) {
		let formattedAddress = i.building + "+" + i.street + "+" + i.zipcode;
		let elem = {
			map: map
		};
		elem.position = await geocode(formattedAddress);
		new google.maps.Marker(elem);
	}
}

async function geocode(address) {
	const res = await fetch(
		"https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=AIzaSyCn2Ht9My5Ps3LJRclNtm-ATeY_zD57nSE"
	);
	const data = await res.json();
	let coordinates = {
		lat: data.results[0].geometry.location.lat,
		lng: data.results[0].geometry.location.lng
	};
	return coordinates;
}

$('.dropdown-container').on('click', showFilters);

function showFilters() {
	$('.dropdown').removeClass('visible');

	if ( !$(this).find('.dropdown').hasClass('visible') ) {
		$(this).find('.dropdown').addClass('visible');
	}
}

function populateFilters(data) {
	let cuisineTypes = [];
	let grades = [];

	data.forEach(function(restaurant) {
		if ( !cuisineTypes.includes(restaurant.cuisine_description) ) {
			cuisineTypes.push(restaurant.cuisine_description);
		}
		if ( !grades.includes(restaurant.grade) ) {
			grades.push(restaurant.grade);
		}
	});
	cuisineTypes.sort();
	grades.sort();

	cuisineTypes.forEach(function(i) {
		$('#cuisine-description').append('<li><input type="checkbox" value="' + i + '">' + i + '</li>')
	});
	grades.forEach(function(i) {
		$('#grade').append('<li><input type="checkbox" value="' + i + '">' + i + '</li>')
	});
}

// filter functionality
	//when a checkbox in dropdown is selected
		//get values of selected checkboxes



//favorite functionality????


// {
// 	"action": "Violations were cited in the following area(s).",
// 	"boro": "QUEENS",
// 	"building": "9014",
// 	"camis": "50038736",
// 	"critical_flag": "Critical",
// 	"cuisine_description": "Mexican",
// 	"dba": "DON NICO'S",
// 	"grade": "A",
// 	"grade_date": "2015-10-19T00:00:00.000",
// 	"inspection_date": "2015-10-19T00:00:00.000",
// 	"inspection_type": "Pre-permit (Operational) / Initial Inspection",
// 	"phone": "7182976426",
// 	"record_date": "2018-08-30T06:01:26.000",
// 	"score": "12",
// 	"street": "161ST ST",
// 	"violation_code": "05D",
// 	"violation_description": "Hand washing facility not provided in or near food preparation area and toilet room. Hot and cold running water at adequate pressure to enable cleanliness of employees not provided at facility. Soap and an acceptable hand-drying device not provided.",
// 	"zipcode": "11432"
// }