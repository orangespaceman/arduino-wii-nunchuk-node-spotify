/**
 * Arduino
 * Wii Nunchuk
 * Node
 * Spotify
 * ...thing
 */

var serialport = require("serialport");
var controls = require("./lib/controls");

try {
  var config = require("./config.js");
} catch (e) {
  console.log("ERROR: config.js file is missing");
  console.log("To see available serial ports, run the command:");
  console.log(" $ node list-serial-ports.js");
  process.exit(1);
}

var serialPort = new serialport.SerialPort(config.serial.port, {
  baudrate: config.serial.baudRate,
  parser: serialport.parsers.readline("\n")
}, false);

serialPort.open(function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Arduino serial port connection established");

    serialPort.on("data", controls.processSerialData);
  }
});
