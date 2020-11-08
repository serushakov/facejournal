console.log("login");

const form = document.getElementById("login-form");

fetch("/api/me").then(console.log);

console.log(form);
form.addEventListener("submit", (event) => {
  event.preventDefault();
  console.log(event);

  const formData = new FormData(form);

  fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: formData.get("email"),
      password: formData.get("password"),
    }),
  }).then(console.log);
});
