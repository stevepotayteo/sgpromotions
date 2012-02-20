var chalkboard_api_token = 'JVbi0jbTqNVUOiYcdagDO4cvM19aOZdX0rveegKVousCuzt3dY';
var chalkboard_api_nearby_uri = 'http://api.yourchalkboard.com/promo/api/nearby/?token=' + chalkboard_api_token + '&lat=1.300&lng=103.86';
var chalkboard_api_category_uri = 'http://api.yourchalkboard.com/category/api/all/?token=' + chalkboard_api_token;
var promotion_parameters = ["category","distance","contact_number", "contact_number_link", "name", "promo", "pic", "operating_hours", "url", "expiry_date", "address", "lat", "lng"];

function getNearby() {		
	var yql_str = 'select * from json where url="'+ chalkboard_api_nearby_uri +'"';	// YQL string. Similar to SQL
	var yql_uri = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent(yql_str) + '&format=json';	// YQL public URI string

	$.ajax({
		url: yql_uri,
		cache: false,
        dataType: 'jsonp',
		jsonpCallback: 'displayNearby'
		// success: displayNearby - this only works in chrome
	});
}

function displayNearby(data) {
	if(data.query.results.json != null){
		var nearby = data.query.results.json;
		$("#nearby-content").html($("#NearbyTemplate").render(nearby));
		$('#nearby-content > ul').listview();
		
		$('#nearby-list').delegate("li", "click", function (event) {
			var $item = $(this);
		
			$.each(promotion_parameters, function(index, value) {
				$('#promotion').jqmData(value, $item.jqmData(value));
			});
		    
		    // $.mobile.changePage('#promotion');
		});
	}
}

function getCategory() {		
	var yql_str = 'select * from json where url="'+ chalkboard_api_category_uri +'"';	// YQL string. Similar to SQL
	var yql_uri = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent(yql_str) + '&format=json';	// YQL public URI string

	$.ajax({
		url: yql_uri,
		cache: false,
        dataType: 'jsonp',
        jsonpCallback: 'displayCategory'
		// success: displayCategory
	});
}

function displayCategory(data) {
	if(data.query.results.json != null){
		var category = data.query.results.json;
		$("#category-content").html($("#CategoryTemplate").render(category)); // trigger("pagecreate").trigger("refresh"); // alternative method for multiple generated items
		$('#category-content > ul').listview();
	}
}