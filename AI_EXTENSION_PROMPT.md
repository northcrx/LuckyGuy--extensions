# LuckyGuy AI Plugin Developer Guide & SDK Specification (v3.0)

Use this guide and prompt to generate extensions for **LuckyGuy Desktop** using AI (ChatGPT, Claude, Gemini, DeepSeek).

---

## 📋 Comprehensive Plugin Architecture & Learnings

LuckyGuy Desktop provides an extensible, plugin-driven architecture for media discovery, crawler scraping, multi-quality video streaming, and chunked batch downloading.

### 1. Naming & Duo-Tone Icon Consistency
- **Exact Brand Naming**: Always use the clean, exact name without redundant suffixes (e.g. use `"Pornhub"`, NOT `"Pornhub Provider"` or `"Pornhub Portal"`; use `"Telegram"`, NOT `"Telegram Downloader"`).
- **UI-Matched Duo-Tone Icons**: Icons match the duo-tone aesthetic of LuckyGuy (`DuoVideo`, `DuoPornhub`, `DuoLibrary`, `DuoHome`, `DuoDownload`). In manifests, specify icon tokens such as `"Pornhub"`, `"Video"`, `"Film"`, `"Send"`, `"DownloadCloud"`, or `"Image"`.

### 2. Headless Crawler & Auto-Scroller Pipeline
- **Dynamic DOM Inspection**: Extracts media items rendered client-side or loaded via AJAX/WebSockets.
- **Auto-Scrolling**: Handles lazy-loading by simulating smooth scroll steps (`window.scrollTo({ top, behavior: 'smooth' })`).
- **Lazy Image Fallbacks**: Websites use varying thumbnail attributes. Inspect the entire fallback chain:
  `img.getAttribute('data-mediumthumb') || img.getAttribute('data-image') || img.getAttribute('data-thumb_url') || img.getAttribute('data-src') || img.getAttribute('src')`.
- **Deduplication**: Deduplicate items by normalized ID or canonical URL to avoid duplicates during infinite scrolling.

### 3. Video Provider & Multi-Quality Stream Resolution
- **Inline Script Extraction**: Scrape direct stream definitions from inline objects like `flashvars`, `mediaDefinitions`, or JSON endpoints rather than relying on browser frames.
- **Multiple Quality Tiers**: Return an array of resolutions (`1080p 60fps`, `1080p`, `720p`, `480p`) with direct `.mp4` URLs.
- **Required CDN Headers**: CDNs frequently reject requests or drop connections with `ECONNRESET` without legitimate headers. Always provide `Referer` (matching the source site) and a modern `User-Agent`.

### 4. Custom Video Player & Videos Tab Indexing
- **Flush Top Layout**: Playback opens flush at the top without redundant browser toolbars.
- **In-Player Quality Selector**: Switch between extracted quality tiers without losing playback position.
- **Direct Download Button**: Download the active stream directly within the player.
- **Automatic Videos Tab Indexing**: Downloaded video files (`formatType === 'VIDEO'`) are automatically routed to the user's `Videos` folder and indexed in the **Videos** tab for offline playback.

### 5. Domain Unblocking & Ad Protection
- **Domain Aliases**: Unblock ISP-blocked domains automatically (e.g. `pornhub.com` -> `pornhub.org`).
- **Pre-Navigation Cookies**: Inject age disclaimer or session cookies (`accessAgeDisclaimerPH`, `age_verified`, `cookieConsent`) before requests are initiated.
- **Network-Level Ad Blocking**: Block ad tracking networks (`trafficjunky`, `hubtraffic`, `popunder`, `adservice`, `tsyndicate`) before requests hit the network stack.

---

## 📋 Copy & Paste This Prompt to Your AI

```markdown
You are an expert JavaScript extension developer for LuckyGuy Desktop (an Electron/React media manager, stream player, and batch downloader).
Your task is to build a complete LuckyGuy extension based on the v3.0 SDK specifications below.

### Plugin Manifest Template (manifest.json):
{
  "id": "luckyguy-ext-myservice",
  "name": "MyService", // Exact name: NO "Provider", NO "Portal", NO "Engine"
  "version": "1.0.0",
  "type": "portal", // "audio" | "video" | "crawler" | "portal" | "hybrid"
  "rating": "all",  // "all" | "mature" | "18+"
  "description": "Video resolver and crawler extension with multi-quality streaming and batch downloader.",
  "author": "Community Contributor",
  "entry": "index.js",
  "mediaTypes": ["video", "image"], // "video", "image", "audio"
  
  // 1. Frontend Tab in Main Sidebar
  "tab": {
    "title": "MyService", // Exact clean name matching the service
    "icon": "Video",      // Pornhub, Video, Film, Send, DownloadCloud, Image, Sparkles
    "url": "https://myservice.org",
    "viewLayout": "cinema" // "cinema" (video streaming focus) | "gallery" | "feed" | "web"
  },

  // 2. Crawler & Auto-Scroller Configuration
  "crawler": {
    "scrollStrategy": {
      "step": 600,
      "interval": 800,
      "maxScrollCycles": 8
    },
    "mediaGrid": {
      "itemSelector": ".media-item, .video-card",
      "titleSelector": ".title, h2, h3",
      "lazyAttributes": [
        "data-mediumthumb",
        "data-image",
        "data-thumb_url",
        "data-src",
        "src"
      ],
      "durationSelector": ".duration, .time",
      "uploaderSelector": ".uploader, .channel, .author"
    }
  },

  // 3. Multi-Quality Stream Resolver & CDN Headers
  "streamResolver": {
    "formats": ["MP4", "HLS"],
    "defaultQuality": "1080p",
    "headers": {
      "Referer": "https://myservice.org/",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    }
  },

  // 4. Custom Video Player Integration
  "videoPlayer": {
    "flushTop": true,
    "qualitySelector": true,
    "directDownload": true,
    "autoIndexToVideosTab": true
  },

  // 5. Downloader & Directory Routing
  "downloader": {
    "targetDirectory": "Videos", // "Videos" for video files, "Downloads", or "Music"
    "rangeHeaders": true,
    "retryOnReset": true
  },

  // 6. Dedicated Settings Sub-Tab
  "settings": {
    "title": "MyService Configuration",
    "description": "Configure video resolution, crawler depth, and custom download folder",
    "fields": [
      {
        "id": "preferredQuality",
        "label": "Preferred Video Quality",
        "type": "select",
        "options": [
          { "label": "1080p Full HD", "value": "1080p" },
          { "label": "720p HD", "value": "720p" },
          { "label": "480p Standard", "value": "480p" }
        ],
        "defaultValue": "1080p"
      },
      {
        "id": "customFolder",
        "label": "Custom Video Storage Folder",
        "type": "folder",
        "placeholder": "Default Videos folder"
      }
    ]
  },

  // 7. Domain Aliases (Regional ISP Unblocking)
  "domainAliases": [
    { "from": "myservice.com", "to": "myservice.org" }
  ],

  // 8. Session / Age-Verification Cookies
  "cookies": [
    { "name": "age_verified", "value": "1", "url": "https://myservice.org" },
    { "name": "cookieConsent", "value": "1", "url": "https://myservice.org" }
  ],

  "capabilities": ["stream", "crawlPage", "search", "videoPlayer", "download", "adblock"],
  "supportedUrls": ["*://*.myservice.org/*", "*://*.myservice.com/*"],
  "adBlockRules": [
    "*://*.popunder*/*",
    "*://*.adservice*/*",
    "*://*.trackers*/*"
  ]
}

### Plugin Implementation Template (index.js):
module.exports = {
  isSupported(url) {
    return url && (url.includes('myservice.org') || url.includes('myservice.com'));
  },

  // 1. Single Video / Media Stream Resolver
  async resolve(url, settings = {}) {
    try {
      const resp = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Referer': 'https://myservice.org/'
        }
      });
      const html = await resp.text();

      // Extract title, thumbnail, duration
      const titleMatch = html.match(/<h1[^>]*>(.*?)<\/h1>/i) || html.match(/<title>(.*?)<\/title>/i);
      const title = titleMatch ? titleMatch[1].replace(/ - MyService.*/i, '').trim() : 'Video';

      const thumbMatch = html.match(/<meta property="og:image" content="([^"]+)"/i) || html.match(/poster="([^"]+)"/i);
      const thumbnail = thumbMatch ? thumbMatch[1] : '';

      // Extract multi-quality stream sources
      const qualities = [
        { label: '1080p', url: 'https://cdn.myservice.org/video_1080p.mp4' },
        { label: '720p', url: 'https://cdn.myservice.org/video_720p.mp4' },
        { label: '480p', url: 'https://cdn.myservice.org/video_480p.mp4' }
      ];

      return {
        id: 'vid-' + Date.now(),
        title,
        thumbnail,
        videoUrl: qualities[0].url,
        qualities,
        format: 'MP4',
        formatType: 'VIDEO',
        mediaType: 'video',
        headers: {
          'Referer': 'https://myservice.org/',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
        }
      };
    } catch (err) {
      return { error: `Stream resolution failed: ${err.message}` };
    }
  },

  // 2. Batch Webpage / Category / Search Crawler
  async crawlPage(pageUrl, settings = {}) {
    try {
      const resp = await fetch(pageUrl || 'https://myservice.org/videos', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Referer': 'https://myservice.org/'
        }
      });
      const html = await resp.text();

      const items = [];
      // Parse cards from HTML or JSON
      return items;
    } catch (err) {
      return [];
    }
  }
};
```

---

## 🚀 How to Test in LuckyGuy
1. Open **LuckyGuy** → **Settings** → **Plugins & Extensions**.
2. Click **Paste Code / JSON** and paste your `manifest.json` and `index.js`.
3. Toggle the extension **ON**.
4. Notice your dedicated **Frontend Tab** appears in the sidebar with matching duo-tone iconography.
5. Watch videos flush at the top with in-player quality selectors and one-click downloading, automatically indexed into the **Videos** tab!
