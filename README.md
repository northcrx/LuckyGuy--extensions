# LuckyGuy Extensions & Plugins SDK

Official community extensions repository and plugin SDK specifications for [LuckyGuy Desktop](https://github.com/nishantkumrmishra/LuckyGuy).

---

## 📦 Architecture & Philosophy

LuckyGuy follows an offline-first, neutral architecture. The core application serves as a media manager, multi-threaded download orchestrator, and media player.
- **No Proprietary or Rated Content in Core**: The application core contains zero hardcoded scrapers, pirated streams, or adult scripts.
- **User-Declared Dynamic Tabs**: Instead of rigid built-in stream tabs, plugins declare their own custom tabs directly in LuckyGuy's sidebar.
- **Open SDK Freedom**: Users and third-party developers can build, distribute, and install custom source plugins, video portals, webpage crawlers (including mature/adult or indie platforms), and appearance skins via GitHub URLs.

---

## 🛠️ Plugin SDK Specification

Every extension provides a `manifest.json` conforming to [`schema.json`](schema.json):

```json
{
  "id": "my-media-portal",
  "name": "Community Video Portal",
  "version": "1.0.0",
  "type": "portal",
  "rating": "mature",
  "description": "Custom media portal with integrated ad blocking and bulk video download",
  "author": "Community Developer",
  "entry": "index.js",
  "tab": {
    "title": "Anime Hub",
    "icon": "Film",
    "url": "https://example-streaming-portal.org",
    "badge": "HD"
  },
  "capabilities": ["stream", "crawlPage", "adblock"],
  "supportedUrls": ["*://example-streaming-portal.org/*"],
  "adBlockRules": [
    "*://*.popunder-ad.com/*",
    "*://*.redirect-tracker.net/*"
  ]
}
```

### Dynamic Sidebar Tab Injection
If your plugin declares `"tab"`, LuckyGuy automatically injects a navigation button into the desktop sidebar:
- Clicking the tab opens the plugin's dedicated container view.
- Disabling or uninstalling the plugin cleanly removes the tab from the sidebar.

### Implementing `index.js`
Your plugin exports standard lifecycle hooks:

```javascript
module.exports = {
  // 1. URL pattern check
  isSupported(url) {
    return url.includes('example-streaming-portal.org');
  },

  // 2. Single Stream Resolver (with Ad-Bypass headers)
  async resolve(url) {
    return {
      title: 'Sample Stream Title',
      videoUrl: 'https://cdn.example.com/stream.m3u8',
      format: 'HLS',
      headers: {
        'Referer': 'https://example-streaming-portal.org/',
        'User-Agent': 'Mozilla/5.0 ...'
      }
    };
  },

  // 3. Batch Webpage Crawler (Scan 100-200 videos from category/page)
  async crawlPage(pageUrl) {
    // Scrapes video listings from the webpage
    return [
      {
        id: 'vid-101',
        title: 'Video Title #1',
        thumbnail: 'https://.../thumb.jpg',
        duration: '12:45',
        size: '120 MB',
        url: 'https://.../video1.mp4'
      }
    ];
  }
};
```

---

## 🛡️ Integrated Back-end Ad Blocker

All plugin tabs run through LuckyGuy's integrated back-end ad blocker:
- Blocks popunders, malicious redirects, and tracking scripts before media buffers.
- Plugins can bundle custom `adBlockRules` targeting specific ad networks.
- Users can customize and add their own ad-blocking blacklists in **Rules**.

---

## 🎨 Appearance & Themes SDK

Custom appearances can be packaged as `theme.json` or CSS bundles loaded in Settings:

```json
{
  "id": "neon-cyberpunk",
  "name": "Neon Cyberpunk",
  "version": "1.0.0",
  "tokens": {
    "--primary": "#06b6d4",
    "--bg-main": "#0f172a",
    "--bg-card": "#1e293b",
    "--text-primary": "#f8fafc"
  }
}
```

---

## 📥 How to Install Plugins in LuckyGuy

1. Open **LuckyGuy**.
2. Go to **Settings → Plugins & Extensions**.
3. Paste the plugin's `manifest.json` URL (e.g., from raw GitHub or personal host).
4. Click **Install Plugin**. LuckyGuy registers the engine safely in your sandbox.

---

## 📄 License
MIT License.
