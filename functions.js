var map;
function initMap() {

	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 40.7128, lng: -74.0060}, //TODO: center on user's location
		zoom: 15
	});

	fetch("https://data.cityofnewyork.us/resource/9w7m-hzhe.json", {
		method: 'get',
		data: {
			"$limit": 5000,
			"$$app_token": "6FjM1ZtKX9i88F2tcHnHGhFjI"
		}
	})//make an initial call
	.then(res => res.json())
	.then(data => {
		plotPoints(data)
	});
}

sampleData = [{
	"action": "Violations were cited in the following area(s).",
	"boro": "QUEENS",
	"building": "13620",
	"camis": "41350583",
	"critical_flag": "Critical",
	"cuisine_description": "Japanese",
	"dba": "AJISEN RAMEN",
	"inspection_date": "2017-12-07T00:00:00.000",
	"inspection_type": "Cycle Inspection / Initial Inspection",
	"phone": "7183958119",
	"record_date": "2018-09-10T06:01:04.000",
	"score": "26",
	"street": "38 AVENUE",
	"violation_code": "02G",
	"violation_description": "Cold food item held above 41Âº F (smoked fish and reduced oxygen packaged foods above 38 ÂºF) except during necessary preparation.",
	"zipcode": "11354"
}, {
	"action": "Violations were cited in the following area(s).",
	"boro": "MANHATTAN",
	"building": "436",
	"camis": "41363369",
	"critical_flag": "Critical",
	"cuisine_description": "Pizza",
	"dba": "LA CROSTA RESTAURANT",
	"inspection_date": "2015-07-09T00:00:00.000",
	"inspection_type": "Cycle Inspection / Initial Inspection",
	"phone": "2124725004",
	"record_date": "2018-09-12T06:01:14.000",
	"score": "60",
	"street": "EAST   72 STREET",
	"violation_code": "02G",
	"violation_description": "Cold food item held above 41Âº F (smoked fish and reduced oxygen packaged foods above 38 ÂºF) except during necessary preparation.",
	"zipcode": "10021"
}]

function plotPoints(data) {
	sampleData.forEach(function(i) {
		let formattedAddess = (i.building + "+" + i.street + "+" + i.zipcode);
		let marker = new google.maps.Marker(geocode(formattedAddess));
	});
}

function geocode(address) {
	let coordinates = {};

	fetch("https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=AIzaSyCn2Ht9My5Ps3LJRclNtm-ATeY_zD57nSE")
	.then(res => res.json())
	.then(data => {
		coordinates.lat = data.results[0].geometry.location.lat;
		coordinates.lng = data.results[0].geometry.location.lng;
	});

	return coordinates;
}

//TODO:
// function to populate filter lists
	//create empty array for list of cusisine types
	//create empty array for grades
		//for each entry
			//check if cuisine type exists in cuisine array
				//if not, add to cuisine array
			//check if grade exists in grade array
				//if not, add to grades array
	//for each entry in the cuisine-type array, add that entry to cuisine-type dropdown
		//alphabetize the dropdown
	//for each entry in grades array, add that entry to grades dropdown
		//alphabetize the dropdown



// filter functionality
	//when a checkbox in dropdown is selected
		//get values of selected checkboxes



//favorite functionality????