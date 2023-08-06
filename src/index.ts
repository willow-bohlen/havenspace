import * as song from './song';

const color1 = "#c76bf1";
const color2 = "#6f2592";
const color3 = "#f74366";
const color4 = "#94283d";
const btnUnpressedColor = "#2d49c7";
const btnPressedColor = "#fa5519";

const button = window.document.getElementById("main-button") as HTMLButtonElement;
const loadText = window.document.getElementById("loadText") as HTMLHeadingElement;

var isPressed = false;
var isMousePress = false;
var isKeyPress = false;

var isLoaded = false;

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
    if (!isPressed && isLoaded) {
        isPressed = true;
        song.advance(true);

        button.style["backgroundColor"] = btnPressedColor;
        document.body.style.backgroundImage = "linear-gradient(to bottom, "+color3+", "+color4+")";
    }
}

function buttonReleased () {
    if (isPressed && isLoaded) {
        isPressed = false;
        song.advance(false);

        button.style["backgroundColor"] = btnUnpressedColor;
        document.body.style.backgroundImage = "linear-gradient(to bottom, "+color1+", "+color2+")";
    }
}

function fadeIn(element) {
    var op = 0.1;  // initial opacity
    element.style.display = 'block';
    var timer = setInterval(function () {
        if (op >= 1){
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.05;
    }, 10);
}

function fadeOut(element) {
    var op = 1;  // initial opacity
    element.style.display = 'block';
    var timer = setInterval(function () {
        if (op <= 0){
            clearInterval(timer);
            fadeIn(button);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.05 + 0.01;
    }, 10);
}

function updateLoop() {
    window.requestAnimationFrame(() => {
        if (!isLoaded) {
            isLoaded = song.isLoaded();
            if (isLoaded) {
                console.log("Loaded!");
                fadeOut(loadText);
            }
        }
        else {
            song.tick();
        }
        updateLoop();
    });
}

updateLoop();
