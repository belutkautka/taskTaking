document.addEventListener("DOMContentLoaded", function () {
    const cursor = document.querySelector(".cursor");
    const activeCursor = cursor.querySelector(".active-cursor");

    function moveCursor(e) {
        cursor.style.left = e.clientX + "px";
        cursor.style.top = e.clientY + "px";
    }

    document.addEventListener("mousemove", moveCursor);

    function toggleCursorAnimation(isHovering) {
        cursor.classList.toggle("hover", isHovering);
        activeCursor.style.opacity = isHovering ? "1" : "1";
    }

    const hoverElements = document.querySelectorAll("tr, a, div");
    hoverElements.forEach((element) => {
        element.addEventListener("mouseenter", () => {
            toggleCursorAnimation(true);
        });
        element.addEventListener("mouseleave", () => {
            toggleCursorAnimation(false);
        });
    });
});