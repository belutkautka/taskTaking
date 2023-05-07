const btn = document.getElementById("theme-button");
const link = document.getElementById("theme-link");
const lightTheme = "styles/light.css";
const darkTheme = "styles/dark.css";

btn.addEventListener("click", function () { ChangeTheme(); });

function ChangeTheme()
{
    let currTheme = link.getAttribute("href");

    if(currTheme == lightTheme)
    {
        currTheme = darkTheme;
    }
    else
    {
        currTheme = lightTheme;
    }

    link.setAttribute("href", currTheme);
}