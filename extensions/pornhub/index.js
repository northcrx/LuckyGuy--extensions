/**
 * Pornhub Stream Resolver & Webpage Batch Crawler Extension
 * Compliant with @luckyguy/plugin-sdk v1.0.0
 */

const VIDEO_KEY_REGEX = /[?&]viewkey=([a-zA-Z0-9_-]+)/;

module.exports = {
  isSupported(url) {
    if (!url) return false;
    return url.includes('pornhub.org') || url.includes('pornhub.com') || url.includes('phncdn.com');
  },

  extractVideoKey(url) {
    if (!url) return null;
    const match = url.match(VIDEO_KEY_REGEX);
    return match ? match[1] : null;
  },

  /**
   * Resolves direct video stream link from video webpage
   */
  async resolve(url) {
    const viewKey = this.extractVideoKey(url);
    if (!viewKey) {
      return { error: 'Invalid Pornhub video URL or viewkey missing.' };
    }

    try {
      const resp = await fetch(`https://www.pornhub.org/view_video.php?viewkey=${viewKey}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Referer': 'https://www.pornhub.org/'
        }
      });

      if (!resp.ok) {
        return { error: `Failed to fetch video page (status ${resp.status})` };
      }

      const html = await resp.text();

      // Extract title
      const titleMatch = html.match(/<h1[^>]*class="[^"]*inlineFree[^"]*"[^>]*>(.*?)<\/h1>/s) ||
                         html.match(/<title>(.*?)<\/title>/);
      let title = titleMatch ? titleMatch[1].replace(' - Pornhub.org', '').replace(' - Pornhub.com', '').trim() : `Video ${viewKey}`;

      // Extract poster / thumbnail
      const thumbMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i) ||
                         html.match(/poster="([^"]+)"/i);
      const thumbnail = thumbMatch ? thumbMatch[1] : '';

      // Extract video duration
      const durationMatch = html.match(/<meta\s+property="video:duration"\s+content="([^"]+)"/i);
      const durationSeconds = durationMatch ? parseInt(durationMatch[1], 10) : 0;

      // Extract flashvars or mediaDefinitions stream sources
      let videoUrl = null;
      let qualities = [];

      const flashvarsMatch = html.match(/flashvars_\d+\s*=\s*({.*?});/s);
      if (flashvarsMatch) {
        try {
          const flashvars = JSON.parse(flashvarsMatch[1]);
          if (flashvars.mediaDefinitions && Array.isArray(flashvars.mediaDefinitions)) {
            const hlsOrMp4 = flashvars.mediaDefinitions.filter(m => m.videoUrl && m.videoUrl.length > 0);
            if (hlsOrMp4.length > 0) {
              // Pick highest quality available (1080p, 720p, 480p)
              hlsOrMp4.sort((a, b) => (parseInt(b.quality, 10) || 0) - (parseInt(a.quality, 10) || 0));
              videoUrl = hlsOrMp4[0].videoUrl;
              qualities = hlsOrMp4.map(m => ({ label: m.quality ? `${m.quality}p` : 'HD', url: m.videoUrl }));
            }
          }
        } catch (e) {}
      }

      // Fallback: look for direct MP4 or master.m3u8 link in scripts
      if (!videoUrl) {
        const hlsMatch = html.match(/(https:\/\/[^"'\s]+\/master\.m3u8[^"'\s]*)/);
        if (hlsMatch) {
          videoUrl = hlsMatch[1];
        }
      }

      return {
        id: viewKey,
        title,
        thumbnail,
        durationSeconds,
        videoUrl: videoUrl || url,
        qualities,
        format: videoUrl?.includes('.m3u8') ? 'HLS' : 'MP4',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Referer': 'https://www.pornhub.org/'
        }
      };
    } catch (err) {
      return { error: `Resolver error: ${err.message}` };
    }
  },

  /**
   * Crawls webpage (search page, category, model channel) and scans 50-200 discovered videos
   */
  async crawlPage(pageUrl) {
    try {
      const resp = await fetch(pageUrl || 'https://www.pornhub.org/video', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Referer': 'https://www.pornhub.org/'
        }
      });

      if (!resp.ok) return [];
      const html = await resp.text();

      const items = [];
      // Match video preview blocks: <li class="...videoBox..." data-video-vkey="ph..." ...>
      const blockRegex = /<li[^>]*data-video-vkey="([^"]+)"[^>]*>([\s\S]*?)<\/li>/gi;
      let match;

      while ((match = blockRegex.exec(html)) !== null && items.length < 150) {
        const vkey = match[1];
        const blockHtml = match[2];

        // Extract title
        const titleMatch = blockHtml.match(/title="([^"]+)"/i) || blockHtml.match(/<span class="title">([^<]+)<\/span>/i);
        const title = titleMatch ? titleMatch[1].trim() : `Video ${vkey}`;

        // Extract thumbnail
        const thumbMatch = blockHtml.match(/data-src="([^"]+)"/i) || blockHtml.match(/src="([^"]+)"/i);
        const thumbnail = thumbMatch ? thumbMatch[1] : '';

        // Extract duration
        const durMatch = blockHtml.match(/<var[^>]*class="duration"[^>]*>([^<]+)<\/var>/i);
        const duration = durMatch ? durMatch[1].trim() : '10:00';

        items.push({
          id: `ph-${vkey}`,
          title,
          thumbnail,
          duration,
          url: `https://www.pornhub.org/view_video.php?viewkey=${vkey}`,
          size: '~120 MB'
        });
      }

      return items;
    } catch (err) {
      console.warn('[Pornhub Plugin] crawlPage error:', err.message);
      return [];
    }
  }
};
