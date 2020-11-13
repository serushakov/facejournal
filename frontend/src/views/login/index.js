import store from "/state/index.js";
import { loginSuccess } from "/state/auth/actions.js";

const routeRoot = document.getElementById("login");

const form = document.getElementById("login-form");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(form);

  const response = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: formData.get("email"),
      password: formData.get("password"),
    }),
  });

  const { user, token } = await response.json();

  store.dispatch(loginSuccess(user, token));

  localStorage.setItem("token", token);
});

function listener(state) {}

store.subscribe(listener);

const root = document.getElementById("root");

const observer = new MutationObserver(cleanup);

observer.observe(root, {
  childList: true,
});

function cleanup(events) {
  if (
    events.find((event) =>
      Array.from(event.removedNodes).find((element) =>
        element.isSameNode?.(routeRoot)
      )
    )
  ) {
    console.log("cleanup");
    store.unsubscribe(listener);
  }
}
