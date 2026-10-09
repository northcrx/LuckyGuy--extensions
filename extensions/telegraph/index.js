/**
 * Telegraph & Telegram Video/Image Downloader Extension
 * Compliant with @luckyguy/plugin-sdk v2.0.0
 */

module.exports = {
  isSupported(url) {
    if (!url) return false;
    return url.includes('telegra.ph') || url.includes('t.me') || url.includes('telegram.me');
  },

  /**
   * Resolves direct media (Images, Photo Albums, and Videos) from article or post
   */
  async resolve(url, settings = {}) {
    try {
      const resp = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
          'Referer': 'https://telegra.ph/'
        }
      });

      if (!resp.ok) {
        return { error: `Failed to fetch page (HTTP ${resp.status})` };
      }

      const html = await resp.text();

      // Extract article title
      const titleMatch = html.match(/<h1[^>]*>(.*?)<\/h1>/i) || html.match(/<title>(.*?)<\/title>/i);
      const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : 'Telegraph Post';

      // Extract images from <figure> <img src="/file/...">
      const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
      const images = [];
      let match;
      while ((match = imgRegex.exec(html)) !== null) {
        let src = match[1];
        if (src.startsWith('/')) {
          src = 'https://telegra.ph' + src;
        }
        if (!images.includes(src) && !src.includes('data:image')) {
          images.push(src);
        }
      }

      // Extract videos from <video src="...">
      const videoRegex = /<video[^>]+src=["']([^"']+)["'][^>]*>/gi;
      const videos = [];
      while ((match = videoRegex.exec(html)) !== null) {
        let vsrc = match[1];
        if (vsrc.startsWith('/')) {
          vsrc = 'https://telegra.ph' + vsrc;
        }
        if (!videos.includes(vsrc)) {
          videos.push(vsrc);
        }
      }

      const isVideo = videos.length > 0;
      const primaryUrl = isVideo ? videos[0] : (images[0] || url);
      const thumbnail = images[0] || '';

      return {
        id: 'telegraph-' + Date.now(),
        title,
        thumbnail,
        mediaType: isVideo ? 'video' : (images.length > 1 ? 'gallery' : 'image'),
        streamUrl: isVideo ? videos[0] : null,
        imageUrl: images[0] || null,
        images,
        videos,
        headers: {
          'Referer': 'https://telegra.ph/',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      };
    } catch (err) {
      return { error: `Telegraph extraction error: ${err.message}` };
    }
  },

  /**
   * Crawls articles, media posts, and galleries from target URL
   */
  async crawlPage(pageUrl, settings = {}) {
    try {
      const resp = await fetch(pageUrl || 'https://telegra.ph', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (!resp.ok) return [];
      const html = await resp.text();

      const items = [];
      const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
      let count = 0;
      let match;

      while ((match = imgRegex.exec(html)) !== null && count < 60) {
        let src = match[1];
        if (src.startsWith('/')) src = 'https://telegra.ph' + src;
        if (!src.includes('data:image')) {
          count++;
          items.push({
            id: `tg-media-${count}`,
            title: `Telegraph Media #${count}`,
            thumbnail: src,
            imageUrl: src,
            mediaType: 'image',
            size: '~2.8 MB',
            url: pageUrl || 'https://telegra.ph'
          });
        }
      }

      return items;
    } catch (err) {
      console.warn('[Telegraph Extension] crawlPage error:', err.message);
      return [];
    }
  }
};
