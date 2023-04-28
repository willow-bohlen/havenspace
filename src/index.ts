import * as Tone from 'tone';

const color1 = "#c76bf1";
const color2 = "#6f2592";
const color3 = "#f74366";
const color4 = "#94283d";
const btnUnhoverColor = "#2d49c7";
const btnHoverColor   = "#0024c2";
const btnPressedColor = "#fa5519";

const document = window.document as Document;
const button = document.getElementById("main-button") as HTMLButtonElement;

var isPressed = false;
var isHovered = false;

button.addEventListener("mousedown", (event) => {
    buttonPressed();
})

button.addEventListener("mouseup", (event) => {
    buttonReleased();
})

button.addEventListener("mouseenter", (event) => {
    isHovered = true;
    button.style["backgroundColor"] = btnHoverColor;
})

button.addEventListener("mouseleave", (event) => {
    isHovered = false;
    button.style["backgroundColor"] = btnUnhoverColor;
    if (isPressed) { buttonReleased(); }
})

function buttonPressed () {
    isPressed = true;
    button.style["backgroundColor"] = btnPressedColor;
    document.body.style.backgroundImage = "linear-gradient(to bottom, "+color3+", "+color4+")";
}

function buttonReleased () {
    isPressed = false;
    button.style["backgroundColor"] = isHovered ? btnHoverColor : btnUnhoverColor;
    document.body.style.backgroundImage = "linear-gradient(to bottom, "+color1+", "+color2+")";
}