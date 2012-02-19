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
		var nearby = data.query.results.json.results;
		var nearbyHtml = '<ul data-role="listview" id="nearby-list" data-theme="c" data-inset="true" data-filter="true">';
		for(n in nearby){
			var item = nearby[n];
			nearbyHtml += '<li>';
			nearbyHtml += '<a href="'+ item.url +'">';
			nearbyHtml += '<img src="'+ item.pic +'" width="24" height="24" class="ui-li-icon"/>'; // have to manual specify the width/height
			nearbyHtml += '<h3>' + item.name + '</h3>';
			nearbyHtml += '<p>' + item.promo + '</p>';
			nearbyHtml += '<span class="ui-li-count">' + item.distance + 'm</span>';
			nearbyHtml += '</a>';
			nearbyHtml += '</li>';
		}
		nearbyHtml += '</ul>';
		$('#nearby-content').html(nearbyHtml) // trigger("pagecreate").trigger("refresh"); // alternative method for multiple generated items
		$('#nearby-content > ul').listview(); // needed for ajax addition
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
		var category = data.query.results.json.results;
		var categoryHtml = '<ul data-role="listview" id="category-list" data-theme="c" data-inset="true" data-filter="true">';
		for(c in category){
			var item = category[c];
			categoryHtml += '<li>';
			categoryHtml += '<a href="'+ item.categorytag +'">';
			categoryHtml += '<img src="'+ item.iconurl +'" width="16" height="16" class="ui-li-icon"/>'; // have to manual specify the width/height
			categoryHtml += item.category;
			categoryHtml += '</a>';
			categoryHtml += '</li>';
		}
		categoryHtml += '</ul>';
		$('#category-content').html(categoryHtml) // trigger("pagecreate").trigger("refresh"); // alternative method for multiple generated items
		$('#category-content > ul').listview(); // needed for ajax addition
	}
}


//categoryHtml += '<span class="ui-li-count">4</span>'; // good to keep count