const buttons = document.querySelectorAll(".btn-top");
const slider = document.querySelector(".slider");
const loginBox = document.querySelector(".login-box");
const signinBox = document.querySelector(".signin-box");
const frame = document.querySelector('.frame');
const isStudent = document.getElementById('isStudent');
const teacherField = document.querySelector('.teacher-field');

// let loginProcess = true;

isStudent.onclick = function () {
    if (isStudent.checked) {
        slideToggle(teacherField, 500);
    } else {
        slideToggle(teacherField, 500, true);
    }
};

buttons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        let start = null;
        let startPos = 0;
        let endPos = 0;

        if (index === 0) {
            // ВОЙТИ
            slider.style.left = `${index * 2000}px`;
            slider.style.width = "86px";
            frame.classList.replace('frame-long', 'frame-short');
            // signinBox.classList.replace("active", "inactive");
            slideToggle(signinBox, 500, true);

        } else {
            // ЗАРЕГАТЬСЯ
            slider.style.left = `${index * 108.5}px`;
            slider.style.width = "240px";
            frame.classList.replace('frame-short', 'frame-long');
            // signinBox.classList.replace("inactive", "active");
            slideToggle(signinBox, 500);

        }
    });
});

let animationFrameId = null;

function slideToggle(element, speed, hide = false) {
    let display = getComputedStyle(element).display;

    if (!hide) {
        // show element
        element.style.display = 'block';
        element.style.height = '0px';

        let height = element.scrollHeight;

        let step = height / (speed / 0.016);  // 0.016 - время выполнения одного кадра при 60fps

        let animate = function () {
            let currentHeight = parseFloat(getComputedStyle(element).height);
            let newHeight = currentHeight + step;
            element.style.height = `${newHeight}px`;

            if (newHeight < height) {
                animationFrameId = requestAnimationFrame(animate);
            } else {
                element.style.height = `${height}px`;  // прибиваем итоговый размер на случай небольшой погрешности при расчёте
                cancelAnimationFrame(animationFrameId);
            }
        }

        animationFrameId = requestAnimationFrame(animate);

    } else {
        // hide element
        let height = element.scrollHeight;
        let step = height / (speed / 0.016);

        let animate = function () {
            let currentHeight = parseFloat(getComputedStyle(element).height);
            let newHeight = currentHeight - step;
            element.style.height = `${newHeight}px`;

            if (newHeight > 0) {
                animationFrameId = requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
                cancelAnimationFrame(animationFrameId);
            }
        }

        animationFrameId = requestAnimationFrame(animate);
    }
}

// Использование:
// slideToggle(signinBox, 500); // где 500 это скорость анимации в миллисекундах


// document.querySelector('.signin-nav .btn-top').addEventListener('click', function (e) {
//     e.preventDefault();
//
//     if (e.target.innerHTML === "Войти") {
//         loginBox.classList.replace("inactive", "active");
//         signinBox.classList.replace("active", "inactive");
//     } else if (e.target.innerHTML === "Зарегистрироваться") {
//         loginBox.classList.replace("active", "inactive");
//         signinBox.classList.replace("inactive", "active");
//     }
// });

