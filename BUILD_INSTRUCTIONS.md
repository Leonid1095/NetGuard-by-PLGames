# DNS Shield Pro - Dual Build Instructions

This application uses a **dual-build architecture** where Free and VIP versions are created from the same codebase but with different configurations embedded.

## Architecture Overview

The difference between Free and VIP versions is controlled entirely through configuration settings in `src/renderer/config.js`:

- **Free Version**: `IS_VIP = false`, uses `free_tier_secret_v1` API key
- **VIP Version**: `IS_VIP = true`, uses `vip_super_secret_key` API key

## Building FREE Version

### Step 1: Ensure config.js is set to FREE mode

Edit `src/renderer/config.js` and verify:

```javascript
CONFIG = {
  IS_VIP: false,                           // ← MUST be false
  API_KEY: 'free_tier_secret_v1',         // ← Free tier key
  // ... rest of config
}
```

### Step 2: Build the application

```bash
npm run build:unpacked
```

This creates: `dist/DNS-Shield-Pro-win32-x64/DNS-Shield-Pro.exe`

### Step 3: Create Windows installer (optional)

```bash
npm run build:msi
```

### FREE Version Features

When `IS_VIP = false`:
- ✅ Only **Free NL** server is available in dropdown
- ✅ VIP servers (DE, FR, PL) are **hidden/disabled** in dropdown
- ✅ Header shows **"FREE"** badge in blue (#2196F3)
- ✅ **Donation button** available in main menu
- ✅ Clicking VIP server shows **"🔒 VIP Access Required"** modal
- ✅ Settings has only **General + Updates** tabs (no VIP key input)
- ✅ All API calls use `free_tier_secret_v1` key

---

## Building VIP Version

### Step 1: Change config.js to VIP mode

Edit `src/renderer/config.js` and change:

```javascript
CONFIG = {
  IS_VIP: true,                            // ← Change to true
  API_KEY: 'vip_super_secret_key',        // ← Change to VIP key
  // ... rest of config (servers have vip_only properties)
}
```

### Step 2: Build the application

```bash
npm run build:unpacked
```

This creates: `dist/DNS-Shield-Pro-win32-x64/DNS-Shield-Pro.exe` (VIP version)

### Step 3: Rename to avoid conflict

```bash
ren "dist\DNS-Shield-Pro-win32-x64" "DNS-Shield-Pro-VIP-win32-x64"
```

### VIP Version Features

When `IS_VIP = true`:
- ✅ **All 4 servers** visible and enabled in dropdown:
  - Free NL (Netherlands)
  - VIP DE (Germany)
  - VIP FR (France)
  - VIP PL (Poland)
- ✅ Header shows **"👑 VIP"** badge in gold (#FFD700)
- ✅ **Upgrade modal never shown** (all servers accessible)
- ✅ Settings has only **General + Updates** tabs
- ✅ All API calls use `vip_super_secret_key` key

---

## Key Files to Understand

### config.js
Contains:
- `IS_VIP` - Boolean flag (false = Free, true = VIP)
- `API_KEY` - String, API authentication key
- `SERVERS` - Array with 4 servers, each has `vip_only: boolean` property
- `DONATION` - Payment addresses and Telegram link
- `VIP_BENEFITS` - List of benefits (en/ru)
- `VIP_PRICING` - Pricing structure (en/ru)
- `TRANSLATIONS` - 180+ UI strings in English/Russian

### index.html
Contains:
- Version badge element: `<div id="version-badge">`
- Server selector: `<select id="server-select">` (dynamically populated)
- Modal structure: donation-modal, upgrade-modal, settings-modal, about-modal
- Dynamic content containers: #benefits-list, #pricing-list, #upgrade-features

### renderer.js
Implements:
- IS_VIP detection on app init
- Server filtering/disabling based on IS_VIP
- Version badge display (FREE/VIP)
- Modal management (open/close)
- API calls using CONFIG.API_KEY
- Event listeners and state management

### styles.css
Includes:
- Version badge styling (blue for FREE, gold for VIP)
- Server option disabled styling
- Modal and payment section styling
- Benefits/pricing list styling

---

## Distribution Strategy

### For Free Users:
1. Build with `IS_VIP = false`
2. Distribute `dist/DNS-Shield-Pro-win32-x64/DNS-Shield-Pro.exe`
3. Users can see Donate button and upgrade modal
4. Shows only Free NL server

### For VIP Users:
1. Build with `IS_VIP = true`
2. Distribute `dist/DNS-Shield-Pro-VIP-win32-x64/DNS-Shield-Pro.exe`
3. Send via Telegram bot (linked in donation modal)
4. Shows all 4 servers, unlock all features

---

## Environment Variables (Optional)

For automated CI/CD builds, you can set environment variables:

```bash
set IS_VIP=false
set API_KEY=free_tier_secret_v1
npm run build:unpacked
```

However, the recommended approach is to edit `config.js` directly since these are version-specific builds.

---

## Testing Checklist

### FREE Version (`IS_VIP = false`):
- [ ] App starts without errors
- [ ] Header shows "FREE" badge in blue
- [ ] Only "Free NL" visible in server dropdown
- [ ] Other servers appear disabled/grayed out
- [ ] Clicking disabled server shows upgrade modal
- [ ] Settings modal has only General + Updates tabs
- [ ] Donate button is visible in main menu
- [ ] Connection works with free_tier_secret_v1 API key

### VIP Version (`IS_VIP = true`):
- [ ] App starts without errors
- [ ] Header shows "👑 VIP" badge in gold
- [ ] All 4 servers visible and enabled in dropdown
- [ ] Upgrade modal never appears
- [ ] Settings modal has only General + Updates tabs
- [ ] Donate button still visible (for additional donations)
- [ ] Connection works with vip_super_secret_key API key

---

## Troubleshooting

**Q: App shows wrong API key error**
A: Check that `CONFIG.API_KEY` in config.js matches the current version (free_tier_secret_v1 or vip_super_secret_key)

**Q: Version badge not showing**
A: Ensure config.js is loaded before renderer.js. Check console for errors.

**Q: Servers not filtering properly**
A: Check that all servers have `vip_only: boolean` property in config.js

**Q: Settings modal shows VIP key input**
A: Old HTML file still in use. Delete and rebuild with npm run build:unpacked

---

## Notes

- **No manual key input in UI**: Users never see API keys. Version differences handled entirely through config.
- **Single codebase**: Both versions use identical code, differ only in config.js
- **Easy updates**: Update config.js once, rebuild twice (with different settings)
- **Donation flow**: Free users can upgrade via donation modal → Telegram bot → download VIP build
