/* ══════════════════════════════════
   UNBLOCKPLAY — MAIN SCRIPT (Velara Style)
   ══════════════════════════════════ */

// ── Sidebar ─────────────────────────────────────────────
(function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggle = document.getElementById('sidebarToggle');
    const icon = document.getElementById('toggleIcon');

    toggle.addEventListener('click', () => {
        const expanded = sidebar.classList.toggle('expanded');
        // Flip chevron
        icon.setAttribute('points', expanded ? '9 18 15 12 9 6' : '15 18 9 12 15 6');
    });
})();

// ── Navigation ──────────────────────────────────────────
function showView(id) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.sidebar-btn[data-view]').forEach(b => b.classList.remove('active'));

    document.getElementById(id).classList.add('active');
    const btn = document.querySelector(`.sidebar-btn[data-view="${id.replace('view', '').toLowerCase()}"]`);
    if (btn) btn.classList.add('active');
}

(function initNav() {
    document.querySelectorAll('.sidebar-btn[data-view]').forEach(btn => {
        btn.addEventListener('click', () => {
            const view = 'view' + btn.dataset.view.charAt(0).toUpperCase() + btn.dataset.view.slice(1);
            showView(view);
            if (btn.dataset.view === 'games') loadGames();
        });
    });
    // Home shortcut to games
    const gs = document.getElementById('gamesShortcut');
    if (gs) {
        gs.addEventListener('click', () => {
            showView('viewGames');
            loadGames();
        });
    }
})();

// ── Clock & Tagline ──────────────────────────────────────
const TAGLINES = [
    "ggs bro",
    "100% organic pixels",
    "now with 20% more gaming",
    "better than school",
    "the original diddy",
    "since 2026",
    "don't tell the teacher",
    "hfdg",
    "i was here",
    "zero calorie gaming",
    "made with love and code",
    "unbothered"
];

(function initClockAndTagline() {
    const clockEl = document.getElementById('statusClock');
    const taglineEl = document.getElementById('homeTagline');

    function tick() {
        const now = new Date();
        if (clockEl) clockEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    tick();
    setInterval(tick, 1000);

    // Set daily tagline
    if (taglineEl) {
        const dateStr = new Date().toDateString();
        // Simple hash to pick index
        let hash = 0;
        for (let i = 0; i < dateStr.length; i++) {
            hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
            hash |= 0;
        }
        const index = Math.abs(hash) % TAGLINES.length;
        taglineEl.textContent = TAGLINES[index];
    }
})();

// ── Settings & Cloaking ──────────────────────────────────
function setCloak(title, iconUrl) {
    if (title) document.title = title;

    let link = document.querySelector("link[rel*='icon']");
    if (!link) {
        link = document.createElement('link');
        link.rel = 'shortcut icon';
        document.getElementsByTagName('head')[0].appendChild(link);
    }
    if (iconUrl) link.href = iconUrl;

    // Save
    localStorage.setItem('cloakTitle', title || '');
    localStorage.setItem('cloakIcon', iconUrl || '');
}

(function initSettings() {
    const titleInput = document.getElementById('cloakTitleInput');
    const iconInput = document.getElementById('cloakIconInput');
    const resetBtn = document.getElementById('resetCloak');

    // Load saved
    const savedTitle = localStorage.getItem('cloakTitle');
    const savedIcon = localStorage.getItem('cloakIcon');

    if (savedTitle || savedIcon) {
        setCloak(savedTitle, savedIcon);
        if (titleInput) titleInput.value = savedTitle || '';
        if (iconInput) iconInput.value = savedIcon || '';
    }

    // Listeners
    if (titleInput) titleInput.addEventListener('input', () => setCloak(titleInput.value, iconInput.value));
    if (iconInput) iconInput.addEventListener('input', () => setCloak(titleInput.value, iconInput.value));

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            localStorage.removeItem('cloakTitle');
            localStorage.removeItem('cloakIcon');
            window.location.reload();
        });
    }

    // Presets
    document.querySelectorAll('.cloak-preset-btn[data-title]').forEach(btn => {
        btn.addEventListener('click', () => {
            const t = btn.dataset.title;
            const i = btn.dataset.icon;
            setCloak(t, i);
            if (titleInput) titleInput.value = t;
            if (iconInput) iconInput.value = i;
        });
    });

    const abBtn = document.getElementById('aboutBlankBtn');
    if (abBtn) {
        abBtn.addEventListener('click', () => {
            const win = window.open();
            if (!win) {
                alert("Please allow popups for this feature to work.");
                return;
            }
            const doc = win.document;
            const iframe = doc.createElement('iframe');
            const style = iframe.style;

            doc.title = document.title;
            style.position = 'fixed';
            style.top = style.bottom = style.left = style.right = 0;
            style.border = style.outline = 'none';
            style.width = style.height = '100%';

            iframe.src = window.location.href;
            doc.body.appendChild(iframe);

            // Optional: Close original
            window.location.replace("https://google.com");
        });
    }
})();

// ── Search & Filter ────────────────────────────────────
(function initGameSearch() {
    const input = document.getElementById('gamesSearchInput');
    const tabs = document.querySelectorAll('.filter-tab');

    if (input) {
        input.addEventListener('input', e => {
            const activeTab = document.querySelector('.filter-tab.active');
            const filter = activeTab ? activeTab.dataset.filter : 'all';
            loadGames(filter, e.target.value);
        });
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            loadGames(tab.dataset.filter, input ? input.value : '');
        });
    });
})();

// ── Boot ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // Note: initSidebar, initNav, initClock, initGameSearch, 
    // initOverlay, and fixLayout are all IIFEs and run automatically.

    // Games shortcut in sidebar
    const navGames = document.getElementById('navGames');
    if (navGames) navGames.addEventListener('click', () => loadGames());

    const gamesShortcut = document.getElementById('gamesShortcut');
    if (gamesShortcut) gamesShortcut.addEventListener('click', () => loadGames());

    loadGames();
});

// ── Games Logic ──────────────────────────────────────────
function loadGames(filter = 'all', searchQuery = '') {
    const grid = document.getElementById('gamesGrid');
    if (!grid) return;
    grid.innerHTML = '';

    let filtered = GAMES;
    if (filter !== 'all') filtered = GAMES.filter(g => g.tags.includes(filter));
    if (searchQuery) filtered = filtered.filter(g => g.title.toLowerCase().includes(searchQuery.toLowerCase()));

    const noRes = document.getElementById('noResults');
    if (filtered.length === 0) {
        if (noRes) noRes.style.display = 'block';
        return;
    }
    if (noRes) noRes.style.display = 'none';

    filtered.forEach((game, i) => {
        const div = document.createElement('div');
        div.className = 'game-card';
        div.style.animationDelay = `${i * 0.05}s`; // Add animation delay for smooth appearance
        div.innerHTML = `
            <div class="game-card-thumb">
                <div class="thumb-bg" style="background:${game.gradient}">${game.emoji}</div>
                ${game.thumb ? `<img src="${game.thumb}" alt="${game.title}" loading="lazy" onerror="this.remove()">` : ''}
                <div class="play-overlay"><div class="play-circle"><svg viewBox="0 0 24 24" width="24" height="24"><path d="M8 5v14l11-7z"/></svg></div></div>
            </div>
            <div class="game-card-body">
                <div class="game-card-name">${game.title}</div>
                <div class="game-card-desc">${game.description}</div>
            </div>
        `;
        div.addEventListener('click', () => openGame(game));
        grid.appendChild(div);
    });
}

function openGame(game) {
    const overlay = document.getElementById('gameOverlay');
    const frame = document.getElementById('gameFrame');
    const title = document.getElementById('overlayTitle'); // Keep existing ID for title
    const controls = document.getElementById('gameControls'); // Assuming this element exists for controls

    // Smooth opening sequence
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling behind overlay

    setTimeout(() => {
        if (title) title.textContent = game.title;
        if (controls) controls.innerHTML = game.controls || ''; // Populate controls if available
        frame.src = game.folder;
        frame.setAttribute('allowfullscreen', '');
        frame.setAttribute('allow', 'autoplay; fullscreen');
    }, 300); // Delay for overlay transition
}

function closeGame() {
    const overlay = document.getElementById('gameOverlay');
    const frame = document.getElementById('gameFrame');

    overlay.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling

    setTimeout(() => {
        frame.src = ''; // Clear iframe source
        // Optionally clear title/controls if they are dynamic
        const title = document.getElementById('overlayTitle');
        if (title) title.textContent = '';
        const controls = document.getElementById('gameControls');
        if (controls) controls.innerHTML = '';
    }, 400); // Delay for overlay transition
}

// ── Overlay Controls ────────────────────────────────────
(function initOverlay() {
    const closeBtn = document.getElementById('overlayClose'); // Keep existing ID
    const fullscreenBtn = document.getElementById('overlayFullscreen'); // Keep existing ID

    if (closeBtn) closeBtn.addEventListener('click', closeGame);

    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', () => {
            const frame = document.getElementById('gameFrame');
            if (frame) { // Ensure frame exists
                if (frame.requestFullscreen) frame.requestFullscreen();
                else if (frame.webkitRequestFullscreen) frame.webkitRequestFullscreen();
                else if (frame.msRequestFullscreen) frame.msRequestFullscreen();
            }
        });
    }

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && document.getElementById('gameOverlay').classList.contains('active')) {
            const closeBtn = document.getElementById('overlayClose');
            if (closeBtn) closeBtn.click();
        }
    });
})();

// Fix layout: wrap main+sidebar
(function fixLayout() {
    const sidebar = document.getElementById('sidebar');
    const main = document.getElementById('main');
    const body = document.body;
    const statusbar = document.querySelector('.statusbar');

    if (!sidebar || !main) return;
    // Body already flex-column; wrap sidebar+main in a div
    const wrap = document.createElement('div');
    wrap.className = 'main-wrap';
    body.insertBefore(wrap, main);
    wrap.appendChild(sidebar);
    wrap.appendChild(main);
    if (statusbar) body.appendChild(statusbar);
})();
