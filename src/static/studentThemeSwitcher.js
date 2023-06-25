const btn = document.getElementById("theme-button");
const exitButton = document.getElementsByClassName("exit_images").item(0)
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

exitButton.addEventListener("click", async () => {
    await logout();
});


function LoadStyle(loadStyle) {
    localStorage.setItem('theme', loadStyle);
    if (loadStyle === "dark") {
        currentProfile.src = "../static/img/whiteProfile.png";
        profile.src = "../static/img/blueProfile.png";
        currentTheme.src = "../static/img/whiteSun.png";
        theme.src = "../static/img/blueSun.png";
        currentExit.src = "../static/img/whiteExit.png";
        exit.src = "../static/img/blueExit.png";
        if (bTree) {
            bTree.src = "../static/img/btreelogo.png";
        }
        document.body.setAttribute('data_theme', 'dark');
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
        document.body.setAttribute('data_theme', 'light');
    }
}

btn.addEventListener("click", (e) => {
    ChangeTheme();
});

function ChangeTheme() {
    let currTheme = document.body.getAttribute("data_theme");
    if (currTheme === "light") {
        LoadStyle("dark");
    } else {
        LoadStyle("light");
    }
}

async function logout() {
    try {
        const result = await sendLogoutReq();
        if (result.success) {
            console.log(`Logout success with status code ${result.status}`);
            goToSignInPage();
            return true;
        } else {
            console.error(`Logout failed with status code ${result.status}`);
            goToSignInPage();
            return false;
        }
    } catch (error) {
        console.log('Logout failed: ', error);
    }
}

async function sendLogoutReq() {
    const response = await fetch("/auth/jwt/logout", {
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