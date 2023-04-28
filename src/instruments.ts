import * as Tone from 'tone';

export const pressedPlayer = new Tone.Player("./audio/pressed.wav").toDestination();
pressedPlayer.loop = true;
export const unpressedPlayer = new Tone.Player("./audio/unpressed.wav").toDestination();
unpressedPlayer.loop = true;