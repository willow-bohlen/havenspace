"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var color1 = "#c76bf1";
var color2 = "#6f2592";
var color3 = "#f74366";
var color4 = "#94283d";
var btnUnhoverColor = "#2d49c7";
var btnHoverColor = "#0024c2";
var btnPressedColor = "#fa5519";
var document = window.document;
var button = document.getElementById("main-button");
var isPressed = false;
var isMousePress = false;
var isKeyPress = false;
var isHovered = false;
button.addEventListener("mousedown", function (event) {
    isMousePress = true;
    buttonPressed();
});
button.addEventListener("mouseup", function (event) {
    isMousePress = true;
    buttonReleased();
});
document.addEventListener('keydown', function (event) {
    isKeyPress = true;
    buttonPressed();
});
document.addEventListener('keyup', function (event) {
    isKeyPress = false;
    buttonReleased();
});
button.addEventListener("mouseenter", function (event) {
    isHovered = true;
    if (!isKeyPress)
        button.style["backgroundColor"] = btnHoverColor;
});
button.addEventListener("mouseleave", function (event) {
    isHovered = false;
    if (!isKeyPress)
        button.style["backgroundColor"] = btnUnhoverColor;
    if (isPressed) {
        buttonReleased();
    }
});
function buttonPressed() {
    if (!isPressed) {
        isPressed = true;
        button.style["backgroundColor"] = btnPressedColor;
        document.body.style.backgroundImage = "linear-gradient(to bottom, " + color3 + ", " + color4 + ")";
    }
}
function buttonReleased() {
    if (isPressed) {
        isPressed = false;
        button.style["backgroundColor"] = isHovered ? btnHoverColor : btnUnhoverColor;
        document.body.style.backgroundImage = "linear-gradient(to bottom, " + color1 + ", " + color2 + ")";
    }
}
