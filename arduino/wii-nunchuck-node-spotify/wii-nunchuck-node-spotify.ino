/**
 * Arduino
 * Wii Nunchuk
 * Node
 * Spotify
 * ...thing
 */

#include <math.h>
#include "Wire.h"
#include "WiiChuck.h"

WiiChuck chuck = WiiChuck();

/*
 * init vars
 */

// accelerometer
int x = 0;
int y = 0;
int z = 0;

// joystick
int joyX = 0;
int joyY = 0;
int dir = 0;

// debounce
long lastDebounceTime = 0;
long debounceDelay = 1000;

// serial output
String output;

// play/pause
const int buttonPin = 3;
int buttonState = 0;

// led
const int rLedPin = 11;
const int gLedPin = 10;
const int bLedPin = 9;


/*
 * setup
 */
void setup() {
  Serial.begin(9600);
  chuck.begin();
  chuck.update();
  pinMode(buttonPin, INPUT);
  pinMode(rLedPin, OUTPUT);
  pinMode(gLedPin, OUTPUT);
  pinMode(bLedPin, OUTPUT);
}


/*
 * loop
 */
void loop() {

  delay(10);

  chuck.update();

  buttonState = digitalRead(buttonPin);

  // reset output values for each loop
  output = "";

  readAccel();
  readStick();

  // check for C button - used to play sound effect based on up/down/left/right
  if (chuck.buttonC) {
    output = "SFX, " + String(dir);
  }

  // check for Z button - used to calculate playlist number based on XYZ
  if (chuck.buttonZ) {
    output = "PLAY, " + String(x) + ", " + String(y) + ", " + String(z);
  }

  // check for button press - toggle music
  if (buttonState == HIGH) {
    output = "TOGGLE";
  }

  // update LED light based on XYZ
  analogWrite(rLedPin, x);
  analogWrite(gLedPin, y);
  analogWrite(bLedPin, z);

  // output?
  if (output.length() > 0 && (millis() - lastDebounceTime) > debounceDelay) {
    Serial.print(output);
    Serial.println();
    lastDebounceTime = millis();
  }
}


// read accelerometer data and calculate average
void readAccel() {
  x = (int)chuck.readAccelX();
  y = (int)chuck.readAccelY();
  z = (int)chuck.readAccelZ();

  x = abs(x);
  y = abs(y);
  z = abs(z);

  if (x > 250) {
    x = 250;
  }
  if (y > 250) {
    y = 250;
  }
  if (z > 250) {
    z = 250;
  }
}


// read joystick data and calculate direction
void readStick() {

  joyX = chuck.readJoyX();
  joyY = chuck.readJoyY();

  // high value, based on joystick extremes
  // values above this limit dictates joystick direction
  int limit = 120;

  dir = 0; // default direction, none

  if (joyX >  -limit && joyX <   limit && joyY >=  limit) { dir = 1; } // up
  if (joyX >  -limit && joyX <   limit && joyY <= -limit) { dir = 5; } // down
  if (joyX >=  limit && joyY >  -limit && joyY <   limit) { dir = 3; } // right
  if (joyX <= -limit && joyY >  -limit && joyY <   limit) { dir = 7; } // left

  if (joyX >=  limit && joyY >=  limit) { dir = 2; } // up-right
  if (joyX >=  limit && joyY <= -limit) { dir = 4; } // down-right
  if (joyX <= -limit && joyY <= -limit) { dir = 6; } // down-left
  if (joyX <= -limit && joyY >=  limit) { dir = 8; } // up-left
}

