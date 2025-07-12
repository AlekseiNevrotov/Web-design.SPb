    document.addEventListener('DOMContentLoaded', function() {
      const burgerBtn = document.getElementById('burgerBtn');
      const burgerMenu = document.getElementById('burgerMenu');
      burgerBtn.addEventListener('click', function() {
        burgerMenu.classList.toggle('open');
        burgerBtn.classList.toggle('open');
      });
      // Закрытие меню по клику вне меню (опционально)
      document.addEventListener('click', function(e) {
        if (
          burgerMenu.classList.contains('open') &&
          !burgerMenu.contains(e.target) &&
          e.target !== burgerBtn && !burgerBtn.contains(e.target)
        ) {
          burgerMenu.classList.remove('open');
        }
      });
      // Выпадающее подменю "Приложения"
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
    }
  }
  fetchWeather();
const scrollToTopButton = document.getElementById("scrollToTop");
window.onscroll = function() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        scrollToTopButton.style.display = "block"; 
    } else {
        scrollToTopButton.style.display = "none"; 
    }
};
scrollToTopButton.onclick = function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};