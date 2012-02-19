var chalkboard_api_token = 'JVbi0jbTqNVUOiYcdagDO4cvM19aOZdX0rveegKVousCuzt3dY';
var chalkboard_api_nearby_uri = 'http://api.yourchalkboard.com/promo/api/nearby/?token=' + chalkboard_api_token + '&lat=1.300&lng=103.86';
var chalkboard_api_category_uri = 'http://api.yourchalkboard.com/category/api/all/?token=' + chalkboard_api_token;

function getNearby() {		
	var yql_str = 'select * from json where url="'+ chalkboard_api_nearby_uri +'"';	// YQL string. Similar to SQL
	var yql_uri = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent(yql_str) + '&format=json';	// YQL public URI string

	$.ajax({
		url: yql_uri,
		cache: false,
		success: displayNearby
	});
}

function displayNearby(data) {
	if(data.query.results.json != null){
		var nearby = data.query.results.json;
		$("#nearby-content").html($("#NearbyTemplate").render(nearby));
		$('#nearby-content > ul').listview();
	}
}

function getCategory() {		
	var yql_str = 'select * from json where url="'+ chalkboard_api_category_uri +'"';	// YQL string. Similar to SQL
	var yql_uri = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent(yql_str) + '&format=json';	// YQL public URI string

	$.ajax({
		url: yql_uri,
		cache: true,
		success: displayCategory
	});
}

function displayCategory(data) {
	if(data.query.results.json != null){
		var category = data.query.results.json;
		$("#category-content").html($("#CategoryTemplate").render(category)); // trigger("pagecreate").trigger("refresh"); // alternative method for multiple generated items
		$('#category-content > ul').listview();
	}
}