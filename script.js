AOS.init();

const toggleBtn = document.querySelector(".theme-toggle");
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  if (document.body.classList.contains("dark-mode")) {
    toggleBtn.textContent = "☀️";
  } else {
    toggleBtn.textContent = "🌙";
  }
  localStorage.setItem("dark", "☀️");
  localStorage.setItem("dark", "🌙");
  console.log(localStorage.getItem("toggleBtn"));
});



window.addEventListener('scroll', function () {
  const sections = document.querySelectorAll('.ha'); // divs with class 'ha'
  const navLinks = document.querySelectorAll('nav ul li a');

  let current = '';

  sections.forEach(section => {
    const rect = section.getBoundingClientRect();

    if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
      console.log("Currently visible section:", current);
    }
  });

});




