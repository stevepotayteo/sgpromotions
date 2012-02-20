document.addEventListener = function (evt, handler, capture) {
  $("body").bind(evt, handler);
};

$(document).ready(function () {
  setTimeout(function () {
    $("body").trigger("deviceready");
  }, 100);
});




