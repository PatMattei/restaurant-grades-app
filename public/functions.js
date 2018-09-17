var map;
//TODO: write markers into local storage
var markers = []; 


function initMap(parameters, center) {
	if (center == undefined) {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				var pos = {
					lat: position.coords.latitude,
					lng: position.coords.longitude
				};

				map.setCenter(pos);
			});
		} else {
			console.log("get user location not allowed in browser");
		}
	}
	center = {lat: 40.7128, lng: -74.0060};
	$('#map').empty();
	map = new google.maps.Map(document.getElementById('map'), {
		center: center,
		zoom: 15
	});

	apiFetch(parameters);
}

function apiFetch(parameters) {
	let query = "https://data.cityofnewyork.us/resource/9w7m-hzhe.json?$limit=500";

	if (parameters != undefined) {
		query = query + '&' + parameters;
	}

		fetch(query)//make an initial call -----TO DO: narrow down to user's zip?
		.then(res => res.json())
		.then(data => {
			createMarkers(data);
			populateFilters(data);
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

	async function createMarkers(data) {
		markers = [];
		
		for (let i of data) {
			let grade = i.grade;
			let formattedAddress = i.building + "+" + i.street + "+" + i.zipcode;

			let elem = {
				map: map,
				icon: 'images/' + grade + '.png'
			};
			elem.position = await geocode(formattedAddress);
			markers.push(elem);
			plotPoints();
		}
	}

	function plotPoints() {
		markers.forEach(function(i) {
			new google.maps.Marker(i);
		});
	}

	var filters = {
		cuisineTypes: [],
		grades: []
	}
	function populateFilters(data) {
		data.forEach(function(restaurant) {
			if ( !filters.cuisineTypes.includes(restaurant.cuisine_description) ) {
				filters.cuisineTypes.push(restaurant.cuisine_description);
				$('#cuisine-description').empty();			
				filters.cuisineTypes.forEach(function(i) {
					$('#cuisine-description').append('<li><input type="checkbox" value="' + i + '">' + i + '</li>')
				});
				filters.cuisineTypes.sort();
			}
			if ( !filters.grades.includes(restaurant.grade) ) {
				filters.grades.push(restaurant.grade);
				$('#grade').empty();
				filters.grades.forEach(function(i) {
					$('#grade').append('<li><input type="checkbox" value="' + i + '">' + i + '</li>')
				});
				filters.grades.sort();
			}
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
		let activeFilters = {};
		$('.dropdown').each(function() {
			let apiFilter = $(this).attr('api-call');
			activeFilters[apiFilter] = []

			$(this).find('input:checkbox:checked').each(function() {
				activeFilters[apiFilter].push($(this).attr('value'));
			});
		});
		let query = buildFilterQuery(activeFilters);
		let center = {lat: map.getCenter().lat(), lng: map.getCenter().lng()};

		initMap(query, center)
	}

	function buildFilterQuery(activeFilters) {
		let query = '$where=';

		for (var key in activeFilters) {
			activeFilters[key].forEach(function(d, i) {
				if (i == 0) {
					query = query + '(';
				}
				query = query + key + '="' + d + '"';

				if (i + 1 != activeFilters[key].length) {
					query = query + " OR ";
				} else {
					query = query + ") AND ";
		}
	});
		}
		query = query.slice(0, -5); //slice the final ' AND ' statement
		return query;
	}

	//	• N = Not Yet Graded • A = Grade A • B = Grade B • C = Grade C • Z = Grade Pending • P= Grade Pending issued on re-opening following an initial inspection that resulted in a closure

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