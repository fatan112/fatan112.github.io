(() => {
  'use strict';

  // 1. Mobile Navigation Toggle
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 2. Acid Riot Theme Toggle
  const riotToggle = document.getElementById('riotToggle');
  const riotLabel = document.getElementById('riotLabel');

  if (riotToggle && riotLabel) {
    riotToggle.addEventListener('click', () => {
      const active = document.body.classList.toggle('acid-riot');
      riotToggle.setAttribute('aria-pressed', String(active));
      riotLabel.textContent = active ? 'ZINE DARK' : 'ACID RIOT';
      showToast(active ? 'MODE ACID RIOT DIAKTIFKAN!' : 'KEMBALI KE ZINE DARK');
    });
  }

  // 3. Skill Filter Tabs
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.filter;
      filterBtns.forEach((b) => {
        const isCurrent = b === btn;
        b.classList.toggle('active', isCurrent);
        b.setAttribute('aria-selected', String(isCurrent));
      });

      skillCards.forEach((card) => {
        const match = target === 'all' || card.dataset.category === target;
        card.classList.toggle('is-hidden', !match);
      });
    });
  });

  // 4. Project Detail Modal
  const PROJECT_LOGS = {
    'rtr-riot': {
      badge: 'LAB-01 // MIKROTIK',
      title: 'RTR-RIOT: Manajemen Bandwidth & Hotspot',
      desc: 'Konfigurasi RouterBoard untuk memisahkan trafik guru, lab TKJ, dan tamu hotspot agar latensi tetap stabil saat jam praktik.',
      code: `/ip hotspot setup
/queue simple add name="LAB-TKJ-LIMIT" target=192.168.20.0/24 max-limit=20M/50M
/ip firewall nat add chain=srcnat out-interface=ether1-isp action=masquerade
# STATUS: PACKETS ROUTED CLEANLY // 0% DROP`
    },
    'debian-zine': {
      badge: 'LAB-02 // DEBIAN CLI',
      title: 'DEBIAN-ZINE: Server DNS & Web Lokal',
      desc: 'Setup domain internal fathanadji.tkj.local menggunakan BIND9 dan virtual host Nginx di Debian Linux untuk akses dokumentasi praktikum offline.',
      code: `$ sudo systemctl status bind9 nginx
● bind9.service - BIND Domain Name Server (active)
● nginx.service - High Performance Web Server (active)
$ dig @127.0.0.1 fathanadji.tkj.local +short
192.168.10.254`
    },
    'cat6-anarchy': {
      badge: 'LAB-03 // CABLING',
      title: 'CAT6-ANARCHY: Re-Wiring Rack & Patch Panel',
      desc: 'Crimping ulang 24 kabel patch cord standar T568B (Putih-Oranye, Oranye, Putih-Hijau, Biru, Putih-Biru, Hijau, Putih-Coklat, Coklat).',
      code: `[TEST] Port 01 -> 24 | Standard: EIA/TIA-568B
Pin 1-8 Continuity : PASS (1,2,3,4,5,6,7,8)
Cross-talk Check   : PASS
Link Speed         : 1000Mbps Full-Duplex`
    },
    'net-scan': {
      badge: 'LAB-04 // AUTOMATION',
      title: 'NET-SCAN: Bash Ping Sweeper',
      desc: 'Skrip Bash sederhana untuk mendeteksi perangkat aktif di segmen jaringan lab tanpa install tools berat.',
      code: `#!/usr/bin/env bash
SUBNET="192.168.10"
for ip in {1..20}; do
  ping -c 1 -W 1 "$SUBNET.$ip" >/dev/null && echo "[UP] $SUBNET.$ip"
done`
    }
  };

  const modal = document.getElementById('projectModal');
  const modalClose = document.getElementById('modalClose');
  const modalBadge = document.getElementById('modalBadge');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalCode = document.getElementById('modalCode');

  document.querySelectorAll('.btn-log').forEach((btn) => {
    btn.addEventListener('click', () => {
      const data = PROJECT_LOGS[btn.dataset.project];
      if (!data || !modal) return;
      modalBadge.textContent = data.badge;
      modalTitle.textContent = data.title;
      modalDesc.textContent = data.desc;
      modalCode.textContent = data.code;
      modal.hidden = false;
    });
  });

  if (modalClose && modal) {
    modalClose.addEventListener('click', () => {
      modal.hidden = true;
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.hidden = true;
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.hidden) modal.hidden = true;
    });
  }

  // 5. Interactive TKJ Punk Terminal
  const termOutput = document.getElementById('terminalOutput');
  const termForm = document.getElementById('terminalForm');
  const termInput = document.getElementById('terminalInput');
  const termClearBtn = document.getElementById('termClearBtn');

  function appendTermLine(text, className = '') {
    if (!termOutput) return;
    const p = document.createElement('p');
    p.className = `term-line ${className}`.trim();
    p.textContent = text;
    termOutput.appendChild(p);
    termOutput.scrollTop = termOutput.scrollHeight;
  }

  function bootTerminal() {
    if (!termOutput) return;
    termOutput.innerHTML = '';
    appendTermLine('==================================================', 'term-cyan');
    appendTermLine('  TKJ-PUNK OS v2.6 // FATHANADJI ARYA LANGIT', 'term-ok');
    appendTermLine('  SMK BANGUN NUSA BANGSA — TEKNIK KOMPUTER & JARINGAN', 'term-cyan');
    appendTermLine('==================================================', 'term-cyan');
    appendTermLine('Ketik "help" atau klik tombol perintah cepat di atas.');
  }

  function runTerminalCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    appendTermLine(`fathanadji@tkj:~$ ${rawCmd}`, 'term-cmd-echo');

    switch (cmd) {
      case 'help':
        appendTermLine('Daftar perintah tersedia:');
        appendTermLine('  whoami   -> Profil singkat Fathanadji Arya Langit');
        appendTermLine('  sekolah  -> Info SMK Bangun Nusa Bangsa & Jurusan TKJ');
        appendTermLine('  skill    -> Daftar keahlian lab jaringan & sistem');
        appendTermLine('  proyek   -> Ringkasan eksperimen lab TKJ');
        appendTermLine('  ping     -> Uji koneksi ke gateway 192.168.10.1');
        appendTermLine('  riot     -> Toggle mode tema Acid Riot / Zine Dark');
        appendTermLine('  clear    -> Bersihkan layar terminal');
        break;
      case 'whoami':
        appendTermLine('Nama   : Fathanadji Arya Langit', 'term-ok');
        appendTermLine('Role   : Pelajar TKJ & DIY Punk Tech Enthusiast');
        appendTermLine('Moto   : "No Rules, Only Clean Packets."');
        break;
      case 'sekolah':
        appendTermLine('Sekolah : SMK BANGUN NUSA BANGSA', 'term-ok');
        appendTermLine('Jurusan : Teknik Komputer & Jaringan (TKJ)');
        appendTermLine('Fokus   : Routing, Server Linux, Cabling & Hardware');
        break;
      case 'skill':
        appendTermLine('[OK] MikroTik RouterOS (NAT, Hotspot, Queue)');
        appendTermLine('[OK] Linux Debian/Ubuntu (BIND9, Nginx, SSH)');
        appendTermLine('[OK] Crimping UTP Cat6 T568B & Patch Panel');
        appendTermLine('[OK] Rakit PC, BIOS/UEFI, Wireshark & Nmap');
        break;
      case 'proyek':
        appendTermLine('1. RTR-RIOT      — Hotspot & Bandwidth Limiter');
        appendTermLine('2. DEBIAN-ZINE   — Intranet DNS & Web Server');
        appendTermLine('3. CAT6-ANARCHY  — Rack Re-Wiring & LAN Test');
        appendTermLine('4. NET-SCAN      — Bash Ping Sweeper');
        break;
      case 'ping':
        appendTermLine('PING 192.168.10.1 (192.168.10.1) 56(84) bytes of data.', 'term-cyan');
        appendTermLine('64 bytes from 192.168.10.1: icmp_seq=1 ttl=64 time=0.42 ms', 'term-ok');
        appendTermLine('64 bytes from 192.168.10.1: icmp_seq=2 ttl=64 time=0.38 ms', 'term-ok');
        appendTermLine('64 bytes from 192.168.10.1: icmp_seq=3 ttl=64 time=0.40 ms', 'term-ok');
        appendTermLine('--- 192.168.10.1 ping statistics: 0% packet loss ---');
        break;
      case 'riot':
        if (riotToggle) riotToggle.click();
        appendTermLine('Tema visual berhasil diganti!', 'term-ok');
        break;
      case 'clear':
        bootTerminal();
        break;
      default:
        appendTermLine(`bash: ${cmd}: perintah tidak dikenal. Ketik "help".`, 'term-err');
        break;
    }
  }

  bootTerminal();

  if (termForm && termInput) {
    termForm.addEventListener('submit', (e) => {
      e.preventDefault();
      runTerminalCommand(termInput.value);
      termInput.value = '';
    });
  }

  document.querySelectorAll('.cmd-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      runTerminalCommand(chip.dataset.cmd || '');
    });
  });

  if (termClearBtn) {
    termClearBtn.addEventListener('click', bootTerminal);
  }

  // 6. Tembok Zine (Local Guestbook)
  const STORAGE_KEY = 'fathanadji_punk_wall_v1';
  const DEFAULT_NOTES = [
    {
      name: 'Admin Lab TKJ',
      tag: 'TKJ-BNB',
      msg: 'Crimpingan T568B lu rapi banget bro, gas terus ngoprek MikroTik!'
    },
    {
      name: 'RiotPacket_99',
      tag: 'PUNK-NET',
      msg: 'Salam dari sesama anak Debian CLI. Keep DIY alive!'
    }
  ];

  const wallForm = document.getElementById('wallForm');
  const wallName = document.getElementById('wallName');
  const wallTag = document.getElementById('wallTag');
  const wallMsg = document.getElementById('wallMsg');
  const wallNotes = document.getElementById('wallNotes');

  function loadWallNotes() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore storage access issues
    }
    return DEFAULT_NOTES;
  }

  function saveWallNotes(notes) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes.slice(0, 8)));
    } catch {
      // ignore storage access issues
    }
  }

  function renderWallNotes() {
    if (!wallNotes) return;
    const notes = loadWallNotes();
    wallNotes.innerHTML = '';

    notes.forEach((item) => {
      const card = document.createElement('article');
      card.className = 'wall-note';

      const head = document.createElement('div');
      head.className = 'wall-note-head';

      const author = document.createElement('span');
      author.textContent = item.name;

      const tag = document.createElement('span');
      tag.className = 'wall-note-tag';
      tag.textContent = item.tag || 'ZINE';

      head.appendChild(author);
      head.appendChild(tag);

      const body = document.createElement('p');
      body.textContent = item.msg;

      card.appendChild(head);
      card.appendChild(body);
      wallNotes.appendChild(card);
    });
  }

  renderWallNotes();

  if (wallForm) {
    wallForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = (wallName?.value || '').trim();
      const tag = (wallTag?.value || '').trim() || 'TKJ-ZINE';
      const msg = (wallMsg?.value || '').trim();
      if (!name || !msg) return;

      const current = loadWallNotes();
      current.unshift({ name, tag, msg });
      saveWallNotes(current);
      renderWallNotes();
      wallForm.reset();
      showToast('Stiker berhasil ditempel ke Tembok Zine!');
    });
  }

  // 7. Copy to Clipboard & Toast
  const toastEl = document.getElementById('toast');
  let toastTimer;

  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 2400);
  }

  document.querySelectorAll('.copy-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const val = btn.dataset.copy || '';
      try {
        await navigator.clipboard.writeText(val);
        showToast(`Disalin: ${val}`);
      } catch {
        showToast(`Info: ${val}`);
      }
    });
  });
})();
