/* let container = document.querySelector("#snakeContainer");
let food = container.querySelector("div");
let scoreBoard = container.querySelector("h2");
let gameOver = container.querySelector("h1");
let highScore = container.querySelector("h3");
let x;
let y;
let score = -1;

localStorage.setItem("061102", score !==-1? score : localStorage.getItem("061122") || 0);

function getRandomCoordinates() {
  var rect = container.getBoundingClientRect();
  // Ensure food stays within the container
  x = Math.floor(Math.random() * (rect.width - food.offsetWidth));
  y = Math.floor(Math.random() * (rect.height - food.offsetHeight));
  return { x, y };
}

function setRandomCoordinates(){
  score++;
  gameOver.classList.add("hidden")
  scoreBoard.innerText = `Your Score = ${score}`;
  highScore.innerText = `Highest Score = ${localStorage.getItem("061102")}`  
  let coords = getRandomCoordinates();
  food.style.left = coords.x + "px";
  food.style.top = coords.y + "px";
}

setRandomCoordinates();

var resetTimeout;
food.addEventListener("mouseover", setRandomCoordinates);

function resetGame () {
  
}

container.addEventListener("mousemove", () => {
  clearTimeout(resetTimeout);
  resetTimeout = setTimeout(() => {
    localStorage.setItem("061102",score);
    gameOver.classList.remove("hidden");
    scoreBoard.innerText = `Your Score = ${score}`;
    score = 0;
  }, 1500);
});

container.addEventListener("mouseleave", ()=>{
  localStorage.setItem("061102", score);
  gameOver.classList.remove("hidden");
  scoreBoard.innerText = `Your Score = ${score}`;
  score = 0;
})

food.addEventListener("mouseleave", () => {
  clearTimeout(resetTimeout);
}); */
