requirejs.config({
    paths: {
        "jquery": "jquery.min",
        "jquery.bootstrap": "../theme/js/bootstrap.min",
        "ko": "knockout-3.1.0"
    },
    shim: {
        "jquery.bootstrap": {
            deps: ["jquery"]
        }
    }
});

require(["ko", "jquery", "jquery.bootstrap"], function (ko, $) {
	
});