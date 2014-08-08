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

require(["ko", "jquery", "jquery.bootstrap","appViewModel"], function (ko, $, something, AppViewModel) {
	$(document).ready(function() {
		var appViewModel = new AppViewModel(ko);
		ko.applyBindings(appViewModel);
	});		
});