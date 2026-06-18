// ─────────────────────────────────────────────
//  LovPilot — pageHook.js
//  Injected into the page's main world to intercept
//  fetch / XHR and extract the Lovable auth token.
// ─────────────────────────────────────────────

(function () {
  console.log('[LovPilotHook] Injected and running');

  let token        = null;
  let projectId    = null;
  let workspaceId  = null;
  let castleToken  = null;
  let castleTokenAt = 0;
  let browserSessionId = null;
  let clientGitSha = null;

  // ── URL helpers ───────────────────────────

  function extractProjectId(url) {
    try {
      const m = String(url).match(/\/projects\/([0-9a-fA-F-]{36})/i);
      return m ? m[1] : null;
    } catch { return null; }
  }

  function extractWorkspaceId(url) {
    try {
      const m = String(url).match(/\/workspaces\/([0-9a-fA-F-]{36})/i);
      return m ? m[1] : null;
    } catch { return null; }
  }

  function getHeaderValue(headers, name) {
    try {
      const lower = name.toLowerCase();
      if (!headers) return null;
      if (headers instanceof Headers) return headers.get(name) || headers.get(lower) || null;
      if (Array.isArray(headers)) {
        const found = headers.find(h => {
          const k = Array.isArray(h) ? h[0] : (h?.name || h?.key || '');
          return String(k).toLowerCase() === lower;
        });
        return found ? (Array.isArray(found) ? found[1] : found.value) : null;
      }
      if (typeof headers === 'object') {
        for (const k of Object.keys(headers)) {
          if (k.toLowerCase() === lower) return headers[k];
        }
      }
    } catch {}
    return null;
  }

  // ── Sync state to content script ─────────

  function syncState(newToken, newProjectId, newWorkspaceId, force = false) {
    let changed = false;

    if (newToken && typeof newToken === 'string') {
      const bare = newToken.replace(/^Bearer\s+/i, '').trim();
      if (bare && bare !== token) { token = bare; changed = true; }
    }
    if (newProjectId && newProjectId !== projectId)   { projectId   = newProjectId;  changed = true; }
    if (newWorkspaceId && newWorkspaceId !== workspaceId) { workspaceId = newWorkspaceId; changed = true; }

    if (!changed && !force) return;

    console.log('[LovPilotHook] Sync:', {
      token:       token        ? 'YES' : 'NO',
      projectId:   projectId   || 'NO',
      workspaceId: workspaceId || 'NO',
      castleToken: castleToken ? 'YES' : 'NO',
    });

    window.postMessage({
      type: 'lovableTokenFound',
      token,
      projectId,
      workspaceId,
      castleToken,
      castleTokenAt,
      browserSessionId,
      clientGitSha,
    }, '*');
  }

  // ── Extract from localStorage ─────────────

  function getTokenFromStorage() {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (!k) continue;
        if (k.includes('auth-token') || k.includes('sb-') || k.includes('supabase')) {
          try {
            const parsed = JSON.parse(localStorage.getItem(k));
            if (parsed?.access_token)                  return parsed.access_token;
            if (parsed?.currentSession?.access_token)  return parsed.currentSession.access_token;
            if (parsed?.session?.access_token)         return parsed.session.access_token;
            if (Array.isArray(parsed)) {
              for (const item of parsed) {
                if (item?.access_token) return item.access_token;
              }
            }
          } catch {}
        }
      }
    } catch {}
    return null;
  }

  // ── Castle token extraction ───────────────

  function extractCastleFromBody(body) {
    try {
      if (!body) return;
      let str = null;
      if (typeof body === 'string') str = body;
      else if (typeof body === 'object' && !(body instanceof FormData) && !ArrayBuffer.isView(body)) {
        try { str = JSON.stringify(body); } catch { return; }
      }
      if (!str || !str.includes('castle_request_token')) return;
      const m = str.match(/"castle_request_token"\s*:\s*"([^"]+)"/);
      if (m && m[1] && m[1] !== castleToken) {
        castleToken  = m[1];
        castleTokenAt = Date.now();
        console.log('[LovPilotHook] Castle token captured');
        syncState(null, null, null, true);
      }
    } catch {}
  }

  async function refreshCastleToken() {
    try {
      const sdk = window.__cstl || window.__castle || window._castle
        || (typeof _castle !== 'undefined' ? _castle : null);
      if (!sdk) return;
      let t = null;
      if (typeof sdk === 'function')          t = await sdk('createRequestToken');
      else if (typeof sdk.createRequestToken === 'function') t = await sdk.createRequestToken();
      if (t && t !== castleToken) {
        castleToken  = t;
        castleTokenAt = Date.now();
        console.log('[LovPilotHook] Castle token refreshed');
        syncState(null, null, null, true);
      }
    } catch (err) {
      console.warn('[LovPilotHook] Castle refresh error:', err);
    }
  }

  // ── Intercept window.fetch ────────────────

  (function wrapFetch() {
    try {
      const origFetch = window.fetch;
      window.fetch = async function (...args) {
        try {
          const urlStr = typeof args[0] === 'string' ? args[0] : args[0]?.url || '';
          const opts   = args[1] || {};

          // Extract body for castle token
          try {
            if (args[0] instanceof Request) {
              args[0].clone().text().then(extractCastleFromBody).catch(() => {});
            } else if (opts.body) {
              extractCastleFromBody(opts.body);
            }
          } catch {}

          // Extract auth token from headers
          let authHeader = null;
          if (args[0] instanceof Request) {
            authHeader = getHeaderValue(args[0].headers, 'Authorization');
          }
          if (!authHeader && opts.headers) {
            authHeader = opts.headers instanceof Headers
              ? getHeaderValue(opts.headers, 'Authorization')
              : opts.headers?.Authorization || opts.headers?.authorization || null;
          }

          // Extract session tracking headers
          const bsid    = getHeaderValue(opts.headers || (args[0] instanceof Request ? args[0].headers : null), 'x-browser-session');
          const gitSha  = getHeaderValue(opts.headers || (args[0] instanceof Request ? args[0].headers : null), 'x-client-git-sha');
          let changed = false;
          if (bsid  && bsid  !== browserSessionId) { browserSessionId = bsid;   changed = true; }
          if (gitSha && gitSha !== clientGitSha)   { clientGitSha     = gitSha; changed = true; }

          const pid = extractProjectId(urlStr);
          const wid = extractWorkspaceId(urlStr);

          if (authHeader?.toLowerCase().startsWith('bearer ')) {
            syncState(authHeader.substring(7), pid, wid, changed);
          } else if (pid || wid || changed) {
            syncState(null, pid, wid, changed);
          }
        } catch {}

        return origFetch.apply(this, args);
      };
    } catch (err) {
      console.warn('[LovPilotHook] fetch wrap error:', err);
    }
  })();

  // ── Intercept XMLHttpRequest ──────────────

  (function wrapXHR() {
    try {
      const origOpen = XMLHttpRequest.prototype.open;
      const origSetHeader = XMLHttpRequest.prototype.setRequestHeader;
      const origSend = XMLHttpRequest.prototype.send;

      XMLHttpRequest.prototype.open = function (method, url) {
        this._lp_url = url;
        return origOpen.apply(this, arguments);
      };

      XMLHttpRequest.prototype.setRequestHeader = function (name, value) {
        const lower = name.toLowerCase();
        if (lower === 'authorization' && value?.toLowerCase().startsWith('bearer ')) {
          syncState(value.substring(7), extractProjectId(this._lp_url), extractWorkspaceId(this._lp_url));
        }
        if (lower === 'x-browser-session' && value && value !== browserSessionId) {
          browserSessionId = value;
          syncState(null, extractProjectId(this._lp_url), extractWorkspaceId(this._lp_url), true);
        }
        if (lower === 'x-client-git-sha' && value && value !== clientGitSha) {
          clientGitSha = value;
          syncState(null, extractProjectId(this._lp_url), extractWorkspaceId(this._lp_url), true);
        }
        return origSetHeader.apply(this, arguments);
      };

      XMLHttpRequest.prototype.send = function (body) {
        try { extractCastleFromBody(body); } catch {}
        return origSend.apply(this, arguments);
      };
    } catch (err) {
      console.warn('[LovPilotHook] XHR wrap error:', err);
    }
  })();

  // ── Listen for messages from content.js ──

  window.addEventListener('message', event => {
    if (event.source !== window || !event.data) return;

    if (event.data.type === 'lovableRequestToken') {
      syncState(token, projectId || extractProjectId(location.href), workspaceId || extractWorkspaceId(location.href), true);
      return;
    }

    if (event.data.type === 'lovableCreateProject') {
      (async () => {
        const reqId = event.data.reqId;
        try {
          await refreshCastleToken();
          const authToken = event.data.token || token;
          if (!authToken) throw new Error('Auth token not available');

          let wid = event.data.workspaceId || workspaceId;
          const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
            Accept: 'application/json',
          };

          if (!wid) {
            const res  = await fetch('https://api.lovable.dev/v1/workspaces', { method: 'GET', credentials: 'include', headers });
            const json = await res.json().catch(() => null);
            wid = Array.isArray(json) ? json[0]?.id : json?.id || json?.workspaces?.[0]?.id;
            if (!wid) throw new Error('Workspace ID not found');
          }

          const res  = await fetch(`https://api.lovable.dev/workspaces/${wid}/projects`, {
            method: 'POST',
            credentials: 'include',
            headers,
            body: JSON.stringify({
              name: event.data.projectName || 'Novo Projeto',
              castle_request_token: castleToken,
            }),
          });
          const text = await res.text();
          let data;
          try { data = JSON.parse(text); } catch { data = { raw: text }; }
          window.postMessage({ type: 'lovableCreateProjectResponse', reqId, ok: res.ok, status: res.status, data }, '*');
        } catch (err) {
          console.error('[LovPilotHook] create project error:', err);
          window.postMessage({ type: 'lovableCreateProjectResponse', reqId, ok: false, status: 0, error: err.message || String(err) }, '*');
        }
      })();
      return;
    }
  });

  // ── Castle SDK polling ────────────────────

  let castleDetected = false;
  const castlePoll = setInterval(async () => {
    const sdk = window.__cstl || window.__castle || window._castle;
    if (!sdk || castleDetected) return;
    castleDetected = true;
    clearInterval(castlePoll);
    console.log('[LovPilotHook] Castle SDK detected');
    await refreshCastleToken();
    setInterval(refreshCastleToken, 120000);
  }, 1000);

  // Periodic project/workspace ID sync from URL
  setInterval(() => {
    syncState(null, extractProjectId(location.pathname) || extractProjectId(location.href), extractWorkspaceId(location.pathname) || extractWorkspaceId(location.href));
  }, 3000);

  // Initial token extraction from localStorage
  setTimeout(() => {
    const stored = getTokenFromStorage();
    if (stored) token = stored;
    syncState(token, extractProjectId(location.href), extractWorkspaceId(location.href), true);
  }, 500);
})();
