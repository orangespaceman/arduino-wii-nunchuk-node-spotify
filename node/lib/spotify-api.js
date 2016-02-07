/**
 * Arduino
 * Wii Nunchuk
 * Node
 * Spotify
 * ...thing
 */

var SpotifyWebApi = require("spotify-web-api-node");
var config = require("../config.js");

// connect
var spotifyApi = new SpotifyWebApi({
    clientId: config.spotify.clientId,
    clientSecret: config.spotify.clientSecret
});

// get playlists
// (includes access token logic)
function getPlaylists () {

  return new Promise(function(resolve, reject) {

    spotifyApi.clientCredentialsGrant()
      .then(function (data) {
        console.log("Spotify API access token retreived successfully");

        // Save the access token so that it's used in future calls
        spotifyApi.setAccessToken(data.body["access_token"]);

        spotifyApi.getUserPlaylists(config.spotify.user, {limit: 50})
          .then(function (data) {
            console.log("Retrieved playlists");
            var playlists = data.body.items.map(function (playlist) {
              return {
                id: playlist.id,
                uri: playlist.uri,
                owner: playlist.owner.id,
                name: playlist.name
              }
            });
            resolve(playlists);
          },
          function (err) {
            console.log("Something went wrong when retrieving playlists", err);
            reject(err);
          });

      }, function (err) {
        console.log("Something went wrong when retrieving an access token", err);
        reject(err);
      });
  });
}

function getFirstTrack (playlist) {
  return new Promise(function(resolve, reject) {
    spotifyApi.getPlaylistTracks(playlist.owner, playlist.id, {"limit": 1})
      .then(function (data) {
        resolve(data.body.items[0].track);
      },
      function (err) {
        console.log("Something went wrong when retrieving the first track", err);
        reject(err);
      });
  });
}

module.exports = {
  getPlaylists: getPlaylists,
  getFirstTrack: getFirstTrack
};