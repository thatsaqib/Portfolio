AOS.init({duration:700,easing:'ease-out-cubic',once:true});
    // Smooth nav scroll (native fallback)
    document.querySelectorAll('a[href^="#"]').forEach(a=>{
      a.addEventListener('click', e=>{
        const href = a.getAttribute('href');
        if(!href.startsWith('#') || href==='#!') return;
        const el=document.querySelector(href);
        if(el){ e.preventDefault(); el.scrollIntoView({behavior:'smooth',block:'start'}); }
      });
    });

    // Optional: update active nav link on scroll
    const sections = document.querySelectorAll('main section, .hero');
    const navLinks = document.querySelectorAll('header nav a');
    function onScroll(){
      const y = window.scrollY + 120;
      let current = null;
      sections.forEach(s=>{
        if(s.offsetTop <= y) current = s;
      });
      if(current){
        navLinks.forEach(a=>{
          a.classList.toggle('active', a.getAttribute('href') === '#'+current.id);
        });
      }
    }
    window.addEventListener('scroll', onScroll);
    onScroll();