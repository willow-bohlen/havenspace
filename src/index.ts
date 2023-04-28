import * as song from './song';

const color1 = "#c76bf1";
const color2 = "#6f2592";
const color3 = "#f74366";
const color4 = "#94283d";
const btnUnhoverColor = "#2d49c7";
const btnHoverColor   = "#0024c2";
const btnPressedColor = "#fa5519";

const button = window.document.getElementById("main-button") as HTMLButtonElement;

var isPressed = false;
var isMousePress = false;
var isKeyPress = false;
var isHovered = false;

song.init();

button.addEventListener("mousedown", (event) => {
    isMousePress = true;
    buttonPressed();
})

button.addEventListener("mouseup", (event) => {
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

button.addEventListener("mouseenter", (event) => {
    isHovered = true;
    if (!isKeyPress) button.style["backgroundColor"] = btnHoverColor;
})

button.addEventListener("mouseleave", (event) => {
    isHovered = false;
    if (!isKeyPress) button.style["backgroundColor"] = btnUnhoverColor;
    if (isPressed) { buttonReleased(); }
})

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

        button.style["backgroundColor"] = isHovered ? btnHoverColor : btnUnhoverColor;
        document.body.style.backgroundImage = "linear-gradient(to bottom, "+color1+", "+color2+")";
    }
}