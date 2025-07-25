import emailjs from "@emailjs/browser";
import gsap from "gsap";

const contactSection = document.getElementById("contact");
const contactButton = document.getElementById("contact-button");
const contactForm = document.getElementById("contact-form");

let position = {x: null,y: null};

emailjs.init("uVVMgS-56q2ObctTT");
document.getElementById("con-form").addEventListener("submit", function (e) {
  e.preventDefault();

  emailjs.sendForm("service_m5tnjrx", "template_hqr0x5l", this).then(
    function (response) {
      alert("Message sent successfully!");
      document.getElementById("con-form").reset();
    },
    function (error) {
      alert("Failed to send message. Please try again later.");
    }
  );
});

document.getElementById("sub-wp").addEventListener("click", function () {
  const form = document.getElementById("con-form");
  const name =
    form.elements["fname"] && form.elements["lname"]
      ? form.elements["fname"].value +" " + form.elements["lname"].value
      : "";
  const email = form.elements["email"] ? form.elements["email"].value : "";
  const phone = form.elements["phone"] ? form.elements["phone"].value : "";
  const sub = form.elements["sub"] ? form.elements["sub"].value : "";
  const message = form.elements["message"]
    ? form.elements["message"].value
    : "";
  const comp = form.elements["comp"] ? form.elements["comp"].value : "";

  const whatsappMessage = `Name: ${encodeURIComponent(
    name
  )}%0AEmail: ${encodeURIComponent(email)}%0APhone: ${encodeURIComponent(
    phone
  )}%0AOrganization: ${encodeURIComponent(
    comp
  )}%0ASubject: ${encodeURIComponent(sub)}%0AMessage: ${encodeURIComponent(
    message
  )}`;
  const whatsappUrl = `https://wa.me/918817789181?text=${whatsappMessage}`;

  document.getElementById("con-form").reset();
  window.open(whatsappUrl, "_blank");
});

function updateContactButtonPosition(x,y){
  
let boxSize = contactSection.getBoundingClientRect();
  gsap.to(contactButton, {
    left: `${x - boxSize.left}px`,
    top: `${y - boxSize.top}px`,
    duration: 0.4,
    delay: 0.2,
  });
}

contactSection.addEventListener("mousemove",(e)=>{
  position.x = e.clientX - 75;
  position.y = e.clientY - 25;
  updateContactButtonPosition(position.x,position.y);
});

contactSection.addEventListener("mouseenter", (e) => {
  position.x = e.clientX - 75;
  position.y = e.clientY - 25;
  updateContactButtonPosition(position.x, position.y);
});

contactSection.addEventListener("mouseleave",()=>{
  position.x = null;
  position.y = null
})
window.addEventListener("scroll", () => {
  if (
     position.x !== null && position.y !== null
  ) {
    updateContactButtonPosition(position.x,position.y);
  }
});

document.querySelectorAll(".contact-button").forEach((button)=>{
  button.addEventListener("click",()=>{
    window.scrollTo({top: contactSection.offsetTop, behavior: "smooth"});
    contactForm.classList.replace("hidden","flex");
    gsap.from(contactForm,{
      scale:0,
      opacity: 0,
      duration: 1,
      ease: "power2.out"
    })
    contactButton.classList.add("hidden");
  });
});

document.getElementById("close-form").addEventListener("click",()=>{
  contactForm.classList.replace("flex", "hidden");
  contactButton.classList.remove("hidden");
})