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
let initComplete = false;

let tickFunction = () => {}; 
const crossFade = new Tone.CrossFade().toDestination();

export function init() {
    chordPlayer = new Tone.Player("https://willow-bohlen.github.io/havenspace/src/audio/chords.mp3").toDestination();
    chordPlayer.loop = true;
    dronePlayer = new Tone.Player("https://willow-bohlen.github.io/havenspace/src/audio/dronebeat.mp3").toDestination();
    dronePlayer.loop = true;


    transDronePlayer = new Tone.Player("https://willow-bohlen.github.io/havenspace/src/audio/transitiondrone.mp3").toDestination();
    transFluffPlayer = new Tone.Player("https://willow-bohlen.github.io/havenspace/src/audio/transitionfluff.mp3").toDestination();
    transFluffPlayer.mute = true;
    transFuzzPlayer = new Tone.Player("https://willow-bohlen.github.io/havenspace/src/audio/transitionfuzz.mp3").toDestination();
    transFuzzPlayer.mute = true;


    fuzzworldPlayer = new Tone.Player("https://willow-bohlen.github.io/havenspace/src/audio/fuzzworld.mp3").toDestination();
    fuzzworldPlayer.loop = true;
    fuzzworldPlayer.mute = true;
    fluffworldPlayer = new Tone.Player("https://willow-bohlen.github.io/havenspace/src/audio/fluffworld.mp3").toDestination();
    fluffworldPlayer.loop = true;

    jamiversePlayer = new Tone.Player("https://willow-bohlen.github.io/havenspace/src/audio/jamiverse.mp3").toDestination();

    havenPlayer = new Tone.Player("https://willow-bohlen.github.io/havenspace/src/audio/haven.mp3");
    havenPlayer.loop = true;
    spacePlayer = new Tone.Player("https://willow-bohlen.github.io/havenspace/src/audio/space.mp3");
    spacePlayer.loop = true;

    transBeatPlayer = new Tone.Player("https://willow-bohlen.github.io/havenspace/src/audio/transitionbeat.mp3").toDestination();
    troughPlayer = new Tone.Player("https://willow-bohlen.github.io/havenspace/src/audio/trough.mp3").toDestination();
    trovePlayer = new Tone.Player("https://willow-bohlen.github.io/havenspace/src/audio/trove.mp3").toDestination();

    startTime = new Date().getTime();

    console.log("Init complete");
    initComplete = true;
}

export function isLoaded() {
    if (!initComplete) return false;

    //We can start as soon as the first two tracks are loaded
    //The rest will load by the time these two finish playing
    return (chordPlayer.loaded && dronePlayer.loaded);
}

export function tick() {
    currentTime = new Date().getTime();
    tickFunction();
}

export function advance(pressed: boolean) {
    isPressed = pressed;
    switch (stage) {
        case 0:
            Tone.Transport.start();
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

                chordPlayer.setLoopPoints(chordTimings[currentChord], chordTimings[currentChord] + 2);
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
                    jamiversePlayer.stop();
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

                if (currentTime - sectionStartTime > 44000 && !playingBeat) {
                    transBeatPlayer.volume.value = -40;
                    transBeatPlayer.start();
                    playingBeat = true;

                    havenPlayer.volume.linearRampTo(-40, 15);
                    spacePlayer.volume.linearRampTo(-40, 15);
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
