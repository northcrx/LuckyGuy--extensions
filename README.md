# LuckyGuy Extensions & Plugins SDK

Official community extensions repository and plugin SDK specifications for [LuckyGuy Desktop](https://github.com/nishantkumrmishra/LuckyGuy).

---

## ⚡ 1 Master URL to Index Everything (All-in-One Registry)

Instead of installing plugins one-by-one, you can index and install **every official extension at once** using this single master registry URL:

```
https://raw.githubusercontent.com/nishantkumrmishra/LuckyGuy--extensions/main/index.json
```

### 📋 How to Index Everything in LuckyGuy Desktop:
1. Open **LuckyGuy Desktop** and click **Settings** (`⚙️`) in the sidebar.
2. Select **Plugins** (or **Plugins & Modular Extensions**).
3. In the **Extension Manifest URL** field, paste:
   ```
   https://raw.githubusercontent.com/nishantkumrmishra/LuckyGuy--extensions/main/index.json
   ```
4. Click **Install Plugin** (or use the in-app **"Index All Official Extensions"** button).
5. All 7 extensions will be indexed and registered in your library immediately!
6. **Complete User Freedom**: All extensions are installed **disabled by default**. It is entirely up to you inside the software to toggle **ON** only the extensions and stream portals you actually want, leaving the rest disabled.

---

## 📦 Individual Extension Manifest URLs

If you prefer to install only specific standalone extensions rather than indexing the entire suite, use any of the direct URLs below:

| Extension Name | Category | Description | Standalone Manifest URL (Copy & Paste in App) | Rating |
| :--- | :--- | :--- | :--- | :--- |
| **Archive Cinema & Movies** | Cinema & Video Portal | Stream public domain films, classic documentaries, and open culture videos with ad-blocker & batch crawler. | `https://raw.githubusercontent.com/nishantkumrmishra/LuckyGuy--extensions/main/extensions/archive-movies/manifest.json` | All |
| **Worldwide Live Radio Hub** | Live Audio & Broadcasts | Stream 30,000+ live worldwide radio stations, podcasts, and community broadcasts. | `https://raw.githubusercontent.com/nishantkumrmishra/LuckyGuy--extensions/main/extensions/radio-browser/manifest.json` | All |
| **YouTube Audio Stream Engine** | Media Resolver | High-fidelity YouTube audio stream resolver with format selection and title extraction. | `https://raw.githubusercontent.com/nishantkumrmishra/LuckyGuy--extensions/main/extensions/youtube/manifest.json` | All |
| **Spotify Metadata & Scraper** | Tags & Artwork | Extracts rich Spotify playlist, album, and track metadata with official HD cover art. | `https://raw.githubusercontent.com/nishantkumrmishra/LuckyGuy--extensions/main/extensions/spotify/manifest.json` | All |
| **JioSaavn 320k Studio CDN** | Lossless CDN | Direct pristine 320kbps MP3/AAC CDN media resolver with native crypto DES decryption. | `https://raw.githubusercontent.com/nishantkumrmishra/LuckyGuy--extensions/main/extensions/jiosaavn/manifest.json` | All |
| **SoundCloud Stream Engine** | Streaming | Resolves SoundCloud indie artist streams, live DJ sets, and official remixes. | `https://raw.githubusercontent.com/nishantkumrmishra/LuckyGuy--extensions/main/extensions/soundcloud/manifest.json` | All |
| **Pornhub Video & Crawler** | Adult Media & Stream Resolver | Video resolver and crawler extension with dedicated sidebar tab and back-end ad blocking. | `https://raw.githubusercontent.com/nishantkumrmishra/LuckyGuy--extensions/main/extensions/pornhub/manifest.json` | 18+ |

---

## 🛡️ Architecture & Philosophy

LuckyGuy follows an offline-first, neutral architecture:
- **No Proprietary Scrapers in Core**: The application core contains zero hardcoded scrapers, pirated streams, or adult scripts.
- **User Choice & Explicit Opt-In**: Newly installed plugins are disabled by default. Users have full granular control over which extensions to enable or disable inside the software.
- **User-Declared Dynamic Tabs**: Instead of rigid built-in tabs, plugins declare their own custom tabs directly in LuckyGuy's sidebar.
- **Integrated Back-End Ad Blocker**: Webview portals run through LuckyGuy's ad blocker to strip popunders, malicious redirects, and tracking scripts before media buffers.
- **Open SDK Freedom**: Users and third-party developers can build, distribute, and install custom source plugins, video portals, and webpage crawlers via raw GitHub URLs.

---

## 🛠️ Plugin SDK Specification

Every extension provides a `manifest.json` conforming to [`schema.json`](schema.json):

```json
{
  "id": "my-media-portal",
  "name": "Community Video Portal",
  "version": "1.0.0",
  "type": "portal",
  "rating": "all",
  "description": "Custom media portal with integrated ad blocking and bulk video download",
  "author": "Community Developer",
  "entry": "index.js",
  "tab": {
    "title": "Open Cinema",
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

## 🧪 Testing Plugins Without Compilation

You don't need a code editor, local compiler, or Git repository to test or run extensions:
1. Open **LuckyGuy Desktop → Settings → Plugins**.
2. Click **"Paste Code / JSON"**.
3. Paste your manifest JSON or JS script directly into the box.
4. Click **"Test & Save Script"** to validate syntax and save.
5. Toggle the switch **ON** to activate the tab in your sidebar!

---

## 📄 License
MIT License.
