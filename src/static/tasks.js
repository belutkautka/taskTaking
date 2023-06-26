const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal__title');
const modalText = document.getElementById('modal__text');
const modalButton = document.getElementById('button');
const modalLimit = document.getElementsByClassName("limit_modal")[0];
const modalDescription = document.getElementById("modal__full_text")
const busy = document.getElementById("check_busy");
const active = document.getElementById("check_free");

loadStyle = localStorage.getItem('theme');

let tasks = new Map();
let takenTasks = new Set();

sendGetTaskRequest("/tasks/get_my_taken_tasks")
    .then(data => data.Data.forEach(e => takenTasks.add(e.id)))
    .then(e => sendGetTaskRequest("/tasks/get_tasks_by_teacher_id"))
    .then(data => createNewTasks(data.Data));

function createNewTasks(data) {
    data.forEach(e => createNewTask(e));
}

function createNewTask(data) {
    let newTask = document.createElement("div");
    newTask.id = data.id;
    newTask.className = "task_table";
    newTask.classList.add("task_active");
    let title = document.createElement("div");
    title.className = "title";
    title.innerHTML = data.name.length > 65 ? data.name.substring(0, 62) + "..." : data.name;
    let path = document.createElement("div");
    path.className = "path";
    path.innerHTML = `${data.contest_type} контест ${data.contest_number} задача ${data.task_number}`;
    let grade = document.createElement("div");
    grade.className = "grade";
    grade.innerHTML = data.task_value;
    if (takenTasks.has(data.id)) {
        newTask.classList.add('task_selected');
        path.classList.add('text_selected');
    } else if (!data.is_available) {
        newTask.classList.add('task_blocked');
        newTask.classList.remove("task_active");
        title.classList.add('text_blocked');
        grade.classList.add('text_blocked');
    }
    document.getElementById("titles").append(newTask);

    sendGetTaskRequest(`/tasks/get_students_by_task_id?task_id=${data.id}`)
        .then(result => {
            newTask.addEventListener('click', function (e) {
                modalTitle.innerHTML = data.name;
                modalText.innerHTML = data.description.length > 150 ? data.description.substring(0, 147) + "..." : data.description;
                modalButton.innerHTML = takenTasks.has(data.id) ? "Снять задачу" : "Взять задачу";
                modal.classList.add('modal_active');
                activeOrNot(data.id);
                modalLimit.innerHTML = `Осталось ${data.taken_max - result.Data.length} из ${data.taken_max}`;
                modalDescription.innerHTML = data.description;
            })
        });

    let days = document.createElement("div");
    days.className = "days";
    let time = document.createElement("div");
    let image = document.createElement("img");
    let dedline = Math.ceil((Date.parse(data.dead_line) - Date.now()) / (1000 * 3600 * 24));
    image.className = "dedline_image";
    if (loadStyle === "dark" | loadStyle === null) {
        if (dedline < 2) {
            image.src = "../static/img/darkrededline.png";
            time.className = "days_recording time_over";
        } else {
            image.src = "../static/img/darkthemededline.png";
            time.className = "days_recording";
        }
    } else {
        if (dedline < 2) {
            image.src = "../static/img/rededline.png";
            time.className = "days_recording time_over";
        } else {
            image.src = "../static/img/dedline.png"
            time.className = "days_recording";
        }
    }
    time.innerHTML = `${dedline} день`;
    days.append(image, time);
    newTask.append(title, path, grade, days);
    addTaskToDictionary(data.name, data.id);
}

function addTaskToDictionary(name, id) {
    tasks.set(name, id);
}

function activeOrNot(id) {
    if (document.getElementById(id).className === "task_table task_blocked") {
        modalButton.style.display = "none";
    } else {
        modalButton.style.display = "";
    }
}

function sendGetTaskRequest(url) {
    return fetch(url).then(response => {
        if (response.ok && response.status[0] !== "3") {
            return response.json();
        }
    });
}

function sendTaskRequest(url, id) {
    return fetch(url + "?task_id=" + id, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            let task = document.getElementById(taskId);
            if (response.ok && response.status[0] !== "3") {
                if (url === '/tasks/drop_task') {
                    task.classList.remove('task_selected');
                    task.children[1].classList.remove('text_selected');
                } else {
                    task.classList.add('task_selected');
                    task.children[1].classList.add('text_selected');
                }
            } else {
                task.classList.add('task_blocked');
                task.children[0].classList.add('text_blocked');
                task.children[2].classList.add('text_blocked');
            }
        });
}

document.querySelector('.modal__close-button').addEventListener('click', function (e) {
    modal.classList.remove('modal_active');
});

document.querySelector('.button').addEventListener('click', function (e) {
    taskId = tasks.get(modalTitle.innerHTML);
    if (modalButton.innerHTML === "Снять задачу") {
        modalButton.innerHTML = "Взять задачу";
        takenTasks.delete(taskId);
        sendTaskRequest("/tasks/drop_task", taskId);
    } else {
        modalButton.innerHTML = "Снять задачу";
        takenTasks.add(taskId);
        sendTaskRequest("/tasks/take_task", taskId);
    }
});

busy.addEventListener('click', function (e) {
    if (!busy.checked) {
        [...document.getElementsByClassName("task_blocked")]
            .forEach(e => e.style.display = "none");
    } else {
        [...document.getElementsByClassName("task_blocked")]
            .forEach(e => e.style.display = "");
    }
});

active.addEventListener('click', function (e) {

    if (!active.checked) {
        [...document.getElementsByClassName("task_active")]
            .forEach(e => e.style.display = "none");
    } else {
        [...document.getElementsByClassName("task_active")]
            .forEach(e => e.style.display = "");
    }
})