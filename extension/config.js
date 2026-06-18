// ─────────────────────────────────────────────
//  LovPilot — Config & License System
//  Troque SUPABASE_URL e SUPABASE_ANON_KEY pelas
//  suas credenciais do Supabase antes de distribuir.
// ─────────────────────────────────────────────

const CONFIG = {
  supabaseUrl: 'YOUR_SUPABASE_URL',
  supabaseAnonKey: 'YOUR_SUPABASE_ANON_KEY',
  licensePrefix: 'LP-',
};

// ── Supabase REST helper ──────────────────────

async function supabaseRequest(endpoint, options = {}) {
  const url = `${CONFIG.supabaseUrl}/rest/v1/${endpoint}`;
  const headers = {
    apikey: CONFIG.supabaseAnonKey,
    Authorization: `Bearer ${CONFIG.supabaseAnonKey}`,
    'Content-Type': 'application/json',
    Prefer: options.prefer || 'return=representation',
    ...(options.headers || {}),
  };

  const res = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase error (${res.status}): ${text}`);
  }

  return res.json();
}

// ── Device ID ─────────────────────────────────

function generateDeviceId() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = 'lp-';
  for (let i = 0; i < 24; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

async function getDeviceId() {
  return new Promise(resolve => {
    chrome.storage.local.get('deviceId', data => {
      if (data.deviceId) {
        resolve(data.deviceId);
      } else {
        const id = generateDeviceId();
        chrome.storage.local.set({ deviceId: id }, () => resolve(id));
      }
    });
  });
}

// ── License validation ────────────────────────

async function validateLicense(key) {
  const rows = await supabaseRequest(
    `licenses?key=eq.${encodeURIComponent(key)}&select=*`
  );

  if (!rows || rows.length === 0) throw new Error('Chave de licença inválida.');

  const license = rows[0];

  if (!license.active) throw new Error('Esta licença está desativada.');

  if (license.expires_at && new Date(license.expires_at) < new Date()) {
    throw new Error('Esta licença expirou.');
  }

  const deviceId = await getDeviceId();
  const devices = await supabaseRequest(
    `license_devices?license_id=eq.${license.id}&select=*`
  );

  const thisDevice = devices.find(d => d.device_id === deviceId);

  if (!thisDevice && devices.length >= (license.max_devices || 1)) {
    // Try to free a stale device (inactive > 25h)
    const cutoff = new Date(Date.now() - 25 * 3600 * 1000).toISOString();
    let freed = false;

    for (const device of devices) {
      if (device.last_seen && device.last_seen < cutoff) {
        try {
          await supabaseRequest(`license_devices?id=eq.${device.id}`, { method: 'DELETE' });
          freed = true;
          break;
        } catch {}
      }
    }

    if (!freed) {
      throw new Error(`Limite de dispositivos atingido (${license.max_devices || 1}).`);
    }
  }

  if (thisDevice) {
    await supabaseRequest(`license_devices?id=eq.${thisDevice.id}`, {
      method: 'PATCH',
      body: { last_seen: new Date().toISOString() },
    });
  } else {
    try {
      await supabaseRequest('license_devices', {
        method: 'POST',
        prefer: 'return=minimal',
        body: {
          license_id: license.id,
          device_id: deviceId,
          last_seen: new Date().toISOString(),
        },
      });
    } catch {
      await supabaseRequest(
        `license_devices?license_id=eq.${license.id}&device_id=eq.${encodeURIComponent(deviceId)}`,
        { method: 'PATCH', body: { last_seen: new Date().toISOString() } }
      );
    }
  }

  return {
    valid: true,
    license: {
      id: license.id,
      key: license.key,
      expiresAt: license.expires_at || null,
      maxDevices: license.max_devices || 1,
    },
  };
}

// ── Storage helpers ───────────────────────────

async function getStoredLicense() {
  return new Promise(resolve => {
    chrome.storage.local.get('license', data => resolve(data.license || null));
  });
}

async function saveLicense(data) {
  return new Promise(resolve => {
    chrome.storage.local.set({ license: data }, resolve);
  });
}

async function removeLicense() {
  return new Promise(resolve => {
    chrome.storage.local.remove('license', resolve);
  });
}

async function logout() {
  await removeLicense();
}
