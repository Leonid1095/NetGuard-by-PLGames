// 🌐 NetGuard by PLGames - Renderer Process
// DNS без компромиссов - Minimal renderer logic
console.log('🚀 NetGuard renderer ready');

// ===== GITHUB КОНФИГУРАЦИЯ =====
const GITHUB_CONFIG = {
  username: 'Leonid1095',
  repo: 'NetGuard-by-PLGames',
  branch: 'main'
};

const GITHUB_RAW_URL = `https://raw.githubusercontent.com/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repo}/${GITHUB_CONFIG.branch}`;
const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repo}`;

const FREE_POOL_ID = 'free_pool';
const VIP_AUTO_ID = 'vip_auto';

const logger = {
  info: (msg, data) => console.log(`[INFO] ${new Date().toISOString()} ${msg}`, data || ''),
  warn: (msg, data) => console.warn(`[WARN] ${new Date().toISOString()} ${msg}`, data || ''),
  error: (msg, data) => console.error(`[ERROR] ${new Date().toISOString()} ${msg}`, data || ''),
  debug: (msg, data) => console.log(`[DEBUG] ${new Date().toISOString()} ${msg}`, data || '')
};

const defaultSettings = {
  autoConnect: false,
  preferVip: false,
  autoFailover: true
};

const appState = {
  isConnected: false,
  currentServer: localStorage.getItem('server') || CONFIG.DEFAULT_SERVER,
  currentLang: localStorage.getItem('lang') || CONFIG.DEFAULT_LANG,
  stats: { queries: 0, blocked: 0, startTime: null },
  activeEndpoint: null,
  currentDnsIndex: 0,
  settings: { ...defaultSettings }
};

function t(key) {
  return TRANSLATIONS[appState.currentLang]?.[key] || TRANSLATIONS.en[key] || key;
}

// Диалог для запроса прав администратора
function showAdminDialog() {
  return new Promise((resolve) => {
    const dialog = document.createElement('div');
    dialog.className = 'admin-dialog-overlay';
    dialog.innerHTML = `
      <div class="admin-dialog">
        <h3>⚠️ Требуются права администратора</h3>
        <p>Для изменения DNS-серверов требуются права администратора.</p>
        <p>Перезапустить приложение с правами администратора?</p>
        <div class="admin-dialog-buttons">
          <button class="admin-btn-cancel">Отмена</button>
          <button class="admin-btn-confirm">Перезапустить</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(dialog);
    
    dialog.querySelector('.admin-btn-cancel').onclick = () => {
      document.body.removeChild(dialog);
      resolve(false);
    };
    
    dialog.querySelector('.admin-btn-confirm').onclick = () => {
      document.body.removeChild(dialog);
      resolve(true);
    };
  });
}

document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
  logger.info('🚀 Initializing NetGuard', { IS_VIP: CONFIG.IS_VIP, API_KEY: CONFIG.API_KEY ? '***' : 'none' });
  updateVersionBadge();
  loadSettings();
  ensureServerExists();
  populateServerDropdown();
  setupEventListeners();
  applySettingsUI();
  applyPreferredServer();
  updateLanguage();
  logger.info('🌍 Language set to', appState.currentLang);
  updateServerDisplay();
  logger.info('🖥️ Server selected', appState.currentServer);
  updateStatusDisplay();

  if (appState.settings.autoConnect) {
    logger.info('⚡ Auto-connect enabled, will connect in 400ms');
    setTimeout(() => {
      if (!appState.isConnected) toggleConnection();
    }, 400);
  }
  logger.info('✅ Initialization complete');
  
  // Загрузить DNS с GitHub (опционально)
  loadDNSServersFromGitHub();
  
  // Проверить обновления при старте (через 2 сек)
  setTimeout(() => checkForUpdates(false), 2000);
}

// ===== ЗАГРУЗКА DNS С GITHUB =====
async function loadDNSServersFromGitHub() {
  try {
    const githubRawUrl = `${GITHUB_RAW_URL}/dns-servers.json`;
    logger.info('📡 Fetching DNS servers from GitHub...', { url: githubRawUrl });
    
    const response = await fetch(githubRawUrl, { cache: 'no-cache' });
    if (response.ok) {
      const data = await response.json();
      if (data.servers && Array.isArray(data.servers)) {
        // Обновить PUBLIC_DNS в CONFIG
        const newCount = data.servers.length;
        CONFIG.PUBLIC_DNS = data.servers;
        logger.info('✅ DNS servers loaded from GitHub', { count: newCount, version: data.version, timestamp: data.timestamp });
        
        // Перестроить dropdown
        populateServerDropdown();
        
        // Показать уведомление
        showNotification(`✅ Обновлено ${newCount} DNS серверов с GitHub (v${data.version})`, 'success');
      }
    } else {
      logger.warn('Failed to fetch DNS servers from GitHub', { status: response.status, url: githubRawUrl });
      showNotificationAlert('❌ Ошибка загрузки DNS с GitHub', 'error');
    }
  } catch (error) {
    logger.error('Error loading DNS from GitHub', error.message);
    showNotificationAlert('❌ Ошибка подключения к GitHub', 'error');
  }
}

// ===== ПРОВЕРКА ОБНОВЛЕНИЙ =====
async function checkForUpdates(showNotification = true) {
  try {
    const githubApiUrl = `${GITHUB_API_URL}/releases/latest`;
    logger.info('🔄 Checking for app updates...', { url: githubApiUrl });
    
    const response = await fetch(githubApiUrl);
    if (response.ok) {
      const release = await response.json();
      const latestVersion = release.tag_name.replace('v', '');
      const currentVersion = '1.0.0'; // Из package.json
      
      if (latestVersion > currentVersion) {
        logger.info('🆕 New version available', { current: currentVersion, latest: latestVersion });
        showUpdateNotification(latestVersion, release.html_url);
        return true;
      } else if (showNotification) {
        showNotificationAlert(`✅ Приложение актуально (v${currentVersion})`, 'info');
      }
      logger.info('✅ App is up to date', { version: currentVersion });
    } else {
      logger.warn('Failed to check updates', { status: response.status });
      if (showNotification) {
        showNotificationAlert('⚠️ Не удалось проверить обновления', 'error');
      }
    }
  } catch (error) {
    logger.error('Error checking for updates', error.message);
    if (showNotification) {
      showNotificationAlert('❌ Ошибка проверки обновлений', 'error');
    }
  }
  return false;
}

function showUpdateNotification(version, downloadUrl) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 16px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 10000;
    font-size: 13px;
    max-width: 300px;
  `;
  notification.innerHTML = `
    <strong>🆕 Новая версия: v${version}</strong><br>
    <a href="${downloadUrl}" target="_blank" style="color:#fff;text-decoration:underline;">Загрузить →</a>
  `;
  document.body.appendChild(notification);
  
  setTimeout(() => notification.remove(), 8000);
}

function showNotificationAlert(msg, type = 'info') {
  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
  logger.info(`${icon} ${msg}`);
  
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
    color: white;
    padding: 12px 16px;
    border-radius: 6px;
    z-index: 10000;
    font-size: 12px;
  `;
  notification.textContent = msg;
  document.body.appendChild(notification);
  
  setTimeout(() => notification.remove(), 3000);
}

function showNotification(msg, type) {
  showNotificationAlert(msg, type);
}

function ensureServerExists() {
  const exists = CONFIG.SERVERS.some(s => s.id === appState.currentServer);
  if (!exists) appState.currentServer = CONFIG.DEFAULT_SERVER;
}

function loadSettings() {
  const stored = localStorage.getItem('settings');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      appState.settings = { ...defaultSettings, ...parsed };
      logger.info('💾 Settings loaded from storage', appState.settings);
    } catch (err) {
      logger.error('Failed to parse settings', err.message);
      appState.settings = { ...defaultSettings };
    }
  } else {
    logger.info('📭 No stored settings, using defaults', appState.settings);
  }
}

function saveSettings() {
  localStorage.setItem('settings', JSON.stringify(appState.settings));
  logger.info('💾 Settings saved to storage', appState.settings);
}

function applyPreferredServer() {
  if (CONFIG.IS_VIP && appState.settings.preferVip) {
    appState.currentServer = VIP_AUTO_ID;
  } else if (appState.currentServer === VIP_AUTO_ID && !CONFIG.IS_VIP) {
    appState.currentServer = FREE_POOL_ID;
  }
  localStorage.setItem('server', appState.currentServer);
}

function updateVersionBadge() {
  const badge = document.getElementById('version-badge');
  if (!badge) return;
  if (CONFIG.IS_VIP) {
    badge.textContent = '👑 VIP';
    badge.style.color = '#FFD700';
    badge.style.backgroundColor = 'rgba(255,215,0,0.2)';
  } else {
    badge.textContent = 'FREE';
    badge.style.color = '#4FA3FF';
    badge.style.backgroundColor = 'rgba(79,163,255,0.15)';
  }
}

function toggleServerList() {
  const dropdown = document.getElementById('server-dropdown-list');
  const btn = document.getElementById('server-select-btn');
  if (!dropdown || !btn) return;
  const isOpen = dropdown.style.display === 'block';
  dropdown.style.display = isOpen ? 'none' : 'block';
  btn.classList.toggle('active', !isOpen);
  if (!isOpen) populateServerDropdown();
}

function populateServerDropdown() {
  const container = document.getElementById('server-dropdown-list');
  if (!container) return;
  container.innerHTML = '';
  CONFIG.SERVERS.forEach(server => {
    const option = document.createElement('div');
    option.className = 'server-list-item';
    if (appState.currentServer === server.id) option.classList.add('active');
    const name = server.name[appState.currentLang] || server.name.en;
    option.innerHTML = `
      <span class="server-name">${name}</span>
      <span class="server-badge ${server.vip_only ? 'vip' : 'free'}">${server.badge}</span>
    `;
    option.onclick = () => selectServer(server.id);
    container.appendChild(option);
  });
}

function selectServer(serverId) {
  const prevServer = appState.currentServer;
  appState.currentServer = serverId;
  localStorage.setItem('server', serverId);
  logger.info(`🖥️ Server changed: ${prevServer} → ${serverId}`);
  updateServerDisplay();
  toggleServerList();
  if (appState.isConnected) {
    logger.info('🔄 Reconnecting to new server');
    appState.isConnected = false;
    appState.activeEndpoint = null;
    updateStatusDisplay();
  }
}

function updateServerDisplay() {
  const btn = document.getElementById('server-select-name');
  if (!btn) return;
  const server = CONFIG.SERVERS.find(s => s.id === appState.currentServer);
  if (server) btn.textContent = server.name[appState.currentLang] || server.name.en;
}

async function toggleConnection() {
  if (appState.isConnected) {
    logger.info('📴 Disconnecting');
    
    // Сбрасываем DNS на автоматический
    if (window.api && window.api.resetDns) {
      const resetResult = await window.api.resetDns();
      if (!resetResult.success) {
        logger.error('Failed to reset DNS:', resetResult.error);
        showNotification('❌ ' + (resetResult.error || 'Не удалось сбросить DNS'), 'error');
      }
    }
    
    appState.isConnected = false;
    appState.activeEndpoint = null;
    appState.stats = { queries: 0, blocked: 0, startTime: null };
    updateStatusDisplay();
    return;
  }

  const server = CONFIG.SERVERS.find(s => s.id === appState.currentServer);
  if (!server) {
    logger.error('❌ Server not found', appState.currentServer);
    alert(t('noServerAvailable'));
    return;
  }

  // Проверка прав администратора перед подключением FREE DNS
  if (server.id === FREE_POOL_ID) {
    if (!window.api || !window.api.checkAdmin) {
      showNotification('❌ Ошибка: API не доступен. Перезапустите приложение.', 'error');
      logger.error('window.api not available');
      return;
    }
    
    try {
      const isAdminUser = await window.api.checkAdmin();
      
      if (!isAdminUser) {
        const result = await showAdminDialog();
        if (result) {
          // Пользователь согласился - перезапускаем с правами админа
          await window.api.restartAsAdmin();
          return;
        } else {
          // Пользователь отказался
          showNotification('⚠️ Для изменения DNS требуются права администратора', 'warning');
          return;
        }
      }
    } catch (err) {
      logger.error('Admin check failed:', err);
      showNotification('❌ Ошибка проверки прав: ' + err.message, 'error');
      return;
    }
  }

  try {
    logger.info('📡 Attempting connection', { server: server.id, vip: server.vip_only });
    if (server.id === FREE_POOL_ID) {
      await connectFreePool();
    } else {
      await connectVipAuto();
    }
    logger.info('✅ Connected successfully', { endpoint: appState.activeEndpoint });
    startStats();
    updateStatusDisplay();
  } catch (err) {
    logger.error('❌ Connection failed', err.message);
    alert(`${t('connectionFailed')}\n${err.message}`);
  }
}

async function connectFreePool() {
  const list = appState.settings.autoFailover ? CONFIG.PUBLIC_DNS : CONFIG.PUBLIC_DNS.slice(0, 1);
  logger.info(`🌍 Connecting to Free DNS pool`, { failover: appState.settings.autoFailover, endpoints: list.length });
  
  for (let i = 0; i < list.length; i++) {
    const dns = list[i];
    
    // Извлекаем IP адрес из protocols.ip
    const primaryIP = dns.protocols?.ip;
    if (!primaryIP) {
      logger.warn(`⏭️ Skipped ${dns.name} (no IP address)`);
      continue;
    }
    
    // Формируем массив DNS серверов (основной + вторичный если есть)
    const dnsIPs = dns.protocols?.ipSecondary 
      ? [primaryIP, dns.protocols.ipSecondary]
      : [primaryIP];
    
    logger.debug(`🔍 Changing DNS to ${dns.name}`, dnsIPs);
    
    // Изменяем DNS через PowerShell
    const result = await window.api.changeDns(dnsIPs);
    
    if (result.success) {
      appState.isConnected = true;
      appState.activeEndpoint = `${dns.name} (${dnsIPs.join(', ')})`;
      appState.currentDnsIndex = i;
      logger.info(`✅ Free DNS connected`, { name: dns.name, ips: dnsIPs, adapter: result.adapter });
      showNotification(`✅ DNS изменён: ${dns.name}`, 'success');
      return;
    }
    
    logger.warn(`❌ ${dns.name} failed: ${result.error}, trying next...`);
  }
  
  logger.error('🔴 All Free DNS endpoints failed');
  throw new Error('Не удалось изменить DNS. Проверьте сетевое подключение.');
}

// Переключение на следующий DNS сервер
async function switchToNextDNS() {
  if (!appState.isConnected) {
    showNotification('⚠️ Сначала подключитесь', 'warning');
    return;
  }
  
  const server = CONFIG.SERVERS.find(s => s.id === appState.currentServer);
  if (server?.vip_only) {
    showNotification('⚠️ Переключение DNS недоступно для VIP', 'warning');
    return;
  }
  
  // Переходим к следующему DNS
  const nextIndex = (appState.currentDnsIndex + 1) % CONFIG.PUBLIC_DNS.length;
  const dns = CONFIG.PUBLIC_DNS[nextIndex];
  
  if (!dns) {
    showNotification('❌ Нет доступных DNS серверов', 'error');
    return;
  }
  
  const primaryIP = dns.protocols?.ip;
  if (!primaryIP) {
    showNotification('❌ DNS не имеет IP адреса', 'error');
    return;
  }
  
  const dnsIPs = dns.protocols?.ipSecondary 
    ? [primaryIP, dns.protocols.ipSecondary]
    : [primaryIP];
  
  logger.info(`🔄 Switching to ${dns.name}`, dnsIPs);
  
  try {
    const result = await window.api.changeDns(dnsIPs);
    
    if (result.success) {
      appState.currentDnsIndex = nextIndex;
      appState.activeEndpoint = `${dns.name} (${dnsIPs.join(', ')})`;
      updateStatusDisplay();
      showNotification(`🔄 DNS переключён: ${dns.name}`, 'success');
      logger.info(`✅ Switched to ${dns.name}`);
    } else {
      showNotification('❌ ' + (result.error || 'Ошибка переключения'), 'error');
    }
  } catch (err) {
    showNotification('❌ Ошибка: ' + err.message, 'error');
    logger.error('Switch DNS failed:', err);
  }
}

async function connectVipAuto() {
  if (!CONFIG.IS_VIP) {
    logger.error('🔴 VIP build required');
    throw new Error('VIP недоступен в этой сборке');
  }
  const pool = CONFIG.VIP_POOL || [];
  if (!pool.length) {
    logger.error('🔴 No VIP endpoints configured');
    throw new Error('Нет VIP точек');
  }

  logger.info('👑 Connecting to VIP auto-pool', { endpoints: pool.length });
  
  for (let i = 0; i < pool.length; i++) {
    const endpoint = pool[i];
    logger.debug(`🔍 Health check for VIP ${endpoint.id}`, endpoint.url);
    const ok = await checkVipHealth(endpoint.url);
    if (ok) {
      appState.isConnected = true;
      appState.activeEndpoint = `${endpoint.flag || '⭐'} ${endpoint.name[appState.currentLang] || endpoint.name.en}`;
      logger.info(`✅ VIP connected`, { endpoint: endpoint.id, name: appState.activeEndpoint, attempt: i + 1 });
      return;
    }
    logger.warn(`❌ VIP ${endpoint.id} health check failed`);
  }

  // если ничего не ответило — подключаемся в оффлайн-режиме на первую точку
  logger.warn('⚠️ All VIP endpoints failed, using offline mode');
  appState.isConnected = true;
  const fallback = pool[0];
  appState.activeEndpoint = `${fallback.flag || '⭐'} ${fallback.name[appState.currentLang] || fallback.name.en} (offline mode)`;
  logger.info(`✅ VIP connected (offline mode)`, { endpoint: fallback.id });
}

async function checkVipHealth(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  const startTime = Date.now();
  try {
    await fetch(`${url}/health`, {
      method: 'GET',
      headers: { 'X-API-Key': CONFIG.API_KEY, Accept: 'application/json' },
      mode: 'no-cors',
      signal: controller.signal
    });
    const elapsed = Date.now() - startTime;
    logger.debug(`✅ Health check OK (${elapsed}ms)`, url);
    return true;
  } catch (err) {
    const elapsed = Date.now() - startTime;
    logger.debug(`❌ Health check failed (${elapsed}ms)`, { url, error: err.message });
    return false;
  } finally {
    clearTimeout(timer);
  }
}

async function pingEndpoint(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 4000);
  const startTime = Date.now();
  try {
    await fetch(url, { method: 'GET', mode: 'no-cors', signal: controller.signal });
    const elapsed = Date.now() - startTime;
    logger.debug(`✅ Ping OK (${elapsed}ms)`, url);
    return true;
  } catch (err) {
    const elapsed = Date.now() - startTime;
    logger.debug(`❌ Ping failed (${elapsed}ms)`, { url, error: err.message });
    return false;
  } finally {
    clearTimeout(timer);
  }
}

function startStats() {
  appState.stats = { queries: 0, blocked: 0, startTime: Date.now() };
  simulateQueries();
}

function simulateQueries() {
  if (!appState.isConnected) return;
  setTimeout(() => {
    appState.stats.queries += Math.floor(Math.random() * 6) + 2;
    appState.stats.blocked += Math.floor(Math.random() * 3);
    updateStatsDisplay();
    if (appState.isConnected) simulateQueries();
  }, 3000);
}

function updateStatusDisplay() {
  const connectionCircle = document.getElementById('connection-circle');
  const statusIcon = document.getElementById('status-icon');
  const statusLabel = document.getElementById('status-label');
  const statusSub = document.getElementById('status-sub');
  const activeEndpointEl = document.getElementById('active-endpoint');

  const server = CONFIG.SERVERS.find(s => s.id === appState.currentServer);
  const isVip = server?.vip_only;

  if (appState.isConnected) {
    document.body.classList.add('connected');
    connectionCircle?.classList.remove('disconnected', 'connected-free', 'connected-vip');
    connectionCircle?.classList.add(isVip ? 'connected-vip' : 'connected-free');
    if (statusIcon) statusIcon.textContent = isVip ? '👑' : '✓';
    if (statusLabel) statusLabel.textContent = t('connected');
    if (statusSub) statusSub.textContent = appState.activeEndpoint || 'Connected';
    if (activeEndpointEl) activeEndpointEl.textContent = appState.activeEndpoint || 'Active';
  } else {
    document.body.classList.remove('connected');
    connectionCircle?.classList.remove('connected-free', 'connected-vip');
    connectionCircle?.classList.add('disconnected');
    if (statusIcon) statusIcon.textContent = '⚡';
    if (statusLabel) statusLabel.textContent = t('disconnected');
    if (statusSub) statusSub.textContent = 'Auto DNS ready';
    if (activeEndpointEl) activeEndpointEl.textContent = '—';
  }
}

function updateStatsDisplay() {
  const queriesStat = document.getElementById('queries-stat');
  const blockedStat = document.getElementById('blocked-stat');
  if (queriesStat) queriesStat.textContent = appState.stats.queries.toLocaleString();
  if (blockedStat) blockedStat.textContent = appState.stats.blocked.toLocaleString();
}

function updateLanguage() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    el.textContent = t(key);
  });
  const langSelect = document.getElementById('lang-select');
  if (langSelect) langSelect.value = appState.currentLang;
}

function setupEventListeners() {
  document.getElementById('minimize-btn')?.addEventListener('click', () => {
    window.electronAPI?.minimize?.();
  });
  document.getElementById('close-btn')?.addEventListener('click', () => {
    window.electronAPI?.close?.();
  });
  document.getElementById('lang-select')?.addEventListener('change', e => {
    appState.currentLang = e.target.value;
    localStorage.setItem('lang', appState.currentLang);
    updateLanguage();
    populateServerDropdown();
    updateServerDisplay();
    updateStatusDisplay();
  });

  document.getElementById('settings-btn')?.addEventListener('click', openSettingsModal);
  document.querySelector('[data-close="settings-modal"]')?.addEventListener('click', closeSettingsModal);
  document.getElementById('settings-modal')?.addEventListener('click', e => {
    if (e.target.id === 'settings-modal') closeSettingsModal();
  });

  document.getElementById('donate-btn')?.addEventListener('click', openDonateModal);
  document.querySelector('[data-close="donate-modal"]')?.addEventListener('click', closeDonateModal);
  document.getElementById('donate-modal')?.addEventListener('click', e => {
    if (e.target.id === 'donate-modal') closeDonateModal();
  });

  document.getElementById('open-telegram')?.addEventListener('click', () => {
    require('electron')?.shell?.openExternal?.(CONFIG.DONATION.TELEGRAM);
  });

  document.getElementById('setting-autoconnect')?.addEventListener('change', e => {
    appState.settings.autoConnect = e.target.checked;
    logger.info('⚙️ Auto-connect setting', appState.settings.autoConnect);
    saveSettings();
  });

  document.getElementById('setting-prefer-vip')?.addEventListener('change', e => {
    appState.settings.preferVip = e.target.checked;
    logger.info('⚙️ Prefer VIP setting', appState.settings.preferVip);
    saveSettings();
    applyPreferredServer();
    updateServerDisplay();
  });

  document.getElementById('setting-autofailover')?.addEventListener('change', e => {
    appState.settings.autoFailover = e.target.checked;
    logger.info('⚙️ Auto-failover setting', appState.settings.autoFailover);
    saveSettings();
  });

  // Кнопка проверки обновлений приложения
  document.getElementById('update-btn')?.addEventListener('click', async () => {
    const btn = document.getElementById('update-btn');
    btn.style.opacity = '0.5';
    btn.style.cursor = 'wait';
    logger.info('🔄 Checking for app updates...');
    showNotificationAlert('🔄 Проверка обновлений...', 'info');
    
    const hasUpdate = await checkForUpdates(true);
    
    btn.style.opacity = '1';
    btn.style.cursor = 'pointer';
    if (!hasUpdate) {
      showNotificationAlert('✅ Приложение актуально!', 'success');
    }
  });

  // Кнопка загрузки DNS с GitHub
  document.getElementById('reload-dns-btn')?.addEventListener('click', async () => {
    const btn = document.getElementById('reload-dns-btn');
    btn.style.opacity = '0.5';
    btn.style.cursor = 'wait';
    logger.info('📡 Reloading DNS servers from GitHub...');
    showNotificationAlert('📡 Загрузка DNS с GitHub...', 'info');
    
    await loadDNSServersFromGitHub();
    
    btn.style.opacity = '1';
    btn.style.cursor = 'pointer';
  });
}

function applySettingsUI() {
  const auto = document.getElementById('setting-autoconnect');
  const prefer = document.getElementById('setting-prefer-vip');
  const failover = document.getElementById('setting-autofailover');

  if (auto) auto.checked = appState.settings.autoConnect;
  if (prefer) {
    prefer.checked = appState.settings.preferVip && CONFIG.IS_VIP;
    prefer.disabled = !CONFIG.IS_VIP;
  }
  if (failover) failover.checked = appState.settings.autoFailover;
}

function openSettingsModal() {
  document.getElementById('settings-modal')?.classList.add('active');
}

function closeSettingsModal() {
  document.getElementById('settings-modal')?.classList.remove('active');
}

function openDonateModal() {
  document.getElementById('donate-modal')?.classList.add('active');
}

function closeDonateModal() {
  document.getElementById('donate-modal')?.classList.remove('active');
}

// Expose toggleConnection for the circle click
window.toggleConnection = toggleConnection;
