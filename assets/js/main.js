const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems = document.querySelectorAll('.reveal');
const navLinks = [...document.querySelectorAll('.nav-links a')];
const sections = [...document.querySelectorAll('[data-section]')];
const toTop = document.querySelector('.to-top');
const themeToggle = document.querySelector('.theme-toggle');
const themeColor = document.querySelector('meta[name="theme-color"]');
const profileCard = document.querySelector('.profile-card');
const profileToggle = document.querySelector('.profile-toggle');

const setTheme = (theme, persist = false) => {
  document.documentElement.dataset.theme = theme;
  const isLight = theme === 'light';
  const nextTheme = isLight ? 'dark' : 'light';
  themeToggle.setAttribute('aria-label', `Switch to ${nextTheme} theme`);
  themeToggle.setAttribute('title', `Switch to ${nextTheme} theme`);
  themeToggle.setAttribute('aria-pressed', String(isLight));
  themeColor.setAttribute('content', isLight ? '#f5f3ed' : '#171816');

  if (persist) {
    try { localStorage.setItem('theme', theme); } catch (_) {}
  }
};

setTheme(document.documentElement.dataset.theme || 'dark');
themeToggle.addEventListener('click', () => {
  setTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light', true);
});

profileToggle.addEventListener('click', () => {
  const expanded = profileCard.classList.toggle('profile-expanded');
  profileToggle.setAttribute('aria-expanded', String(expanded));
  profileToggle.setAttribute('aria-label', expanded ? 'Collapse profile details' : 'Expand profile details');
});

if (reduceMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('in-view'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.09, rootMargin: '0px 0px -40px' });

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 3, 2) * 70}ms`;
    revealObserver.observe(item);
  });
}

const setActiveSection = () => {
  const marker = Math.min(window.innerHeight * 0.34, 260);
  let activeId = sections[0]?.id;

  sections.forEach((section) => {
    if (section.getBoundingClientRect().top <= marker) activeId = section.id;
  });

  navLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${activeId}`);
  });

  toTop.classList.toggle('visible', window.scrollY > 700);
};

window.addEventListener('scroll', setActiveSection, { passive: true });
window.addEventListener('resize', setActiveSection, { passive: true });
setActiveSection();

toTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
});

document.getElementById('year').textContent = new Date().getFullYear();
