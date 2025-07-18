import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

let portfolioItems = [
  {
    title: "Graphics Design",
    description:
      "GD Lorem ipsum dolor sit amet, consectetur adipisicing elit. Necessitatibus mollitia iure hic quis exercitationem libero molestiae ex cum facere atque.",
    image: "images/img2.png",
  },
  {
    title: "Video Creation",
    description:
      "VC Lorem ipsum dolor sit amet, consectetur adipisicing elit. Necessitatibus mollitia iure hic quis exercitationem libero molestiae ex cum facere atque.",
    image: "images/img2.png",
  },
  {
    title: "Development",
    description:
      "Dev Lorem ipsum dolor sit amet, consectetur adipisicing elit. Necessitatibus mollitia iure hic quis exercitationem libero molestiae ex cum facere atque.",
    image: "images/img2.png",
  },
  {
    title: "Digital Marketing",
    description:
      "DM Lorem ipsum dolor sit amet, consectetur adipisicing elit. Necessitatibus mollitia iure hic quis exercitationem libero molestiae ex cum facere atque.",
    image: "images/img2.png",
  },
  {
    title: "Social Media Management",
    description:
      "SMM Lorem ipsum dolor sit amet, consectetur adipisicing elit. Necessitatibus mollitia iure hic quis exercitationem libero molestiae ex cum facere atque.",
    image: "images/img2.png",
  },
];

let portfolioItemsDiv = document.getElementById("portfolio-items");
let itemsInfoDiv = document.getElementById("items-info");
let carousalItems = [];

// function createPF(){
//   portfolioItems.forEach(item=>{
//     let itemDiv = document.createElement("div");
//     itemDiv.className = "w-full";
//     itemDiv.innerHTML =`<h1 class="w-full text-white bg-white/20 py-8 rounded-tl-2xl rounded-br-2xl text-center hover:bg-white/25 transition-all duration-300" >${item.title}</h1>`;
//     portfolioItemsDiv.appendChild(itemDiv);
  
//     let itemInfoDiv = document.createElement("div");
//     itemInfoDiv.className = "min-w-1/2 h-3/4 group relative transform-3d perspective-distant";
//     itemInfoDiv.innerHTML = `<div class="w-full h-full absolute flex flex-col group items-center justify-end p-8 group-hover:rotate-x-[75deg] group-hover:translate-y-40 group-hover:scale-95 transition-all duration-300 bg-white/50 backdrop-blur-2xl">
//               <div id="item-desc">
//                 ${item.description}
//               </div>
//             </div>
//             <img src="${item.image}" alt="image" class="h-2/3 absolute left-1/2 -translate-1/2 top-1/3 group-hover:-translate-y-64 transition-all duration-300 delay-150" />`;
//     carousalItems.push(itemInfoDiv);
//   });
// }

function createPF(){
  portfolioItems.forEach((item)=>{
    let itemDiv = document.createElement("div");
    itemDiv.className = "w-full";
    itemDiv.innerHTML =`<h1 class="w-full text-white py-8 rounded-tl-2xl rounded-br-2xl text-center hover:bg-white/25 transition-all duration-300" >${item.title}</h1>`;
    portfolioItemsDiv.appendChild(itemDiv);
    let itemInfoDiv = document.createElement("div");
    itemInfoDiv.className = `w-full h-full absolute flex items-center justify-center left-1/2 top-1/2 -translate-1/2 cursor-default`;
    itemInfoDiv.innerHTML = `<div class="w-1/2 h-3/4 group relative transform-3d perspective-distant">
    <div class="w-full h-full absolute flex flex-col pointer-events-none cursor-default items-center justify-end p-8 group-hover:rotate-x-[75deg] group-hover:translate-y-40 group-hover:scale-95 transition-all duration-300 bg-white backdrop-blur-2xl">
              <div id="item-desc" class="pointer-events-none cursor-default">
                ${item.description}
              </div>
            </div>
            <img src="${
              item.image
            }" alt="image" class="h-2/3 absolute left-1/2 -translate-1/2 top-1/3 pointer-events-none cursor-default group-hover:-translate-y-64 transition-all duration-300 delay-150" />
            </div>`;
    itemsInfoDiv.appendChild(itemInfoDiv);
  });
}

createPF();

let currentIndex = 0;

// function updatePortfolio() {
//   itemsInfoDiv.innerHTML = "";
//   let prev = (currentIndex - 1 + carousalItems.length) % carousalItems.length;
//   let next = (currentIndex + 1) % carousalItems.length;
//   itemsInfoDiv.appendChild(carousalItems[next]);
//   itemsInfoDiv.appendChild(carousalItems[currentIndex]);
//   itemsInfoDiv.appendChild(carousalItems[prev]);
//   portfolioItemsDiv.children[prev].firstChild.classList.remove(
//     "bg-blue-500",
//     "rounded-tr-2xl",
//     "rounded-bl-2xl",
//     "scale-105"
//   );
//   portfolioItemsDiv.children[prev].firstChild.classList.add(
//     "bg-white/20",
//     "rounded-tl-2xl",
//     "rounded-br-2xl"
//   );
//   portfolioItemsDiv.children[currentIndex].firstChild.classList.remove(
//     "bg-white/20", "rounded-tl-2xl", "rounded-br-2xl"
//   );
//   portfolioItemsDiv.children[currentIndex].firstChild.classList.add(
//     "bg-blue-500", "rounded-tr-2xl", "rounded-bl-2xl", "scale-105"
//   );
  
//   itemsInfoDiv.children[1].classList.remove("pointer-events-none");
//   itemsInfoDiv.firstChild.classList.add("pointer-events-none");
//   itemsInfoDiv.lastChild.classList.add("pointer-events-none");


//   gsap.fromTo(itemsInfoDiv.children,{ 
//     x: "-100%",
//   },
//     { 
//       x: "0%",
//       duration: 0.5 
//     }
//   );
//   currentIndex = (currentIndex + 1) % carousalItems.length;
// }
// updatePortfolio();
// let carousalInterval = setInterval(updatePortfolio,3000);


gsap.fromTo(itemsInfoDiv.children, {
  x: "-100%",
  rotate: "0deg",
},
{
  x: "100%",
  stagger: 0.15,
  ease: "none",
  // {
  //   amount: 1,
  //   onStart: () => {
  //     gsap.set(itemsInfoDiv.children[currentIndex], {
  //       scale: 1,
  //       opacity: 1,
  //     });
  //   },
  //   onComplete: () => {
  //     gsap.set(itemsInfoDiv.children[currentIndex],{
  //       scale: 0.95,
  //       opacity: 0.4/currentIndex
  //     });
  //     currentIndex = currentIndex + 1 < carousalItems.length ? currentIndex + 1 : 0;
  //   }
  // },
  scrollTrigger: {
    trigger: "#portfolio",
    scroller: "body",
    start: "top 0%",
    end: "top -100%",
    pin: true,
    scrub: 1,
  },
});

gsap.fromTo(
  portfolioItemsDiv.children,
  {
    scale: 0.95,
    opacity: 0.5,
    borderTopLeftRadius: "2rem",
    borderBottomRightRadius: "2rem",
    borderTopRightRadius: "0rem",
    borderBottomLeftRadius: "0rem",
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  {
    scale: 1.05,
    opacity: 1,
    borderTopLeftRadius: "0",
    borderBottomRightRadius: "0",
    borderTopRightRadius: "2rem",
    borderBottomLeftRadius: "2rem",
    backgroundColor: "rgba(0,0,255,1.5)",
    stagger: 0.15,
    scrollTrigger: {
      trigger: "#portfolio",
      scroller: "body",
      start: "top 0%",
      end: "top -74%",
      scrub: 1,
    },
  }
);

// portfolioItemsDiv.addEventListener("click", (e)=>{
//   if (e.target.tagName === "H1") {
//     clearInterval(carousalInterval);
//     currentIndex = Array.from(portfolioItemsDiv.children).indexOf(e.target.parentElement);
//     portfolioItemsDiv.querySelectorAll("h1").forEach((h1, index) => {
//       if (index === currentIndex) {
//         h1.classList.add("bg-white/30", "rounded-tr-2xl", "rounded-bl-2xl", "scale-105");
//         h1.classList.remove("bg-white/20", "rounded-tl-2xl", "rounded-br-2xl");
//       } else {
//         h1.classList.remove("bg-white/30", "rounded-tr-2xl", "rounded-bl-2xl", "scale-105");
//         h1.classList.add("bg-white/20", "rounded-tl-2xl", "rounded-br-2xl");
//       }
//     });
//     updatePortfolio();
//     carousalInterval = setInterval(updatePortfolio, 5000);
//   }
// });

// itemsInfoDiv.addEventListener("mousemove",(e)=>{
//   if(e.target === itemsInfoDiv.children[1]){
//     clearInterval(carousalInterval);
//     carousalInterval = null;
//   } else if (!carousalInterval){
//     carousalInterval = setInterval(updatePortfolio,5000);
//   }
// });