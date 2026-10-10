# LuckyGuy Extensions & Plugins SDK (v3.0)

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
5. All extensions will be indexed and registered in your library immediately!
6. **Complete User Freedom**: All extensions are installed **disabled by default**. It is entirely up to you inside the software to toggle **ON** only the extensions and stream portals you actually want, leaving the rest disabled.

---

## 📦 Individual Extension Manifest URLs

If you prefer to install only specific standalone extensions rather than indexing the entire suite, use any of the direct URLs below:

| Extension Name | Category | Description | Standalone Manifest URL (Copy & Paste in App) | Rating |
| :--- | :--- | :--- | :--- | :--- |
| **Archive Cinema & Movies** | Cinema & Video Portal | Stream public domain films, classic documentaries, and open culture videos with ad-blocker & batch crawler. | `https://raw.githubusercontent.com/nishantkumrmishra/LuckyGuy--extensions/main/extensions/archive-movies/manifest.json` | All |
| **Worldwide Live Radio Hub** | Live Audio & Broadcasts | Stream 30,000+ live worldwide radio stations, podcasts, and community broadcasts. | `https://raw.githubusercontent.com/nishantkumrmishra/LuckyGuy--extensions/main/extensions/radio-browser/manifest.json` | All |
| **Telegram** | Video & Media Downloader | Download original high-speed videos, voice notes, photos, and media from Telegram channels, posts, and bots. | `https://raw.githubusercontent.com/nishantkumrmishra/LuckyGuy--extensions/main/extensions/telegram/manifest.json` | All |
| **YouTube Audio Stream Engine** | Media Resolver | High-fidelity YouTube audio stream resolver with format selection and title extraction. | `https://raw.githubusercontent.com/nishantkumrmishra/LuckyGuy--extensions/main/extensions/youtube/manifest.json` | All |
| **Spotify Metadata & Scraper** | Tags & Artwork | Extracts rich Spotify playlist, album, and track metadata with official HD cover art. | `https://raw.githubusercontent.com/nishantkumrmishra/LuckyGuy--extensions/main/extensions/spotify/manifest.json` | All |
| **JioSaavn 320k Studio CDN** | Lossless CDN | Direct pristine 320kbps MP3/AAC CDN media resolver with native crypto DES decryption. | `https://raw.githubusercontent.com/nishantkumrmishra/LuckyGuy--extensions/main/extensions/jiosaavn/manifest.json` | All |
| **SoundCloud Stream Engine** | Streaming | Resolves SoundCloud indie artist streams, live DJ sets, and official remixes. | `https://raw.githubusercontent.com/nishantkumrmishra/LuckyGuy--extensions/main/extensions/soundcloud/manifest.json` | All |
| **Pornhub** | Video & Media | Video resolver and crawler extension with dedicated sidebar tab, multi-quality video player, and back-end ad blocking. | `https://raw.githubusercontent.com/nishantkumrmishra/LuckyGuy--extensions/main/extensions/pornhub/manifest.json` | 18+ |

---

## 🛡️ Architecture & Philosophy

LuckyGuy follows an offline-first, neutral architecture:
- **Exact Brand Naming**: Extensions use exact, canonical names (e.g. `Pornhub`, `Telegram`) with no unnecessary suffixes like "Provider" or "Portal".
- **Duo-Tone UI Cohesion**: Icons seamlessly match LuckyGuy's minimalist duo-tone styling (`DuoVideo`, `DuoPornhub`, `DuoLibrary`, `DuoHome`, `DuoDownload`).
- **Headless Crawler & Auto-Scroller**: Webview background scrapers simulate smooth page scrolling, trigger dynamic AJAX/DOM insertion, resolve image fallback attribute chains (`data-mediumthumb`, `data-image`, `data-src`), and deduplicate cards.
- **Dedicated Videos Tab Indexing**: Downloaded video files are automatically organized into the user's `Videos` folder and indexed in the unified **Videos** tab for offline playback.
- **In-App Flush Video Player**: Native video player starts flush at the top with multi-quality resolution selectors (`1080p`, `720p`, `480p`) and one-click in-player download buttons.
- **Integrated Back-End Ad Blocker**: Webview portals run through LuckyGuy's ad blocker to strip popunders, malicious redirects, and tracking scripts before media buffers.
- **Chunked HTTP Range Resuming**: CDNs are accessed with exact `Referer` and `User-Agent` headers with automatic reconnect and resume for interrupted downloads.

---

## 🛠️ Plugin SDK Specification

Every extension provides a `manifest.json` conforming to [`schema.json`](schema.json):

```json
{
  "id": "luckyguy-ext-myservice",
  "name": "MyService",
  "version": "1.0.0",
  "type": "portal",
  "rating": "all",
  "description": "Video resolver and crawler extension with multi-quality streaming and batch downloader",
  "author": "Community Developer",
  "entry": "index.js",
  "tab": {
    "title": "MyService",
    "icon": "Video",
    "url": "https://myservice.org",
    "viewLayout": "cinema"
  },
  "capabilities": ["stream", "crawlPage", "videoPlayer", "download", "adblock"],
  "supportedUrls": ["*://*.myservice.org/*"]
}
```

### Implementing `index.js`
Your plugin exports standard lifecycle hooks:

```javascript
module.exports = {
  // 1. URL pattern check
  isSupported(url) {
    return url && url.includes('myservice.org');
  },

  // 2. Single Video Stream Resolver (with multi-quality tiers & CDN headers)
  async resolve(url) {
    return {
      title: 'Video Title',
      thumbnail: 'https://cdn.myservice.org/thumb.jpg',
      videoUrl: 'https://cdn.myservice.org/1080p.mp4',
      qualities: [
        { label: '1080p', url: 'https://cdn.myservice.org/1080p.mp4' },
        { label: '720p', url: 'https://cdn.myservice.org/720p.mp4' },
        { label: '480p', url: 'https://cdn.myservice.org/480p.mp4' }
      ],
      format: 'MP4',
      formatType: 'VIDEO',
      mediaType: 'video',
      headers: {
        'Referer': 'https://myservice.org/',
        'User-Agent': 'Mozilla/5.0 ...'
      }
    };
  },

  // 3. Batch Webpage Crawler (Auto-scrolled DOM cards)
  async crawlPage(pageUrl) {
    return [
      {
        id: 'vid-101',
        title: 'Video Title #1',
        thumbnail: 'https://.../thumb.jpg',
        duration: '12:45',
        size: '120 MB',
        url: 'https://myservice.org/view/101'
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
