// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// =========================================================
// Reveal sections on scroll
// =========================================================
const revealTargets = document.querySelectorAll('.section, .hero');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealTargets.forEach(el => io.observe(el));

// =========================================================
// Typewriter role cycler
// =========================================================
(function typewriter(){
  const el = document.getElementById('roleType');
  if (!el) return;
  const roles = [
    'Lead Engineer, MES & Automation',
    'Bridging Automation & Data Engineering',
    'IT-OT Integration Specialist',
    'Industry 4.0 / IIoT Developer'
  ];
  if (reducedMotion) { el.textContent = roles[0]; return; }

  let roleIndex = 0, charIndex = 0, deleting = false;

  function tick(){
    const current = roles[roleIndex];
    if (!deleting){
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length){
        deleting = true;
        return setTimeout(tick, 1600);
      }
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0){
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(tick, deleting ? 30 : 55);
  }
  tick();
})();

// =========================================================
// Animated stat counters
// =========================================================
(function counters(){
  const stats = document.querySelectorAll('.stat__value[data-count]');
  if (!stats.length) return;

  const animate = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    if (reducedMotion){ el.textContent = target + suffix; return; }
    const duration = 900;
    const start = performance.now();
    function frame(now){
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  };

  const statIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        animate(entry.target);
        statIo.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  stats.forEach(el => statIo.observe(el));
})();

// =========================================================
// Hero diagram: node tooltips + mouse tilt
// =========================================================
(function diagram(){
  const wrap = document.getElementById('heroDiagram');
  const tip = document.getElementById('nodeTip');
  if (!wrap || !tip) return;

  wrap.querySelectorAll('.node').forEach(node => {
    node.addEventListener('mouseenter', () => {
      tip.textContent = node.dataset.tip || '';
      tip.classList.add('is-visible');
    });
    node.addEventListener('mousemove', (e) => {
      const rect = wrap.getBoundingClientRect();
      let x = e.clientX - rect.left + 14;
      let y = e.clientY - rect.top + 14;
      const tipW = 230, tipH = 70;
      if (x + tipW > rect.width) x = e.clientX - rect.left - tipW - 14;
      if (y + tipH > rect.height) y = e.clientY - rect.top - tipH - 14;
      tip.style.transform = `translate(${x}px, ${y}px)`;
    });
    node.addEventListener('mouseleave', () => tip.classList.remove('is-visible'));
  });

  if (!reducedMotion && window.matchMedia('(pointer: fine)').matches){
    wrap.addEventListener('mousemove', (e) => {
      const rect = wrap.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      wrap.classList.add('is-tilting');
      wrap.style.transform = `perspective(900px) rotateY(${px * 6}deg) rotateX(${-py * 6}deg)`;
    });
    wrap.addEventListener('mouseleave', () => {
      wrap.classList.remove('is-tilting');
      wrap.style.transform = '';
    });
  }
})();

// =========================================================
// Diagnostic modal easter egg
// =========================================================
(function diagnostic(){
  const btn = document.getElementById('diagBtn');
  const modal = document.getElementById('diagModal');
  if (!btn || !modal) return;

  const body = document.getElementById('diagBody');
  const footer = document.getElementById('diagFooter');
  const runNum = document.getElementById('diagRun');

  const checks = [
    'PLC / SCADA link',
    'OPC-UA handshake',
    'MQTT broker connection',
    'SQL Server pipeline',
    'REST API (SAP ↔ PLC)',
    'Power BI refresh',
    'IT-OT security gateway'
  ];

  let runCount = 0;

  function openModal(){
    runCount++;
    runNum.textContent = String(runCount).padStart(3, '0');
    body.innerHTML = '';
    footer.textContent = '';
    footer.classList.remove('is-visible');
    modal.hidden = false;
    document.body.style.overflow = 'hidden';

    checks.forEach((label, i) => {
      const row = document.createElement('div');
      row.className = 'diag__check';
      row.style.animationDelay = (i * 0.18) + 's';
      row.innerHTML = `<span class="diag__check-icon">${reducedMotion ? '✓' : '…'}</span><span>${label}</span>`;
      body.appendChild(row);

      const revealAt = reducedMotion ? 0 : i * 220 + 260;
      setTimeout(() => {
        row.querySelector('.diag__check-icon').textContent = '✓';
      }, revealAt);
    });

    const totalDelay = reducedMotion ? 0 : checks.length * 220 + 300;
    setTimeout(() => {
      footer.textContent = 'ALL SYSTEMS NOMINAL — READY TO DEPLOY ✓';
      footer.classList.add('is-visible');
    }, totalDelay);
  }

  function closeModal(){
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', openModal);
  modal.addEventListener('click', (e) => {
    if (e.target.hasAttribute('data-close')) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });
})();

// =========================================================
// Interactive terminal
// =========================================================
(function terminal(){
  const body = document.getElementById('termBody');
  const input = document.getElementById('termInput');
  if (!body || !input) return;

  const print = (html, cls) => {
    const p = document.createElement('p');
    p.className = 'term__line' + (cls ? ' ' + cls : '');
    p.innerHTML = html;
    body.appendChild(p);
    body.scrollTop = body.scrollHeight;
  };

  const commands = {
    help: () => print(
      'Available commands:<br>' +
      '<span class="term__accent">whoami</span> · <span class="term__accent">about</span> · ' +
      '<span class="term__accent">skills</span> · <span class="term__accent">experience</span> · ' +
      '<span class="term__accent">education</span> · <span class="term__accent">contact</span> · ' +
      '<span class="term__accent">ls</span> · <span class="term__accent">date</span> · <span class="term__accent">clear</span>'
    ),
    whoami: () => print('Subhajit Routh — Lead Engineer, MES | Automation &amp; Digitalization | IT-OT Integration | Industry 4.0'),
    about: () => print(
      'Technical Lead &amp; Developer bridging Automation and Data Engineering. 5+ years across PLC/SCADA, ' +
      'IT-OT integration, and Industry 4.0 digitalization — connecting the plant floor to enterprise systems.'
    ),
    skills: () => print(
      'Automation: Rockwell PLC/SCADA, PlantPAx, VFD Integration<br>' +
      'IT-OT/IIoT: OPC-UA, MQTT, KEPServer, Node-RED, REST API<br>' +
      'Data: SQL Server, Power BI, Python<br>' +
      'Tools: Azure DevOps, GitHub'
    ),
    experience: () => print(
      'Lead Engineer — L&amp;T Technology Services (May 2026–Present)<br>' +
      'Technical Lead — Greenwave Solutions (Jan 2025–May 2026)<br>' +
      'Senior Project Engineer — Greenwave Solutions (Jan 2023–Dec 2024)<br>' +
      'Project Engineer — Greenwave Solutions (Jan 2021–Dec 2022)'
    ),
    education: () => print('B.Tech, Electrical &amp; Electronics Engineering — Academy of Technology (2014–2019)'),
    contact: () => {
      print('email: subhajitr879@gmail.com<br>linkedin: linkedin.com/in/subhajitrouth16');
      document.getElementById('contact')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    },
    ls: () => print('about.txt&nbsp;&nbsp;skills.log&nbsp;&nbsp;experience.csv&nbsp;&nbsp;education.pdf&nbsp;&nbsp;contact.sh'),
    date: () => print(new Date().toString()),
    clear: () => { body.innerHTML = ''; },
    'sudo hire me': () => {
      print('Permission granted. Redirecting to contact section…', 'term__amber');
      document.getElementById('contact')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    }
  };

  function run(raw){
    const cmd = raw.trim();
    if (!cmd) return;
    print(cmd.replace(/</g, '&lt;'), 'term__line--cmd');
    const handler = commands[cmd.toLowerCase()];
    if (handler) {
      handler();
    } else {
      print(`command not found: ${cmd.replace(/</g, '&lt;')}. Type <span class="term__accent">help</span> for available commands.`, 'term__err');
    }
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter'){
      run(input.value);
      input.value = '';
    }
  });

  document.querySelectorAll('.term__chips button[data-cmd]').forEach(chip => {
    chip.addEventListener('click', () => {
      input.focus();
      run(chip.dataset.cmd);
    });
  });

  document.getElementById('term')?.addEventListener('click', () => input.focus());
})();
