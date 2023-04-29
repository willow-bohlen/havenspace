import * as Tone from 'tone';
import * as instr from './instruments';

let stage = 0;
let pressedPlayer;
let unpressedPlayer; 

let startTime;
let currentTime;
let sectionStartTime;

let crossfadeTime;

let tickFunction = () => {}; 
const crossFade = new Tone.CrossFade().toDestination();

export function init() {
    pressedPlayer = new Tone.Player("https://will-bohlen.github.io/havenspace/src/audio/pressed.wav");
    pressedPlayer.loop = true;
    unpressedPlayer = new Tone.Player("https://will-bohlen.github.io/havenspace/src/audio/unpressed.wav");
    unpressedPlayer.loop = true;

    startTime = new Date().getTime();
}

export function tick() {
    currentTime = new Date().getTime();
    tickFunction();
}

export function advance(pressed: boolean) {
    switch (stage) {
        case 0:
            Tone.Transport.start();

            unpressedPlayer.start();
            pressedPlayer.start();
            unpressedPlayer.connect(crossFade.a);
            pressedPlayer.connect(crossFade.b);
            //unpressedPlayer.mute = true;
            stage++;
            advance(pressed);
            break;
        case 1:
            let distance = (pressed ? 1 - crossFade.fade.value : crossFade.fade.value);
            crossfadeTime = currentTime + (2000 * distance);


            tickFunction = () => {
                if (crossfadeTime >= currentTime) {
                    let cfValue = (crossfadeTime - currentTime) / 2000;
                    if (pressed) cfValue = 1 - cfValue;
                    console.log(cfValue)
                    crossFade.fade.value = cfValue;
                    console.log(crossFade.fade.value)
                }
                if (crossfadeTime < currentTime) {
                    crossFade.fade.value = pressed ? 1 : 0;
                }
            }

            tickFunction();
            //pressedPlayer.mute = !pressed;
            //unpressedPlayer.mute = pressed;
            break;
    }
}