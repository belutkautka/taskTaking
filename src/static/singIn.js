const buttons = document.querySelectorAll(".btn-top");
const slider = document.querySelector(".slider");
const loginForm = document.querySelector(".login-form");
const signinForm = document.querySelector(".signin-form");
const frame = document.querySelector('.frame');
// let loginProcess = true;
buttons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        let start = null;
        let startPos = 0;
        let endPos = 0;

        if (index === 0) {
            // alert((loginForm.classList.length));
            slider.style.left = `${index * 2000}px`;
            slider.style.width = "90px";

            // alert(lgPos.top + ' ' + lgPos.right + ' ' + lgPos.bottom + ' ' + lgPos.left);
            // let lgPos = loginForm.getBoundingClientRect();
            //
            // startPos = (lgPos.right + lgPos.left) / 2;
            // endPos = -loginForm.offsetWidth;
            loginForm.classList.replace("inactive", "active");
            signinForm.classList.replace("active", "inactive");

        } else {
            // alert('зарегаться')
            slider.style.left = `${index * 108.5}px`;
            slider.style.width = "240px";
            frame.classList.replace('frame-short', 'frame-long')


            // let lgPos = loginForm.getBoundingClientRect();
            startPos = getOffset(loginForm).left;
            endPos = -loginForm.offsetWidth;
            loginForm.classList.replace("active", "inactive");
            signinForm.classList.replace("inactive", "active");
        }

        function step(timestamp) {
            if (!start) start = timestamp;
            let progress = timestamp - start;
            let pos = Math.easeInOutQuad(progress, startPos, endPos - startPos, 2000);
            loginForm.style.left = pos + 'px';

            if (progress < 2000) {
                window.requestAnimationFrame(step);
            }
        }

        window.requestAnimationFrame(step);
    });
});

Math.easeInOutQuad = function (t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
};

function getOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY
    };
}

// document.querySelector('.signin-nav .btn-top').addEventListener('click', function (e) {
//     e.preventDefault();
//
//     if (e.target.innerHTML === "Войти") {
//         loginForm.classList.replace("inactive", "active");
//         signinForm.classList.replace("active", "inactive");
//     } else if (e.target.innerHTML === "Зарегистрироваться") {
//         loginForm.classList.replace("active", "inactive");
//         signinForm.classList.replace("inactive", "active");
//     }
// });

