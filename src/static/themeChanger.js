const btn = document.getElementById("theme-button");
const link = document.getElementById("theme-link");
const lightTheme = "../static/light.css";
const darkTheme = "../static/dark.css";
const currentNotification = document.getElementById("current_notification");
const notification = document.getElementById("notification");
const currentProfile = document.getElementById("current_profile");
const profile = document.getElementById("profile");
const currentTheme = document.getElementById("current_theme");
const theme = document.getElementById("theme");
const currentExit = document.getElementById("current_exit");
const exit = document.getElementById("exit");
const bTree = document.getElementById("logo")

let loadStyle = localStorage.getItem('theme');
if (loadStyle) {
    LoadStyle(loadStyle);
}

btn.addEventListener("click", function () {
    ChangeTheme();
});

function ChangeTheme() {
    let currTheme = link.getAttribute("href");
    if (currTheme == lightTheme) {
        LoadStyle(darkTheme);
    } else {
        LoadStyle(lightTheme);
    }
}

function LoadStyle(loadStyle) {
    localStorage.setItem('theme', loadStyle);
    if (loadStyle === darkTheme) {
        currentNotification.src = "../static/img/whiteNotification.png";
        notification.src = "../static/img/blueNotification.png";
        currentProfile.src = "../static/img/whiteProfile.png";
        profile.src = "../static/img/blueProfile.png";
        currentTheme.src = "../static/img/whiteSun.png";
        theme.src = "../static/img/blueSun.png";
        currentExit.src = "../static/img/whiteExit.png";
        exit.src = "../static/img/blueExit.png";
        if (bTree) {
            bTree.src = "../static/img/btreelogo.png";
        }
    } else {
        currentNotification.src = "../static/img/blackNotification.png"
        notification.src = "../static/img/orangeNotification.png";
        currentProfile.src = "../static/img/blackPerson.png";
        profile.src = "../static/img/orangeProfile.png";
        currentTheme.src = "../static/img/blackMoon.png";
        theme.src = "../static/img/orangeMoon.png";
        currentExit.src = "../static/img/blackExit.png";
        exit.src = "../static/img/orangeExit.png";
        if (bTree) {
            bTree.src = "../static/img/btreelogoblack.png";
        }
    }
    link.setAttribute("href", loadStyle);
}

