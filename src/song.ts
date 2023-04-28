import * as Tone from 'tone';
import * as instr from './instruments';

let stage = 0;
let pressedPlayer;
let unpressedPlayer; 

export function init() {
    pressedPlayer = new Tone.Player("https://will-bohlen.github.io/havenspace/src/audio/pressed.wav").toDestination();
    pressedPlayer.loop = true;
    unpressedPlayer = new Tone.Player("https://will-bohlen.github.io/havenspace/src/audio/unpressed.wav").toDestination();
    unpressedPlayer.loop = true;
}

export function advance(pressed: boolean) {
    switch (stage) {
        case 0:
            Tone.Transport.start();

            pressedPlayer.start();
            unpressedPlayer.start();
            unpressedPlayer.mute = true;
            stage++;
            break;
        case 1:
            pressedPlayer.mute = !pressed;
            unpressedPlayer.mute = pressed;
            break;
    }
}