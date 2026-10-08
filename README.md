# LuckyGuy Extensions Repository

Official community extensions repository and plugin engines for [LuckyGuy Desktop](https://github.com/nishantkumrmishra/LuckyGuy).

---

## 📦 What is This Repository?

LuckyGuy follows a modular extension architecture. The core application serves as a clean, offline-first music manager and audio player. Streaming providers, media resolvers, and metadata scrapers are modularized into extensions.

Users can install any plugin by entering its GitHub URL in **Settings > Plugins & Extensions > Install Extension from URL**.

---

## 🧩 Available Extensions

| Extension | Category | Description | Manifest URL |
| :--- | :--- | :--- | :--- |
| **YouTube Audio Stream Engine** | Media Resolver | High-fidelity YouTube stream resolver with direct audio extraction | [manifest.json](https://raw.githubusercontent.com/nishantkumrmishra/LuckyGuy--extensions/main/extensions/youtube/manifest.json) |
| **Spotify Metadata Scraper** | Tags & Artwork | Scrapes track, album, and playlist metadata with official HD cover artwork | [manifest.json](https://raw.githubusercontent.com/nishantkumrmishra/LuckyGuy--extensions/main/extensions/spotify/manifest.json) |
| **JioSaavn 320k Studio CDN** | Lossless CDN | Pristine 320kbps AAC/MP3 CDN stream decipher with native crypto decryption | [manifest.json](https://raw.githubusercontent.com/nishantkumrmishra/LuckyGuy--extensions/main/extensions/jiosaavn/manifest.json) |
| **SoundCloud Stream Engine** | Streaming | Resolves indie SoundCloud releases, live DJ sets, and remixes | [manifest.json](https://raw.githubusercontent.com/nishantkumrmishra/LuckyGuy--extensions/main/extensions/soundcloud/manifest.json) |

---

## 🛠️ How to Install in LuckyGuy

1. Open **LuckyGuy**.
2. Click **Settings** in the bottom sidebar.
3. Select **Plugins & Extensions**.
4. Paste the Extension Manifest URL or repository link:
   ```text
   https://raw.githubusercontent.com/nishantkumrmishra/LuckyGuy--extensions/main/extensions/youtube/manifest.json
   ```
5. Click **Install Plugin**. LuckyGuy will register and enable the engine without interrupting playback.

---

## 🚀 Creating a Custom Extension

Every extension must supply a `manifest.json` adhering to the [schema.json](schema.json):

```json
{
  "id": "my-custom-plugin",
  "name": "My Custom Music Engine",
  "version": "1.0.0",
  "description": "Resolves audio streams from my source",
  "author": "Your Name",
  "entry": "index.js",
  "capabilities": ["stream", "metadata"],
  "supportedUrls": ["*://mysite.com/*"]
}
```

Implement your extractor in `index.js`:
```javascript
module.exports = {
  isSupported(url) {
    return url.includes('mysite.com');
  },
  async resolve(url) {
    return {
      title: 'Track Title',
      artist: 'Artist Name',
      streamUrl: 'https://...',
      durationSeconds: 200
    };
  }
};
```

---

## 📜 License
MIT License.
