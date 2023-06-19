const buttons = document.querySelectorAll(".btn-top");
const slider = document.querySelector(".slider");
const loginBox = document.querySelector(".login-box");
const signinBox = document.querySelector(".signin-box");
const frame = document.querySelector('.frame');
const isStudent = document.getElementById('isStudent');
const teacherField = document.querySelector('.teacher-field');
const loginForm = document.querySelector('.login-form');
const submitBtn = document.querySelector('.submit-btn');
let animationFrameId = null;
let signupProcess = false;

isStudent.onclick = function () {
    if (isStudent.checked) {
        slideToggle(teacherField, 500);
    } else {
        slideToggle(teacherField, 500, true);
    }
};

submitBtn.addEventListener('click', () => {
    let login = document.getElementById('login');
    let password = document.getElementById('password');

    if (!login.value) {
        alert('Введите логин');
        return;
    }

    if (!password.value) {
        alert('Введите пароль');
        return;
    }

    if (signupProcess) {
        let confirmPassword = document.getElementById('confirmPassword');
        let teacherId = document.getElementById('teacher');
        let username = document.getElementById('username');
        let role_id = isStudent.checked ? 2 : 1;
        if (!confirmPassword.value) {
            alert('Подтвердите пароль!');
            return;
        }
        if (password.value !== confirmPassword.value) {
            alert('Пароли не совпадают!');
            return;
        }
        if (isStudent.checked && !teacherId.value) {
            alert('Введите ID своего преподавателя!');
            return;
        }
        alert(createUser(login.value, password.value, username.value, role_id, teacherId.value));
    } else {
        alert(loginUser(login.value, password.value));
    }
});

buttons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        // alert(loginForm.attributes.item(1).value);
        // let start = null;
        // let startPos = 0;
        // let endPos = 0;

        if (index === 0) {
            // ВОЙТИ
            // loginForm.attributes.item(0).value = '/auth/jwt/login';
            signupProcess = false;

            slider.style.left = `${index * 2000}px`;
            slider.style.width = "86px";
            frame.classList.replace('frame-long', 'frame-short');
            // signinBox.classList.replace("active", "inactive");
            slideToggle(signinBox, 500, true);
        } else {
            // ЗАРЕГАТЬСЯ
            // loginForm.attributes.item(0).value = '/auth/register';
            signupProcess = true;

            slider.style.left = `${index * 108.5}px`;
            slider.style.width = "240px";
            frame.classList.replace('frame-short', 'frame-long');
            // signinBox.classList.replace("inactive", "active");
            slideToggle(signinBox, 500);
        }
    });
});

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


function createUser(login, password, username, role_id, invited_by) {
    return fetch("/auth/register", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: login,
            password: password,
            is_active: true,
            is_superuser: false,
            is_verified: false,
            username: username,
            role_id: role_id, // если 1 то препод, 2 -- ученик
            invited_by: invited_by,
        })
    })
        .then(response => {
            if (response.ok && response.status[0] !== "3") {
                loginUser(login, password);

            } else {
                //
            }

            return response;
        });
}

function loginUser(login, password) {
    return fetch('/auth/jwt/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'accept': 'application/json'
        },
        body: `grant_type=&username=${login}&password=${password}&scope=&client_id=&client_secret=`
    })
        .then(response => {

            if (response.ok && response.status[0] !== "3") {

            } else {
                //
            }

            return response;
        })
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

