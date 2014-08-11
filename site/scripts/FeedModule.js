define(["jquery"], function($) {
	return function(postbox) {
		var self = this;
		
		function setupSubscriptions() {
			postbox.subscribe(self.loadInitialFeeds, null, "application_start");
		}		
		self.loadInitialFeeds = function(done) {
			var feed = new google.feeds.Feed("http://feeds.news24.com/articles/fin24/tech/rss");
			feed.load(function(feedData) {
				postbox.notifySubscribers(feedData, "feed_newfeeddata");
			});
		}
		setupSubscriptions();
	}
});