System.register(['@angular/router', '../site/gameScreen/gameScreen.component', '../site/mainMenu.component'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var router_1, gameScreen_component_1, mainMenu_component_1;
    var appRoutes, APP_ROUTER_PROVIDER;
    return {
        setters:[
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (gameScreen_component_1_1) {
                gameScreen_component_1 = gameScreen_component_1_1;
            },
            function (mainMenu_component_1_1) {
                mainMenu_component_1 = mainMenu_component_1_1;
            }],
        execute: function() {
            exports_1("appRoutes", appRoutes = [
                { path: '', component: mainMenu_component_1.MainMenuComponent },
                { path: 'game', component: gameScreen_component_1.GameScreen }
            ]);
            exports_1("APP_ROUTER_PROVIDER", APP_ROUTER_PROVIDER = router_1.provideRouter(appRoutes));
        }
    }
});
//# sourceMappingURL=app.routes.js.map