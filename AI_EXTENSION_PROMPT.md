# LuckyGuy AI Plugin Developer Guide & SDK Specification (v2.0)

Use this guide and prompt to generate extensions for **LuckyGuy Desktop** using AI (ChatGPT, Claude, Gemini, DeepSeek).

---

## 📋 Comprehensive Plugin Capabilities

LuckyGuy extensions can now provide:
1. **Frontend Dedicated Tabs (`tab`)**:
   - Sidebar item with custom icon, URL, and content badge.
   - Layout options: `"cinema"` (75% video player + 25% recommendations), `"gallery"` (images & photo sets), `"feed"`, or `"web"`.
2. **Dedicated Settings Tabs (`settings`)**:
   - Plugins can declare custom configuration options, API keys, download folders, switches, and code hooks.
   - These **automatically appear as a dedicated settings sub-tab in LuckyGuy Preferences**!
3. **Dual Media Support (`mediaTypes`)**:
   - Support for downloading **Videos** (`MP4`, `HLS`, `WebM`) and **Images** (`JPG`, `PNG`, `WebP`, photo galleries/albums).
4. **Domain Aliases & Regional Unblocking (`domainAliases`)**:
   - Automatic fallback from ISP-blocked domains (e.g., `pornhub.com` -> `pornhub.org`).
5. **Cookie Injection (`cookies`)**:
   - Pre-inject age-gate disclaimer or authentication cookies.
6. **Built-in Ad Blocking (`adBlockRules`)**:
   - Domain rules to eliminate redirects, popunders, and tracking scripts.

---

## 📋 Copy & Paste This Prompt to Your AI

```markdown
You are an expert JavaScript extension developer for LuckyGuy Desktop (an Electron/React media manager, stream player, and batch downloader).
Your task is to build a complete LuckyGuy extension based on the specifications below.

### Plugin Manifest Template (manifest.json):
{
  "id": "luckyguy-ext-myplugin",
  "name": "My Plugin Display Name",
  "version": "1.0.0",
  "type": "hybrid", // "audio" | "video" | "crawler" | "portal" | "hybrid"
  "rating": "all",  // "all" | "mature" | "18+"
  "description": "Short explanation of the plugin",
  "author": "Author Name",
  "entry": "index.js",
  "mediaTypes": ["video", "image"], // "video", "image", "audio"
  
  // 1. Frontend Tab in Main Sidebar
  "tab": {
    "title": "Sidebar Label",
    "icon": "DownloadCloud", // Film, Sparkles, Image, Compass, DownloadCloud
    "url": "https://example-source.com",
    "badge": "MEDIA",
    "viewLayout": "cinema" // "cinema" | "gallery" | "feed" | "web"
  },

  // 2. Dedicated Back-end Settings Tab in Preferences
  "settings": {
    "title": "My Plugin Configuration",
    "description": "Configure API credentials, media resolution, and storage behavior",
    "fields": [
      {
        "id": "apiToken",
        "label": "API Access Token (Optional)",
        "type": "password",
        "placeholder": "Enter secret token..."
      },
      {
        "id": "mediaFilter",
        "label": "Download Target",
        "type": "select",
        "options": [
          { "label": "All Media (Videos & Images)", "value": "all" },
          { "label": "Images Only", "value": "images" },
          { "label": "Videos Only", "value": "videos" }
        ],
        "defaultValue": "all"
      },
      {
        "id": "autoBatchGalleries",
        "label": "Auto-Download Albums / Galleries",
        "type": "boolean",
        "defaultValue": true,
        "description": "Batch download all images found inside a post"
      },
      {
        "id": "customFolder",
        "label": "Custom Download Folder",
        "type": "folder",
        "placeholder": "Default Music & Downloads folder"
      },
      {
        "id": "customCode",
        "label": "Custom Post-Processing Script (JavaScript)",
        "type": "code",
        "placeholder": "function onExtract(items) { return items; }"
      }
    ]
  },

  // 3. Domain Aliases (Regional ISP Unblocking)
  "domainAliases": [
    { "from": "blocked-site.com", "to": "unblocked-site.org" }
  ],

  // 4. Session Cookies
  "cookies": [
    { "name": "age_verified", "value": "1", "url": "https://example-source.com" }
  ],

  "capabilities": ["stream", "crawlPage", "download", "imageGallery", "adblock"],
  "supportedUrls": ["*://example-source.com/*"],
  "adBlockRules": [
    "*://*.popunder-ad.com/*",
    "*://*.trackers.net/*"
  ]
}

### Plugin Implementation Template (index.js):
module.exports = {
  isSupported(url) {
    return url && (url.includes('example-source.com') || url.includes('unblocked-site.org'));
  },

  // 1. Single Media / Post / Album Resolver
  async resolve(url, settings = {}) {
    try {
      const resp = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      const html = await resp.text();

      // Return video stream OR image album
      return {
        id: 'post-1',
        title: 'Media Post Title',
        thumbnail: 'https://.../preview.jpg',
        mediaType: 'video', // 'video' | 'image' | 'gallery'
        videoUrl: 'https://.../stream.mp4',
        images: [
          'https://.../image1.jpg',
          'https://.../image2.jpg'
        ],
        headers: {
          'Referer': url
        }
      };
    } catch (err) {
      return { error: `Resolution failed: ${err.message}` };
    }
  },

  // 2. Batch Webpage / Channel / Feed Crawler
  async crawlPage(pageUrl, settings = {}) {
    try {
      // Scrape media items from the page
      return [
        {
          id: 'item-1',
          title: 'Article / Post Title',
          thumbnail: 'https://.../thumb.jpg',
          mediaType: 'image',
          imageUrl: 'https://.../original.jpg',
          size: '~4.2 MB',
          url: pageUrl
        }
      ];
    } catch (err) {
      return [];
    }
  }
};
```

---

## 🚀 How to Run in LuckyGuy
1. Open **LuckyGuy** → **Settings** → **Plugins & Extensions**.
2. Click **Paste Code / JSON** and paste your `manifest.json` and `index.js`.
3. Toggle the extension **ON**.
4. Notice your dedicated **Frontend Tab** appears in the main sidebar, and your dedicated **Settings Tab** appears under Preferences!
