var chalkboard_api_token = 'JVbi0jbTqNVUOiYcdagDO4cvM19aOZdX0rveegKVousCuzt3dY';
//var chalkboard_api_nearby_uri = 'http://api.yourchalkboard.com/promo/api/nearby/?token=' + chalkboard_api_token + '&lat=1.300&lng=103.86';
var chalkboard_api_nearby_uri = 'http://api.yourchalkboard.com/promo/api/nearby/?token=' + chalkboard_api_token;
var default_lat = 1.300;
var default_lng = 103.86;
var chalkboard_api_category_uri = 'http://api.yourchalkboard.com/category/api/all/?token=' + chalkboard_api_token;
var promotion_parameters = ["category","distance","contact_number", "contact_number_link", "name", "promo", "pic", "operating_hours", "url", "expiry_date", "address", "lat", "lng"];

$(document).bind("mobileinit", function() {
    $.mobile.ajaxEnabled = false;
//                $.support.cors = true;
//                $.mobile.allowCrossDomainPages = true;
//
//              $.mobile.page.prototype.options.addBackBtn = true; // back button doesn't work for pages on different files when using phonegap
//				$.mobile.page.prototype.options.backBtnText = "Back";
//				$.mobile.page.prototype.options.backBtnTheme = "b";
//
//				$("[data-role='page']").live("pageshow", function () {
//				    $('a[data-rel|="back"]').removeClass().addClass("ui-btn-back ui-btn-left ui-btn ui-btn-icon-notext ui-btn-corner-all ui-shadow ui-btn-up-b");
//				});
});

function getNearby() {
    var currentLat = sessionStorage.getItem("current_lat");
    var currentLng = sessionStorage.getItem("current_lng");
    var additionalParameters = '';
    if(currentLat != null && currentLng != null) {
        additionalParameters += '&lat=' + currentLat + '&lng=' + currentLng;
    } else {
        return;
    }

    var category_selection = sessionStorage.getItem("categorySelect");
    if(category_selection != null && category_selection != "all") {
        additionalParameters += '&category=' + category_selection;
    }

	var yql_str = 'select * from json where url="'+ chalkboard_api_nearby_uri + additionalParameters +'"';	// YQL string. Similar to SQL
	var yql_uri = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent(yql_str) + '&format=json';	// YQL public URI string

	$.ajax({
		url: yql_uri,
		cache: false,
        dataType: 'jsonp',
		jsonpCallback: 'displayNearby'
		// success: displayNearby - this only works in chrome
	});
}

/* GPS Section */
// onSuccess Geolocation
//
function onSuccess(position) {
    navigator.notification.alert(position.coords.latitude + ' ' + position.coords.longitude);
    sessionStorage.setItem("current_lat", position.coords.latitude);
    sessionStorage.setItem("current_lng", position.coords.longitude);
}

// onError Callback receives a PositionError object
//
function onError(error) {
    navigator.notification.alert("code: "    + error.code    + '\n' +
        'message: ' + error.message + '\n');
}

function displayNearby(data) {
	if(data.query.results.json != null){
		var nearby = data.query.results.json;

		$("#nearby-content").html($("#NearbyTemplate").render(nearby));
		$('#nearby-content > ul').listview();
		
		$('#nearby-list').delegate("li", "click", function (event) {
			var $item = $(this);
		
			$.each(promotion_parameters, function(index, value) {
                sessionStorage.setItem(value, $item.jqmData(value));
				// $('#promotion').jqmData(value, $item.jqmData(value)); // all external links now so jqmData is pointless
			});
		    
		    // $.mobile.changePage('#promotion');
		});
	} else {
        $("#nearby-content").html($("#EmptyNearbyTemplate").render());
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
    if (data.query.results.json != null) {
        data.query.results.json.results.splice(0, 0, // insert at the beginning
            { category: "All", categorytag: "all", iconurl: "images/all.png" }
        );

		var category = data.query.results.json;
		$("#category-content").html($("#CategoryTemplate").render(category)); // trigger("pagecreate").trigger("refresh"); // alternative method for multiple generated items
		$('#category-content > ul').listview();
		$('#category-content > ul').listview();

        $('#category-list').delegate("li", "click", function (event) {
            sessionStorage.setItem("categorySelect", $(this).jqmData("category_tag"));
        });
	}
}