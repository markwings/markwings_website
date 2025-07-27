import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function dateTime(){
  // Date and Time Display
  let dateTimeContainer = document.getElementById("dateTime");
  
  dateTimeContainer.innerHTML = new Date().toLocaleString().replace(/,/g, "<br>");
  setInterval(() => {
    dateTimeContainer.innerHTML = new Date()
      .toLocaleString()
      .replace(/,/g, "<br>");
  }, 1000);
}
dateTime();

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
  function threeDAnimation(x,y){
    let positionPx = x - item.getBoundingClientRect().left;
    let positionX = (50 - (positionPx / item.offsetWidth) * 100) / 3;
    let positionPy = y - item.getBoundingClientRect().top;
    let positionY = (50 - (positionPy / item.offsetHeight) * 100) / 3;

    item.style.setProperty("--rX", positionX + "deg");
    item.style.setProperty("--rY", positionY + "deg");
  }
  item.addEventListener("mousemove",(e)=>{
    threeDAnimation(e.x, e.y);
  });
  item.addEventListener("touchstart",(e)=>{
    document.getElementById("intro-bg-video").style.opacity = "1";
  });
  item.addEventListener("touchend",()=>{
    document.getElementById("intro-bg-video").style.opacity = "0";
  })
  item.addEventListener("mouseout",()=>{
    item.style.setProperty("--rX", "0deg");
    item.style.setProperty("--rY", "0deg");
  });
});

function strings(){
  let initialPath = "M 10 200 Q 700 200 1390 200";
  let finalPath = "M 10 200 Q 700 200 1390 200";
  let el = document.getElementById("string");
  el.addEventListener("mousemove",e=>{
    initialPath = `M 10 200 Q ${e.x} ${e.y-200} 1390 200`;
    gsap.set("#string path",{
      attr: {
        d: initialPath
      }
    })
    
  })
  el.addEventListener("mouseleave",()=>{
    gsap.to("#string path", {
      attr: {
        d: finalPath,
      },
      duration: 1,
      ease: "elastic.out(1,0.2)",
    });
  })
}
strings();