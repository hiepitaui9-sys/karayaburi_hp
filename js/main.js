document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Custom Cursor (Mouse Stalker) ---
  const dot = document.createElement('div');
  const circle = document.createElement('div');
  dot.className = 'mouse-stalker-dot';
  circle.className = 'mouse-stalker-circle';
  document.body.appendChild(dot);
  document.body.appendChild(circle);

  let mouseX = 0, mouseY = 0;
  let circleX = 0, circleY = 0;
  
  // Speed coefficient (lerp factor) for smooth lag
  const delay = 0.15; 

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Dot moves instantly
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
  });

  // Animate circle with inertia
  function animateCircle() {
    circleX += (mouseX - circleX) * delay;
    circleY += (mouseY - circleY) * delay;
    
    circle.style.transform = `translate3d(${circleX}px, ${circleY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(animateCircle);
  }
  animateCircle();

  // Cursor hover states logic
  const interactiveElements = document.querySelectorAll('a, button, .interactive-hover, input, textarea, .service-circle-part, .works-card');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
      
      // Determine subclass
      if (el.classList.contains('view-hover')) {
        document.body.classList.add('cursor-hover-view');
      } else if (el.classList.contains('play-hover')) {
        document.body.classList.add('cursor-hover-play');
      }
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover', 'cursor-hover-view', 'cursor-hover-play');
    });
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    circle.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    circle.style.opacity = '1';
  });


  // --- 2. Header Scroll Effect ---
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  });


  // --- 3. Hamburger Menu ---
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const navMenu = document.querySelector('.nav-menu');
  
  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      hamburgerBtn.classList.toggle('active');
      navMenu.classList.toggle('active');
      
      // Prevent body scroll when menu is active
      if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    // Close menu when clicking navigation link
    const navLinks = document.querySelectorAll('.nav-item a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }


  // --- 4. Reveal on Scroll (Intersection Observer) ---
  const revealElements = document.querySelectorAll('.reveal-fade');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Unobserve once shown
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));


  // --- 5. Hero Panels Parallax ---
  const heroSection = document.querySelector('.hero');
  const parallaxPanels = document.querySelectorAll('.parallax-panel');
  
  if (heroSection && parallaxPanels.length > 0) {
    heroSection.addEventListener('mousemove', (e) => {
      const { width, height } = heroSection.getBoundingClientRect();
      // Mouse offset from center (-0.5 to 0.5)
      const offX = (e.clientX / width) - 0.5;
      const offY = (e.clientY / height) - 0.5;
      
      parallaxPanels.forEach((panel, idx) => {
        // Vary movement for layered effect
        const speed = (idx + 1) * 15; 
        const x = offX * speed;
        const y = offY * speed;
        
        // Retain original diagonal clip translations and add parallax offset
        panel.style.transform = `translate(${x}px, ${y}px)`;
      });
    });
    
    // Reset position when mouse leaves hero
    heroSection.addEventListener('mouseleave', () => {
      parallaxPanels.forEach(panel => {
        panel.style.transform = 'translate(0, 0)';
      });
    });
  }


  // --- 6. Service Circle Diagram Interaction ---
  const serviceParts = document.querySelectorAll('.service-diag-part');
  const serviceDetailCards = document.querySelectorAll('.service-detail-card');
  
  if (serviceParts.length > 0) {
    serviceParts.forEach(part => {
      part.addEventListener('mouseenter', () => {
        const targetId = part.getAttribute('data-service');
        
        // Highlight active part
        serviceParts.forEach(p => p.classList.remove('active'));
        part.classList.add('active');
        
        // Show corresponding detail card
        serviceDetailCards.forEach(card => {
          if (card.id === `service-detail-${targetId}`) {
            card.classList.add('active');
          } else {
            card.classList.remove('active');
          }
        });
      });
    });
  }


  // --- 7. Contact Form Handling ---
  const contactForm = document.getElementById('contact-form');
  const successModal = document.getElementById('success-modal');
  const closeModalBtn = document.getElementById('close-modal');

  if (contactForm && successModal) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Form validation
      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const message = document.getElementById('form-message').value.trim();
      
      if (!name || !email || !message) {
        alert('全ての必須項目を入力してください。');
        return;
      }

      // Simple email validation regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('正しいメールアドレスを入力してください。');
        return;
      }

      // Show success modal with nice animation
      successModal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Lock scroll

      // Reset form
      contactForm.reset();
    });

    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', () => {
        successModal.classList.remove('active');
        document.body.style.overflow = ''; // Unlock scroll
      });
    }
    
    // Close modal by clicking background
    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) {
        successModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }


  // --- 8. Opening Animation ---
  const openingOverlay = document.getElementById('opening-overlay');
  const openingLogoImg = document.getElementById('opening-logo-img');
  console.log("Opening overlay found:", !!openingOverlay, "GSAP defined:", typeof gsap !== 'undefined');
  
  if (openingOverlay && openingLogoImg) {
    if (typeof gsap !== 'undefined' && !sessionStorage.getItem('visited-karayaburi')) {
      try {
        console.log("Starting GSAP opening animation...");
        
        // Lock scroll dynamically only when animation is going to play
        document.body.classList.add('overflow-hidden');
        
        // Set visited flag
        sessionStorage.setItem('visited-karayaburi', 'true');
        
        const tl = gsap.timeline();

        // Initial state setup for transform opening (highly compatible across all browsers)
        gsap.set(openingLogoImg, {
          opacity: 0,
          scaleX: 0,
          transformOrigin: "50% 50%"
        });
        
        // 1. Open the logo from center (horizontal expand)
        tl.to(openingLogoImg, {
          opacity: 1,
          scaleX: 1,
          duration: 1.2,
          ease: "power3.inOut"
        });

        // 2. Fade out overlay after 0.8s of visual impact (using delay on the next tween)
        tl.to(openingOverlay, {
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          delay: 0.8,
          onComplete: () => {
            openingOverlay.style.display = 'none';
            document.body.classList.remove('overflow-hidden');
            console.log("Opening animation complete: overlay removed.");
          }
        });
      } catch (err) {
        console.error("Failed to run opening animation:", err);
        // Fallback: hide overlay and restore scroll
        openingOverlay.style.display = 'none';
        document.body.classList.remove('overflow-hidden');
      }
    } else {
      console.log("Animation skipped: already visited, or GSAP not loaded.");
      openingOverlay.style.display = 'none';
      document.body.classList.remove('overflow-hidden');
    }
  }
});
