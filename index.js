const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

function getDataFromApi(searchTerm, callback, pageToken) {
	if (typeof pageToken === 'undefined') {
		pageToken = '';
	}
	const query = {
		part: 'snippet',
	  	key: 'AIzaSyC66T2dUVOC-aw6kL9JEnOzNDQKJ21grag',
	    q: `${searchTerm}`,
	    pageToken: pageToken,
	    maxResults: 20
  	}
  	$.getJSON(YOUTUBE_SEARCH_URL, query, callback);
}

const youTubeSearch = {
	currentQuery: '',
};

const pageTracker = {
	currentPage: 0,
};

function submitListener() {
	$('.js-search-form').submit(event => {
		event.preventDefault();
		const queryTarget = $(event.currentTarget).find('.js-query');
		youTubeSearch.currentQuery = queryTarget.val();
		// clear search field
		queryTarget.val('');
		getDataFromApi(youTubeSearch.currentQuery, displayYouTubeSearchData);
		showMoreResultsBtn();
	});
}

function displayYouTubeSearchData(data) {
	const results = data.items.map((item) => renderResult(item));
	$('.js-search-results').html(results);
	// find token # of next and previous results
	const nextPageId = data.nextPageToken;
	nextPage(nextPageId);
	console.log('next page token:', nextPageId);
	const prevPageId = data.prevPageToken;
	prevPage(prevPageId);
}

function pageHandler() {

}

function renderResult(result) {
	return `
		<div>
			${result.snippet.title} <br>
			<a href="https://www.youtube.com/watch?v=${result.id.videoId}" target="_blank"><img src="${result.snippet.thumbnails.default.url}"></a>
		</div>
	`;
}

function showMoreResultsBtn() {
  $('.moreResults').fadeIn(2000);
}

function nextPage(nextPageId) {
	$('.moreResults').submit(event => {
		event.preventDefault();
		// show previous page button
		$('.prevResults').show();
		console.log('next page token 2:', nextPageId);
		getDataFromApi(youTubeSearch.currentQuery, displayYouTubeSearchData, nextPageId);
		pageTracker.currentPage++;
	});
}
function prevPage(prevPageId) {
	$('.prevResults').submit(event => {
		event.preventDefault();
		console.log('prev page token:', prevPageId);
		getDataFromApi(youTubeSearch.currentQuery, displayYouTubeSearchData, prevPageId);
		// $('.prevResults').hide();
		pageTracker.currentPage--;
	});
}

$(submitListener);