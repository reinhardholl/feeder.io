(function() {
    requirejs.config({
        paths: {
            jquery: "jquery.min",
            "jquery.bootstrap": "../theme/js/bootstrap.min",
            ko: "knockout-3.1.0",
            application: "jsApplication",
            "firebase": "https://cdn.firebase.com/js/client/1.0.19/firebase",
            "fbase-simpleloging": "firebase-simple-login"
        },
        shim: {
            "jquery.bootstrap": {
                deps: ["jquery"]
            },
             "ko": {
                deps: ["jquery"]    
             }
        },
        urlArgs: "bust=" + (new Date()).getTime()
    });

    require(["ko","FeedModule", "appViewModel", "auth", "jquery.bootstrap"], function (ko, FeedModule, AppViewModel, Auth) {
        var postbox = new ko.subscribable();
        var auth = new Auth(postbox);

        var FeedModule = new FeedModule(postbox, auth);
        var appViewModel = new AppViewModel(postbox, auth);          
        ko.applyBindings(appViewModel);
    });
})();
