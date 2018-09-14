var map;
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 40.7128, lng: -74.0060}, //TODO: center on user's location
		zoom: 15
	});


	fetch("https://data.cityofnewyork.us/resource/9w7m-hzhe.json?$limit=1000&$where=zipcode IS NOT NULL AND building IS NOT NULL AND street IS NOT NULL")//make an initial call TO DO narrow down to user's zip?
	.then(res => res.json())
	.then(data => {
		plotPoints(data);
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