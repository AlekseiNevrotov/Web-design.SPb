let isFontsLoaded = false;
let isWeatherLoaded = false;
function hidePreloader() {
    if (isFontsLoaded && isWeatherLoaded) {
        document.getElementById('preloader').classList.add('hide');
        document.getElementById('main-content').classList.add('visible');
        setTimeout(() => {
            document.getElementById('preloader').style.display = 'none';
        }, 600);
    }
}
document.addEventListener('DOMContentLoaded', function() {
      const burgerBtn = document.getElementById('burgerBtn');
      const burgerMenu = document.getElementById('burgerMenu');
      burgerBtn.addEventListener('click', function() {
        burgerMenu.classList.toggle('open');
        burgerBtn.classList.toggle('open');
      });
      document.addEventListener('click', function(e) {
        if (
          burgerMenu.classList.contains('open') &&
          !burgerMenu.contains(e.target) &&
          e.target !== burgerBtn && !burgerBtn.contains(e.target)
        ) {
          burgerMenu.classList.remove('open');
        }
      });
      document.querySelectorAll('.submenu-toggle').forEach(btn => {
        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          const submenu = btn.parentElement;
          submenu.classList.toggle('open');
        });
      });
    });
    const canvas = document.getElementById('bg');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const dots = [];
  const DOT_COUNT = 100;
  for (let i = 0; i < DOT_COUNT; i++) {
    dots.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5
    });
  }
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#26D9CD';
    ctx.strokeStyle = '#16847D';
    ctx.lineWidth = 0.4;
    for (let i = 0; i < DOT_COUNT; i++) {
      let p = dots[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
      ctx.fill();
      for (let j = i + 1; j < DOT_COUNT; j++) {
        let q = dots[j];
        let dx = p.x - q.x;
        let dy = p.y - q.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
  async function fetchWeather() {
    const apiKey = "304be0f6672349579dc131530250707";
    const city = "Saint Petersburg";
    try {
      const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&lang=ru`);
      const data = await res.json();
      const iconUrl = "https:" + data.current.condition.icon;
      const tempC = Math.round(data.current.temp_c);
      document.getElementById("weather-icon").src = iconUrl;
      document.getElementById("weather-temp").textContent = `${tempC}°C`;
    } catch (err) {
      console.error("Ошибка получения погоды:", err);
    } finally {
      isWeatherLoaded = true;
      hidePreloader();
    }
  }
  fetchWeather();
const scrollToTopButton = document.getElementById('scrollToTop');
let lastScrollY = window.scrollY; 
window.addEventListener('scroll', () => {
    if (window.scrollY > lastScrollY) {
        if (window.scrollY > window.innerHeight * 0.8) { 
            scrollToTopButton.classList.add('show');
        }
    } else {
        if (window.scrollY <= window.innerHeight * 0.8) { 
            scrollToTopButton.classList.remove('show'); 
        }
    }
    lastScrollY = window.scrollY;
});
scrollToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
});
document.addEventListener('DOMContentLoaded', () => {
  const flipBlock = document.querySelector('.flip-block');
  const checkScroll = () => {
    const rect = flipBlock.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    if (rect.top < windowHeight && rect.bottom > 0) {
      flipBlock.classList.add('flip-in');
      window.removeEventListener('scroll', checkScroll);
    }
  };
  window.addEventListener('scroll', checkScroll);
});
document.addEventListener('DOMContentLoaded', () => {
    const reviews = document.querySelectorAll('.review');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); 
            }
        });
    });
    reviews.forEach(review => {
        observer.observe(review); 
    });
});
function smoothScrollTo(targetId) {
    const targetElement = document.getElementById(targetId);
    const offset = 140;
    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - offset;
    window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
    });
}
document.fonts.ready.then(function() {
    isFontsLoaded = true;
    hidePreloader();
});
  document.getElementById('auditForm').onsubmit = async function(e) {
  e.preventDefault();
  const status = document.getElementById('form-status');
  status.className = 'sending';
  status.innerText = 'Отправка...';
  const form = e.target;
  let digits = form.phone.value.replace(/\D/g, '');
  if (digits.startsWith('7') || digits.startsWith('8')) {
    digits = digits.slice(1);
  }
  if (digits.length !== 10) {
    status.className = 'error';
    status.innerText = 'Заполните пожалуйста телефон полностью!';
    form.phone.focus();
    return;
  }
  const data = {
    name: form.name.value,
    phone: digits,
    message: form.message.value
  };
  try {
    const res = await fetch('/api/sendMail', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    });
    if (res.ok) {
      status.className = 'success';
      status.innerText = 'Спасибо за заявку!';
      setTimeout(() => {
  form.reset();
  status.innerText = '';
  status.className = '';
}, 1500);
    } else {
      status.className = 'error';
      status.innerText = 'Ошибка при отправке. Попробуйте позже.';
    }
  } catch {
    status.className = 'error';
    status.innerText = 'Ошибка сети. Попробуйте позже.';
  }
};
    const phoneInput = document.getElementById('phone');
    const mask = '+7 (___) ___-__-__';
    function applyMask(digits) {
      let output = '+7 (';
      output += digits.substring(0, 3);
      if (digits.length >= 3) {
        output += ') ';
        output += digits.substring(3, 6);
      }
      if (digits.length >= 6) {
        output += '-';
        output += digits.substring(6, 8);
      }
      if (digits.length >= 8) {
        output += '-';
        output += digits.substring(8, 10);
      }
      return output;
    }
    phoneInput.addEventListener('input', function(e) {
  let digits = this.value.replace(/\D/g, '');
  if (digits.startsWith('7') || digits.startsWith('8')) {
    digits = digits.slice(1);
  }
  digits = digits.slice(0, 10);
  let masked = '+7 (';
  if (digits.length > 0) masked += digits.substring(0, 3);
  if (digits.length >= 3) masked += ') ';
  if (digits.length >= 4) masked += digits.substring(3, 6);
  if (digits.length >= 6) masked += '-';
  if (digits.length >= 6) masked += digits.substring(6, 8);
  if (digits.length >= 8) masked += '-';
  if (digits.length >= 8) masked += digits.substring(8, 10);
  this.value = masked;
});
const servicesBlock = document.querySelector('.services-form-block');
const isElementInViewport = (el) => {
    const rect = el.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) + 152 &&
        rect.bottom >= 0
    );
};
const handleScroll = () => {
    if (isElementInViewport(servicesBlock)) {
        servicesBlock.classList.add('show'); 
        window.removeEventListener('scroll', handleScroll); 
    }
};
window.addEventListener('scroll', handleScroll);
document.addEventListener('DOMContentLoaded', () => {
  const menuLinks = document.querySelectorAll('.nav .scroll-button');
  const sections = [];
  menuLinks.forEach(link => {
    const href = link.getAttribute('href'); 
    if (href && href.startsWith('#')) {
      const targetId = href.substring(1); 
      const targetElement = document.getElementById(targetId); 
      if (targetElement) {
        sections.push({ link, element: targetElement }); 
      } else {
        console.warn(`Секция с ID "${targetId}" не найдена!`);
      }
    }
  });
  if (sections.length === 0) return;
  const setActiveLink = (activeLink) => {
    menuLinks.forEach(link => link.classList.remove('active'));
    if (activeLink) {
      activeLink.classList.add('active');
    }
  };
  const observer = new IntersectionObserver((entries) => {
    let visibleEntries = entries.filter(entry => entry.isIntersecting); 
    if (visibleEntries.length === 0) {
      setActiveLink(null); 
      return;
    }
    visibleEntries.sort((a, b) => {
      if (b.intersectionRatio !== a.intersectionRatio) {
        return b.intersectionRatio - a.intersectionRatio; 
      }
      return a.boundingClientRect.top - b.boundingClientRect.top;
    });
    const bestEntry = visibleEntries[0];
    const activeSection = sections.find(sec => sec.element === bestEntry.target);
    if (activeSection) {
      setActiveLink(activeSection.link);
    }
  }, {
    root: null, 
    threshold: [0.1, 0.5], 
    rootMargin: '-10% 0px -30% 0px' 
  });
  sections.forEach(sec => observer.observe(sec.element));
  const initialScroll = window.scrollY;
});
const modal = document.getElementById('modal');
const openBtn = document.getElementById('openCalcBtn');
const closeBtn = document.querySelector('.modal-close');
const iframe = document.getElementById('calcIframe');
openBtn.addEventListener('click', () => {
  modal.style.display = 'flex';
  document.body.style.overflow = 'auto'; 
});
closeBtn.addEventListener('click', () => closeModal());
modal.addEventListener('click', (e) => {
  if (e.target === modal || e.target.classList.contains('modal-overlay')) {
    closeModal();
  }
});
function closeModal() {
  modal.style.display = 'none';
  document.body.style.overflow = 'auto'; 
}
iframe.addEventListener('load', () => {
  try {
    const iframeHeight = iframe.contentWindow.document.body.scrollHeight + 500; 
    iframe.style.height = `${Math.min(iframeHeight, window.innerHeight * 1)}px`;
  } catch (e) {
    console.warn('Ошибка доступа к iframe (cross-origin?)');
    iframe.style.height = '680px'; 
  }
});
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.style.display === 'flex') {
    closeModal();
  }
});