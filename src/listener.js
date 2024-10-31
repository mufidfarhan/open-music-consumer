const autoBind = require('auto-bind');

class Listener {
  constructor(playlistsService, mailSender) {
    this._playlistsService = playlistsService;
    this._mailSender = mailSender;

    autoBind(this);
  }

  async listen(message) {
    try {
      const { playlistId, targetEmail } = JSON.parse(message.content.toString());

      const playlists = await this._playlistsService.getSongsInPlaylist(playlistId);

      const prettyJson = JSON.stringify(playlists, null, 2);
      const result = await this._mailSender.sendMail(targetEmail, prettyJson);

      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Listener;
