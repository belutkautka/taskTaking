const buttons = document.querySelectorAll(".btn-top");
const slider = document.querySelector(".slider");
const signinBox = document.querySelector(".signin-box");
const frame = document.querySelector('.frame');
const isStudent = document.getElementById('isStudent');
const teacherField = document.querySelector('.teacher-field');
const loginForm = document.querySelector('.login-form');
const submitBtn = document.querySelector('.submit-btn');
const inputs = document.getElementsByTagName('input');
const isStudentInput = document.querySelector("[name='isStudent']");
const teacherInput = document.querySelector("[name='teacher']");
const placeHolders = [];
const sliderWidth = {
    defaultStartWidth: '86px', defaultFinishWidth: '240px',
    mobileStartWidth: '60px', mobileFinishWidth: '160px'
};
const sliderLefts = {
    defaultFinishLeft: '100px',
    mobileStartLeft: '-6px',
    mobileFinishLeft: '140px'
};
let signupProcess = false;


teacherFieldHeight = teacherField.style.height

isStudent.onclick = function () {
    if (isStudent.checked) {
        teacherField.classList.replace('tinactive', 'tactive');
    } else {
        teacherField.classList.replace('tactive', 'tinactive');
    }
};

for (let i = 0; i < inputs.length; i++) {
    placeHolders.push(inputs[i].placeholder);
    inputs[i].addEventListener('focus', () => {
        inputs[i].placeholder = placeHolders[i];
        inputs[i].style.borderColor = 'var(--color-border-checkbox)';

    });
}

buttons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        if (index === 0) {
            slider.style.left = '0px';
            if (window.innerWidth < 600) {
                slider.style.width = sliderWidth.mobileStartWidth;
            } else {
                slider.style.width = sliderWidth.defaultStartWidth;
            }
            signupProcess = false;
            loginForm.classList.replace('extended', 'default');
            frame.classList.replace('frame-long', 'frame-short');
            signinBox.classList.replace("active", "inactive");
            submitBtn.textContent = 'Войти';
            for (let i = 2; i < inputs.length; i++) {
                inputs[i].required = false;
            }
        } else {
            if (window.innerWidth < 600) {
                slider.style.width = sliderWidth.mobileFinishWidth;
                slider.style.left = sliderLefts.mobileFinishLeft;
            } else {
                slider.style.width = sliderWidth.defaultFinishWidth;
                slider.style.left = sliderLefts.defaultFinishLeft;
            }
            signupProcess = true;
            loginForm.classList.replace('default', 'extended');
            frame.classList.replace('frame-short', 'frame-long');
            signinBox.classList.replace("inactive", "active");
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
        login.placeholder = 'Разрешены только латинские буквы и цифры';
    }

    if (!password.value) {
        password.style.borderColor = 'red';
        return;
    } else if (!regex.test(password.value)) {
        password.style.borderColor = 'red';
        password.value = '';
        password.placeholder = 'Разрешены только латинские буквы и цифры';
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
                teacherLogin.placeholder = 'Разрешены только латинские буквы и цифры'
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
                                if (isStudent.checked) {
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