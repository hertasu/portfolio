/* ============================================================
   Portfolio renderer
   Loads /data/*.json and builds the page. Edit the JSON files
   to update content — this file should not need to change
   unless you add a brand-new field you want displayed.
   ============================================================ */

async function loadJSON(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`${path} not found`);
    return await res.json();
  } catch (err) {
    console.warn(`Could not load ${path}:`, err);
    return [];
  }
}

function el(tag, className, html) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (html !== undefined) e.innerHTML = html;
  return e;
}

/* ---------- BIO / HEADER ---------- */
function renderBio(bio) {
  if (!bio || !bio.name) return;
  document.getElementById('bio-name').textContent = bio.name;
  document.getElementById('bio-position').textContent = bio.position || '';
  document.getElementById('bio-summary').textContent = bio.summary || '';
  document.getElementById('bio-location').textContent = bio.location || '';
  const li = document.getElementById('bio-linkedin');
  if (bio.linkedin) { li.href = bio.linkedin; } else { li.style.display = 'none'; }
  document.title = `${bio.name} — Portfolio`;
}

/* ---------- DECLARATIONS STRIP ---------- */
function renderDeclarations({ certificates, experience, projects, publications, extracurriculars }) {
  const grid = document.getElementById('declarations-grid');
  const items = [];

  const sat = certificates.find(c => c.name && c.name.toUpperCase().includes('SAT'));
  if (sat) items.push({ value: sat.score.split(',')[0].split('(')[0].trim(), label: 'SAT' });

  const ielts = certificates.find(c => c.name && c.name.toUpperCase().includes('IELTS'));
  if (ielts) items.push({ value: ielts.score, label: 'IELTS' });

  if (experience && experience.length) items.push({ value: experience.length, label: 'Roles Held' });
  if (projects && projects.length) items.push({ value: projects.length, label: 'Projects' });
  if (publications && publications.length) items.push({ value: publications.length, label: 'Publication' + (publications.length > 1 ? 's' : '') });
  if (extracurriculars && extracurriculars.length) items.push({ value: extracurriculars.length, label: 'Extracurriculars' });

  items.forEach(item => {
    const d = el('div', 'decl-item');
    d.appendChild(el('span', 'decl-value', item.value));
    d.appendChild(el('span', 'decl-label', item.label));
    grid.appendChild(d);
  });
}

/* ---------- EXPERIENCE / PUBLICATIONS / EXTRACURRICULARS (entry list) ---------- */
function renderEntry(container, item, opts = {}) {
  const entry = el('div', 'entry');

  const meta = el('div', 'entry-meta', item.duration || item.date || '');
  entry.appendChild(meta);

  const body = el('div');
  body.appendChild(el('p', 'entry-title', item.title || item.name || ''));

  const orgLine = item.company || item.organization || item.issuer || item.target_journal;
  if (orgLine) body.appendChild(el('p', 'entry-org', orgLine + (item.location ? ` — ${item.location}` : '')));

  if (item.status) body.appendChild(el('span', 'status-badge', item.status));
  if (item.type) body.appendChild(el('p', 'entry-org', item.type));

  if (item.description) body.appendChild(el('p', 'entry-desc', item.description));

  if (item.responsibilities && item.responsibilities.length) {
    const ul = el('ul', 'entry-resp');
    item.responsibilities.forEach(r => ul.appendChild(el('li', null, r)));
    body.appendChild(ul);
  }

  if (item.link) {
    const a = el('a', 'entry-link', 'View publication ↗');
    a.href = item.link; a.target = '_blank'; a.rel = 'noopener';
    body.appendChild(a);
  }

  entry.appendChild(body);
  container.appendChild(entry);
}

/* ---------- PROJECT CARDS ---------- */
function renderProjectCard(container, item) {
  const card = el('div', 'card');
  card.appendChild(el('p', 'card-title', item.title));
  if (item.role) card.appendChild(el('p', 'card-sub', item.role));
  const meta = el('p', 'card-desc');
  meta.textContent = item.description || '';
  card.appendChild(meta);
  if (item.duration) {
    const d = el('p', 'card-desc');
    d.style.marginTop = '-0.4rem';
    d.style.fontFamily = 'var(--mono)';
    d.style.fontSize = '0.75rem';
    d.textContent = item.duration;
    card.appendChild(d);
  }
  if (item.tech && item.tech.length) {
    const tags = el('div', 'tech-tags');
    item.tech.forEach(t => tags.appendChild(el('span', 'tech-tag', t)));
    card.appendChild(tags);
  }
  if (item.link) {
    const a = el('a', 'card-link', 'View ↗');
    a.href = item.link.startsWith('http') ? item.link : `https://${item.link}`;
    a.target = '_blank'; a.rel = 'noopener';
    card.appendChild(a);
  }
  container.appendChild(card);
}

/* ---------- DOCUMENT CARDS (certificates / letters) ---------- */
function renderDocCard(container, item, folder) {
  const card = el('div', 'card');

  const preview = el('div', 'doc-preview');
  if (item.image) {
    const path = `images/${folder}/${item.image}`;
    if (item.image.toLowerCase().endsWith('.pdf')) {
      preview.appendChild(el('div', 'doc-fallback', `<span class="doc-icon">&#128196;</span>${item.image}`));
      preview.style.cursor = 'pointer';
      preview.title = 'Click to open PDF';
      preview.addEventListener('click', () => window.open(path, '_blank'));
    } else {
      const img = document.createElement('img');
      img.src = path;
      img.alt = item.name;
      img.onerror = () => {
        preview.innerHTML = '';
        preview.appendChild(el('div', 'doc-fallback', `<span class="doc-icon">&#128196;</span>Add ${item.image} to<br>images/${folder}/`));
      };
      preview.appendChild(img);
    }
  }
  card.appendChild(preview);

  card.appendChild(el('p', 'card-title', item.name));
  card.appendChild(el('p', 'card-sub', item.issuer));
  if (item.score) card.appendChild(el('span', 'card-score', item.score));
  card.appendChild(el('p', 'card-desc', item.date || ''));

  if (item.image) {
    const a = el('a', 'card-link', 'Open document ↗');
    a.href = `images/${folder}/${item.image}`;
    a.target = '_blank'; a.rel = 'noopener';
    card.appendChild(a);
  }

  container.appendChild(card);
}

/* ---------- SCROLL BEHAVIOR: active tab + fade-in ---------- */
function initScrollBehavior() {
  const tabs = Array.from(document.querySelectorAll('.tabs a'));
  const sections = tabs.map(t => document.querySelector(t.getAttribute('href')));

  const spy = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const idx = sections.indexOf(entry.target);
      if (idx === -1) return;
      if (entry.isIntersecting) {
        tabs.forEach(t => t.classList.remove('active'));
        tabs[idx].classList.add('active');
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });

  sections.forEach(s => s && spy.observe(s));

  const fade = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('in-view');
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.folio').forEach(f => fade.observe(f));
}

/* ---------- INIT ---------- */
(async function init() {
  const [bio, experience, projects, certificates, publications, extracurriculars, letters] = await Promise.all([
    loadJSON('data/bio.json'),
    loadJSON('data/experience.json'),
    loadJSON('data/projects.json'),
    loadJSON('data/certificates.json'),
    loadJSON('data/publications.json'),
    loadJSON('data/extracurriculars.json'),
    loadJSON('data/letters.json'),
  ]);

  renderBio(bio);
  renderDeclarations({ certificates, experience, projects, publications, extracurriculars });

  const expList = document.getElementById('experience-list');
  experience.forEach(item => renderEntry(expList, item));

  const projList = document.getElementById('projects-list');
  projects.forEach(item => renderProjectCard(projList, item));

  const certList = document.getElementById('certificates-list');
  certificates.forEach(item => renderDocCard(certList, item, 'certificates'));

  const pubList = document.getElementById('publications-list');
  publications.forEach(item => renderEntry(pubList, item));
  // publication certificates, if present, get their own doc card appended inline
  publications.forEach(item => {
    if (item.certificate) {
      renderDocCard(certList, { name: `${item.title} — Certificate`, issuer: item.target_journal, date: item.date, image: item.certificate }, 'certificates');
    }
  });

  const extraList = document.getElementById('extracurriculars-list');
  extracurriculars.forEach(item => renderEntry(extraList, item));

  const lettersList = document.getElementById('letters-list');
  letters.forEach(item => renderDocCard(lettersList, item, 'letters'));

  document.getElementById('footer-year').textContent = new Date().getFullYear();

  initScrollBehavior();
})();
