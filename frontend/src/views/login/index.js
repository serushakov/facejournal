import store from "/state/index.js";
import { loginSuccess } from "/state/auth/actions.js";

const form = document.getElementById("login-form");

fetch("/api/me").then(console.log);

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
});
