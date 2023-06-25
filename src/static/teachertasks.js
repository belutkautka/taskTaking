const modal = document.getElementById('modal_form');
const modalTask = document.getElementsByClassName('modal_task')[0];
const modalDelete = document.getElementsByClassName('modal_delete')[0];
const name = document.getElementById('modal_form');
const form = document.forms.add;
const sortSign = document.getElementsByClassName('sort_sign')[0];
const busy = document.getElementById("check_busy");
const active = document.getElementById("check_free");
const tasks = document.getElementById("tasks")
const modalTitle = document.getElementById('modal__title');
const modalText = document.getElementById('modal__text');
const modalDescription = document.getElementById("modal__full_text")
const modalLimit = document.getElementsByClassName("limit_modal")[0]

let sortedTasks = null;
let sortedDescTasks = null;
let unsortedTasks = null;

sendGetTaskRequest("/tasks/get_tasks_by_teacher_id").then(data => data.Data.forEach(e => makeTask(e)))

document.getElementById('modal_form__close-button').addEventListener('click', function (e) {
    modal.classList.remove('modal_active');
});
document.getElementById('add_task_button').addEventListener('click', function (e) {
    modal.classList.add('modal_active');
});
document.getElementById("button_delete").addEventListener('click', function (e) {
    modalDelete.classList.add('modal_active');
});
document.getElementById("button_send_mark").addEventListener('click', function (e) {
    [...document.getElementsByClassName("score")].forEach(e => {
        if (+e.value !== 0)
            sendRateTaskRequest(e.id.split("_")[1], e.id.split("_")[0], e.value);
    });
});

document.getElementById("button_delete_back").addEventListener('click', function (e) {
    modalDelete.classList.remove('modal_active');
});
document.getElementById("button_exactly_delete").addEventListener('click', function (e) {
    sendDeleteTaskRequest(modalTask.id)
});

document.getElementById("button_save").addEventListener('click', function (e) {
    sendAddTaskRequest("/tasks/add_task")
});
document.querySelector('.modal__close-button').addEventListener('click', function (e) {
    modalTask.classList.remove('modal_active');
});

function makeTask(data) {
    let newTask = document.createElement("tr");
    newTask.id = data.id;
    let name = document.createElement("td")
    name.className = "teacher_task";
    name.innerHTML = data.name;
    let contest = document.createElement("td");
    contest.innerHTML = `${data.contest_type} ${data.contest_number} задача ${data.task_number}`;
    let score = document.createElement("td");
    score.innerHTML = data.task_value;
    let student = document.createElement("td");
    let input = document.createElement("td");
    if (data.username != null) {
        if (data.username.length == 1) {
            student.innerHTML = data.username[0];
            if (data.score[0] !== 0)
                input.innerHTML = `<input id = ${data.user_id[0]}_${data.id} class="number_input task_score score" type="number" value=${data.score[0]} name="score"  min="0.0" max="30.0"
                        step="0.1" required>`;
            else {
                input.innerHTML = `<input id = ${data.user_id[0]}_${data.id} class="number_input task_score score" type="number" name="score"  min="1.0" max="30.0"
                        step="0.1" required>`;
            }
        } else {
            student.innerHTML = "►";
            student.addEventListener('click', function (e) {
                if (student.innerHTML === "►") {
                    student.innerHTML = "▼";
                    input.innerHTML = "<br>";
                    for (let i = 0; i < data.username.length; i++) {
                        let id = `${data.user_id[0]}_${data.id}`;
                        let st = document.createElement("p")
                        st.innerHTML = data.username[i];
                        student.append(st);
                        let inp = document.createElement("p")
                        if (data.score[0] !== 0)
                            inp.innerHTML = `<input id = ${data.user_id[0]}_${data.id} class="number_input task_score score" type="number" value=${data.score[i]} name="score"  min="0.0" max="30.0"
                        step="0.1" required>`;
                        else
                            inp.innerHTML = `<input id = ${data.user_id[i]}_${data.id} class="number_input task_score score" type="number" name="score"  min="0.0" max="30.0"
                         step="0.1" required>`;
                        input.append(inp)
                    }
                } else {
                    student.innerHTML = "►"
                    input.innerHTML="";
                }
            })
        }
        newTask.classList.add("taken")
    } else {
        student.innerHTML = "—"
        newTask.classList.add("free")
    }
    newTask.append(name, contest, score, student, input);
    document.getElementById("button").parentNode.insertBefore(newTask, document.getElementById("button"));
    name.addEventListener('click', function (e) {
        modalTitle.innerHTML = data.name;
        modalText.innerHTML = data.description.length > 150 ? data.description.substring(0, 147) + "..." : data.description;
        modalDescription.innerHTML = data.description;
        modalTask.classList.add('modal_active');
        modalTask.id = data.id;
        modalLimit.innerHTML = `${data.taken_max} места до ${data.dead_line.slice(0, 10)} включительно`
    })
}

function sendAddTaskRequest(url) {
    return fetch('/tasks/add_task', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json'
        },
        body: JSON.stringify({
            name: form.name.value,
            contest_type: form.answer.value == "long" ? "Длинный" : "Короткий",
            contest_number: form.contestNumber.value,
            task_number: form.word.value,
            description: form.description.value,
            taken_max: form.limit.value,
            dead_line: form.days.value,
            task_value: form.score.value
        })
    }).then(response => {
        if (response.ok && response.status[0] !== "3") {
        } else {
            alert("Не удалось создать задачу, попробуйте еще раз")
        }
    });
}

function sendDeleteTaskRequest(id) {
    return fetch(`/tasks/delete_task?task_id=${id}`, {
        method: "POST",
    }).then(response => {
        if (response.ok && response.status[0] !== "3") {
            location.reload();
        } else {
            alert("Не удалось удалить задачу, ее уже кто-то взял или она уже оценена")
        }
    });
}

function sendRateTaskRequest(taskId, userId, score) {
    return fetch(`/tasks/rate_task?task_id=${taskId}&user_id=${userId}&score=${score}`, {
        method: "POST",
    }).then(response => {
        if (response.ok && response.status[0] !== "3") {
        } else {
            alert("Не удалось оценить задачу")
        }
    });
}

function sendGetTaskRequest(url) {
    return fetch(url).then(response => {
        if (response.ok && response.status[0] !== "3") {
            return response.json();
        }
    });
}

busy.addEventListener('click', function (e) {
    if (!busy.checked) {
        [...document.getElementsByClassName("taken")]
            .forEach(e => e.style.display = "none");
    } else {
        [...document.getElementsByClassName("taken")]
            .forEach(e => e.style.display = "");
    }
});

active.addEventListener('click', function (e) {

    if (!active.checked) {
        [...document.getElementsByClassName("free")]
            .forEach(e => e.style.display = "none");
    } else {
        [...document.getElementsByClassName("free")]
            .forEach(e => e.style.display = "");
    }
})

sortSign.addEventListener('click', function (e) {
    if (unsortedTasks === null)
        unsortedTasks = Array.from(tasks.querySelectorAll('tr')).slice(1);
    if (sortSign.innerHTML === '↕') {
        sortSign.innerHTML = '↑';
        if (sortedTasks === null) {
            sortedTasks = Array.from(tasks.querySelectorAll('tr'))
                .slice(1)
                .sort((rowA, rowB) => +rowA.cells[1].innerHTML > +rowB.cells[1].innerHTML ? 1 : -1);
            sortedDescTasks = Array.from(sortedTasks);
            sortedDescTasks.reverse();
        }
        tasks.tBodies[0].append(...sortedTasks);
    } else if (sortSign.innerHTML === '↑') {
        sortSign.innerHTML = '↓';
        tasks.tBodies[0].append(...sortedDescTasks);
    } else {
        sortSign.innerHTML = '↕';
        tasks.tBodies[0].append(...unsortedTasks);
    }
    tasks.tBodies[0].append(document.getElementById("button"));
});

active.addEventListener('click', function (e) {

    if (!active.checked) {
        [...document.getElementsByClassName("free")]
            .forEach(e => e.style.display = "none");
    } else {
        [...document.getElementsByClassName("free")]
            .forEach(e => e.style.display = "");
    }
})