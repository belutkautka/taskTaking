const buttons = document.querySelectorAll(".btn-top");
const slider = document.querySelector(".slider");
const loginBox = document.querySelector(".login-box");
const signinBox = document.querySelector(".signin-box");
const frame = document.querySelector('.frame');
const isStudent = document.getElementById('isStudent');
const teacherField = document.querySelector('.teacher-field');
const form = document.querySelector('.form');
const submitBtn = document.querySelector('.submit-btn');
const inputs = document.getElementsByTagName('input');
const isStudentInput = document.querySelector("[name='isStudent']");
const teacherInput = document.querySelector("[name='teacher']");
const placeHolders = [];
let animationFrameId = null;
let signupProcess = false;

teacherFieldHeight = teacherField.style.height

isStudent.onclick = function () {
    if (isStudent.checked) {
        // slideToggle(teacherField, 1, teacherFieldHeight);
        // inputs[inputs.length - 1].required = true;
        teacherField.classList.replace('inactive', 'active');
    } else {
        teacherField.classList.replace('active', 'inactive');
        // slideToggle(teacherField, 1, teacherFieldHeight, true);
        // inputs[inputs.length - 1].required = false;
    }
};

for (let i = 0; i < inputs.length; i++) {
    placeHolders.push(inputs[i].placeholder);
    inputs[i].addEventListener('focus', () => {
        inputs[i].placeholder = placeHolders[i];
        inputs[i].style.borderColor = 'var(--color-border-checkbox)';
        // inputs[i].placeholder = '';
    });
}

buttons.forEach((btn, index) => {
    btn.addEventListener('click', () => {

        if (index === 0) {
            // ВОЙТИ
            signupProcess = false;
            slider.style.left = `${index * 2000}px`;
            slider.style.width = "86px";
            frame.classList.replace('frame-long', 'frame-short');
            signinBox.classList.replace("active", "inactive");
            // slideToggle(signinBox, 400, true);
            submitBtn.textContent = 'Войти';
            for (let i = 2; i < inputs.length; i++) {
                inputs[i].required = false;
            }
        } else {
            // ЗАРЕГАТЬСЯ
            signupProcess = true;
            slider.style.left = `${index * 108.5}px`;
            slider.style.width = "240px";
            frame.classList.replace('frame-short', 'frame-long');
            signinBox.classList.replace("inactive", "active");
            // slideToggle(signinBox, 500);
            submitBtn.textContent = 'Зарегистрироваться';
            for (let i = 2; i < inputs.length; i++) {
                inputs[i].required = true;
            }
            isStudentInput.removeAttribute('required');
            teacherInput.removeAttribute('required');
        }

        isStudent.required = false;
    });
});

function slideToggle(element, speed, height, hide = false) {
    let display = getComputedStyle(element).display;

    if (!hide) {
        // show element
        element.style.display = display;
        element.style.height = '0px';
        // let height = height;
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
        let height = height;
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
        method: "POST", headers: {
            'Content-Type': 'application/json'
        }, body: JSON.stringify({
            email: login,
            password: password,
            is_active: true,
            is_superuser: false,
            is_verified: false,
            username: username,
            role_id: role_id, // если 1, то препод, 2 -- ученик
            invited_by: invited_by,
        })
    });
}

async function loginUser(login, password) {
    return await fetch('/auth/jwt/login', {
        method: 'POST', headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }, body: `grant_type=&username=${login}&password=${password}&scope=&client_id=&client_secret=`
    })

}


async function getRoleId() {
    const response = await fetch('/users/me');
    const data = await response.json();
    console.log(data);
    return data['role_id'];
}


function goToStartPage() {
    window.location.href = '/pages/startpage';
}

function goToTeacherStartPage() {
    window.location.href = '/pages/teacherstartpage';
}

submitBtn.addEventListener('click', async () => {
    let login = document.getElementById('login');
    let password = document.getElementById('password');
    let regex = /^[a-zA-Z0-9]+$/;

    if (!login.value) {
        login.style.borderColor = 'red';
        return;
    } else if (!regex.test(login.value)) {
        login.style.borderColor = 'red';
        login.value = '';
        login.placeholder = 'Латинские буквы, цифры';
    }

    if (!password.value) {
        password.style.borderColor = 'red';
        return;
    } else if (!regex.test(password.value)) {
        password.style.borderColor = 'red';
        password.value = '';
        password.placeholder = 'Латинские буквы, цифры';
    }

    if (signupProcess) {
        let confirmPassword = document.getElementById('confirmPassword');
        let teacherLogin = document.getElementById('teacher');
        let username = document.getElementById('username');
        let roleId = isStudent.checked ? 2 : 1;
        if (!confirmPassword.value) {
            confirmPassword.style.borderColor = 'red';
            return;
        }
        if (password.value !== confirmPassword.value) {
            password.style.borderColor = 'red';
            confirmPassword.style.borderColor = 'red';
            confirmPassword.value = '';
            confirmPassword.placeholder = 'Пароли не совпадают!';
            return;
        }
        if (isStudent.checked) {
            if (!teacherLogin.value) {
                teacherLogin.style.borderColor = 'red';
                return;
            } else if (!regex.test(teacherLogin.value)) {
                teacherLogin.style.borderColor = 'red';
                teacherLogin.value = '';
                teacherLogin.placeholder = 'Латинские буквы, цифры'
                return;
            }
        }

        await createUser(login.value, password.value, username.value, roleId, teacherLogin.value)
            .then(response => {
                if (response.status === 400) {
                    return false;
                }
                if (response.status === 500) {
                    teacherLogin.style.borderColor = 'red';
                    teacherLogin.value = '';
                    teacherLogin.placeholder = 'Нет такого препода';
                    return false;
                }
                if (response.ok || String(response.status)[0] === '3' || response.status === 201) {
                    return true;
                }
            })
            .then(success => {
                if (success) {
                    return loginUser(login.value, password.value)
                        .then(response => {
                            if (response.ok || String(response.status)[0] === '3') {
                                if (isStudent) {
                                    goToStartPage();
                                } else {
                                    goToTeacherStartPage();
                                }
                            } else {
                            }
                        });
                } else {
                }
            });

    } else {
        let success = await loginUser(login.value, password.value)
            .then(response => {
                console.log(response.json());
                return !(!response.ok && String(response.status)[0] !== '3');
            });

        if (!success) {
            password.style.borderColor = 'red';
            password.value = '';
            password.placeholder = 'Проверьте данные'
        }

        let roleId = await getRoleId();
        if (roleId === 2) {
            goToStartPage();
        } else if (roleId === 1) {
            goToTeacherStartPage();
        } else {
            console.log(roleId + ' ' + typeof roleId);
        }
    }
});