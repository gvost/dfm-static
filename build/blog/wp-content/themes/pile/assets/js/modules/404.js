/* --- 404 Page --- */
var gifImages = [
	"http://cdn.makeagif.com/media/9-04-2014/LqSsUg.gif"
];

function getGif() {
	return gifImages[Math.floor(Math.random() * gifImages.length)];
}

function changeBackground() {
	$('.error404').css('background-image', 'url(' + getGif() + ')');
}

$(window).on('load', function () {
	if ($('.error404').length) {
		changeBackground();
	}
});

$(window).keydown(function (e) {
	if (e.keyCode == 32) {
		changeBackground();
	}
});