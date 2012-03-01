var chalkboard_api_token = 'JVbi0jbTqNVUOiYcdagDO4cvM19aOZdX0rveegKVousCuzt3dY';
var bing_credentials = 'Ah8sbb0MRxaQru0Q9Q_ork2-75FG5Li8Qt08V7vlQOCOuDJoL7LbnXtjLlIZLBwr';
//var chalkboard_api_nearby_uri = 'http://api.yourchalkboard.com/promo/api/nearby/?token=' + chalkboard_api_token + '&lat=1.300&lng=103.86';
var chalkboard_api_nearby_uri = 'http://api.yourchalkboard.com/promo/api/nearby/?token=' + chalkboard_api_token;
var google_geocode_uri = 'http://maps.googleapis.com/maps/api/geocode/json?region=SG&sensor=true'; // address needs to be filled up

var default_lat = 1.300;
var default_lng = 103.86;
var chalkboard_api_category_uri = 'http://api.yourchalkboard.com/category/api/all/?token=' + chalkboard_api_token;
var promotion_parameters = ["category","distance","contact_number", "contact_number_link", "name", "promo", "pic", "operating_hours", "url", "expiry_date", "address", "lat", "lng"];
var location_parameters = ["lat", "lng"];

$(document).bind("mobileinit", function() {
    //$.mobile.ajaxEnabled = false;
    $.support.cors = true;
    $.mobile.allowCrossDomainPages = true;
    $.mobile.pushStateEnabled = false;
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
		cache: true,
        dataType: 'jsonp',
		jsonpCallback: 'displayNearby'
		// success: displayNearby - this only works in chrome
	});

    req.error(function() {
        stopProgressBar();
        $("#nearby-result").delay("slow").html($("#NearbyErrorTemplate").render());
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
    sessionStorage.setItem("current_position", "Current Location");
    $.mobile.hidePageLoadingMsg();

    window.location.href="category.html";
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
    stopProgressBar();

    navigator.notification.beep(1);
    navigator.notification.vibrate(1000);
    navigator.notification.alert(sErrMsg);
}

function displayNearby(data) {
    var nearby = data.query.results.json;
    stopProgressBar();
    $("#nearby-result").hide();
    if(nearby != null){
		$("#nearby-result").delay("slow").html($("#NearbyTemplate").render(nearby));
		$('#nearby-result > ul').listview();
        var count = nearby.results.length;
        if(count == undefined) {
            count = 1;
        }
        $("#count").text(count);

		$('#nearby-list').delegate("li", "click", function (event) {
			var $item = $(this);
		
			$.each(promotion_parameters, function(index, value) {
//                if(value == "url" || value == "pic" || value == "promo") { // to fix some fuck-ed up bug with storing urls in IE sessionstorage. wasted my time
//                    sessionStorage.setItem(value, encodeURIComponent($item.jqmData(value)));
//                } else {
//                    sessionStorage.setItem(value, $item.jqmData(value));
//                }

                sessionStorage.setItem(value, encodeURIComponent($item.jqmData(value)));
				// $('#promotion').jqmData(value, $item.jqmData(value)); // all external links now so jqmData is pointless
			});
		    
		    // $.mobile.changePage('#promotion');
		});
	} else {
        $("#nearby-result").delay("slow").html($("#NearbyEmptyTemplate").render());
    }
    $("#nearby-result").fadeIn();
}

//function getMRT() {
//    $.ajax({
//        url: 'mrt.json',
//        dataType: 'json',
//        success: displayMRT,
//        async: true
//    });
//}
//
//function displayMRT(data) {
//    stopProgressBar();
//    $("#mrt-result").hide();
//
//    if (data != null) {
//        $("#mrt-result").delay("slow").html($("#MRTTemplate").render(data));
//        $('#mrt-result > ul').listview();
//
//        $('#mrt-list').delegate("li", "click", function (event) {
//            var $item = $(this);
//            if($item.jqmData('name') != undefined) {
//                sessionStorage.setItem("current_lat", $item.jqmData('lat'));
//                sessionStorage.setItem("current_lng", $item.jqmData('lng'));
//                sessionStorage.setItem("current_position", $item.jqmData('name') + " MRT");
//            }
//
//        });
//    } else {
//        $("#mrt-result").delay("slow").html($("#MRTEmptyTemplate").render());
//    }
//
//    $("#mrt-result").fadeIn();
//}

function getCategory() {		
	var yql_str = 'select * from json where url="'+ chalkboard_api_category_uri +'"';	// YQL string. Similar to SQL
	var yql_uri = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent(yql_str) + '&format=json';	// YQL public URI string

	req = $.ajax({
		url: yql_uri,
		cache: true,
        dataType: 'jsonp',
        jsonpCallback: 'displayCategory',
        timeout : 10000
	});

    req.error(function() {
        stopProgressBar();
        $("#category-result").delay("slow").hide().html($("#CategoryErrorTemplate").render()).fadeIn();
    });
}

function displayCategory(data) {
    stopProgressBar();
    $("#category-result").hide();
    if (data.query.results.json != null) {
        data.query.results.json.results.splice(0, 0, // insert at the beginning
            { category: "All", categorytag: "all", iconurl: "images/all.png" }
        );

		var category = data.query.results.json;
		$("#category-result").delay("slow").html($("#CategoryTemplate").render(category)); // trigger("pagecreate").trigger("refresh"); // alternative method for multiple generated items
		$('#category-result > ul').listview();

        $('#category-list').delegate("li", "click", function (event) {
            sessionStorage.setItem("categorySelect", $(this).jqmData("category_tag"));
        });
	} else {
        $("#category-result").delay("slow").html($("#CategoryEmptyTemplate").render());
    }

    $("#category-result").fadeIn();
}

function geocodeLocation(location) {
    location += ", Singapore"; // to make it extremely restrictive - might not be a good idea, but good for now
    var yql_str = encodeURIComponent('select * from json where url="')+ encodeURIComponent(google_geocode_uri) + encodeURIComponent('&address=') + encodeURIComponent(location).replace(/%20/g, '%2B') + encodeURIComponent('"');	// YQL string. Similar to SQL
    var yql_uri = 'http://query.yahooapis.com/v1/public/yql?q=' + yql_str + '&format=json';	// YQL public URI string
    // $('#location-result').html(yql_uri); - for pure debugging

    req = $.ajax({
        url: yql_uri,
        cache: true,
        dataType: 'jsonp',
        jsonpCallback: 'displayLocationResults',
        timeout : 2000
    });
    req.error(function() {
        $.mobile.hidePageLoadingMsg();
        stopProgressBar();
        $("#location-result").hide().html($("#LocationErrorTemplate").render()).fadeIn();
    });
}

function displayLocationResults(data) {
    var locations = data.query.results.json;
    $.mobile.hidePageLoadingMsg();
    stopProgressBar();
    $("#location-result").hide();

    if(locations != null){ // need to double check to see what happens in the result of an empty address
        $("#location-result").html($("#LocationTemplate").render(locations));
        $('#location-result > ul').listview();
        var count = locations.results.length;
        if(count == undefined) {
            count = 1;
        }
        $("#count").text(count);

        $('#location-list').delegate("li", "click", function (event) {
            var $item = $(this);
            // alert($item.jqmData('lat'), $item.jqmData('lng'));
            sessionStorage.setItem("current_lat", $item.jqmData('lat'));
            sessionStorage.setItem("current_lng", $item.jqmData('lng'));
            sessionStorage.setItem("current_position", $item.jqmData('address'));
        });
    } else {
        $("#location-result").html($("#LocationEmptyTemplate").render());
    }

    $("#location-result").fadeIn();
}

// Array to JSON: http://stackoverflow.com/questions/459105/convert-a-multidimensional-javascript-array-to-json
//function array2dToJson(a, p, nl) {
//    var i, j, s = '[{"' + p + '":{';
//    nl = nl || '';
//    for (i = 0; i < a.length; ++i) {
//        s += nl + array1dToJson(a[i]);
//        if (i < a.length - 1) {
//            s += ',';
//        }
//    }
//    s += nl + '}}]';
//    return s;
//}
//
//function array1dToJson(a, p) {
//    var i, s = '';
//    for (i = 0; i < a.length; ++i) {
//        if (typeof a[i] == 'string') {
//            s += '"' + a[i] + '"';
//        }
//        else { // assume number type
//            s += a[i];
//        }
//        if (i < a.length - 1) {
//            s += ':';
//        }
//    }
//    s += '';
//    if (p) {
//        return '{"' + p + '":' + s + '}';
//    }
//    return s;
//}
//
//function isArray(a){var g=a.constructor.toString();
//    if(g.match(/function Array()/)){return true;}else{return false;}
//}
//function objtostring(o){var a,k,f,freg=[],txt; if(typeof o!='object'){return false;}
//    if(isArray(o)){a={'t1':'[','t2':']','isarray':true}
//    }else         {a={'t1':'{','t2':'}','isarray':false}}; txt=a.t1;
//    for(k in o){
//        if(!a.isarray)txt+="'"+k+"':";
//        if(typeof o[k]=='string'){txt+="'"+o[k]+"',";
//        }else if(typeof o[k]=='number'||typeof o[k]=='boolean'){txt+=o[k]+",";
//        }else if(typeof o[k]=='function'){f=o[k].toString();freg=f.match(/^function\s+(\w+)\s*\(/);
//            if(freg){txt+=freg[1]+",";}else{txt+=f+",";};
//        }else if(typeof o[k]=='object'){txt+=objtostring(o[k])+",";
//        }
//    }return txt.substr(0,txt.length-1)+a.t2;
//}

// Application Barf
function appbar_home() {
    $.mobile.changePage("index.html");
}

function appbar_nearby() {
    startProgressBar();
    $.mobile.showPageLoadingMsg("a", "Getting Current Location...", true);
    SetCurrentLocation();
}

function appbar_location() {
    $.mobile.changePage("location.html");
}

function appbar_mrt() {
    $.mobile.changePage("mrt.html");
}

function appbar_fav() {
    $.mobile.changePage("fav.html");
}

function appbar_about() {
    $.mobile.changePage("about.html");
}
//
//
//function getOpacity(elem) {
//    var ori = $(elem).css('opacity');
//    var ori2 = $(elem).css('filter');
//    if (ori2) {
//        ori2 = parseInt( ori2.replace(')','').replace('alpha(opacity=','') ) / 100;
//        if (!isNaN(ori2) && ori2 != '') {
//            ori = ori2;
//        }
//    }
//    return ori;
//}

function startProgressBar() {
    $("#" + $.mobile.activePage.attr('id') + " > div > div.progress").css('opacity', 1);

    startAnimation();
    var tid = setInterval(startAnimation, 3500);
}

function stopProgressBar() {
    $("#" + $.mobile.activePage.attr('id') + " > div > div.progress").css('opacity', 0);

    $("#" + $.mobile.activePage.attr('id') + " > div > div.progress > div.pip").each(function () {
        $(this).stop(true);
    });
}

// progress bar
function startAnimation() {
    var delay = 200;
    $("#" + $.mobile.activePage.attr('id') + " > div > div.progress > div.pip").each(function () {
        animatePip($(this), delay);
        delay += 200;
    });
}

function animatePip(element, delay) {
    element.css("left", 0)
        .hide()
        .delay(delay)
        .show()
        .animate({ left: 240 }, { duration: 1000, easing: "easeOutSine" })
        .animate({ left: 480 }, { duration: 1000, easing: "easeInSine" });
}

// source: http://motyar.blogspot.com/2010/03/dream-night-animation-with-jquery.html
function dream(){
    //calculating random color of dream
    var color = 'rgb('+255+','+255+','+255+')';

    //calculating random X position
    var x = Math.floor(Math.random()*$(window).width());

    //calculating random Y position
    var y = Math.floor(Math.random()*$(window).height());

    //creating the dream and hide
    drawingpix = $('<span>').attr({class: 'drawingpix'}).hide();

    //appending it to body
    $('#home').append(drawingpix);

    //styling dream.. filling colors.. positioning.. showing.. growing..fading
    drawingpix.css({
        'background-color':color,
        'border-radius':'4px',
        '-moz-border-radius': '4px',
        '-webkit-border-radius': '4px',
        top: y,    //offsets
        left: x //offsets
    }).show().animate({
            height:'20px',
            width:'20px',
            'border-radius':'20px',
            '-moz-border-radius': '20px',
            '-webkit-border-radius': '20px',
            opacity: 0.1,
            top: y-10,    //offsets
            left: x-10
        }, 3000).fadeOut(2000);

    //Every dream's end starts a new dream
    window.setTimeout('dream()',900);
}