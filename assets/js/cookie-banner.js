// ============================================================
//  4x4 CATALUNYA – cookie-banner.js
//  Simple cookie/privacy banner (no cookies are used)
// ============================================================

(function () {
  const STORAGE_KEY = '4x4_cookie_consent';
  const banner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const rejectBtn = document.getElementById('cookie-reject');

  if (!banner) return;

  // Check if user already responded
  const consent = localStorage.getItem(STORAGE_KEY);
  if (consent) return; // Already accepted or rejected, don't show

  // Show banner with a small delay for smooth appearance
  setTimeout(function () {
    banner.style.display = '';
    requestAnimationFrame(function () {
      banner.classList.add('show');
    });
  }, 800);

  function closeBanner(value) {
    banner.classList.remove('show');
    banner.classList.add('hiding');
    setTimeout(function () {
      banner.style.display = 'none';
      banner.classList.remove('hiding');
    }, 400);
    localStorage.setItem(STORAGE_KEY, value);
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', function () {
      closeBanner('accepted');
    });
  }

  if (rejectBtn) {
    rejectBtn.addEventListener('click', function () {
      closeBanner('rejected');
    });
  }
})();
