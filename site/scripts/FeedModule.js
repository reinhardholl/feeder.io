define(["jquery"], function($) {
	return function(postbox) {
		var self = this;
		
		function setupSubscriptions() {
			postbox.subscribe(loadInitialFeeds, null, "application_start");
		}

		function loadInitialFeeds(done) {
			loadFeed("http://www.trulia.com/rss2/San_Francisco,CA/3p_baths/3p_beds/800000-2000000_price/date;d_sort/");
		}

		function loadFeed(feedPath) {
			var feed = new google.feeds.Feed(feedPath);
			feed.load(function(feedData) {
				postbox.notifySubscribers(feedData, "feed_newfeeddata");
			});
		}
		setupSubscriptions();
	}
});