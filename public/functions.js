var map;
var markers = []; //TODO: write markers into local storage


$(document).ready(function() {
	fetch("https://data.cityofnewyork.us/resource/9w7m-hzhe.json?$limit=5000")//make an initial call -----TO DO: narrow down to user's zip?
	.then(res => res.json())
	.then(data => {
		createMarkers(data);
		populateFilters(data);
	});
});


function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 40.7128, lng: -74.0060}, //TODO: center on user's location
		zoom: 15
	});
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


function plotPoints() {
	markers.forEach(function(i) {
		new google.maps.Marker(i);
	});
}

async function createMarkers(data) {
	for (let i of data) {
		let formattedAddress = i.building + "+" + i.street + "+" + i.zipcode;
		let elem = {
			map: map
		};
		elem.position = await geocode(formattedAddress);
		markers.push(elem);
		plotPoints();
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

	$('.dropdown input:checkbox').on('click', function() {
		updateFilters();
	});
}


$('.dropdown-container').on('click', function() {
	$('.dropdown').removeClass('visible');

	if ( !$(this).find('.dropdown').hasClass('visible') ) {
		$(this).find('.dropdown').addClass('visible');
	}
});

//------FIX THESE FUNCTIONS-----
$('#clear-filters').on('click', clearMarkers);
function setMapOnAll(map) {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(map);
	}
}

function clearMarkers() {
	setMapOnAll(null);
}
//------FIX THESE FUNCTIONS-----

function updateFilters() {
	let filters = {};
	$('.dropdown').each(function() {
		let filter = $(this).attr('id');
		filters[filter] = []

		$(this).find('input:checkbox:checked').each(function() {
			filters[filter].push($(this).attr('value'));
		});
	});
	buildQuery(filters);
}

function buildQuery(filters) {
	let query = 'https://data.cityofnewyork.us/resource/9w7m-hzhe.json?$where='

	for (var key in filters) {
		filters[key].forEach(function(d, i) {
			query = query + '(' + key + '="' + filters[key][i] + '")';

			if (i + 1 != filters[key].length) {
				query = query + ' OR ';
			}
			console.log(query);
		});
	}
}


//https://data.cityofnewyork.us/resource/9w7m-hzhe.json?$where=(grade="A") AND (grade="B") AND (cuisine_description="Mexican" OR cuisine_description="Korean")
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