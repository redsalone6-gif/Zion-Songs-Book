const APP_TITLE = 'Zion Songs Book';
const EXTERNAL_TUNER_URL = 'PUT_YOUR_TUNER_URL_HERE';
const SHEETS = {
  SONGS: 'Songs',
  PLAYLISTS: 'Playlists',
  CHORDS: 'Chords'
};

function doGet() {
  ensureData_();
  const template = HtmlService.createTemplateFromFile('Index');
  template.appTitle = APP_TITLE;
  template.initialData = JSON.stringify(getBootstrapData_());
  template.externalTunerUrl = EXTERNAL_TUNER_URL;
  return template
    .evaluate()
    .setTitle(APP_TITLE)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, viewport-fit=cover');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function setupAppData() {
  ensureData_();
  return getBootstrapData_();
}

function getAppData() {
  ensureData_();
  return getBootstrapData_();
}

function searchSongs(query) {
  ensureData_();
  const q = String(query || '').trim().toLowerCase();
  const songs = getSongs_();
  if (!q) return songs;

  return songs.filter(function(song) {
    return [song.title, song.artist, song.genre, song.key, song.lyrics, song.playlist, song.tags]
      .join(' ')
      .toLowerCase()
      .indexOf(q) !== -1;
  });
}

function getSong(songId) {
  ensureData_();
  const songs = getSongs_();
  const song = songs.find(function(item) { return item.id === songId; });
  if (!song) throw new Error('Song not found.');
  return song;
}

function saveSong(payload) {
  ensureData_();

  if (!payload || !String(payload.title || '').trim()) {
    throw new Error('Title is required.');
  }

  const sheet = getOrCreateSheet_(SHEETS.SONGS, songHeaders_());
  const sheetHeaders = getHeaders_(sheet);
  const songs = getSongsWithRowMeta_();
  const now = new Date().toISOString();
  const id = String(payload.id || '').trim() || Utilities.getUuid();

  const record = {
    id: id,
    title: String(payload.title || '').trim(),
    lyrics: String(payload.lyrics || '').trim(),
    language: String(payload.language || '').trim(),
    key: String(payload.key || '').trim(),
    bpm: String(payload.bpm || payload.tempo || '').trim(),
    duration: String(payload.duration || '').trim(),
    artist: String(payload.artist || '').trim(),
    genre: String(payload.genre || payload.category || '').trim(),
    playlist: String(payload.playlist || '').trim(),
    isFavorite: payload.isFavorite ? 'TRUE' : 'FALSE',
    tags: String(payload.tags || '').trim(),
    notes: String(payload.notes || '').trim(),
    status: String(payload.status || 'Active').trim(),
    chords: String(payload.chords || '').trim(),
    updatedAt: now,
    createdAt: now
  };

  const existing = songs.find(function(item) { return item.id === id; });
  if (existing) {
    record.createdAt = existing.createdAt || now;
  }

  const rowValues = buildRowValuesForHeaders_(sheetHeaders, record, existing ? existing.__raw : null);

  if (existing && existing.__rowNumber) {
    sheet.getRange(existing.__rowNumber, 1, 1, rowValues.length).setValues([rowValues]);
  } else {
    sheet.appendRow(rowValues);
  }

  return getBootstrapData_();
}

function deleteSong(songId) {
  ensureData_();
  const sheet = getOrCreateSheet_(SHEETS.SONGS, songHeaders_());
  const songs = getSongsWithRowMeta_();
  const song = songs.find(function(item) { return item.id === songId; });
  if (!song || !song.__rowNumber) throw new Error('Song not found.');
  sheet.deleteRow(song.__rowNumber);
  return getBootstrapData_();
}

function getBootstrapData_() {
  const songs = getSongs_();
  const playlists = getPlaylists_();
  const chords = getChords_();

  return {
    appTitle: APP_TITLE,
    songs: songs,
    playlists: playlists,
    chords: chords,
    stats: {
      totalSongs: songs.length,
      totalPlaylists: playlists.length,
      favorites: songs.filter(function(song) { return String(song.isFavorite) === 'TRUE'; }).length,
      keysTracked: uniqueCount_(songs.map(function(song) { return song.key; }).filter(Boolean))
    },
    featuredSong: songs[0] || null
  };
}

function getSongs_() {
  return getSongsWithRowMeta_().map(function(song) {
    delete song.__rowNumber;
    delete song.__raw;
    return song;
  });
}

function getSongsWithRowMeta_() {
  const sheet = getOrCreateSheet_(SHEETS.SONGS, songHeaders_());
  const schema = songSchema_();
  return getRowsAsCanonicalObjects_(sheet, schema)
    .filter(function(song) {
      return String(song.title || '').trim() !== '';
    })
    .sort(function(a, b) {
      return String(b.updatedAt || '').localeCompare(String(a.updatedAt || ''));
    });
}

function getPlaylists_() {
  const sheet = getOrCreateSheet_(SHEETS.PLAYLISTS, playlistHeaders_());
  return getRowsAsCanonicalObjects_(sheet, playlistSchema_())
    .map(function(item) {
      item.songIds = item.songIds ? String(item.songIds).split(',').map(function(v) { return v.trim(); }).filter(Boolean) : [];
      delete item.__rowNumber;
      delete item.__raw;
      return item;
    })
    .filter(function(item) {
      return String(item.name || '').trim() !== '';
    });
}

function getChords_() {
  const sheet = getOrCreateSheet_(SHEETS.CHORDS, chordHeaders_());
  return getRowsAsCanonicalObjects_(sheet, chordSchema_())
    .map(function(item) {
      delete item.__rowNumber;
      delete item.__raw;
      return item;
    })
    .filter(function(item) {
      return String(item.name || '').trim() !== '';
    });
}

function ensureData_() {
  getOrCreateSheet_(SHEETS.SONGS, songHeaders_());
  getOrCreateSheet_(SHEETS.PLAYLISTS, playlistHeaders_());
  getOrCreateSheet_(SHEETS.CHORDS, chordHeaders_());
}

function getSpreadsheet_() {
  const props = PropertiesService.getScriptProperties();
  const configuredId = props.getProperty('SPREADSHEET_ID');

  if (configuredId) {
    return SpreadsheetApp.openById(configuredId);
  }

  try {
    const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    if (activeSpreadsheet) {
      props.setProperty('SPREADSHEET_ID', activeSpreadsheet.getId());
      return activeSpreadsheet;
    }
  } catch (err) {
    // Ignore and create a new spreadsheet below.
  }

  const spreadsheet = SpreadsheetApp.create(APP_TITLE + ' Data');
  props.setProperty('SPREADSHEET_ID', spreadsheet.getId());
  return spreadsheet;
}

function getOrCreateSheet_(sheetName, headers) {
  const spreadsheet = getSpreadsheet_();
  let sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  }

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function getHeaders_(sheet) {
  const lastColumn = Math.max(sheet.getLastColumn(), 1);
  const headers = sheet.getRange(1, 1, 1, lastColumn).getDisplayValues()[0].map(String);
  return headers.filter(function(header, index) {
    return index === 0 || header !== '' || headers.slice(index + 1).join('').trim() !== '';
  });
}

function getRowsAsCanonicalObjects_(sheet, schema) {
  const values = sheet.getDataRange().getDisplayValues();
  if (values.length < 2) return [];
  const headers = values[0].map(String);

  return values.slice(1).filter(function(row) {
    return row.join('').trim() !== '';
  }).map(function(row, index) {
    const raw = headers.reduce(function(obj, header, i) {
      obj[header] = row[i];
      return obj;
    }, {});

    const canonical = schema.reduce(function(obj, field) {
      obj[field.key] = getFieldValueFromRaw_(raw, field.aliases);
      return obj;
    }, {});

    canonical.__rowNumber = index + 2;
    canonical.__raw = raw;
    return canonical;
  });
}

function getFieldValueFromRaw_(raw, aliases) {
  const normalizedRaw = {};
  Object.keys(raw).forEach(function(key) {
    normalizedRaw[normalizeHeader_(key)] = raw[key];
  });

  for (let i = 0; i < aliases.length; i++) {
    const value = normalizedRaw[normalizeHeader_(aliases[i])];
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      return String(value).trim();
    }
  }
  return '';
}

function buildRowValuesForHeaders_(headers, record, existingRaw) {
  return headers.map(function(header) {
    const key = canonicalKeyForHeader_(header);
    if (key && record[key] !== undefined) {
      return record[key];
    }
    if (existingRaw && existingRaw[header] !== undefined) {
      return existingRaw[header];
    }
    return '';
  });
}

function canonicalKeyForHeader_(header) {
  const normalized = normalizeHeader_(header);
  const allFields = songSchema_().concat(playlistSchema_()).concat(chordSchema_());
  for (let i = 0; i < allFields.length; i++) {
    if (allFields[i].aliases.some(function(alias) { return normalizeHeader_(alias) === normalized; })) {
      return allFields[i].key;
    }
  }
  return '';
}

function normalizeHeader_(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function uniqueCount_(items) {
  return Object.keys(items.reduce(function(map, item) {
    map[item] = true;
    return map;
  }, {})).length;
}

function songHeaders_() {
  return ['Song ID', 'Title', 'Lyrics', 'Language', 'Key/Scale', 'Tempo', 'Artist/Composer', 'Category', 'Playlist', 'Favorite', 'Tags', 'Notes', 'Status', 'Chords', 'Updated Date', 'Created Date'];
}

function playlistHeaders_() {
  return ['Playlist ID', 'Playlist Name', 'Description', 'Song IDs', 'Updated Date', 'Created Date', 'Status'];
}

function chordHeaders_() {
  return ['Chord ID', 'Chord Name', 'Fingering', 'Notes', 'Chord Type', 'Status'];
}

function songSchema_() {
  return [
    { key: 'id', aliases: ['id', 'song id'] },
    { key: 'title', aliases: ['title', 'song title'] },
    { key: 'lyrics', aliases: ['lyrics'] },
    { key: 'language', aliases: ['language'] },
    { key: 'key', aliases: ['key', 'key/scale', 'scale'] },
    { key: 'bpm', aliases: ['bpm', 'tempo'] },
    { key: 'duration', aliases: ['duration'] },
    { key: 'artist', aliases: ['artist', 'artist/composer', 'composer', 'singer'] },
    { key: 'genre', aliases: ['genre', 'category'] },
    { key: 'playlist', aliases: ['playlist', 'playlist name'] },
    { key: 'isFavorite', aliases: ['isfavorite', 'favorite'] },
    { key: 'tags', aliases: ['tags'] },
    { key: 'notes', aliases: ['notes'] },
    { key: 'status', aliases: ['status'] },
    { key: 'chords', aliases: ['chords'] },
    { key: 'updatedAt', aliases: ['updatedat', 'updated date'] },
    { key: 'createdAt', aliases: ['createdat', 'created date'] }
  ];
}

function playlistSchema_() {
  return [
    { key: 'id', aliases: ['id', 'playlist id'] },
    { key: 'name', aliases: ['name', 'playlist name'] },
    { key: 'description', aliases: ['description'] },
    { key: 'songIds', aliases: ['songids', 'song ids'] },
    { key: 'updatedAt', aliases: ['updatedat', 'updated date'] },
    { key: 'createdAt', aliases: ['createdat', 'created date'] },
    { key: 'status', aliases: ['status'] }
  ];
}

function chordSchema_() {
  return [
    { key: 'id', aliases: ['id', 'chord id'] },
    { key: 'name', aliases: ['name', 'chord name'] },
    { key: 'shape', aliases: ['shape', 'fingering'] },
    { key: 'notes', aliases: ['notes'] },
    { key: 'category', aliases: ['category', 'chord type'] },
    { key: 'status', aliases: ['status'] }
  ];
}
