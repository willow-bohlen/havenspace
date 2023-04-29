import * as song from './song';

const color1 = "#c76bf1";
const color2 = "#6f2592";
const color3 = "#f74366";
const color4 = "#94283d";
const btnUnpressedColor = "#2d49c7";
const btnPressedColor = "#fa5519";

const button = window.document.getElementById("main-button") as HTMLButtonElement;

var isPressed = false;
var isMousePress = false;
var isKeyPress = false;
var isHovered = false;

song.init();

document.addEventListener("mousedown", (event) => {
    isMousePress = true;
    buttonPressed();
})

document.addEventListener("mouseup", (event) => {
    isMousePress = true;
    buttonReleased();
})

document.addEventListener('keydown', (event) => {
    isKeyPress = true;
    buttonPressed();
});
document.addEventListener('keyup', (event) => {
    isKeyPress = false;
    buttonReleased();
});

function buttonPressed () {
    if (!isPressed) {
        isPressed = true;
        song.advance(true);

        button.style["backgroundColor"] = btnPressedColor;
        document.body.style.backgroundImage = "linear-gradient(to bottom, "+color3+", "+color4+")";
    }
}

function buttonReleased () {
    if (isPressed) {
        isPressed = false;
        song.advance(false);

        document.body.style.backgroundImage = "linear-gradient(to bottom, "+color1+", "+color2+")";
    }
}

function updateLoop() {
    window.requestAnimationFrame(() => {
        song.tick();
        updateLoop();
    });
}

updateLoop();