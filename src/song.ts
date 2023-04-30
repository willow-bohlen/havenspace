import * as Tone from 'tone';

let stage = 0;
let isPressed = false;
let chordPlayer;
let dronePlayer;
let transDronePlayer;
let transFluffPlayer;
let transFuzzPlayer;
let fuzzworldPlayer;
let fluffworldPlayer;
let jamiversePlayer;
let havenPlayer;
let spacePlayer; 
let transBeatPlayer;
let trovePlayer;
let troughPlayer;


let startTime;
let currentTime;
let sectionStartTime;

let currentChord = 0;
const chordTimings = [0, 4, 8, 12, 16, 20, 24, 28];

let crossfadeTime;
let playingBeat = false;

let tickFunction = () => {}; 
const crossFade = new Tone.CrossFade().toDestination();

export function init() {
    chordPlayer = new Tone.Player("https://will-bohlen.github.io/havenspace/src/audio/chords.wav").toDestination();
    chordPlayer.loop = true;
    dronePlayer = new Tone.Player("https://will-bohlen.github.io/havenspace/src/audio/dronebeat.wav").toDestination();
    dronePlayer.loop = true;


    transDronePlayer = new Tone.Player("https://will-bohlen.github.io/havenspace/src/audio/transitiondrone.wav").toDestination();
    transFluffPlayer = new Tone.Player("https://will-bohlen.github.io/havenspace/src/audio/transitionfluff.wav").toDestination();
    transFluffPlayer.mute = true;
    transFuzzPlayer = new Tone.Player("https://will-bohlen.github.io/havenspace/src/audio/transitionfuzz.wav").toDestination();
    transFuzzPlayer.mute = true;


    fuzzworldPlayer = new Tone.Player("https://will-bohlen.github.io/havenspace/src/audio/fuzzworld.wav").toDestination();
    fuzzworldPlayer.loop = true;
    fuzzworldPlayer.mute = true;
    fluffworldPlayer = new Tone.Player("https://will-bohlen.github.io/havenspace/src/audio/fluffworld.wav").toDestination();
    fluffworldPlayer.loop = true;

    jamiversePlayer = new Tone.Player("https://will-bohlen.github.io/havenspace/src/audio/jamiverse.wav").toDestination();

    havenPlayer = new Tone.Player("https://will-bohlen.github.io/havenspace/src/audio/haven.wav");
    havenPlayer.loop = true;
    spacePlayer = new Tone.Player("https://will-bohlen.github.io/havenspace/src/audio/space.wav");
    spacePlayer.loop = true;

    transBeatPlayer = new Tone.Player("https://will-bohlen.github.io/havenspace/src/audio/transitionbeat.wav").toDestination();
    troughPlayer = new Tone.Player("https://will-bohlen.github.io/havenspace/src/audio/trough.wav").toDestination();
    trovePlayer = new Tone.Player("https://will-bohlen.github.io/havenspace/src/audio/trove.wav").toDestination();

    startTime = new Date().getTime();
    Tone.Transport.start();
}

export function tick() {
    currentTime = new Date().getTime();
    tickFunction();
}

export function advance(pressed: boolean) {
    isPressed = pressed;
    switch (stage) {
        case 0:
            dronePlayer.start();
            chordPlayer.start();


            tickFunction = () => {
                if (currentTime - sectionStartTime > 42000) {
                    tickFunction = () => {};
                    nextStage();
                }  
            }

            nextStage();

            break;
        case 1:
            if (pressed) {
                chordPlayer.mute = false;

                chordPlayer.setLoopPoints(chordTimings[currentChord], chordTimings[currentChord] + 3.95);
                chordPlayer.seek(chordTimings[currentChord]);

                currentChord = (currentChord + 1) % (chordTimings.length);
            }
            else {
                chordPlayer.mute = true;
            }

            break;
        case 2:
            chordPlayer.stop();
            dronePlayer.stop();

            transDronePlayer.start();
            transFluffPlayer.start();
            transFuzzPlayer.start();
    
            tickFunction = () => {
                if (currentTime - sectionStartTime > 40000) {
                    tickFunction = () => {};
                    nextStage();
                }  
            }

            nextStage();
            break;

        case 3:
            transFuzzPlayer.mute = pressed;
            transFluffPlayer.mute = !pressed;
            break;

        case 4:
            transDronePlayer.stop();
            transFuzzPlayer.stop();
            transFluffPlayer.stop();

            fuzzworldPlayer.start();
            fluffworldPlayer.start();

            tickFunction = () => {
                if (currentTime - sectionStartTime > 41036) {
                    tickFunction = () => {};
                    nextStage();
                }  
            }

            nextStage();
            break;

        case 5:
            fuzzworldPlayer.mute = !pressed;
            fluffworldPlayer.mute = pressed;
            break;

        case 6:
            fuzzworldPlayer.stop();
            fluffworldPlayer.stop();

            jamiversePlayer.start();
            tickFunction = () => {
                if (currentTime - sectionStartTime > 67197) {
                    tickFunction = () => {};
                    nextStage();
                }  
            }
        
            nextStage();
            break;

        case 7:
            if (pressed) {
                jamiversePlayer.loop = true;
                jamiversePlayer.setLoopPoints(Math.max(currentTime - sectionStartTime - 100, 0) / 1000, Math.max(currentTime - sectionStartTime, 100) / 1000);
            }
            else {
                jamiversePlayer.loop = false;
                jamiversePlayer.restart("+0", (currentTime - sectionStartTime) / 1000);
            }
            break;

        case 8:
            jamiversePlayer.stop();

            havenPlayer.start();
            spacePlayer.start();
            havenPlayer.connect(crossFade.b);
            spacePlayer.connect(crossFade.a);

            crossFade.fade.value = pressed ? 1 : 0;

            nextStage();
            break;

        case 9:
            let distance = (pressed ? 0 : crossFade.fade.value); // instant on press, fade on unpress
            crossfadeTime = currentTime + (3000 * distance);


            tickFunction = () => {
                if (crossfadeTime >= currentTime) {
                    let cfValue = (crossfadeTime - currentTime) / 3000;
                    if (pressed) cfValue = 1 - cfValue;
                    crossFade.fade.value = cfValue;
                }
                if (crossfadeTime < currentTime) {
                    crossFade.fade.value = pressed ? 1 : 0;
                }

                if (currentTime - sectionStartTime > 54858 && !playingBeat) {
                    transBeatPlayer.volume = -100;
                    transBeatPlayer.start();
                    playingBeat = true;

                    havenPlayer.volume.linearRampTo(-100, 15);
                    spacePlayer.volume.linearRampTo(-100, 15);
                    transBeatPlayer.volume.linearRampTo(0, 15);
                }

                if (currentTime - sectionStartTime > 70858) {
                    tickFunction = () => {};
                    nextStage();
                }  
            }

            tickFunction();
            break;
        
        case 10:
            havenPlayer.stop();
            spacePlayer.stop();
            transBeatPlayer.stop();

            trovePlayer.start();
            troughPlayer.start();

            nextStage();
            break;
        
        case 11:
            troughPlayer.mute = pressed;
            trovePlayer.mute = !pressed;
    }
}

function nextStage() {
    stage++;
    sectionStartTime = currentTime;
    console.log("Stage: "+stage);
    advance(isPressed);
}
