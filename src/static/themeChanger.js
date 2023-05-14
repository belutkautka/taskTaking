const btn = document.getElementById("theme-button");
const link = document.getElementById("theme-link");
const lightTheme = "../static/light.css";
const darkTheme = "../static/dark.css";

btn.addEventListener("click", function () {
    ChangeTheme();
});

let loadStyle = localStorage.getItem('theme');
if (loadStyle) {
    LoadStyle(loadStyle);
}

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
    link.setAttribute("href", loadStyle);
}