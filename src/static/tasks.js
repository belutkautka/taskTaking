const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal__title');
const modalText = document.getElementById('modal__text');
const modalButton = document.getElementById('button');

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
    newTask.id = data.id
    newTask.className = "task_table";
    let title = document.createElement("div");
    title.className = "title";
    title.innerHTML = data.name;
    let path = document.createElement("div");
    path.className = "path";
    path.innerHTML = `${data.contest_type} ${data.contest_number} задача ${data.task_number}`;
    let grade = document.createElement("div");
    grade.className = "grade";
    grade.innerHTML = data.task_value;
    if (takenTasks.has(data.id)) {
        newTask.classList.add('task_selected');
        path.classList.add('text_selected')
    } else if (!data.is_available) {
        newTask.classList.add('task_blocked');
        title.classList.add('text_blocked');
        grade.classList.add('text_blocked');
    }
    document.getElementById("titles").append(newTask);
    newTask.addEventListener('click', function (e) {
        modalTitle.innerHTML = data.name;
        modalText.innerHTML = data.description;
        modalButton.innerHTML = takenTasks.has(data.id) ? "Снять задачу" : "Взять задачу"
        modal.classList.add('modal_active');
    });
    newTask.append(title, path, grade);
    addTaskToDictionary(data.name, data.id);
}

function addTaskToDictionary(name, id) {
    tasks.set(name, id);
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
                    task.children[1].classList.remove('text_selected')
                } else {
                    task.classList.add('task_selected');
                    task.children[1].classList.add('text_selected')
                }
            } else {
                task.classList.add('task_blocked');
                task.children[0].classList.add('text_blocked');
                task.children[2].classList.add('text_blocked')
            }
        });
}

document.querySelector('.modal__close-button').addEventListener('click', function (e) {
    modal.classList.remove('modal_active');
});

document.querySelector('.button').addEventListener('click', function (e) {
    taskId = tasks.get(modalTitle.innerHTML);
    let task = document.getElementById(taskId);
    if (modalButton.innerHTML === "Снять задачу") {
        modalButton.innerHTML = "Взять задачу"
        takenTasks.delete(taskId);
        sendTaskRequest("/tasks/drop_task", taskId);
    } else {
        modalButton.innerHTML = "Снять задачу";
        takenTasks.add(taskId);
        sendTaskRequest("/tasks/take_task", taskId);
    }
});