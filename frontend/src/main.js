import Router from "./router/Router.js";
import Route from "./router/Route.js";
import store from "/state/index.js";
import { loginSuccess, loginRequest } from "/state/auth/actions.js";

new Router(document.getElementById("root"), [
  new Route("/login", "/views/login/login.js", "login-page"),
  new Route("/register", "/views/register/register.js", "register-page"),
  new Route(null, "/views/404/404.js", "page-not-found"),
]);

async function loadUser() {
  const token = localStorage.getItem("token");

  if (token) {
    store.dispatch(loginRequest());

    const response = await fetch("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const user = await response.json();

    store.dispatch(loginSuccess(user, token));
  }
}

loadUser();
