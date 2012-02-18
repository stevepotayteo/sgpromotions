var chalkboard_api_token = 'JVbi0jbTqNVUOiYcdagDO4cvM19aOZdX0rveegKVousCuzt3dY';
var chalkboard_api_category_uri = 'http://api.yourchalkboard.com/category/api/all/?token=' + chalkboard_api_token;

function getCategory() {		
	var yql_str = 'select * from json where url="'+ chalkboard_api_category_uri +'"';	// YQL string. Similar to SQL
	var yql_uri = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent(yql_str) + '&format=json';	// YQL public URI string

	$.ajax({
		url: yql_uri,
		cache: false,
		success: displayCategory
	});
}

function displayCategory(data) {
	if(data.query.results.json != null){
		var category = data.query.results.json.results;
		var categoryHtml = '<ul data-role="listview" data-split-icon="gear" data-split-theme="d">';
		for(c in category){
			var item = category[c];
			categoryHtml += '<li>';
			categoryHtml += '<a href="'+ item.categorytag +'">';
			categoryHtml += '<img src="'+ item.iconurl +'"/>';
			categoryHtml += '<strong>'+ item.category +'</strong>';
			categoryHtml += '</a>';
			categoryHtml += '</li>';
		}
		categoryHtml += '</ul>';
		$("#category-content").html(categoryHtml).trigger("pagecreate").trigger("refresh");;
	}
}