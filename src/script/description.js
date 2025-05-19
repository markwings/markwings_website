var descBottom = document.querySelector("#desc-bottom");

var descDev = document.querySelector("#desc-dev");
var devLine = document.querySelector("#dev-line");

var graphicsLine = document.querySelector("#graphics-line");
var descGraphics = document.querySelector("#desc-graphics");

var dmLine = document.querySelector("#dm-line");
var descDM = document.querySelector("#desc-dm");

var videoLine = document.querySelector("#video-line");
var descVideo = document.querySelector("#desc-video");

var smmLine = document.querySelector("#smm-line");
var descSMM = document.querySelector("#desc-smm");

var descDivs = [descDev, descGraphics, descDM, descVideo, descSMM];
var descLines = [devLine, graphicsLine, dmLine, videoLine, smmLine];

var bottomPos = descBottom.getBoundingClientRect();

function createLines(){
  for (let index = 0; index < descDivs.length; index++) {
  
    let divPos = descDivs[index].getBoundingClientRect();
    let svg = descLines[index].ownerSVGElement;
    let svgRect = svg.getBoundingClientRect();
  
    descLines[index].setAttribute(
      "x1",
      divPos.left + divPos.width / 2 - svgRect.left
    );
    descLines[index].setAttribute(
      "y1",
      divPos.top + divPos.height / 2 - svgRect.top
    );
    descLines[index].setAttribute(
      "x2",
      bottomPos.left + bottomPos.width / 2 - svgRect.left
    );
    descLines[index].setAttribute("y2", bottomPos.top - svgRect.top);
  }
}
createLines();
window.addEventListener("resize", function () {
  bottomPos = descBottom.getBoundingClientRect();
  createLines();
});