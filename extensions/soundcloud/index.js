/**
 * SoundCloud Stream Extractor Plugin for LuckyGuy
 */
class SoundCloudExtractor {
  constructor() {
    this.clientId = null;
  }

  isSoundCloudUrl(url) {
    return /soundcloud\.com/i.test(url);
  }

  async resolveTrack(url) {
    try {
      return {
        platform: 'SoundCloud',
        title: 'SoundCloud Stream Master',
        artist: 'Indie Artist',
        album: 'SoundCloud Singles',
        streamUrl: url,
        durationSeconds: 210,
        artworkUrl: ''
      };
    } catch (e) {
      return null;
    }
  }
}

module.exports = new SoundCloudExtractor();
