const { Pool } = require('pg');
const simpleSongModel = require('../utils');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getSongsInPlaylist(playlistId) {
    const query = {
      text:
        `SELECT
          playlists.id AS playlist_id,
          playlists.name,
          songs.id, 
          songs.title, 
          songs.performer 
        FROM
          playlist_songs
        RIGHT JOIN 
          playlists ON playlist_songs.playlist_id = playlists.id
        LEFT JOIN 
          songs ON playlist_songs.song_id = songs.id
        WHERE 
          playlists.id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    const songs = result.rows.length >= 1 && result.rows[0].id ? result.rows.map(simpleSongModel) : [];

    const data = {
      playlist: {
        id: result.rows[0].playlist_id,
        name: result.rows[0].name,
        songs: songs,
      }
    };

    return data;
  }
}


module.exports = PlaylistsService;
