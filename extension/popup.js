// ─────────────────────────────────────────────
//  LovPilot — Popup / Side Panel Logic
// ─────────────────────────────────────────────

const body        = document.getElementById('main-body');
const btnLogout   = document.getElementById('btn-logout');
const btnTheme    = document.getElementById('btn-theme');
const iconMoon    = document.getElementById('icon-moon');
const iconSun     = document.getElementById('icon-sun');

// ── Theme ─────────────────────────────────────

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  iconMoon.style.display = theme === 'dark'  ? 'block' : 'none';
  iconSun.style.display  = theme === 'light' ? 'block' : 'none';
}

chrome.storage.local.get('lp_theme', data => {
  applyTheme(data.lp_theme || 'dark');
});

btnTheme.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  chrome.storage.local.set({ lp_theme: next });
});

// ── Render helpers ────────────────────────────

function renderLoading() {
  body.innerHTML = `
    <div class="loading-state">
      <div class="spinner"></div>
      <span>Verificando licença...</span>
    </div>`;
}

function renderError(msg) {
  body.innerHTML = `
    <div class="error-state">
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <p>${msg}</p>
    </div>`;
}

function renderLogin() {
  btnLogout.style.display = 'none';
  body.innerHTML = `
    <div class="login-view">
      <div class="login-icon">
        <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      </div>
      <h2 class="login-title">Ativar LovPilot</h2>
      <p class="login-sub">Insira sua chave de licença para continuar</p>
      <div class="input-group">
        <input id="license-input" type="text" placeholder="LP-XXXX-XXXX-XXXX" autocomplete="off" spellcheck="false">
      </div>
      <button id="btn-activate" class="btn-primary">
        <span id="btn-activate-text">Ativar</span>
      </button>
      <p id="login-error" class="form-error" style="display:none"></p>
    </div>`;

  const input   = document.getElementById('license-input');
  const btn     = document.getElementById('btn-activate');
  const btnText = document.getElementById('btn-activate-text');
  const errEl   = document.getElementById('login-error');

  input.addEventListener('keydown', e => { if (e.key === 'Enter') btn.click(); });

  btn.addEventListener('click', async () => {
    const key = input.value.trim();
    if (!key) { showLoginError('Insira uma chave de licença.'); return; }

    btn.disabled = true;
    btnText.textContent = 'Verificando...';
    errEl.style.display = 'none';

    try {
      const result = await validateLicense(key);
      await saveLicense(result.license);
      renderMain(result.license);
    } catch (err) {
      showLoginError(err.message || 'Erro ao validar licença.');
      btn.disabled = false;
      btnText.textContent = 'Ativar';
    }
  });

  function showLoginError(msg) {
    errEl.textContent = msg;
    errEl.style.display = 'block';
  }
}

function renderMain(license) {
  btnLogout.style.display = 'block';

  const expiry = license.expiresAt
    ? new Date(license.expiresAt).toLocaleDateString('pt-BR')
    : 'Sem expiração';

  body.innerHTML = `
    <!-- Status connection -->
    <div class="status-card" id="status-card">
      <div class="status-dot" id="status-dot"></div>
      <span id="status-text">Aguardando Lovable...</span>
    </div>

    <!-- License info -->
    <div class="info-card">
      <div class="info-row">
        <span class="info-label">Licença</span>
        <span class="info-val mono">${maskKey(license.key)}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Expira</span>
        <span class="info-val">${expiry}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Dispositivos</span>
        <span class="info-val">Máx. ${license.maxDevices}</span>
      </div>
    </div>

    <!-- Session info -->
    <div class="section-label">Sessão Lovable</div>
    <div class="info-card" id="session-card">
      <div class="info-row">
        <span class="info-label">Token</span>
        <span class="info-val" id="val-token">—</span>
      </div>
      <div class="info-row">
        <span class="info-label">Projeto</span>
        <span class="info-val mono" id="val-project">—</span>
      </div>
      <div class="info-row">
        <span class="info-label">Workspace</span>
        <span class="info-val mono" id="val-workspace">—</span>
      </div>
      <div class="info-row">
        <span class="info-label">Castle</span>
        <span class="info-val" id="val-castle">—</span>
      </div>
    </div>

    <!-- Quick actions -->
    <div class="section-label">Ações</div>
    <div class="actions-grid">
      <button class="action-btn" id="btn-copy-token" title="Copiar token JWT">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        Copiar Token
      </button>
      <button class="action-btn" id="btn-refresh-token">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
        Atualizar Token
      </button>
      <button class="action-btn" id="btn-new-project">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Novo Projeto
      </button>
      <button class="action-btn" id="btn-open-lovable">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        Abrir Lovable
      </button>
    </div>

    <!-- Shield toggle -->
    <div class="section-label">Controles</div>
    <div class="toggle-row">
      <div>
        <div class="toggle-title">Escudo de Input</div>
        <div class="toggle-sub">Bloqueia o chat nativo do Lovable</div>
      </div>
      <label class="toggle-switch">
        <input type="checkbox" id="toggle-shield">
        <span class="toggle-track"></span>
      </label>
    </div>

    <!-- Toast -->
    <div id="toast" class="toast" style="display:none"></div>
  `;

  // ── Bind events ───────────────────────────

  btnLogout.onclick = async () => {
    await logout();
    renderLogin();
  };

  document.getElementById('btn-copy-token').onclick = async () => {
    const data = await getSession();
    if (data.lovable_token) {
      await navigator.clipboard.writeText(data.lovable_token);
      showToast('Token copiado!');
    } else {
      showToast('Token não disponível', true);
    }
  };

  document.getElementById('btn-refresh-token').onclick = async () => {
    const tabs = await chrome.tabs.query({ url: 'https://lovable.dev/*', active: true });
    if (tabs.length === 0) { showToast('Abra o Lovable.dev primeiro', true); return; }
    await chrome.tabs.sendMessage(tabs[0].id, { action: 'refreshToken' }).catch(() => {});
    showToast('Solicitando token...');
    setTimeout(refreshSessionDisplay, 1500);
  };

  document.getElementById('btn-new-project').onclick = () => showNewProjectDialog();

  document.getElementById('btn-open-lovable').onclick = () => {
    chrome.tabs.create({ url: 'https://lovable.dev' });
  };

  // Shield toggle
  chrome.storage.local.get('lp_shield_active', data => {
    document.getElementById('toggle-shield').checked = !!data.lp_shield_active;
  });

  document.getElementById('toggle-shield').onchange = async function () {
    const active = this.checked;
    await chrome.storage.local.set({ lp_shield_active: active });
    const tabs = await chrome.tabs.query({ url: 'https://lovable.dev/*' });
    for (const tab of tabs) {
      chrome.tabs.sendMessage(tab.id, { action: 'toggleShield', active }).catch(() => {});
    }
    showToast(active ? 'Escudo ativado' : 'Escudo desativado');
  };

  refreshSessionDisplay();
  setInterval(refreshSessionDisplay, 5000);
}

// ── Session display ───────────────────────────

async function getSession() {
  return new Promise(resolve => {
    chrome.runtime.sendMessage({ action: 'getSession' }, data => resolve(data || {}));
  });
}

async function refreshSessionDisplay() {
  const data = await getSession();

  const statusDot  = document.getElementById('status-dot');
  const statusText = document.getElementById('status-text');
  const valToken   = document.getElementById('val-token');
  const valProject = document.getElementById('val-project');
  const valWs      = document.getElementById('val-workspace');
  const valCastle  = document.getElementById('val-castle');

  if (!statusDot) return;

  const connected = !!data.lovable_token;
  statusDot.className  = `status-dot ${connected ? 'connected' : ''}`;
  statusText.textContent = connected ? 'Conectado ao Lovable' : 'Aguardando Lovable...';

  valToken.textContent   = data.lovable_token   ? `...${data.lovable_token.slice(-12)}`  : '—';
  valProject.textContent = data.lovable_projectId   ? shortId(data.lovable_projectId)   : '—';
  valWs.textContent      = data.lovable_workspaceId ? shortId(data.lovable_workspaceId) : '—';
  valCastle.textContent  = data.lovable_castleToken ? 'Disponível' : '—';
}

// ── New project dialog ────────────────────────

function showNewProjectDialog() {
  const existing = document.getElementById('new-project-modal');
  if (existing) { existing.remove(); return; }

  const modal = document.createElement('div');
  modal.id = 'new-project-modal';
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-title">Criar Novo Projeto</div>
      <input id="project-name-input" type="text" placeholder="Nome do projeto" class="modal-input">
      <p id="modal-error" class="form-error" style="display:none"></p>
      <div class="modal-actions">
        <button class="btn-secondary" id="modal-cancel">Cancelar</button>
        <button class="btn-primary" id="modal-confirm">Criar</button>
      </div>
    </div>`;

  document.body.appendChild(modal);

  document.getElementById('modal-cancel').onclick = () => modal.remove();

  document.getElementById('modal-confirm').onclick = async () => {
    const name = document.getElementById('project-name-input').value.trim();
    if (!name) {
      document.getElementById('modal-error').textContent = 'Insira um nome para o projeto.';
      document.getElementById('modal-error').style.display = 'block';
      return;
    }

    const session = await getSession();
    if (!session.lovable_token) {
      document.getElementById('modal-error').textContent = 'Token não disponível. Abra o Lovable.dev primeiro.';
      document.getElementById('modal-error').style.display = 'block';
      return;
    }

    const tabs = await chrome.tabs.query({ url: 'https://lovable.dev/*' });
    if (tabs.length === 0) {
      document.getElementById('modal-error').textContent = 'Abra o Lovable.dev em uma aba primeiro.';
      document.getElementById('modal-error').style.display = 'block';
      return;
    }

    const reqId = `req_${Date.now()}`;
    modal.remove();
    showToast('Criando projeto...');

    await chrome.tabs.sendMessage(tabs[0].id, {
      action: 'createProjectNatively',
      reqId,
      projectName: name,
      token: session.lovable_token,
      workspaceId: session.lovable_workspaceId || null,
    }).catch(() => {});
  };

  // Listen for create response
  const handler = (msg) => {
    if (msg.action === 'lovableCreateProjectResponse') {
      chrome.runtime.onMessage.removeListener(handler);
      if (msg.ok) {
        showToast('Projeto criado com sucesso!');
      } else {
        showToast(msg.error || 'Erro ao criar projeto', true);
      }
    }
  };
  chrome.runtime.onMessage.addListener(handler);
  setTimeout(() => chrome.runtime.onMessage.removeListener(handler), 30000);
}

// ── Toast notification ────────────────────────

let toastTimer = null;

function showToast(msg, isError = false) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.className   = `toast ${isError ? 'toast-error' : 'toast-success'} visible`;
  toast.style.display = 'block';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => { toast.style.display = 'none'; }, 300);
  }, 2500);
}

// ── Utilities ─────────────────────────────────

function maskKey(key) {
  if (!key) return '—';
  const parts = key.split('-');
  return parts.map((p, i) => i > 0 && i < parts.length - 1 ? '****' : p).join('-');
}

function shortId(id) {
  if (!id) return '—';
  return id.substring(0, 8) + '...';
}

// ── Init ──────────────────────────────────────

async function init() {
  renderLoading();
  try {
    const stored = await getStoredLicense();
    if (!stored) { renderLogin(); return; }

    // Re-validate on open (heartbeat to Supabase)
    try {
      await validateLicense(stored.key);
      renderMain(stored);
    } catch (err) {
      await removeLicense();
      renderLogin();
    }
  } catch (err) {
    renderError('Erro ao iniciar: ' + (err.message || String(err)));
  }
}

init();
