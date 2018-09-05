# Arduino Wii Nunchuk Node Spotify

## Post

 - [https://f90.co.uk/labs/arduino-wii-nunchuk-node-spotify/](https://f90.co.uk/labs/arduino-wii-nunchuk-node-spotify/)

## Setup

To set up the controller:

1. Upload the Arduino sketch to the board

	*Note that it may be necessary to add the WiiChuck.zip file in the repo to your Arduino library, instructions for how to do this can be found [here](https://www.arduino.cc/en/Guide/Libraries#toc4)*

2. Set up the Arduino board (see the photos in the post above)
3. Clone this repo from Github
4. Install dependencies:

	```
	$ npm install
	```

5. Duplicate `config.example.js`, call is `example.js` and enter the relevant data

 - Change the default voice by editing the value of `say`
 - Update the location of the SerialPort (see below)
 - Update the Spotify user credentials. Developer API details can be set up at [https://developer.spotify.com/my-applications](https://developer.spotify.com/my-applications)

6. Run the app: 

	```
	$ node index.js
	```


### Serial port

To check the correct serial port, you can run the `list-serial-ports.js` script: 

```
$ node list-serial-ports.js
```
