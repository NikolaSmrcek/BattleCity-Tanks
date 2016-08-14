System.register(['@angular/platform-browser-dynamic', './site/index.component', './routes/app.routes'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var platform_browser_dynamic_1, index_component_1, app_routes_1;
    return {
        setters:[
            function (platform_browser_dynamic_1_1) {
                platform_browser_dynamic_1 = platform_browser_dynamic_1_1;
            },
            function (index_component_1_1) {
                index_component_1 = index_component_1_1;
            },
            function (app_routes_1_1) {
                app_routes_1 = app_routes_1_1;
            }],
        execute: function() {
            platform_browser_dynamic_1.bootstrap(index_component_1.IndexComponent, [
                app_routes_1.APP_ROUTER_PROVIDER
            ]);
        }
    }
});
//# sourceMappingURL=main.js.map