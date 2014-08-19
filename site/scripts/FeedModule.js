define(["jquery"], function($) {
	return function(postbox) {
		var self = this;
		
		function setupSubscriptions() {
			postbox.subscribe(loadInitialFeeds, null, "application_start");
			postbox.subscribe(loadFeed, null, "new_feed_url");
		}

		function loadInitialFeeds(done) {
			setTimeout(function() {
				loadFeed("http://www.engadget.com/rss.xml");
			}, 400);
			
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