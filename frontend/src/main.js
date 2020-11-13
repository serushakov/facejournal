import Router from "./router/Router.js";
import Route from "./router/Route.js";
import store from "/state/index.js";
import { loginSuccess } from "/state/auth/actions.js";

new Router(document.getElementById("root"), [
  new Route("/login", "/views/login/index.html"),
  new Route("/pages/kek", "/views/test/test.html"),
  new Route("/pages/lol", "/views/route/index.html"),
  new Route(null, "/views/404/index.html"),
]);

async function loadUser() {
  const token = localStorage.getItem("token");
  console.log(token);

  if (token) {
    const response = await fetch("/api/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const user = await response.json();

    store.dispatch(loginSuccess(user, token));
  }
}

loadUser();
