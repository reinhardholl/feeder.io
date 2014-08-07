requirejs.config({
    paths: {
        "jquery": "jquery.min",
        "jquery.bootstrap": "../theme/js/bootstrap.min"
    },
    shim: {
        "jquery.bootstrap": {
            deps: ["jquery"]
        }
    }
});

require(["jquery", "jquery.bootstrap"], function ($) {
});