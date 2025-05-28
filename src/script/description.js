// var descBottom = document.querySelector("#desc-bottom");

// var descDev = document.querySelector("#desc-dev");
// var devLine = document.querySelector("#dev-line");

// var graphicsLine = document.querySelector("#graphics-line");
// var descGraphics = document.querySelector("#desc-graphics");

// var dmLine = document.querySelector("#dm-line");
// var descDM = document.querySelector("#desc-dm");

// var videoLine = document.querySelector("#video-line");
// var descVideo = document.querySelector("#desc-video");

// var smmLine = document.querySelector("#smm-line");
// var descSMM = document.querySelector("#desc-smm");

// var descDivs = [descDev, descGraphics, descDM, descVideo, descSMM];
// var descLines = [devLine, graphicsLine, dmLine, videoLine, smmLine];

// var bottomPos = descBottom.getBoundingClientRect();

// function createLines(){
//   for (let index = 0; index < descDivs.length; index++) {
  
//     let divPos = descDivs[index].getBoundingClientRect();
//     let svg = descLines[index].ownerSVGElement;
//     let svgRect = svg.getBoundingClientRect();
  
//     descLines[index].setAttribute(
//       "x1",
//       divPos.left + divPos.width / 2 - svgRect.left
//     );
//     descLines[index].setAttribute(
//       "y1",
//       divPos.top + divPos.height / 2 - svgRect.top
//     );
//     descLines[index].setAttribute(
//       "x2",
//       bottomPos.left + bottomPos.width / 2 - svgRect.left
//     );
//     descLines[index].setAttribute("y2", bottomPos.top - svgRect.top);
//   }
// }
// createLines();
// window.addEventListener("resize", function () {
//   bottomPos = descBottom.getBoundingClientRect();
//   createLines();
// });

// Improved line drawing function
function createLines() {
  const bottomCircle = document.querySelector("#desc-bottom");
  const svg = document.querySelector("#lines-container");
  
  // Get all service cards and corresponding lines
  const services = [
    { card: document.querySelector("#desc-dev"), line: document.querySelector("#dev-line") },
    { card: document.querySelector("#desc-graphics"), line: document.querySelector("#graphics-line") },
    { card: document.querySelector("#desc-dm"), line: document.querySelector("#dm-line") },
    { card: document.querySelector("#desc-video"), line: document.querySelector("#video-line") },
    { card: document.querySelector("#desc-smm"), line: document.querySelector("#smm-line") }
  ];

  // Get positions once
  const svgRect = svg.getBoundingClientRect();
  const circleRect = bottomCircle.getBoundingClientRect();
  const circleCenter = {
    x: circleRect.left + circleRect.width/2 - svgRect.left,
    y: circleRect.top + circleRect.height/2 - svgRect.top
  };

  services.forEach(service => {
    const cardRect = service.card.getBoundingClientRect();
    const cardCenter = {
      x: cardRect.left + cardRect.width/2 - svgRect.left,
      y: cardRect.top + cardRect.height/2 - svgRect.top
    };

    // Set line coordinates
    service.line.setAttribute("x1", cardCenter.x);
    service.line.setAttribute("y1", cardCenter.y);
    service.line.setAttribute("x2", circleCenter.x);
    service.line.setAttribute("y2", circleCenter.y);
    
    // Add hover effects
    service.card.addEventListener("mouseenter", () => {
      service.line.setAttribute("stroke", "rgba(30, 64, 175, 0.8)");
      service.line.setAttribute("stroke-width", "3");
      service.line.setAttribute("stroke-dasharray", "0");
    });
    
    service.card.addEventListener("mouseleave", () => {
      service.line.setAttribute("stroke", "rgba(30, 64, 175, 0.4)");
      service.line.setAttribute("stroke-width", "2");
      service.line.setAttribute("stroke-dasharray", "4");
    });
  });
}

// Initialize and update lines
window.addEventListener("load", createLines);
window.addEventListener("resize", createLines);