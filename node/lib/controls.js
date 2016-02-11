/**
 * Arduino
 * Wii Nunchuk
 * Node
 * Spotify
 * ...thing
 */

var exec = require('child_process').exec;
var spotify = require("spotify-node-applescript");
var say = require("say");
var config = require("../config.js");
var spotifyApi = require("./spotify-api");

// current output state, to avoid multiple simultaneous commands
var isActive = false;

// update playlists every hour
var playlists;
getPlaylists();

// method called when serial data is received
function processSerialData (data) {
  console.log("data received:", data);
  var dataArray = data.trim().split(", ");

  // if we're currently playing a sound, don't continue
  if (isActive) return;

  switch (dataArray[0]) {
    case "PLAY":
      play(dataArray[1], dataArray[2], dataArray[3]);
      break;
    case "SFX":
      sfx(dataArray[1]);
      break;
    case "TOGGLE":
      toggle();
      break;
    default:
      console.log("Unexpected data", data);
      break;
  }
}

// on play
function play (x, y, z) {
  isActive = true;
  var ave = (parseInt(x, 10) + parseInt(y) + parseInt(z)) / 3;
  var playlist = Math.round(ave) % playlists.length;

  var selectedPlaylist = playlists[playlist];
  var firstTrackRequest = spotifyApi.getFirstTrack(selectedPlaylist);

  firstTrackRequest.then(function (firstTrack) {
    toggle(true);
    playSound("./sfx/fanfare.mp3")
     .then(function () {
        say.speak(config.say.voice, "You have chosen playlist " + playlist + ", " + selectedPlaylist.name, function () {
          isActive = false;
          spotify.playTrackInContext(firstTrack.uri, selectedPlaylist.uri);
          console.log("PLAYING:");
          console.log(selectedPlaylist.name);
          console.log(firstTrack.name);
          console.log("---");
        });
     });
  });
}

// on sfx
function sfx (dir) {
  var file = "./sfx/" + dir + ".mp3";
  playSound(file)
    .then(function () {
      isActive = false;
    });
}

// on toggle play/pause
function toggle (dontPlay) {
  spotify.getState(function (err, state) {
    if (err) {
      console.log(err);
    }
    if (state && state.state === "playing") {
      spotify.pause();
      playSound("./sfx/scratch.mp3")
        .then(function () {
          isActive = false;
        });
    } else if (state && state.state === "paused" && !dontPlay) {
      spotify.play();
    }
  });
}

// play an mp3 sound effect
function playSound (path) {
  isActive = true;
  return new Promise(function (resolve, reject) {
    exec("/usr/bin/afplay " + path, function (error, stdout, stderr) {
      if (error) {
        return reject(error);
      }
      return resolve(true);
    });
  });
}

// retrieve spotify playlists
function getPlaylists () {
  var playlistRequest = spotifyApi.getPlaylists();
  playlistRequest.then(function (data) {
    playlists = data;
  });
  setTimeout(getPlaylists, 1000 * 60 * 60);
}

// api
module.exports = {
  processSerialData: processSerialData
};