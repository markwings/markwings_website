import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Date and Time Display
let dateTimeContainer = document.getElementById("dateTime");

dateTimeContainer.innerHTML = new Date().toLocaleString().replace(/,/g, "<br>");
setInterval(() => {
  dateTimeContainer.innerHTML = new Date()
    .toLocaleString()
    .replace(/,/g, "<br>");
}, 1000);

// Reverse Scroll
// window.addEventListener("scroll", function () {
//   document.querySelector(".panelCon").style.bottom = window.scrollY * -1 + "px";
// });


document.querySelectorAll(".fadeIn").forEach((item)=>{
  gsap.from(item,{
    y: 30,
    opacity: 0,
    duration: 1,
    scrollTrigger:{
      trigger: item,
      scroller: "body",
      start: "top 90%",
      end: "top 75%",
      scrub: true
    }
  });
});

document.querySelectorAll(".threeD-element").forEach((item)=>{
  item.addEventListener("mousemove",(e)=>{
    let positionPx = e.x - item.getBoundingClientRect().left;
    let positionX = (50-((positionPx / item.offsetWidth)*100))/3;
    let positionPy = e.y - item.getBoundingClientRect().top;
    let positionY = (50-((positionPy / item.offsetHeight)*100))/3;

    item.style.setProperty('--rX',positionX + 'deg');
    item.style.setProperty('--rY',positionY + 'deg');
  });
  item.addEventListener("mouseout",()=>{
    item.style.setProperty("--rX", "0deg");
    item.style.setProperty("--rY", "0deg");
  })
});