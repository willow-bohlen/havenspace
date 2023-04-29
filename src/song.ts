import * as Tone from 'tone';
import * as instr from './instruments';

let stage = 0;
let chordPlayer;
let dronePlayer;
let pressedPlayer;
let unpressedPlayer; 

let startTime;
let currentTime;
let sectionStartTime;

let currentChord = 0;
const chordTimings = [[0, 0, 4], [4, 4, 8], [8, 8, 12], [12, 12, 16], [16, 16, 20], [20, 20, 24], [24, 24, 28], [28, 28, 32]];

let crossfadeTime;

let tickFunction = () => {}; 
const crossFade = new Tone.CrossFade().toDestination();

export function init() {
    chordPlayer = new Tone.Player("https://will-bohlen.github.io/havenspace/src/audio/chords.wav").toDestination();
    chordPlayer.loop = true;
    dronePlayer = new Tone.Player("https://will-bohlen.github.io/havenspace/src/audio/dronebeat.wav").toDestination();
    dronePlayer.loop = true;
    pressedPlayer = new Tone.Player("https://will-bohlen.github.io/havenspace/src/audio/haven.wav");
    pressedPlayer.loop = true;
    unpressedPlayer = new Tone.Player("https://will-bohlen.github.io/havenspace/src/audio/space.wav");
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
            //chordPlayer.start()
            //unpressedPlayer.start();
            //pressedPlayer.start();
            //unpressedPlayer.connect(crossFade.a);
            //pressedPlayer.connect(crossFade.b);
            //crossFade.fade.value = 1;
            //unpressedPlayer.mute = true;
            stage++;
            advance(pressed);

            sectionStartTime = currentTime;
            break;
        case 1:
            if (currentTime - sectionStartTime > 40000) {
                stage++;
                advance(pressed);
                break;
            }
            if (pressed) {
                dronePlayer.stop();

                chordPlayer.setLoopPoints(chordTimings[currentChord][1], chordTimings[currentChord][2]);
                chordPlayer.start("+0", chordTimings[currentChord][0]);

                currentChord = (currentChord + 1) % (chordTimings.length);
                console.log(currentChord);
            }
            else {
                chordPlayer.stop();
                dronePlayer.start();
            }

            break;
        case 2:
            if (pressed) dronePlayer.stop();
            else chordPlayer.stop();

        case 10:
            let distance = (pressed ? 0 : crossFade.fade.value); // instant on press, fade on unpress
            crossfadeTime = currentTime + (3000 * distance);


            tickFunction = () => {
                if (crossfadeTime >= currentTime) {
                    let cfValue = (crossfadeTime - currentTime) / 3000;
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