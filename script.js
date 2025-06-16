    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      const links = document.querySelectorAll('.link');
      links.forEach(link => {
        link.addEventListener('click', function (e) {
          if (link.classList.contains('loading')) return;
          e.preventDefault();
          sessionStorage.setItem('elazar-loading-href', link.href);
          links.forEach(l => l.classList.remove('loading'));
          link.classList.add('loading');
          setTimeout(() => {
            window.location.href = link.href;
          }, 400);
        });
      });
      const resetLoadingState = () => {
        sessionStorage.removeItem('elazar-loading-href');
        links.forEach(link => link.classList.remove('loading'));
      };
      window.addEventListener('pageshow', resetLoadingState);
      window.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') resetLoadingState();
      });
      window.addEventListener('load', resetLoadingState);
    }
    const logo = document.querySelector('.logo-text');
    logo.classList.add('glitch');
    setTimeout(() => {
      logo.classList.remove('glitch');
    }, 600);