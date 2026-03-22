
const STORAGE_KEY = 'zionSongsBookDataV1';

const DEFAULT_SONGS = [
  {
    id: 's1',
    title: 'Amazing Grace',
    artist: 'Traditional',
    key: 'G',
    tempo: '72',
    category: 'Worship',
    collection: 'Sunday Service',
    capo: '0',
    lyrics: `[Verse 1]
Amazing grace, how sweet the sound
That saved a wretch like me
I once was lost, but now am found
Was blind, but now I see`,
    chords: `G   C   G
Amazing grace, how sweet the sound
G         D
That saved a wretch like me
G   C    G
I once was lost, but now am found
G        D      G
Was blind, but now I see`,
    favorite: true,
    createdAt: '2026-03-22T00:00:00Z'
  },
  {
    id: 's2',
    title: 'How Great Thou Art',
    artist: 'Carl Boberg',
    key: 'C',
    tempo: '68',
    category: 'Hymn',
    collection: 'Choir',
    capo: '0',
    lyrics: `[Verse 1]
O Lord my God, when I in awesome wonder
Consider all the worlds Thy hands have made`,
    chords: `C      F      C
O Lord my God, when I in awesome wonder
C      G      C
Consider all the worlds Thy hands have made`,
    favorite: false,
    createdAt: '2026-03-22T00:00:00Z'
  },
  {
    id: 's3',
    title: '10,000 Reasons',
    artist: 'Matt Redman',
    key: 'D',
    tempo: '74',
    category: 'Praise',
    collection: 'Youth Worship',
    capo: '0',
    lyrics: `[Chorus]
Bless the Lord, O my soul
O my soul
Worship His holy name`,
    chords: `D      A
Bless the Lord, O my soul
Bm     G
O my soul
D      A      G
Worship His holy name`,
    favorite: true,
    createdAt: '2026-03-22T00:00:00Z'
  }
];

function loadData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const initial = { songs: DEFAULT_SONGS, selectedSongId: DEFAULT_SONGS[0].id };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  try {
    const parsed = JSON.parse(raw);
    if (!parsed.songs || !Array.isArray(parsed.songs)) throw new Error('bad format');
    return parsed;
  } catch {
    const initial = { songs: DEFAULT_SONGS, selectedSongId: DEFAULT_SONGS[0].id };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getSongs() {
  return loadData().songs.sort((a,b)=> a.title.localeCompare(b.title));
}

function setSelectedSong(id) {
  const data = loadData();
  data.selectedSongId = id;
  saveData(data);
}

function getSelectedSong() {
  const data = loadData();
  return data.songs.find(s => s.id === data.selectedSongId) || data.songs[0] || null;
}

function addSong(song) {
  const data = loadData();
  data.songs.push(song);
  data.selectedSongId = song.id;
  saveData(data);
}

function updateSong(songId, patch) {
  const data = loadData();
  data.songs = data.songs.map(s => s.id === songId ? { ...s, ...patch } : s);
  saveData(data);
}

function deleteSong(songId) {
  const data = loadData();
  data.songs = data.songs.filter(s => s.id !== songId);
  if (data.selectedSongId === songId) {
    data.selectedSongId = data.songs[0]?.id || null;
  }
  saveData(data);
}

function resetLibrary() {
  const initial = { songs: DEFAULT_SONGS, selectedSongId: DEFAULT_SONGS[0].id };
  saveData(initial);
}

function songCard(song) {
  return `
    <article class="song">
      <div>
        <h3>${escapeHtml(song.title)}</h3>
        <div class="meta">
          ${escapeHtml(song.artist || 'Unknown artist')} · Key ${escapeHtml(song.key || '-')} · Tempo ${escapeHtml(song.tempo || '-')} BPM
        </div>
        <div class="tags">
          ${song.category ? `<span class="tag">${escapeHtml(song.category)}</span>` : ''}
          ${song.collection ? `<span class="tag">${escapeHtml(song.collection)}</span>` : ''}
          ${song.favorite ? `<span class="tag">Favorite</span>` : ''}
        </div>
      </div>
      <div class="song-actions">
        <a class="btn secondary" href="song-detail.html" onclick="setSelectedSong('${song.id}')">Open</a>
        <button class="btn secondary" onclick="toggleFavorite('${song.id}')">${song.favorite ? 'Unfavorite' : 'Favorite'}</button>
        <button class="btn danger" onclick="removeSong('${song.id}')">Delete</button>
      </div>
    </article>`;
}

function toggleFavorite(songId) {
  const song = getSongs().find(s => s.id === songId);
  if (!song) return;
  updateSong(songId, { favorite: !song.favorite });
  if (typeof renderLibrary === 'function') renderLibrary();
  if (typeof renderCollections === 'function') renderCollections();
}

function removeSong(songId) {
  const song = getSongs().find(s => s.id === songId);
  if (!song) return;
  const ok = confirm(`Delete "${song.title}"?`);
  if (!ok) return;
  deleteSong(songId);
  if (typeof renderLibrary === 'function') renderLibrary();
  if (typeof renderCollections === 'function') renderCollections();
}

function makeSongFromForm(form) {
  const fd = new FormData(form);
  const title = String(fd.get('title') || '').trim();
  if (!title) throw new Error('Song title is required.');
  return {
    id: 'song-' + Date.now(),
    title,
    artist: String(fd.get('artist') || '').trim(),
    key: String(fd.get('key') || '').trim(),
    tempo: String(fd.get('tempo') || '').trim(),
    category: String(fd.get('category') || '').trim(),
    collection: String(fd.get('collection') || '').trim(),
    capo: String(fd.get('capo') || '').trim(),
    lyrics: String(fd.get('lyrics') || '').trim(),
    chords: String(fd.get('chords') || '').trim(),
    favorite: false,
    createdAt: new Date().toISOString()
  };
}

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
