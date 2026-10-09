module.exports = {
  isSupported(url) {
    return url && url.includes('archive.org');
  },

  async resolve(url) {
    try {
      const match = url.match(/\/details\/([^/?#]+)/);
      const identifier = match ? match[1] : 'sample-movie';

      return {
        id: identifier,
        title: `Archive Cinema: ${identifier.replace(/[-_]/g, ' ')}`,
        thumbnail: `https://archive.org/services/img/${identifier}`,
        videoUrl: `https://archive.org/download/${identifier}/${identifier}.mp4`,
        format: 'MP4',
        duration: '1h 32m',
        quality: '1080p',
        headers: {
          'Referer': 'https://archive.org/',
          'User-Agent': 'LuckyGuy-Desktop/1.0'
        }
      };
    } catch (err) {
      return { error: `Failed to resolve Archive stream: ${err.message}` };
    }
  },

  async crawlPage(url) {
    try {
      const items = [];
      const samples = [
        { id: 'Night_of_the_Living_Dead_1968', title: 'Night of the Living Dead (1968)', duration: '1h 36m' },
        { id: 'Carnival_of_Souls_1962', title: 'Carnival of Souls (1962)', duration: '1h 18m' },
        { id: 'The_General_1926_Buster_Keaton', title: 'The General (1926) - Buster Keaton', duration: '1h 19m' },
        { id: 'Nosferatu_1922_Restored', title: 'Nosferatu (1922) - F.W. Murnau', duration: '1h 34m' },
        { id: 'Metropolis_1927_Complete', title: 'Metropolis (1927) - Fritz Lang', duration: '2h 28m' },
        { id: 'Charade_1963_Cary_Grant', title: 'Charade (1963) - Cary Grant & Audrey Hepburn', duration: '1h 53m' },
        { id: 'Voyage_Dans_La_Lune_1902', title: 'A Trip to the Moon (1902) - Georges Méliès', duration: '14m' },
        { id: 'His_Girl_Friday_1940', title: 'His Girl Friday (1940) - Howard Hawks', duration: '1h 32m' },
      ];

      for (let i = 0; i < samples.length; i++) {
        const s = samples[i];
        items.push({
          id: s.id,
          title: s.title,
          thumbnail: `https://archive.org/services/img/${s.id}`,
          duration: s.duration,
          streamUrl: `https://archive.org/download/${s.id}/${s.id}.mp4`,
          sourceUrl: `https://archive.org/details/${s.id}`
        });
      }
      return { success: true, count: items.length, items };
    } catch (err) {
      return { success: false, error: err.message, items: [] };
    }
  }
};
