const btn = document.getElementById("theme-button");
const link = document.getElementById("theme-link");
const exitButton = document.getElementsByClassName("exit_images").item(0)
const lightTheme = "../static/light.css";
const darkTheme = "../static/dark.css";
const currentProfile = document.getElementById("current_profile");
const profile = document.getElementById("profile");
const currentTheme = document.getElementById("current_theme");
const theme = document.getElementById("theme");
const currentExit = document.getElementById("current_exit");
const exit = document.getElementById("exit");
const bTree = document.getElementById("logo");

let loadStyle = localStorage.getItem('theme');
if (loadStyle) {
    LoadStyle(loadStyle);
}

btn.addEventListener("click", function () {
    ChangeTheme();
});

exitButton.addEventListener("click", async function () {
    await sendLogOutRequest("/auth/jwt/logout");
});

function ChangeTheme() {
    let currTheme = link.getAttribute("href");
    if (currTheme === lightTheme) {
        LoadStyle(darkTheme);
    } else {
        LoadStyle(lightTheme);
    }
}

function LoadStyle(loadStyle) {
    localStorage.setItem('theme', loadStyle);
    if (loadStyle === darkTheme) {
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

async function sendLogOutRequest(url) {
    try {
        const result = await handleLogOut(url);
        if (result.success) {
            console.log(`Login success with status code ${result.status}`);
            goToSignInPage();
            return true;
        } else {
            console.error(`Login failed with status code ${result.status}`);
            goToSignInPage();
            return false;
        }
    } catch (error) {
        console.log('Logout failed: ', error);
    }
}

async function handleLogOut(url) {
    const response = await fetch(url, {
        method: "POST",
    });
    let status = response.status;
    if (response.ok && String(status)[0] !== "3") {
        return {status: status, success: true};
    } else {
        return {status: status, success: false};
    }
}


function goToSignInPage() {
    window.location.href = '/pages/signin';
}