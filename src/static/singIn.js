const buttons = document.querySelectorAll(".btn-top");
const slider = document.querySelector(".slider");
const loginBox = document.querySelector(".login-box");
const signinBox = document.querySelector(".signin-box");
const frame = document.querySelector('.frame');
// let loginProcess = true;
buttons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        let start = null;
        let startPos = 0;
        let endPos = 0;

        if (index === 0) {
            // ВОЙТИ
            slider.style.left = `${index * 2000}px`;
            slider.style.width = "86px";
            signinBox.classList.replace("active", "inactive");
            frame.classList.replace('frame-long', 'frame-short');

            // alert(lgPos.top + ' ' + lgPos.right + ' ' + lgPos.bottom + ' ' + lgPos.left);
            // let lgPos = loginBox.getBoundingClientRect();
            //
            // startPos = (lgPos.right + lgPos.left) / 2;
            // endPos = -loginBox.offsetWidth;
            // loginBox.classList.replace("inactive", "active");

        } else {
            // ЗАРЕГАТЬСЯ
            slider.style.left = `${index * 108.5}px`;
            slider.style.width = "240px";
            signinBox.classList.replace("inactive", "active");
            frame.classList.replace('frame-short', 'frame-long');

            // frame.classList.replace('frame-short', 'frame-long')
            // let lgPos = loginBox.getBoundingClientRect();
            startPos = getOffset(loginBox).left;
            endPos = -loginBox.offsetWidth;
            // loginBox.classList.replace("active", "inactive");
        }

        // function step(timestamp) {
        //     if (!start) start = timestamp;
        //     let progress = timestamp - start;
        //     let pos = Math.easeInOutQuad(progress, startPos, endPos - startPos, 2000);
        //     loginBox.style.left = pos + 'px';
        //
        //     if (progress < 2000) {
        //         window.requestAnimationFrame(step);
        //     }
        // }
        //
        // window.requestAnimationFrame(step);
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
//         loginBox.classList.replace("inactive", "active");
//         signinBox.classList.replace("active", "inactive");
//     } else if (e.target.innerHTML === "Зарегистрироваться") {
//         loginBox.classList.replace("active", "inactive");
//         signinBox.classList.replace("inactive", "active");
//     }
// });

