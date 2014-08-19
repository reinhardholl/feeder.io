define(["ko", "jquery"], function(ko, $) {
	function FeedEntry(data) {
		var self = this;
		self.title = data.title;
		self.content = data.content;
		self.author = data.author;
		self.publishedDate = data.publishedDate;
		self.link = data.link;
		self.thumbSrc = ko.computed(function() {
			var content = self.content;
			// image embedded in html..
			if(content.indexOf("<img") != -1) {
				var imageHtml = content.substring(content.indexOf("<"), content.indexOf(">") + 1);
				self.content = self.content.replace(imageHtml, "");
				self.thumbSrc = $(imageHtml).attr("src");
				if(self.thumbSrc && self.thumbSrc != "" && self.thumbSrc != null)
					return self.thumbSrc;
			}
			return "theme/img/newrss.jpg";
		});
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
		                	link: current.link,
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
		self.feedUrl = ko.observable();
		self.activeTemplate = ko.observable({
			name: "initializing",
			data: {}
		});

		function setupSubscriptions() {
			postbox.subscribe(onFeedData, null, "feed_newfeeddata");
			self.feedUrl.subscribe(function(url) {
				postbox.notifySubscribers(url, "new_feed_url")
			});
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