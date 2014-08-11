(function() {
    requirejs.config({
        paths: {
            jquery: "jquery.min",
            "jquery.bootstrap": "../theme/js/bootstrap.min",
            ko: "knockout-3.1.0",
            application: "jsApplication"
        },
        shim: {
            "jquery.bootstrap": {
                deps: ["jquery"]
            },
             "ko": {
                deps: ["jquery"]    
             }
        }
    });

    require(["ko","FeedModule", "appViewModel", "jquery.bootstrap"], function (ko, FeedModule, AppViewModel) {
        var postbox = new ko.subscribable();
        var application = new FeedModule(postbox);
        var appViewModel = new AppViewModel(postbox);          
        ko.applyBindings(appViewModel);
        postbox.notifySubscribers(null, "application_start");
    });
})();
