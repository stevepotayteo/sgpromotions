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
    var current_lat = sessionStorage.getItem("current_lat");
    var current_lng = sessionStorage.getItem("current_lng");
    var additionalParameters = '';
    if(current_lat != null && current_lng != null) {
        additionalParameters += '&lat=' + current_lat + '&lng=' + current_lng;
    } else {
        // return;
        additionalParameters += '&lat=' + default_lat + '&lng=' + default_lng; // for debug purposes
    }

    var category_selection = sessionStorage.getItem("categorySelect");
    if(category_selection != null && category_selection != "all") {
        additionalParameters += '&category=' + category_selection;
    }

	var yql_str = 'select * from json where url="'+ chalkboard_api_nearby_uri + additionalParameters +'"';	// YQL string. Similar to SQL
	var yql_uri = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent(yql_str) + '&format=json';	// YQL public URI string

	req = $.ajax({
		url: yql_uri,
		cache: false,
        dataType: 'jsonp',
		jsonpCallback: 'displayNearby'
		// success: displayNearby - this only works in chrome
	});

    req.error(function() {
        $("#nearby-content").html($("#NearbyErrorTemplate").render());
    });
}

/* GPS Section */
// onSuccess Geolocation
//
function SetCurrentLocation() {
    navigator.geolocation.getCurrentPosition(onGeolocationSuccess, onGeolocationError,{maximumAge:0, timeout:15000});
}

function onGeolocationSuccess(position) {
    // navigator.notification.alert('GPS Found: ' + position.coords.latitude + ' ' + position.coords.longitude);
    sessionStorage.setItem("current_lat", position.coords.latitude);
    sessionStorage.setItem("current_lng", position.coords.longitude);
    $.mobile.hidePageLoadingMsg();

    $('#SubmitLocation').submit();
}

// onError Callback receives a PositionError object
//
function onGeolocationError(error) {
    var sErrMsg;
    switch (error.code) {
        case error.PERMISSION_DENIED:
            sErrMsg = "In order for sg.promotions to search for nearby promotions, GPS must be enabled so that your current location can be determined.";
            break;
        case error.POSITION_UNAVAILABLE:
            sErrMsg = "We were unable to retrieve your current position. Please try again.";
            break;
        case error.TIMEOUT:
            sErrMsg = "We were unable to retrieve your current position. Please try again.";
            break;
        default:
            sErrMsg = "We were unable to retrieve your current position. Please try again.";
            break;
    };

    $.mobile.hidePageLoadingMsg();

    navigator.notification.beep(1);
    navigator.notification.vibrate(1000);
    navigator.notification.alert(sErrMsg);
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
        $("#nearby-content").html($("#NearbyEmptyTemplate").render());
    }
}

function getCategory() {		
	var yql_str = 'select * from json where url="'+ chalkboard_api_category_uri +'"';	// YQL string. Similar to SQL
	var yql_uri = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent(yql_str) + '&format=json';	// YQL public URI string

	req = $.ajax({
		url: yql_uri,
		cache: false,
        dataType: 'jsonp',
        jsonpCallback: 'displayCategory',
        timeout : 10000
	});

    req.error(function() {
        $("#category-content").html($("#CategoryErrorTemplate").render());
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