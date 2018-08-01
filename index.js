const COLS = 5;
const ROWS = parseInt(window.innerHeight / 150);
const ROWS_BEFORE_LOADING = COLS * 3;

const API_KEY = "b9b865a7a966d097e5e8073a81b39a83";
const PER_PAGE = 50;
const USER_ID = "155573498%40N02";

const IMAGE_HEIGHT = 150; //px

var firstLoad = true;
var curPage = 1;
var arr = []; //global array with images
// var lastIndex = 0;
var isLoading = false;

document.onkeydown = keyboardHandler;

getData(1);

function getData(page, callback) {
	if (isLoading) { //do not load next page until current is completely loaded
		return;
	}
	isLoading = true;
	var xhr = new XMLHttpRequest();

	xhr.open(
		"GET",
		"https://api.flickr.com/services/rest/?method=flickr.favorites.get" +
		"PublicList&api_key=" +
		API_KEY +
		"&user_id=" +
		USER_ID +
		"&extras=url_q&per_page=" +
		(firstLoad ? PER_PAGE : PER_PAGE - 10) +
		"&format=json&nojsoncallback=1&page=" +
		page,
		true
	);
	xhr.send();

	xhr.onreadystatechange = e => {
		var xhr = e.target;
		if (xhr.readyState != 4) return;

		if (xhr.status != 200) {
			console.log(xhr.status + ": " + xhr.statusText); // 404: Not Found
		}

		showData(xhr.responseText, page);
		isLoading = false;
	};
}

function showData(response, page) {
	var response = JSON.parse(response);
	var photos = response.photos.photo;
	console.log('number of new photos', photos.length);

  if (page === 2 ) {
    photos.splice(0, 10);
  }

	for (let i = 0; i < photos.length; i++) {

		var wrap_img = document.createElement("div");
		wrap_img.className = "img-wrap";

		var lastIndex = arr.length > 0 ? +arr[arr.length - 1].getAttribute("tabindex") : -1;
		// var lastIndex = arr.length > 0 ? +arr[arr.length - 1].getAttribute("tabindex") : -1;
		wrap_img.setAttribute("tabindex", lastIndex + 1);

		var img = new Image();
		img.src = photos[i].url_q;
		img.alt = photos[i].title;

		wrap_img.appendChild(img);
		document.getElementById("images").appendChild(wrap_img);
		arr.push(wrap_img);
	}

	updateFocus(page);
}

function updateFocus(page) {
	console.log('number of all photos: ', arr.length);
	console.log("page" + page);


	var index = 0;
	if (firstLoad) {
		firstLoad = false;
		index = 0;
	} else {
		var curIndex = document.activeElement.tabIndex;
		index = Math.min(curIndex, arr.length - 1);
  }
  
	arr[index].focus();
}

function keyboardHandler(e) {
	if (isLoading) {
		return false;
	}
	var curIndex = +document.activeElement.tabIndex;
	var prev = curIndex;

	switch (e.keyCode) {
		case 37: // left
			curIndex = Math.max(curIndex - 1, 0);
			if (needLoadMore(curIndex)) {
				loadMore();
			}
			break;
		case 39: // right
			curIndex = Math.min(curIndex + 1, arr.length - 1);
			if (needLoadMore(curIndex)) {
				loadMore();
			}
			break;
		case 40: // doown

			curIndex = Math.min(curIndex + COLS, arr.length - 1);
			if (needLoadMore(curIndex)) {
				var a = COLS * ROWS * curPage - COLS * 2;
				loadMore();
			}
			scrollTo(document.documentElement, (Math.floor(curIndex / 5) - 1) * IMAGE_HEIGHT, 200);
			break;
		case 38: // up
			curIndex = Math.max(curIndex - COLS, 0);
			scrollTo(document.documentElement, (Math.floor(curIndex / 5) - 1) * IMAGE_HEIGHT, 200);
			break;
		case 9: //tab
			return false;
	}

	arr[curIndex].focus();
	return curIndex == prev;
}

function needLoadMore(curIndex) {
	// var curPerPage = PER_PAGE;
	var limit = arr.length - ROWS_BEFORE_LOADING;
	// var limit = PER_PAGE + ((PER_PAGE - 10) * (curPage - 1)) - COLS * 2;
	console.log("limit:" + limit);

	return curIndex >= limit;
}

function loadMore() {
	curPage++;
	console.log("load page " + curPage);
	getData(curPage);
}


function scrollTo(element, to = 0, duration = 1000) {

	const start = element.scrollTop;
	const change = to - start;
	// console.log(start);

	const increment = 20;
	let currentTime = 0;

	const animateScroll = (() => {

		currentTime += increment;

		const val = Math.easeInOutQuad(currentTime, start, change, duration);

		element.scrollTop = val;

		if (currentTime < duration) {
			setTimeout(animateScroll, increment);
		}
	});

	animateScroll();
};

Math.easeInOutQuad = function (t, b, c, d) {

	t /= d / 2;
	if (t < 1) return c / 2 * t * t + b;
	t--;
	return -c / 2 * (t * (t - 2) - 1) + b;
};