/**
 * Telegram Video & Media Downloader Extension
 * Compliant with @luckyguy/plugin-sdk v2.0.0
 * Supports:
 * 1. Public Channel Web Previews (https://t.me/s/{channel})
 * 2. Direct Post Messages (https://t.me/{channel}/{message_id})
 * 3. Telegram Bot API Token Authentication (https://api.telegram.org/bot<token>)
 */

module.exports = {
  isSupported(url) {
    if (!url) return false;
    return url.includes('t.me') || url.includes('telegram.me') || url.includes('telesco.pe') || url.includes('api.telegram.org');
  },

  /**
   * Normalizes any input query or channel link into a clean Telegram URL
   */
  normalizeUrl(queryOrUrl) {
    if (!queryOrUrl) return 'https://t.me/s/telegram';
    let trimmed = queryOrUrl.trim();
    if (trimmed.startsWith('@')) {
      trimmed = 'https://t.me/s/' + trimmed.substring(1);
    } else if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      trimmed = 'https://t.me/s/' + trimmed;
    }
    // If t.me/channel without /s/, convert to preview /s/channel so it loads publicly
    if (/^https?:\/\/t\.me\/[a-zA-Z0-9_]+$/.test(trimmed) && !trimmed.includes('/s/')) {
      trimmed = trimmed.replace('t.me/', 't.me/s/');
    }
    return trimmed;
  },

  /**
   * Resolves a single Telegram post, video, photo, or Bot API file
   */
  async resolve(url, settings = {}) {
    const targetUrl = this.normalizeUrl(url);

    // 1. Bot API token resolution if botToken is provided and URL is a file_id
    if (settings.botToken && url.startsWith('tgfile:')) {
      const fileId = url.replace('tgfile:', '');
      try {
        const getFileResp = await fetch(`https://api.telegram.org/bot${settings.botToken}/getFile?file_id=${fileId}`);
        if (getFileResp.ok) {
          const fileData = await getFileResp.json();
          if (fileData.ok && fileData.result?.file_path) {
            const streamUrl = `https://api.telegram.org/file/bot${settings.botToken}/${fileData.result.file_path}`;
            return {
              id: 'tg-bot-' + fileId,
              title: 'Telegram Bot Media (' + fileId.substring(0, 8) + ')',
              mediaType: 'video',
              formatType: 'VIDEO',
              streamUrl,
              directStreamUrl: streamUrl,
              qualityLabel: 'Original',
              ext: '.mp4',
              headers: { 'User-Agent': 'LuckyGuy/1.0' }
            };
          }
        }
      } catch (e) {
        console.warn('[TelegramExt] Bot token resolution error:', e.message);
      }
    }

    // 2. Fetch HTML preview of post or channel
    try {
      const resp = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
          'Referer': 'https://t.me/'
        }
      });

      if (!resp.ok) {
        return { error: `Failed to load Telegram content (HTTP ${resp.status})` };
      }

      const html = await resp.text();

      // Check for direct video in post
      const videoMatch = html.match(/<video[^>]*src="([^"]+)"/i);
      const thumbMatch = html.match(/background-image:url\(\x27([^\x27]+)\x27\)/i);
      const textMatch = html.match(/class="tgme_widget_message_text[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
      const title = textMatch ? textMatch[1].replace(/<[^>]+>/g, '').trim().substring(0, 100) : 'Telegram Video';
      const durMatch = html.match(/class="message_video_duration">([^<]+)</i);

      if (videoMatch) {
        return {
          id: 'tg-vid-' + Date.now(),
          title,
          artist: 'Telegram Channel',
          thumbnail: thumbMatch ? thumbMatch[1] : '',
          mediaType: 'video',
          formatType: 'VIDEO',
          duration: durMatch ? durMatch[1] : 'Video',
          qualityLabel: settings.videoQuality || '1080p',
          streamUrl: videoMatch[1],
          directStreamUrl: videoMatch[1],
          ext: '.mp4',
          headers: {
            'Referer': 'https://t.me/',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        };
      }

      if (thumbMatch) {
        return {
          id: 'tg-img-' + Date.now(),
          title: title || 'Telegram Photo',
          artist: 'Telegram Channel',
          thumbnail: thumbMatch[1],
          imageUrl: thumbMatch[1],
          mediaType: 'image',
          formatType: 'IMAGE',
          ext: '.jpg'
        };
      }

      return { error: 'No streamable media found in this Telegram link' };
    } catch (err) {
      return { error: `Telegram extraction failed: ${err.message}` };
    }
  },

  /**
   * Crawls posts, videos, and photos from a Telegram channel preview
   */
  async crawlPage(pageUrl, settings = {}) {
    const targetUrl = this.normalizeUrl(pageUrl);

    try {
      const resp = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
          'Referer': 'https://t.me/'
        }
      });

      if (!resp.ok) return [];
      const html = await resp.text();

      const items = [];
      const seen = new Set();
      const msgBlocks = html.split(/class="tgme_widget_message_wrap/);

      for (let i = 1; i < msgBlocks.length; i++) {
        const block = msgBlocks[i];
        const vidMatch = block.match(/<video[^>]*src="([^"]+)"/i);
        const thumbMatch = block.match(/background-image:url\(\x27([^\x27]+)\x27\)/i);
        const textMatch = block.match(/class="tgme_widget_message_text[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
        const linkMatch = block.match(/class="tgme_widget_message_date"[^>]*href="([^"]+)"/i);
        const viewsMatch = block.match(/class="tgme_widget_message_views">([^<]+)</i);
        const durMatch = block.match(/class="message_video_duration">([^<]+)</i);

        const videoUrl = vidMatch ? vidMatch[1] : null;
        const thumbUrl = thumbMatch ? thumbMatch[1] : null;

        if (!videoUrl && !thumbUrl) continue;

        const rawTitle = textMatch ? textMatch[1].replace(/<[^>]+>/g, '').trim() : '';
        const title = rawTitle ? rawTitle.substring(0, 90) : (videoUrl ? 'Telegram Video Post' : 'Telegram Photo Post');
        const postUrl = linkMatch ? linkMatch[1] : targetUrl;
        const key = videoUrl || thumbUrl || postUrl;

        if (seen.has(key)) continue;
        seen.add(key);

        const isVideo = !!videoUrl;
        const duration = durMatch ? durMatch[1].trim() : (isVideo ? 'HD Video' : 'Original Photo');
        const views = viewsMatch ? viewsMatch[1].trim() + ' views' : 'Telegram Post';

        items.push({
          id: 'tg-' + i + '-' + Date.now().toString(36),
          title,
          thumbnail: thumbUrl || '',
          imageUrl: thumbUrl || null,
          mediaType: isVideo ? 'video' : 'image',
          formatType: isVideo ? 'VIDEO' : 'IMAGE',
          duration,
          quality: settings.videoQuality || '1080p HD',
          views,
          rating: '99%',
          author: targetUrl.split('/').pop().replace('s/', '') || 'Telegram Channel',
          url: postUrl,
          streamUrl: videoUrl || null,
          directStreamUrl: videoUrl || null,
          ext: isVideo ? '.mp4' : '.jpg'
        });
      }

      return items;
    } catch (err) {
      console.warn('[TelegramExt] crawlPage error:', err.message);
      return [];
    }
  }
};
