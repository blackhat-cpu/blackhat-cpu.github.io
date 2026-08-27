// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// =========================================================
// Toast utility
// =========================================================
function showToast(msg){
  const host = document.getElementById('toast');
  if (!host) return;
  const el = document.createElement('div');
  el.className = 'toast__item';
  el.textContent = msg;
  host.appendChild(el);
  setTimeout(() => el.remove(), 2800);
}

// =========================================================
// Confetti burst
// =========================================================
function confettiBurst(originX, originY, count){
  if (reducedMotion) return;
  const colors = ['#4fd8e8', '#ffb020', '#3ddc84', '#ffffff'];
  const n = count || 50;
  for (let i = 0; i < n; i++){
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    const size = 5 + Math.random() * 6;
    piece.style.width = size + 'px';
    piece.style.height = (size * 0.4) + 'px';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.left = (originX != null ? originX : Math.random() * window.innerWidth) + 'px';
    piece.style.top = (originY != null ? originY : -10) + 'px';
    const duration = 1.6 + Math.random() * 1.2;
    piece.style.animationDuration = duration + 's';
    piece.style.transform = `translateX(${(Math.random() - 0.5) * 200}px)`;
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), duration * 1000 + 100);
  }
}

// =========================================================
// Boot sequence
// =========================================================
(function boot(){
  const screen = document.getElementById('bootScreen');
  const linesHost = document.getElementById('bootLines');
  if (!screen || !linesHost) return;

  if (reducedMotion || sessionStorage.getItem('bootPlayed')){
    screen.hidden = true;
    return;
  }
  sessionStorage.setItem('bootPlayed', '1');

  const log = [
    'INIT MES ↔ Azure DevOps bridge ............. <span class="ok">OK</span>',
    'CLONING repository from GitHub ............. <span class="ok">OK</span>',
    'RUNNING Azure Pipelines build ............... <span class="ok">OK</span>',
    'PASSING release gates / QA .................. <span class="ok">OK</span>',
    'DEPLOYING to Kubernetes cluster .............. <span class="ok">OK</span>',
    'SYNCING SQL Server + Power BI pipelines ..... <span class="ok">OK</span>',
    'LOADING IT-OT / automation background ....... <span class="ok">OK</span>',
    '',
    'Welcome, recruiter / fellow engineer / curious human.',
    'Booting portfolio.exe …'
  ];

  let i = 0;
  function nextLine(){
    if (i >= log.length){
      setTimeout(() => { screen.hidden = true; }, 500);
      return;
    }
    const p = document.createElement('p');
    p.innerHTML = log[i];
    p.style.animationDelay = '0s';
    linesHost.appendChild(p);
    i++;
    setTimeout(nextLine, 160);
  }
  nextLine();

  screen.addEventListener('click', () => { screen.hidden = true; });
})();

// =========================================================
// Button ripple effect
// =========================================================
(function ripple(){
  if (reducedMotion) return;
  document.addEventListener('click', (e) => {
    const target = e.target.closest('.btn, .term__chips button');
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.4;
    const span = document.createElement('span');
    span.className = 'ripple';
    span.style.width = span.style.height = size + 'px';
    span.style.left = (e.clientX - rect.left - size / 2) + 'px';
    span.style.top = (e.clientY - rect.top - size / 2) + 'px';
    target.appendChild(span);
    setTimeout(() => span.remove(), 600);
  });
})();

// =========================================================
// Logo click easter egg
// =========================================================
(function logoSpin(){
  const logo = document.getElementById('logoMark');
  if (!logo) return;
  const quips = ['Beep boop. 🤖', 'System nominal.', 'Compiling charm…', '01001000 01101001'];
  let clicks = 0;
  logo.addEventListener('click', (e) => {
    e.preventDefault();
    logo.classList.remove('is-spinning');
    void logo.offsetWidth;
    logo.classList.add('is-spinning');
    showToast(quips[clicks % quips.length]);
    clicks++;
  });
})();

// =========================================================
// Konami code — party mode
// =========================================================
(function konami(){
  const seq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let pos = 0;
  document.addEventListener('keydown', (e) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (key === seq[pos]) {
      pos++;
      if (pos === seq.length){
        pos = 0;
        document.body.classList.add('party-mode');
        showToast('🎉 PARTY MODE ACTIVATED');
        confettiBurst(window.innerWidth / 2, 0, 80);
        setTimeout(() => document.body.classList.remove('party-mode'), 4000);
      }
    } else {
      pos = (key === seq[0]) ? 1 : 0;
    }
  });
})();

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
    'Lead Engineer, MES & DevOps',
    'Azure DevOps · CI/CD Pipelines',
    'GitHub · SQL · Data Engineering',
    'IT-OT Integration (Automation background)'
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
    'GitHub repo connection',
    'Azure Pipelines trigger',
    'Build & unit tests',
    'Release gate approval',
    'Kubernetes deployment',
    'SQL Server data sync',
    'Power BI refresh'
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
      const rect = modal.querySelector('.diag__panel').getBoundingClientRect();
      confettiBurst(rect.left + rect.width / 2, rect.top, 40);
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
    whoami: () => print('Subhajit Routh — Lead Engineer, MES | Azure DevOps | Kubernetes | GitHub | SQL &amp; Data Engineering | IT-OT background'),
    about: () => print(
      'Lead Engineer building CI/CD pipelines in Azure DevOps, deploying to Kubernetes, managing ' +
      'source control on GitHub, and running SQL Server + Power BI data platforms for MES. 5+ years ' +
      'of industrial-automation grounding (PLC/SCADA, IT-OT integration) behind it.'
    ),
    skills: () => print(
      'MES &amp; DevOps: Azure DevOps, GitHub, CI/CD Pipelines, Kubernetes, Release Management<br>' +
      'Data: SQL Server, Power BI, Python, Schema Design<br>' +
      'IT-OT/IIoT: OPC-UA, MQTT, KEPServer, Node-RED, REST API<br>' +
      'Automation (background): Rockwell PLC/SCADA, PlantPAx, VFD Integration'
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
    },
    coffee: () => print(
      '&nbsp;&nbsp;( (<br>&nbsp;&nbsp; ) )<br>&nbsp;.........<br>&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|]<br>&nbsp;\\&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/<br>&nbsp;&nbsp;`---\'<br>brewing... productivity.exe loaded ☕'
    ),
    party: () => {
      document.body.classList.add('party-mode');
      showToast('🎉 PARTY MODE ACTIVATED');
      confettiBurst(window.innerWidth / 2, 0, 80);
      print('Initiating unauthorized celebration…', 'term__amber');
      setTimeout(() => document.body.classList.remove('party-mode'), 4000);
    },
    matrix: () => print('Wake up, Subhajit… the plant floor has you. 🟩'),
    'rm -rf /': () => print("Nice try. This isn't that kind of portfolio.", 'term__err')
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
