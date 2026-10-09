module.exports = {
  isSupported(url) {
    return url && (url.includes('radio-browser') || url.includes('stream') || url.includes('somafm'));
  },

  async resolve(url) {
    return {
      id: 'radio-live',
      title: 'Worldwide Live Broadcast',
      thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300',
      videoUrl: url,
      format: 'MP3/Live',
      isLive: true
    };
  },

  async crawlPage(url) {
    const stations = [
      { id: 'rp-main', title: 'Radio Paradise (Eclectic Mix 320k)', streamUrl: 'https://stream.radioparadise.com/mp3-320', duration: 'Live' },
      { id: 'rp-rock', title: 'Radio Paradise (Rock Mix 320k)', streamUrl: 'https://stream.radioparadise.com/rock-320', duration: 'Live' },
      { id: 'rp-mellow', title: 'Radio Paradise (Mellow Mix 320k)', streamUrl: 'https://stream.radioparadise.com/mellow-320', duration: 'Live' },
      { id: 'chillhop', title: 'Chillhop Radio (Lofi Beats 24/7)', streamUrl: 'https://stream.chillhop.com/live', duration: 'Live' },
      { id: 'somafm-groovesalad', title: 'SomaFM Groove Salad (Ambient Beats)', streamUrl: 'https://ice1.somafm.com/groovesalad-256-mp3', duration: 'Live' },
      { id: 'somafm-defcon', title: 'SomaFM DEF CON Radio (Hacker Beats)', streamUrl: 'https://ice1.somafm.com/defcon-256-mp3', duration: 'Live' },
    ];
    return {
      success: true,
      count: stations.length,
      items: stations.map(s => ({
        id: s.id,
        title: s.title,
        thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300',
        duration: s.duration,
        streamUrl: s.streamUrl,
        sourceUrl: url
      }))
    };
  }
};
