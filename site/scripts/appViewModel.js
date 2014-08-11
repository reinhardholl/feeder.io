define(["ko", "jquery"], function(ko, $) {
	function FeedEntry(data) {
		var self = this;
		self.title = data.title;
		self.content = data.content;
		self.author = data.author;
		self.publishedDate = data.publishedDate;
	}

	function Feed(data) {
		self.title = data.feed.title;
		self.link = data.feed.link;
		self.entries = ko.observableArray(data.feed.entries);

		self.entryRows = ko.computed(function() {
			var entries = self.entries();
			var result = [];
			for (var i = 0; i < entries.length; i += 3) {
		        var row = [];
		        for (var j = 0; j < 3; ++j) {
		            if (entries[i + j]) {
		            	var current = entries[i + j];
		                row.push(new FeedEntry({
		                	title: current.title,
		                	content: current.content,
		                	author: self.title,
		                	publishedDate: current.publishedDate
		                }));
		            }
		        }
		        result.push(row);
		    }
			return result;
		});
	}

	return function (postbox) {
		var self = this;
		self.activeFeed = ko.observable();
		self.activeTemplate = ko.observable({
			name: "initializing",
			data: {}
		});

		function setupSubscriptions() {
			postbox.subscribe(onFeedData, null, "feed_newfeeddata");
		}

		function onFeedData(feedData) {
			console.log(feedData)
			if(feedData && feedData.feed) {
				self.activeFeed(new Feed(feedData));
				self.activeTemplate({
					name: "feed-overview",
					data: {}
				});
			}
		}
		setupSubscriptions();
	}
});