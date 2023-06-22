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
let animationFrameId = null;
let signupProcess = false;

isStudent.onclick = function () {
    if (isStudent.checked) {
        slideToggle(teacherField, 500);
        inputs[inputs.length - 1].required = true;
    } else {
        slideToggle(teacherField, 500, true);
        inputs[inputs.length - 1].required = false;
    }
};

buttons.forEach((btn, index) => {
    btn.addEventListener('click', () => {

        if (index === 0) {
            // ВОЙТИ
            signupProcess = false;
            slider.style.left = `${index * 2000}px`;
            slider.style.width = "86px";
            frame.classList.replace('frame-long', 'frame-short');
            // signinBox.classList.replace("active", "inactive");
            slideToggle(signinBox, 500, true);
            submitBtn.value = 'Войти';
            for (let i = 2; i < inputs.length; i++) {
                inputs[i].required = false;
            }
        } else {
            // ЗАРЕГАТЬСЯ
            signupProcess = true;
            slider.style.left = `${index * 108.5}px`;
            slider.style.width = "240px";
            frame.classList.replace('frame-short', 'frame-long');
            // signinBox.classList.replace("inactive", "active");
            slideToggle(signinBox, 500);
            // slideToggle(flexInner, 500, true);
            submitBtn.value = 'Зарегистрироваться';
            for (let i = 2; i < inputs.length; i++) {
                inputs[i].required = true;
            }
            isStudentInput.removeAttribute('required');
            teacherInput.removeAttribute('required');
        }

        isStudent.required = false;
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


async function createUser(login, password, username, role_id, invited_by) {
    const response = await fetch("/auth/register", {
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
            role_id: role_id, // если 1, то препод, 2 -- ученик
            invited_by: invited_by,
        })
    });
    let status = response.status;
    if (response.ok && String(status)[0] !== "3") {
        return {status: status, success: true};
    } else {
        return {status: status, success: false};
    }
}

async function loginUser(login, password) {
    const response = await fetch('/auth/jwt/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'accept': 'application/json'
        },
        body: `grant_type=&username=${login}&password=${password}&scope=&client_id=&client_secret=`
    });

    let status = response.status;
    if (response.ok && String(status)[0] !== "3") {
        return {status: status, success: true};
    } else {
        return {status: status, success: false};
    }
}

async function handleCreateUser(login, password, username, roleId, teacherId) {
    try {
        const result = await createUser(login, password, username, roleId, teacherId);
        if (result.success) {
            console.log(`Sign up success with status code ${result.status}`);
            await handleLogin(login, password);
            return true;
        } else {
            console.error(`Sign up failed with status code ${result.status}`);
            return false;
        }
    } catch (error) {
        console.error('Sign up failed:', error);
    }
}

async function handleLogin(login, password) {
    try {
        const result = await loginUser(login, password);
        if (result.success) {
            console.log(`Login success with status code ${result.status}`);
            goToStartPage();
            return true;
        } else {
            console.error(`Login failed with status code ${result.status}`);
            alert('Неправильный логин или пароль');
            return false;
        }
    } catch (error) {
        alert('Неправильный логин или пароль');
        console.error('Login failed:', error);
    }
}

function goToStartPage() {
    window.location.href = '/pages/startpage';
}

function goToTeacherStartPage() {
    window.location.href = 'pages/teacherStartPage';
}

submitBtn.addEventListener('click', async () => {
    let login = document.getElementById('login');
    let password = document.getElementById('password');

    if (!login.value) {
        return;
    }

    if (!password.value) {
        return;
    }

    if (signupProcess) {
        let confirmPassword = document.getElementById('confirmPassword');
        let teacherId = document.getElementById('teacher');
        let username = document.getElementById('username');
        let roleId = isStudent.checked ? 2 : 1;
        if (!confirmPassword.value) {
            return;
        }
        if (password.value !== confirmPassword.value) {
            return;
        }
        if (isStudent.checked && !teacherId.value) {
            return;
        }
        await handleCreateUser(login.value, password.value, username.value, roleId, teacherId.value)

    } else {
        await handleLogin(login.value, password.value);
    }
});