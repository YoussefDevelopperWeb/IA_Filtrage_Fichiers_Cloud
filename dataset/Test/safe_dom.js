// DOM interaction without sensitive operations

document.addEventListener("DOMContentLoaded", () => {
  const title = document.createElement("h1");
  title.textContent = "Welcome to Secure App";
  document.body.appendChild(title);
});
