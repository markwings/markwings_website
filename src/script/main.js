// Reverse Scroll
// window.addEventListener("scroll", function () {
//     document.querySelector(".panelCon").style.bottom = window.scrollY * -1 + "px";
//   });

// Date and Time Display
let dateTimeContainer = document.getElementById("dateTime");

dateTimeContainer.innerHTML = new Date().toLocaleString().replace(/,/g, "<br>");
setInterval(() => {
  dateTimeContainer.innerHTML = new Date().toLocaleString().replace(/,/g, "<br>");
}, 1000);