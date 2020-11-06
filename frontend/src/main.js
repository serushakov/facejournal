import Router from "./router/Router.js";
import Route from "./router/Route.js";

new Router(document.getElementById("root"), [
  new Route("/pages/kek", "/views/test/test.html"),
  new Route("/pages/lol", "/views/route/index.html"),
  new Route(null, "/views/404/index.html"),
]);
