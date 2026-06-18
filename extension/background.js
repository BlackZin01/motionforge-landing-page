// ─────────────────────────────────────────────
//  LovPilot — Background Service Worker
// ─────────────────────────────────────────────

console.log('[LovPilot] Background service worker started');

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {});

// ── Message router ────────────────────────────

chrome.runtime.onMessage.addListener((msg, sender, respond) => {
  if (!msg || !msg.action) return;

  // Save Lovable session data synced from the page
  if (msg.action === 'lovableSync') {
    const updates = {};
    if (msg.token)           updates.lovable_token            = msg.token;
    if (msg.projectId)       updates.lovable_projectId        = msg.projectId;
    if (msg.workspaceId)     updates.lovable_workspaceId      = msg.workspaceId;
    if (msg.castleToken)     updates.lovable_castleToken      = msg.castleToken;
    if (msg.castleTokenAt)   updates.lovable_castleTokenAt    = msg.castleTokenAt;
    if (msg.browserSessionId) updates.lovable_browserSessionId = msg.browserSessionId;
    if (msg.clientGitSha)    updates.lovable_clientGitSha     = msg.clientGitSha;

    if (Object.keys(updates).length) {
      chrome.storage.local.set(updates, () => {
        console.log('[LovPilot] Saved:', Object.keys(updates).join(', '));
      });
    }
    respond({ ok: true });
    return false;
  }

  // Forward create-project response to popup
  if (msg.action === 'lovableCreateProjectSync') {
    chrome.runtime.sendMessage({
      action: 'lovableCreateProjectResponse',
      reqId:  msg.reqId,
      ok:     msg.ok,
      status: msg.status,
      data:   msg.data,
      error:  msg.error,
    }).catch(() => {});
    respond({ ok: true });
    return false;
  }

  // Return stored Lovable token
  if (msg.action === 'getToken') {
    chrome.storage.local.get('lovable_token', data => {
      respond({ token: data.lovable_token || null });
    });
    return true;
  }

  // Return all stored Lovable session data
  if (msg.action === 'getSession') {
    chrome.storage.local.get(
      ['lovable_token', 'lovable_projectId', 'lovable_workspaceId',
       'lovable_castleToken', 'lovable_castleTokenAt'],
      respond
    );
    return true;
  }

  // Proxy an HTTP request (bypasses CORS restrictions in content scripts)
  if (msg.action === 'proxyFetch') {
    (async () => {
      try {
        console.log('[LovPilot] proxyFetch ->', msg.url);
        const options = {
          method:  msg.method  || 'GET',
          headers: msg.headers || {},
        };
        if (msg.body) options.body = msg.body;

        const res = await fetch(msg.url, options);
        const text = await res.text();

        let data;
        try { data = JSON.parse(text); } catch { data = { raw: text }; }

        respond({ ok: res.ok, status: res.status, data });
      } catch (err) {
        console.error('[LovPilot] proxyFetch error:', err);
        respond({ ok: false, status: 0, data: { error: err.message || 'Fetch failed' } });
      }
    })();
    return true;
  }

  // Broadcast a token to all open Lovable tabs
  if (msg.action === 'broadcastToken' && msg.token) {
    chrome.tabs.query({ url: ['https://*.lovable.dev/*', 'https://*.lovable.app/*'] }, tabs => {
      for (const tab of tabs) {
        chrome.tabs.sendMessage(tab.id, { type: 'tokenFound', token: msg.token }).catch(() => {});
      }
    });
    respond({ ok: true });
    return false;
  }

  // Persist token from content script
  if (msg.action === 'storeToken' && msg.token) {
    chrome.storage.local.set({ lovable_token: msg.token });
    respond({ ok: true });
    return false;
  }

  // Upload a base64-encoded file to Supabase Storage
  if (msg.action === 'uploadFile') {
    (async () => {
      try {
        const binary = atob(msg.base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

        const res = await fetch(msg.url, {
          method: 'PUT',
          headers: {
            apikey: msg.supabaseKey,
            Authorization: `Bearer ${msg.supabaseKey}`,
            'Content-Type': msg.contentType || 'application/octet-stream',
            'x-upsert': 'true',
          },
          body: bytes,
        });

        if (res.ok) {
          respond({ ok: true });
        } else {
          const err = await res.text().catch(() => 'Unknown error');
          respond({ ok: false, error: `Upload error (${res.status}): ${err}` });
        }
      } catch (err) {
        console.error('[LovPilot] uploadFile error:', err);
        respond({ ok: false, error: err.message });
      }
    })();
    return true;
  }

  respond({ error: 'Unknown action' });
  return false;
});

// ── Re-inject content script on navigation ────

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    if (tab.url.includes('lovable.dev') || tab.url.includes('lovable.app')) {
      injectContentScript(tabId);
    }
  }
});

async function injectContentScript(tabId) {
  try {
    const pong = await chrome.tabs.sendMessage(tabId, { type: 'ping' }).catch(() => null);
    if (pong?.type === 'pong') return;
    await chrome.scripting.executeScript({ target: { tabId }, files: ['content.js'] });
  } catch (err) {
    console.warn('[LovPilot] Could not inject content script:', err.message);
  }
}
