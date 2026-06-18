// ─────────────────────────────────────────────
//  LovPilot — Content Script (lovable.dev)
// ─────────────────────────────────────────────

console.log('[LovPilot] Content script loaded');

// ── Inject pageHook into page context ────────

(function injectHook() {
  try {
    if (typeof chrome === 'undefined' || !chrome.runtime?.id) return;
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('pageHook.js');
    script.onload = () => script.remove();
    (document.head || document.documentElement || document.body).appendChild(script);
    console.log('[LovPilot] pageHook.js injected');
  } catch (err) {
    console.warn('[LovPilot] Failed to inject pageHook:', err);
  }
})();

// ── Shield overlay ────────────────────────────

let shieldActive = false;

function injectShield() {
  if (document.getElementById('lp-shield')) return;

  const container = document.querySelector('form#chat-input');
  if (!container) { setTimeout(injectShield, 1000); return; }

  const parent = container.parentElement || container;
  if (getComputedStyle(parent).position === 'static') {
    parent.style.position = 'relative';
  }

  const overlay = document.createElement('div');
  overlay.id = 'lp-shield';
  overlay.style.cssText = [
    'position:absolute', 'inset:0', 'z-index:9999',
    'background:rgba(10,3,24,0.75)', 'backdrop-filter:blur(10px)',
    'display:flex', 'align-items:center', 'justify-content:center',
    'border-radius:18px', 'border:2px solid rgba(99,102,241,0.4)',
    'cursor:not-allowed', 'pointer-events:all',
    'box-shadow:inset 0 0 30px rgba(99,102,241,0.1)',
  ].join(';');
  overlay.innerHTML = `
    <div style="text-align:center;display:flex;flex-direction:column;align-items:center;gap:8px">
      <div style="width:52px;height:52px;background:rgba(99,102,241,0.15);border:1px solid rgba(99,102,241,0.3);border-radius:50%;display:flex;align-items:center;justify-content:center;filter:drop-shadow(0 0 12px rgba(99,102,241,0.3))">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#6366f1" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      </div>
      <div style="color:#fff;font-size:15px;font-weight:900;letter-spacing:1px;text-transform:uppercase;text-shadow:0 0 10px rgba(99,102,241,0.4)">ESCUDO ATIVO</div>
      <div style="color:#a0a0c8;font-size:12px;font-weight:600">Use o LovPilot para enviar prompts</div>
    </div>`;

  overlay.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); }, true);

  container.style.position = 'relative';
  container.appendChild(overlay);

  // Disable all interactive elements inside the container
  container.querySelectorAll('input, button, textarea, [contenteditable]').forEach(el => {
    if (el.id === 'lp-shield') return;
    el.dataset.lpDisabled   = el.disabled || '';
    el.dataset.lpTabindex   = el.getAttribute('tabindex') || '';
    el.setAttribute('tabindex', '-1');
    if (el.tagName !== 'DIV') el.disabled = true;
    if (el.contentEditable === 'true') {
      el.contentEditable = 'false';
      el.dataset.lpEditable = 'true';
    }
  });
}

function removeShield() {
  const overlay = document.getElementById('lp-shield');
  if (overlay) overlay.remove();

  const container = document.querySelector('form#chat-input');
  if (!container) return;

  container.querySelectorAll('[data-lp-disabled]').forEach(el => {
    const wasDisabled = el.dataset.lpDisabled;
    el.disabled = wasDisabled === 'true';
    delete el.dataset.lpDisabled;

    const tabindex = el.dataset.lpTabindex;
    if (tabindex) el.setAttribute('tabindex', tabindex);
    else el.removeAttribute('tabindex');
    delete el.dataset.lpTabindex;

    if (el.dataset.lpEditable === 'true') {
      el.contentEditable = 'true';
      delete el.dataset.lpEditable;
    }
  });
}

// ── React to shield storage changes ──────────

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.lp_shield_active) {
    const val = changes.lp_shield_active.newValue;
    if (val) { shieldActive = true;  injectShield(); }
    else      { shieldActive = false; removeShield(); }
  }
});

chrome.storage.local.get(['lp_shield_active'], data => {
  if (data.lp_shield_active) { shieldActive = true; injectShield(); }
});

// ── Listen for messages from background/popup ─

chrome.runtime.onMessage.addListener((msg, _sender, respond) => {
  if (msg.type === 'ping') {
    respond({ type: 'pong' });
    return false;
  }

  if (msg.action === 'toggleShield') {
    if (msg.active) { shieldActive = true;  injectShield(); }
    else            { shieldActive = false; removeShield(); }
    respond({ ok: true });
    return false;
  }

  if (msg.action === 'refreshToken' || msg.action === 'getToken') {
    window.postMessage({ type: 'lovableRequestToken' }, '*');
    chrome.storage.local.get(['lovable_token'], data => {
      respond({ token: data.lovable_token || null });
    });
    return true;
  }

  if (msg.action === 'createProjectNatively') {
    window.postMessage({
      type: 'lovableCreateProject',
      reqId: msg.reqId,
      projectName: msg.projectName,
      token: msg.token,
      workspaceId: msg.workspaceId,
    }, '*');
    respond({ ok: true });
    return false;
  }

  if (msg.type === 'tokenFound' && msg.token) {
    chrome.storage.local.set({ lovable_token: msg.token });
    respond({ ok: true });
    return false;
  }

  respond({ ok: true });
  return false;
});

// ── Handle messages from pageHook.js ─────────

window.addEventListener('message', event => {
  if (event.source !== window || !event.data) return;

  if (event.data.type === 'lovableTokenFound') {
    const { token, projectId, workspaceId, castleToken, castleTokenAt, browserSessionId, clientGitSha } = event.data;
    chrome.runtime.sendMessage({
      action:          'lovableSync',
      token,
      projectId,
      workspaceId,
      castleToken,
      castleTokenAt,
      browserSessionId,
      clientGitSha,
    }).catch(() => {});
    return;
  }

  if (event.data.type === 'lovableCreateProjectResponse') {
    chrome.runtime.sendMessage({
      action: 'lovableCreateProjectSync',
      reqId:  event.data.reqId,
      ok:     event.data.ok,
      status: event.data.status,
      data:   event.data.data,
      error:  event.data.error,
    }).catch(() => {});
    return;
  }
});
